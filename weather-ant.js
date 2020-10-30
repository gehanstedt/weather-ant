const openWeatherAPIKey = "0b8af317daa059c03103f8b0517eb971";
const maxNumberOfDays = 5;

var cityArray = [];
var currentSelectedCity;


$(document).ready(function() {

  // Empty the schedule to prepare for loading the schedule from JavaScript
  function emptySchedule () {
      $(".container").empty ();
  }

  //temporary...
  clearLocalStorage ();

  loadCityArray ();
  // loadCityArrayforDevelopment ();
  loadStateSelect ();

  sortCityArray ();
  loadSelectedCity ();
  console.log ("Starting selected city:");
  console.log (currentSelectedCity);

  displayCities (currentSelectedCity);
  displayWeather (currentSelectedCity);

  $("#cityButtonsGoHere").on ("click", ".cityButton", function (event) {
    event.preventDefault ();
    
    console.log ("I'm here");
    
    currentSelectedCity = {
      "cityName": $(this).attr ("cityname"),
      "stateAbbreviation": $(this).attr ("stateabbreviation")
    };
  
    displayWeather (currentSelectedCity);
  });

  $("#clearButton").on ("click", function (event) {
    cityArray = [];
    currentSelectedCity = {
      cityName: null,
      stateAbbreviation: null
    };
  
    displayCities (currentSelectedCity);
    saveSelectedCity ();
    clearLocalStorage ();
    showWeatherPane (false);

  });

  
  $("#citySearchButton").on ("click", function (event) {
    var cityName = $("#cityInput").val ();
    var stateAbbreviation = $("#stateInput").val ();
    var cityStatus;
  
    event.preventDefault ();
  
    console.log (cityName);
    console.log (stateAbbreviation);
  
    if (stateAbbreviation === "INVALID") {
      alert (`Please select a valid state.  If searching outside the United States, select "Outside US"`);
      return;
    }
  
    else if (cityName === "") {
      alert (`Please enter a city.`);
      return;
    }
  
    validateCity ({
                   "cityName": cityName, 
                   "stateAbbreviation": stateAbbreviation});
  
  });

  function saveCityArray () {
    localStorage.setItem ("GDOG-Weather-Ant-1.0", JSON.stringify (cityArray));
  }

  function clearLocalStorage () {
    localStorage.removeItem ("GDOG-Weather-Ant-1.0");
    localStorage.removeItem ("GDOG-Weather-Ant-Selected-City-1.0");
  }



  function saveSelectedCity (cityObject) {
    localStorage.setItem ("GDOG-Weather-Ant-Selected-City-1.0", JSON.stringify (cityObject));
  }

  function loadCityArray () {
    var tempArray = JSON.parse(localStorage.getItem("GDOG-Weather-Ant-1.0"));
    if (tempArray !== null) {
      cityArray = tempArray;
    }
  }

  function loadSelectedCity () {
    var tempArray = JSON.parse(localStorage.getItem("GDOG-Weather-Ant-Selected-City-1.0"));
    if (tempArray !== null) {
      currentSelectedCity = tempArray;
    }
  }

  function showWeatherPane (status) {
    if (status) {
      $("#overall-weather-display").attr ("style", "display: block");
    }
  
    else {
      $("#overall-weather-display").attr ("style", "display: none");
    }
  }
  
  function displayWeather (cityObject) {
    var queryURL;
    var h2Element;
    var pElement;
    var spanElement;
    var uvi;
    var dayTempArray = [];
    var dayCount;
    var forecastLength;
    var sameDate;
    var workingDateObj;
    var divElement;
    var h6Element;
    var imgElement;
  
  /*  var dayTempArray = [
      {
        month: 01,
        date: 01,
        year: 2020,
        dayCondition: "Cloudy",
        humidity: 100,
        tempHigh: 100.1,
        tempLow: 10.3
      }
    ];
  */

  
  
    // If there is no current city, just return
    if (cityObject.cityName === null) {
      showWeatherPane (false);
      return;
    }

    //Save the current selected city
    saveSelectedCity (cityObject);

    //Refresh City list to update the selected city
    displayCities (currentSelectedCity);

    // Show weather pane (in case it was off)
    showWeatherPane (true);
  
    queryURL = buildQueryURL (cityObject, "weather");
  
    console.log (`URL: ${queryURL}`);
  
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      $("#general-city-area").empty ();
  
      h2Element = $("<h2>");
  
      if (cityObject.stateAbbreviation === "NONE") {
        h2Element.text (cityObject.cityName);
      }
  
      else {
        h2Element.text (`${cityObject.cityName}, ${cityObject.stateAbbreviation}`);
      }
  
      $("#general-city-area").append (h2Element);
  
      pElement = $("<p>");
      pElement.text (`Temperature: ${oneDecimal (response.main.temp)}°F`);
      $("#general-city-area").append (pElement);
  
      pElement = $("<p>");
      pElement.text (`Humidity: ${response.main.humidity}%`);
      $("#general-city-area").append (pElement);
  
      pElement = $("<p>");
      pElement.text (`Wind Speed: ${response.wind.speed} MPH`);
      $("#general-city-area").append (pElement);
  
      console.log (response);
  
      console.log (response.coord.lat);
  
      queryURL = buildQueryURLLong (response.coord.lat, response.coord.lon);
  
      console.log (queryURL);
  
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(responseDetailed) {
        console.log (responseDetailed);
  
        uvi = parseFloat (responseDetailed.current.uvi);   
        uviStatus = uviEvaluate (uvi);
  
        pElement = $("<p>");
        pElement.text (`UVI: `);
        $("#general-city-area").append (pElement);
  
        spanElement = $("<span>");
        spanElement.text (uvi);
        spanElement.attr ("class", uviStatus);
        pElement.append (spanElement);
  
        queryURL =   queryURL = buildQueryURL (cityObject, "forecast");
  
        // Yes, I worked my harder than I should have here.  Instead of using the 
        // "forecast" query, I should have used the "onecall" query I used for UVI.
  
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(responseForecast) {
          console.log (responseForecast);
  
          dayCount = 0;
          forecastLength = responseForecast.list.length;;
  
          for (var count = 0; count < forecastLength; count ++) {
            // console.log (responseForecast.list[count].dt_txt);
            // console.log (responseForecast.list[count].weather[0].main);
            workingDateObj = new Date (parseInt(responseForecast.list[count].dt) * 1000);
            // console.log (`Date: ${workingDateObj.getDate ()}`);
  
            if (count === 0) {
              //first pass - skip same date checking
              sameDate = false;
            }
  
            else {
  
              if ((dayTempArray[dayCount].month === workingDateObj.getMonth ()) &&
                  (dayTempArray[dayCount].date === workingDateObj.getDate ()) &&
                  (dayTempArray[dayCount].year === workingDateObj.getFullYear ())) {
                    // Date is the same as the current day object
                    sameDate = true;
              }
  
              else {
                // We have a new date.  Advance dayCount for dayTempArray
                sameDate = false;
                dayCount ++;
              }
            }
  
            // console.log ("count: " + count);
            // console.log ("dayCount: " + dayCount);
  
            if ((count === 0) || (sameDate === false)) {
  /*
              dayTempArray[dayCount].month = workingDateObj.getMonth ();
              dayTempArray[dayCount].date = workingDateObj.getDate ();
              dayTempArray[dayCount].year = workingDateObj.getFullYear ();
              dayTempArray[dayCount].dayCondition = responseForecast.list[count].weather[0].main;
              dayTempArray[dayCount].humidity = parseInt(responseForecast.list[count].main.humidity);
              dayTempArray[dayCount].tempHigh = oneDecimal(responseForecast.list[count].main.temp_max);
              dayTempArray[dayCount].tempLow = oneDecimal(responseForecast.list[count].main.temp_min);
  */
              dayTempArray.push ({
                month: workingDateObj.getMonth (),
                date: workingDateObj.getDate (),
                year: workingDateObj.getFullYear (),
                dayCondition: responseForecast.list[count].weather[0].main,
                humidity: parseInt(responseForecast.list[count].main.humidity),
                tempHigh: oneDecimal(responseForecast.list[count].main.temp_max),
                tempLow: oneDecimal(responseForecast.list[count].main.temp_min)
              });
            }
  
            else {
              // We are on the same day.  Let's see if the high is higher or low lower
              if (oneDecimal(responseForecast.list[count].main.temp_max) > dayTempArray[dayCount].tempHigh) {
                dayTempArray[dayCount].tempHigh = oneDecimal(responseForecast.list[count].main.temp_max);
              }
  
              if (oneDecimal(responseForecast.list[count].main.temp_min < dayTempArray[dayCount].tempLow)) {
                dayTempArray[dayCount].tempLow = oneDecimal(responseForecast.list[count].main.temp_low);
              }
  
              if (responseForecast.list[count].weather[0].main === "Rain") {
                dayTempArray[dayCount].dayCondition = "Rain";
              }
  
              else if ((responseForecast.list[count].weather[0].main == "Clouds") && (dayTempArray[dayCount].dayCondition == "Clear")) {
                dayTempArray[dayCount].dayCondition = "Clouds";
              }
  
              else {
                // Should be clear already.  Nothing to do here.
              }
            }
          }
          console.log (dayTempArray);
  
          // Now go writeout the object with all the days and associated weather
          // First clear out existing data
          $("#weather-boxes-go-here").empty ();
  
          for (count = 0; count < dayTempArray.length; count ++) {
            divElement = $("<div>");
            divElement.attr ("class", "col-3 m-2 bg-primary forecast-day");
            $("#weather-boxes-go-here").append (divElement);
  
            h6Element = $("<h6>");
            h6Element.text (`${dayTempArray[count].month + 1}/${dayTempArray[count].date}/${dayTempArray[count].year}`);
            divElement.append (h6Element);
  
            imgElement = $("<img>");
  
            // console.log ("Condition:  " + dayTempArray[count].dayCondition);
  
            switch (dayTempArray[count].dayCondition) {
              case "Clouds":
                imgElement.attr("src", "https://img.icons8.com/color/48/000000/cloud.png");
                imgElement.attr ("alt", "Cloudy");
                break;
  
              case "Rain":
                imgElement.attr("src", "https://img.icons8.com/color/48/000000/rain.png");
                imgElement.attr ("alt", "Rainy");
                break;
    
              case "Clear":
                imgElement.attr("src", "https://img.icons8.com/color/48/000000/summer.png");
                imgElement.attr ("alt", "Sunny");
                break;
            }
  
            divElement.append (imgElement);
  
            pElement = $("<p>");
            pElement.text (`High Temp: ${dayTempArray[count].tempHigh}°F`);
            divElement.append (pElement);
  
            pElement = $("<p>");
            pElement.text (`Low Temp: ${dayTempArray[count].tempLow}°F`);
            divElement.append (pElement);
  
            pElement = $("<p>");
            pElement.text (`Humidity: ${dayTempArray[count].humidity}%`);
            divElement.append (pElement);
          }
        });
      });
    });
  }
  
  function uviEvaluate (uvi) {
    // Return color dependign on the UVI value
    // Ranges adopted per FDA - https://www.fda.gov/radiation-emitting-products/tanning/ultraviolet-uv-radiation
  
    if (uvi < 3) {
      return ("uviGreen");
    }
  
    else if ((uvi >= 3) && (uvi < 6)) {
      return ("uviYellow");
    }
  
    else if ((uvi >= 6) && (uvi < 8)) {
      return ("uviOrange");
    }
  
    else if ((uvi >= 8) && (uvi < 11)) {
      return ("uviRed");
    }
  
    else {
      return ("uviViolet");
    }
  }
  
  function oneDecimal (numberToChange) {
    return (Math.ceil (parseFloat (numberToChange) * 10) / 10);
  }
  
  function buildQueryURL (cityObject, weatherType) {
    if (cityObject.stateAbbreviation == "NONE") {
      queryURL = `https://api.openweathermap.org/data/2.5/${weatherType}?units=imperial&q=${cityObject.cityName}&APPID=${openWeatherAPIKey}`;
    }
  
    else {   
      queryURL = `https://api.openweathermap.org/data/2.5/${weatherType}?units=imperial&q=${cityObject.cityName}%2c${cityObject.stateAbbreviation}%2cus&APPID=${openWeatherAPIKey}`;
    }
  
    return queryURL;
  }
  
  function buildQueryURLLong (latitude, longtitude) {
    return `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${latitude}&lon=${longtitude}&exclude=hourly%2cdaily&APPID=${openWeatherAPIKey}`;
  }
  
  function validateCity (cityObject) {
    var queryURL;
    var validCity = false;
    var response;
  
    // console.log (`cityObject in validateCity`);
    // console.log (cityObject.stateAbbreviation);
  
    queryURL = buildQueryURL (cityObject, "weather");
  
    // console.log (`Query URL in validateCity: ${queryURL}`);
  
    $.ajax({
      url: queryURL,
      method: "GET",
      error: function (errorCondition) {
        console.log (`City not found.  Error: ${errorCondition.status}  Error text: ${errorCondition.statusText}`);
        validCity = false;
        continueCitySearch (validCity, cityObject);
      },
    }).then(function(response) {
      // console.log ("City was found");
      validCity = true;
  
      continueCitySearch (validCity, cityObject);
    });
  }
  
  // Function was used during development
  function loadCityArrayforDevelopment () {
    cityArray = [
      {
        cityName: "Atlanta",
        stateAbbreviation: "GA"
      },
    
      {
        cityName: "Menomonee Falls",
        stateAbbreviation: "WI"
      },
  
      {
        cityName: "Las Vegas",
        stateAbbreviation: "NV"
      }];
  }
  
  function displayCities (selectedCity) {
    var counter;
    var lengthCityArray = cityArray.length;
    var anchorElement;
    var classes;
  
    // Empty current buttons
    $("#cityButtonsGoHere").empty ();

    // console.log ("Selected city in displayCities:");
    // console.log (selectedCity);
  
    counter = 0;
    while (counter < lengthCityArray) {
      if ((selectedCity.cityName === cityArray[counter].cityName) && (selectedCity.stateAbbreviation == cityArray[counter].stateAbbreviation)) {
        classes = `cityButton list-group-item list-group-item-action active`;
      }
  
      else {
        classes = `cityButton list-group-item list-group-item-action`;
      }
      anchorElement = $(`<a href="#">`);
      anchorElement.attr ("class", classes);
      anchorElement.attr ("cityName", cityArray[counter].cityName);
      anchorElement.attr ("stateAbbreviation", cityArray[counter].stateAbbreviation)
      // anchorElement.attr ("id", "cityButton");
  
      // If the stateAbbreviation is NONE, then we don't show a State
  
      if (cityArray[counter].stateAbbreviation === "NONE") {
        anchorElement.text (`${cityArray[counter].cityName}`);
      }
  
      else {
        anchorElement.text (`${cityArray[counter].cityName}, ${cityArray[counter].stateAbbreviation}`);
      }
  
      $("#cityButtonsGoHere").append (anchorElement);
  
      counter ++;
    }
  }
  
  function loadStateSelect () {
    var stateArray = loadStateArray ();
    var optionElement;
  
    // Empty the state array
    $("#stateInput").empty ();
  
    // Add the default option, which we will yell at the user for selecting... :-)
    optionElement = $(`<option selected value="INVALID">`);
    optionElement.text ("State...");
    $("#stateInput").append (optionElement);
  
    stateArray.forEach (writeStateToSelect);
  
    function writeStateToSelect (stateObject, index) {
      optionElement = $(`<option value=${stateObject.abbreviation}>`);
      optionElement.text (stateObject.state);
      $("#stateInput").append (optionElement);
  
      // console.log (`State:  ${stateObject.state}   Abbreviation:  ${stateObject.abbreviation}`);
    }
  }
  
  
  // This is a continuation of the $("citySearchButton").on ("click").... function
  // from validateCity, this is then called with either success or failure
  function continueCitySearch (cityStatus, cityObject) {
    console.log (`City status:  ${cityStatus}`);

    if (cityStatus) {
      // City is valid - let's add it, then display weather
      addCityToList (cityObject.cityName, cityObject.stateAbbreviation);

      currentSelectedCity = cityObject;
      
      displayWeather (cityObject);
    }
  
    else {
      // City is not valid - let's alert the user
      if (cityObject.stateAbbreviation === "NONE") {
        alert (`The city ${cityObject.cityName} is not valid.  Please enter a different city and try again`);
      }
  
      else {
        alert (`The city ${cityObject.cityName} in state ${cityObject.stateAbbreviation} is not valid.  Please enter a different city/state and try again`);
      }
    }
  }
  
  function addCityToList (cityName, stateAbbreviation) {
    cityArray.push ({
                      "cityName": cityName,
                      "stateAbbreviation": stateAbbreviation
                    });
  
    sortCityArray ();

    saveCityArray ();
  
    displayCities ({
                    "cityName": cityName, 
                    "stateAbbreviation": stateAbbreviation
                  });
  }
  
  function sortCityArray () {
    cityArray = cityArray.sort((c1, c2) => (c1.cityName.toLowerCase() > c2.cityName.toLowerCase()) ? 1 : (c1.cityName.toLowerCase() < c2.cityName.toLowerCase()) ? -1 : 0);
  }
  
  function loadStateArray () {
    stateArray = [
      {
        "state": "Outside US",
        "abbreviation": "NONE"
      },
  
      {
        "state": "Alabama",
        "abbreviation": "AL"
      },
  
      {
        "state": "Alaska",
        "abbreviation": "AK"
      },
  
      {
        "state": "Arizona",
        "abbreviation": "AZ"
      },
  
      {
        "state": "Arkansas",
        "abbreviation": "AR"
      },
  
      {
        "state": "California",
        "abbreviation": "CA"
      },
  
      {
        "state": "Colorado",
        "abbreviation": "CO"
      },
  
      {
        "state": "Connecticut",
        "abbreviation": "CT"
      },
  
      {
        "state": "Delaware",
        "abbreviation": "DE"
      },
  
      {
        "state": "Florida",
        "abbreviation": "FL"
      },
  
      {
        "state": "Georgia",
        "abbreviation": "GA"
      },
  
      {
        "state": "Hawaii",
        "abbreviation": "HI"
      },
  
      {
        "state": "Idaho",
        "abbreviation": "ID"
      },
  
      {
        "state": "Illinois",
        "abbreviation": "IL"
      },
  
      {
        "state": "Indiana",
        "abbreviation": "IN"
      },
  
      {
        "state": "Iowa",
        "abbreviation": "IA"
      },
  
      {
        "state": "Kansas",
        "abbreviation": "KS"
      },
  
      {
        "state": "Kentucky",
        "abbreviation": "KY"
      },
  
      {
        "state": "Lousiana",
        "abbreviation": "LA"
      },
  
      {
        "state": "Maine",
        "abbreviation": "ME"
      },
  
      {
        "state": "Maryland",
        "abbreviation": "MD"
      },
  
      {
        "state": "Massachusetts",
        "abbreviation": "MA"
      },
  
      {
        "state": "Michigan",
        "abbreviation": "MI"
      },
  
      {
        "state": "Minnesota",
        "abbreviation": "MN"
      },
  
      {
        "state": "Mississippi",
        "abbreviation": "MS"
      },
  
      {
        "state": "Missouri",
        "abbreviation": "MO"
      },
  
      {
        "state": "Montana",
        "abbreviation": "MT"
      },
  
      {
        "state": "Nebraska",
        "abbreviation": "NE"
      },
  
      {
        "state": "Nevada",
        "abbreviation": "NV"
      },
  
      {
        "state": "New Hampshire",
        "abbreviation": "NH"
      },
  
      {
        "state": "New Jersey",
        "abbreviation": "NJ"
      },
  
      {
        "state": "New Mexico",
        "abbreviation": "NM"
      },
  
      {
        "state": "New York",
        "abbreviation": "NY"
      },
  
      {
        "state": "North Carolina",
        "abbreviation": "NC"
      },
  
      {
        "state": "North Dakota",
        "abbreviation": "ND"
      },
  
      {
        "state": "Ohio",
        "abbreviation": "OH"
      },
  
      {
        "state": "Oklahoma",
        "abbreviation": "OK"
      },
  
      {
        "state": "Oregon",
        "abbreviation": "OR"
      },
  
      {
        "state": "Pennsylvania",
        "abbreviation": "PA"
      },
  
      {
        "state": "Rhode Island",
        "abbreviation": "RI"
      },
  
      {
        "state": "South Carolina",
        "abbreviation": "SC"
      },
  
      {
        "state": "South Dakota",
        "abbreviation": "SD"
      },
  
      {
        "state": "Tennessee",
        "abbreviation": "TN"
      },
  
      {
        "state": "Texas",
        "abbreviation": "TX"
      },
  
      {
        "state": "Utah",
        "abbreviation": "UT"
      },
  
      {
        "state": "Vermont",
        "abbreviation": "VT"
      },
  
      {
        "state": "Virginia",
        "abbreviation": "VA"
      },
  
      {
        "state": "Washington",
        "abbreviation": "WA"
      },
  
      {
        "state": "West Virginia",
        "abbreviation": "WV"
      },
  
      {
        "state": "Wisconsin",
        "abbreviation": "WI"
      },
  
      {
        "state": "Wyoming",
        "abbreviation": "WY"
      }
    ];
  
    return (stateArray);
  }
});





/*

// Constants to define how thte schedule works.  Adjust to 
// increase / decrease start/stop time, columns and rows used for text area
const standardDayBegin = 7;
const standardDayEnd = 18;
const textAreaColumns = 90;
const textAreaRows = 4;

// Global variables - all to be loaded later
var currentHour;
var hourSelected;
var hoursNoteString;
var calendarDayText = [];
var currentDate;

$(document).ready(function() {

    // Empty the schedule to prepare for loading the schedule from JavaScript
    function emptySchedule () {
        $(".container").empty ();
    }

    // This builds the schedule with the hour, text area, save button.  It will be empty.
    function buildSchedule () {
        var divElementRow;
        var divElementHour;
        var textAreaElement;
        var buttonElement;
        var iElement;
        var timePeriodText;
        var timeText;
        var counter;
        for (counter = standardDayBegin; counter <= standardDayEnd; counter ++) {

            // Create time text and convert from military to regular time
            if (counter > 12) {
                timeText = `${counter - 12}:00 PM`;
            }

            else {
                timeText = `${counter}:00 AM`;
            }

            divElementRow = $(`<div class="row">`);
            $(".container").append (divElementRow);
            divElementHour = $(`<div class="hour"> 
            ${timeText}</div>`);
            divElementRow.append (divElementHour);

            // Determine if we are in the past, present or future
            if (counter < currentHour) {
                timePeriodText = "past";
            }

            else if (counter === currentHour) {
                timePeriodText = "present";
            }

            else { // counter > counterHour
                timePeriodText = "future"; 
            }

            textAreaElement = $(`<textarea cols="${textAreaColumns}" rows="${textAreaRows}" class="${timePeriodText}" houris="${counter}" id="textArea${counter}">`);
            divElementRow.append (textAreaElement);

            buttonElement = $(`<button class="saveBtn" houris="${counter}">`);
            iElement = $(`<i class="fas fa-save">`);
            
            divElementRow.append (buttonElement);
            buttonElement.append (iElement);
        }
    }

    // This writes all saved calendar entries to the blank calendar.
    function writeCalendarData () {
        var workingTextArea;

        if (calendarDayText.length > 0) {
            for (counter = 0; counter < calendarDayText.length; counter ++) {
                if (calendarDayText [counter] !== null) {
                    console.log ("Updating hour: " + counter);
                    workingTextArea = "textArea" + counter;
                    $(`#${workingTextArea}`).val (calendarDayText [counter]);
                }
            }
        }

        else {
            console.log ("There is no existig data");
        }
    }

    // Load the calendar data from localStorage, if it exists
    function loadCalendarData () {
        var tempArray = JSON.parse(localStorage.getItem("GDOG-Work-Day-Scheduler"));
        if (tempArray !== null) {
          calendarDayText = tempArray;
        }
    }
      
    // Save the calendarDayText array to localStorage.  This is called after
    // a user clicks the save button
    function saveCalendarData () {
        localStorage.setItem ("GDOG-Work-Day-Scheduler", JSON.stringify(calendarDayText));
    }

    // Return the full month text based on the date passed
    function getMonthText (currentDate) {
        var month = [];
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[currentDate.getMonth()];        
    }

    // Return the day of the week text based on teh date passed
    function getDayText (currentDate) {
        var days = [];
        days[0] = "Sunday";
        days[1] = "Monday";
        days[2] = "Tuesday";
        days[3] = "Wednesday";
        days[4] = "Thursday";
        days[5] = "Friday";
        days[6] = "Saturday";
        return days[currentDate.getDay()];        
    }

    // Write the current date to the HTML ID #currentDay
    function writeCurrentDate (currentDate) {
        var fullDateText;
        var monthText = getMonthText (currentDate);
        var date = currentDate.getDate ();
        var dayText = getDayText (currentDate);
        var year = currentDate.getFullYear ();

        fullDateText = `${dayText}, ${monthText} ${date}, ${year}`;

        $("#currentDay").text (fullDateText);

        console.log (`Date:  ${fullDateText}`);
    }

    //Begin main program
    // Grab date
    currentDate = new Date ();
    currentHour = currentDate.getHours();
    console.log (currentDate.getMonth ());
    console.log (currentDate);
    emptySchedule ();
    loadCalendarData ();
    writeCurrentDate (currentDate);
    buildSchedule ();
    writeCalendarData ();
    
    $(".saveBtn").on ("click", function (event) {
        event.preventDefault ();
        hourSelected = $(this).attr("houris");
        console.log ("Hour selected:  " + hourSelected);
        selectedTextArea = "textArea" + hourSelected;
        console.log ("Selected text area: " + selectedTextArea);
        hoursNoteString = $(`#${selectedTextArea}`).val ();
        calendarDayText [parseInt (hourSelected)] = hoursNoteString;
        saveCalendarData ();

        console.log ("Hours note:  " + calendarDayText);

    });
});





/*
// Your code here...

var stringVar1;
var stringVar2;
var result;
var operatorSelected;
var currentState;
var buttonElement = $("button");
var buttonClass;
var characterPressed;

function resetCalculator () {
  stringVar1 = "";
  stringVar2 = "";
  result = 0;
  operatorSelected = "";

  currentState = "Load1";
}

$(".number").on ("click", function (event) {
  event.preventDefault ();
  console.log ("State is:" + currentState);
  keyPressed = ($(this).attr("value"));
  console.log ("Key pressed " + keyPressed);
  
  if (currentState === "Load1") {
    stringVar1 += keyPressed;
    $("#first-number").text (stringVar1);
  }

  else if (currentState === "Load2") {
    stringVar2 += keyPressed;
    $("#second-number").text (stringVar2);
  }

  console.log ("stringVar1:  " + stringVar1);
 });

 $(".operator").on ("click", function (event) {
  event.preventDefault ();
  console.log ("State is:" + currentState);
  keyPressed = ($(this).attr("value"));
  operatorSelected = keyPressed;
  characterPressed = ($(this).text());
  console.log ("Key pressed " + keyPressed);
   
  if (currentState === "Load1") {
    currentState = "Load2";
    operatorSelected = keyPressed;
    $("#operator").text (characterPressed);
  }
 });

 $(".equal").on ("click", function (event) {
  event.preventDefault ();

  switch (operatorSelected) {
    case "plus":
      result = parseInt (stringVar1) + parseInt (stringVar2);
      break;

    case "minus":
      result = parseInt (stringVar1) - parseInt (stringVar2);
      break;

    case "times":
      result = parseInt (stringVar1) * parseInt (stringVar2);
      break;

    case "divide":
      result = parseInt (stringVar1) / parseInt (stringVar2);
      break;

    case "power":
      result = Math.pow (parseInt (stringVar1), parseInt (stringVar2));
      break;

  }

  $("#result").text (result);
 });

 $(".clear").on ("click", function (event) {
  event.preventDefault ();
  resetCalculator ();
  $("#first-number").text ("");
  $("#second-number").text ("");
  $("#operator").text ("");
  $("#result").text ("");
 });


 resetCalculator ();
 console.log ("State is (startup):" + currentState);


 */




var cityArray = [];
var currentSelectedCity;


$(document).ready(function() {
  var openWeatherAPIKey = "0b8af317daa059c03103f8b0517eb971";

  // Empty the schedule to prepare for loading the schedule from JavaScript
  function emptySchedule () {
      $(".container").empty ();
  }

  var queryURL = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=Paris%2cTX%2cus&APPID=${openWeatherAPIKey}`;

  console.log (`URL: ${queryURL}`);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log (response);

  });

  currentSelectedCity = {
    cityName: "Milwaukee",
    stateAbbreviation: "WI"
  };

  currentSelectedCity = {
    cityName: null,
    stateAbbreviation: null
  };


  loadStateSelect ();
  loadCityArray ();
  displayCities (currentSelectedCity);
});

function loadCityArray () {
  cityArray = [
    {
      cityName: "Atlanta",
      stateAbbreviation: "GA"
    },
  
    {
      cityName: "Milwaukee",
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

  counter = 0;
  while (counter < lengthCityArray) {
    if ((selectedCity.cityName === cityArray[counter].cityName) && (selectedCity.stateAbbreviation == cityArray[counter].stateAbbreviation)) {
      classes = `list-group-item list-group-item-action active`;
    }

    else {
      classes = `list-group-item list-group-item-action`;
    }
    anchorElement = $(`<a href="#" class="${classes}" cityName="${cityArray[counter].cityName}" stateAbbreviation="${cityArray[counter].stateAbbreviation}">`);

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

    console.log (`State:  ${stateObject.state}   Abbreviation:  ${stateObject.abbreviation}`);
  }


}

$("#citySearchButton").on ("click", function (event) {
  var cityName = $("#cityInput").val ();
  var stateAbbreviation = $("#stateInput").val ();

  event.preventDefault ();

  console.log (cityName);
  console.log (stateAbbreviation);

  if (stateAbbreviation === "INVALID") {
    alert (`Please select a valid state.  If searching outside the United States, select "Outside US"`);
  }

  else if (cityName === "") {
    alert (`Please enter a city.`);
  }
});

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



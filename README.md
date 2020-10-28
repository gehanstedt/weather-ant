# weather-ant
GE Georgia Tech Bootcamp Homework #5 - Weather Ant (my version of a Weather Dashboard)

Available at:  https://gehanstedt.github.io/weather-ant/

Welcome to US State Capitals Trivia.  This has the following features:
- Presents welcome screen showing how the game works
- Once user presses begin, the game builds a list of 7 questions (defined by defaultTargetNumberOfQuestions).  All questions relate to the 50 US State Capitals.
- User is presented with a and a timer with a default start time (currently 60 seconds as of this README - defined by defaultStartingAmountofTime)
- The user selects an answer. 
    - If correct, they are notified below the answer was correct.
    - If incorrect, they are also notified and receive a penalty (currently 10   seconds as of this README - defined by penaltyTime)
- The next question is then displayed.  This repeats for either up to the maximum number of questions as described above or until the timer would reach at (or below) 0 seconds.
- If the user answers all 7 with time left, they declared a winner and can add their name to the high score list.  The score is the time left remaining.  They are shown the high score list, including their new entry.  The high scores are saved locally to the user's web browser local storage and will survive the game being closed.
- If the user does not answer all 7 (and has an expired clock), the are unfortunately a loser and given the option to go back to the beginning or see the high scores.
- There is an option at the beginning of the game to also see the high scores without playing the game (link in the upper left).

Special thanks to Georgia Tech, Trilogy Educaton and John McSwain for the great class thus far.  Thanks Cynthia for the grammar help!  ;-)

Sample images:
![welcome-screen](https://github.com/gehanstedt/us-state-capitals-trivia/blob/main/images/welcome.jpg)
![question](https://github.com/gehanstedt/us-state-capitals-trivia/blob/main/images/question.jpg)
![highscores](https://github.com/gehanstedt/us-state-capitals-trivia/blob/main/images/highscores.jpg)

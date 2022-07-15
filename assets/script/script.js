// Open Trivia Database API request variables
var openTdbUrl = "https://opentdb.com/api.php?";
var numQuestions = 10; // number of questions to request
var questCategory = 27 // 27 is the animals category

// quiz questions
var questionsList = [];
var currentQuestion = 0;

var getQuestions = function(difficulty) {
    // get difficulty selection
    // if the selected difficulty is easy, medium, or hard, create a parameter for the query URL
    if (difficulty !== "random") {
        questDifficulty = "&difficulty=" + difficulty;
    } else {
        // if the selected difficulty was random, don't add anything to query URL
        questDifficulty = "";
    };
    console.log(openTdbUrl + "amount=" + numQuestions + "&category=" + questCategory + questDifficulty)
    // API request to Open Trivia Database
    fetch(openTdbUrl + "amount=" + numQuestions + "&category=" + questCategory + questDifficulty)
        // difficulty can be set to random (default), easy, medium, or hard
    .then(function (response) {
        if (response.ok) {
            // if response is good, get the data
            response.json().then(function (data) {
                // clear old questions
                questionsList.length = 0;
                // store new questions
                for (i = 0; i < numQuestions; i++) {
                    // get data for each question and add it to questions list
                    
                    // copy each question's incorrect answers to an array
                    var tempArray = [];
                    for (j = 0; j < data.results[i].incorrect_answers.length; j++) {
                        tempArray.push(data.results[i].incorrect_answers[j])
                    };

                    // make a new object with each question's info
                    var newQuestion = {
                        'number': i.toString(),
                        'question': data.results[i].question,
                        'correct': data.results[i].correct_answer,
                        'incorrect': tempArray
                    };
                    // add the question info to the question list
                    questionsList.push(newQuestion);

                    $(".start").on("click", startGame);
                };
            });
        } else {
            // need to add error message
            console.log("The page encountered an error retrieving questions.");
        };
        console.log(questionsList);
    })
    .catch(function (error) {
        // need to add error message
        console.log("Please check your connection and try again.");
    });
};

var startGame = function() {
    // reset current question number
    currentQuestion = 0;

    // clear main element
    $("main").html("");

    // if New Game button exists, replace it with My Foxes button and add listener for My Foxes button

    // load first question
    // create question div and add question text
    var questionTextDiv = document.createElement("div")
    questionTextDiv.className = "question";
    var questionNum = parseInt(questionsList[currentQuestion].number) + 1;
    questionTextDiv.textContent = questionNum + ". " + questionsList[currentQuestion].question;
    // append question div to main element
    document.querySelector("main").appendChild(questionTextDiv);

    // randomize answer choices
    // set array for answer choices with correct last
    var allChoices = []
    // set array for answer choices in random order
    var answerChoices = []

    // populate allChoices array
    for (i = 0; i < questionsList[currentQuestion].incorrect.length; i++) {
        allChoices.push(questionsList[currentQuestion].incorrect[i]);
    };
    allChoices.push(questionsList[currentQuestion].correct);

    // populate answerChoices array
    // get number of choices to use in for loop
    var numChoices = allChoices.length;
    // in random order, push each choice to the new array
    for (i = 0; i < numChoices; i++) {
        var randomIndex = Math.floor(Math.random() * allChoices.length);
        answerChoices.push(allChoices[randomIndex]);
        allChoices.splice(randomIndex, 1);
    };

    // create answer choices div
    var answerChoicesDiv = document.createElement("div")
    questionTextDiv.className = "answer-choices"
    
    // add randomized answer choices to answer choices div
    for (i = 0; i < answerChoices.length; i++) {
        var answerChoiceBtn = document.createElement("button");
        answerChoiceBtn.innerHTML = answerChoices[i];
        answerChoiceBtn.className = "choice btn";
        answerChoiceBtn.setAttribute("type", "button");
        answerChoicesDiv.appendChild(answerChoiceBtn);
    };

    // append answer choices div to main
    document.querySelector("main").appendChild(answerChoicesDiv);

    // add listener for ans"wer choices
    $(".answer-choices").on("click", checkAnswer);
};

var checkAnswer = function (event) {
    debugger;
    // function to check 
    if ($(this).children("button").text() === questionsList[currentQuestion].correct) {
        // what happens if the answer is correct
        console.log("correct");
    } else {
        // what happens if the answer is incorrect
        console.log("incorrect");
    };
};

getQuestions("easy");




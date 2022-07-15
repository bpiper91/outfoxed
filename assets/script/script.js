// Open Trivia Database API request variables
var openTdbUrl = "https://opentdb.com/api.php?";
var numQuestions = 10; // number of questions to request
var questCategory = 27 // 27 is the animals category

// quiz questions
var questionsList = [];

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
                        'number': i,
                        'question': data.results[i].question,
                        'correct': data.results[i].correct_answer,
                        'incorrect': tempArray
                    };
                    // add the question info to the question list
                    questionsList.push(newQuestion);
                };
            });
        } else {
            // need to add error message
            console.log(error);
        };
        console.log(questionsList);
    });
}

getQuestions("easy");



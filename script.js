// Brett's Note: search for "IMPORTANT" to find unfinished/hard-coded sections that will need to be changed

// Open Trivia Database API request variables
var openTdbUrl = "https://opentdb.com/api.php?";
var numQuestions = 6; // number of questions to request from Open Trivia Database
// IMPORTANT: set numQuestions to 10 (or whatever) when finished testing
var questCategory = 27 // 27 is the animals category

// quiz questions
var questionsList = [];
var currentQuestion = 0;

// fox photos
var earnedFoxes = [];
var pictureUrl = "https://randomfox.ca/floof/";
var pictureNum = [];

// get new questions from Open Trivia Database based on selected difficulty
var getQuestions = function (difficulty) {
    // get difficulty selection
    // if the selected difficulty is easy, medium, or hard, create a parameter for the query URL
    if (difficulty !== "random") {
        questDifficulty = "&difficulty=" + difficulty;
    } else {
        // if the selected difficulty was random, don't add anything to query URL
        questDifficulty = "";
    };
    // IMPORTANT: the code below in this function needs to be un-commented after testing is finished
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
                    };

                    // wait for API call to get questions before starting game
                    setTimeout(startGame(), 1000);
                });
            } else {
                // need to add error message
                console.log("The page encountered an error retrieving questions.");
                // IMPORTANT: add a modal to alert the user of the error
            };
        })
        .catch(function (error) {
            // need to add error message
            console.log("Please check your connection and try again.");
            // IMPORTANT: add a modal to alert the user of the error
        })
};

var startGame = function () {
    // reset current question number
    currentQuestion = 0;

    // reset earned foxes
    earnedFoxes.length = 0;

    // clear main element
    $("main").html("");

    // if New Game button exists, replace it with My Foxes button and add listener for My Foxes button
    // IMPORTANT: add this code block later

    // load first question
    // create question div and add question text
    var questionTextDiv = document.createElement("div")
    questionTextDiv.className = "question";
    var questionNum = parseInt(questionsList[currentQuestion].number) + 1;
    questionTextDiv.innerHTML = questionNum + ". " + questionsList[currentQuestion].question;
    // append question div to main element
    document.querySelector("main").appendChild(questionTextDiv);

    // get and store the number of answer choices for the question
    var numChoices = questionsList[currentQuestion].incorrect.length + 1;

    if (questionsList[currentQuestion].correct !== "True" && questionsList[currentQuestion].correct !== "False") {
        // randomize answer choices
        // create array to hold each answer choice number
        var choiceNumbers = [];
        // push each answer choice number into array
        for (i = 0; i < numChoices; i++) {
            choiceNumbers.push(i);
        };

        // create array to hold random order of choices
        var choiceOrder = [];
        var choicesLeft = numChoices;
        // push choices into array
        for (i = 0; i < numChoices; i++) {
            var randomIndex = Math.floor(Math.random() * choicesLeft);
            if (parseInt(choiceNumbers[randomIndex]) === numChoices - 1) {
                // if the chosen question number is the highest in the array, push "correct"
                choiceOrder.push("correct");
                choiceNumbers.splice(randomIndex, 1);
                choicesLeft = choicesLeft - 1;
            } else {
                // otherwise, push the number at that index
                choiceOrder.push(choiceNumbers[randomIndex]);
                choiceNumbers.splice(randomIndex, 1);
                choicesLeft = choicesLeft - 1;
            };
        };
    };

    // populate answer choices
    // create answer choices div
    var answerChoicesDiv = document.createElement("div");
    answerChoicesDiv.className = "answer-choices";

    // add answer choices to answer choices div
    if (questionsList[currentQuestion].correct === "True" || questionsList[currentQuestion].correct === "False") {
        // if it's a true/false question, add True answer choice
        var singleChoiceDiv = document.createElement("div");
        singleChoiceDiv.className = "choice";
        singleChoiceDiv.innerText = "True";
        // check correct answer and add appropriate data attribute
        if (questionsList[currentQuestion].correct === "True") {
            singleChoiceDiv.setAttribute("data-correct", "correct");
        } else {
            singleChoiceDiv.setAttribute("data-correct", "incorrect");
        };
        // append the answer choice to the answer choices div
        answerChoicesDiv.appendChild(singleChoiceDiv);

        // add False answer choice
        var singleChoiceDiv = document.createElement("div");
        singleChoiceDiv.className = "choice";
        singleChoiceDiv.innerText = "False";
        // check correct answer and add appropriate data attribute
        if (questionsList[currentQuestion].correct === "False") {
            singleChoiceDiv.setAttribute("data-correct", "correct");
        } else {
            singleChoiceDiv.setAttribute("data-correct", "incorrect");
        };

        // append the answer choice to the answer choices div
        answerChoicesDiv.appendChild(singleChoiceDiv);

    } else {
        // if it's a multiple choice question, add answer choices one by one
        for (i = 0; i < numChoices; i++) {
            var singleChoiceDiv = document.createElement("div");
            singleChoiceDiv.className = "choice";

            // for each answer choice, add a data attribute based on whether it's the correct answer
            if (choiceOrder[i] === "correct") {
                singleChoiceDiv.innerHTML = questionsList[currentQuestion].correct;
                singleChoiceDiv.setAttribute("data-correct", "correct");
            } else {
                singleChoiceDiv.innerHTML = questionsList[currentQuestion].incorrect[choiceOrder[i]];
                singleChoiceDiv.setAttribute("data-correct", "incorrect");
            };

            // append choice to answer choices div
            answerChoicesDiv.appendChild(singleChoiceDiv);
        };
    };

    // add answer choices div to main
    document.querySelector("main").appendChild(answerChoicesDiv);

    // create and add photo div for feedback when a question is answered
    var photoDiv = document.createElement("div");
    photoDiv.className = "photo";
    photoDiv.innerHTML = "";
    document.querySelector("main").appendChild(photoDiv);

    // add listener for answer choices
    $(".answer-choices").on("click", checkAnswer);
}; 

var foxPicQuery = function () {

    fetch(pictureUrl) 
        .then((response) => {
            if (response.ok) {
                response.json().then(function (data) {
                    // var foxQueryUrl = data.image;
                    // console.log(foxQueryUrl);
                    console.log(data.image);
                    pictureNum.push(data.image);    
                });
            };
        })
        .catch(function (response) {
            if(!response.ok) {
                console.log("Fox Picture Query isn't working properly")
            }
        });
        
    return pictureNum[pictureNum.length - 1];
};

// check for right/wrong answer, display feedback, and store fox photo
var checkAnswer = function (event) {

    if (event.target.dataset.correct === "correct") {
        // if the answer was correct, get fox photo and display to page with success message
        // var foxPhotoUrl = getFoxPhoto();
        
        // IMPORTANT: set foxPhotoUrl to getFoxPhoto() after testing
        
        var foxPhotoUrl = foxPicQuery();
        console.log(foxPhotoUrl);
        // clear existing fox photo and/or message
        document.querySelector(".photo").innerHTML = "";

        // create success message
        var successMessage = document.createElement("div");
        successMessage.className = "feedback success";
        successMessage.innerText = "That's right! You earned a fox!";
        // add to page
        document.querySelector(".photo").appendChild(successMessage);

        // create img element to display photo
        var foxPhotoImg = document.createElement("img");
        foxPhotoImg.className = "fox-photo-img";
        foxPhotoImg.src = foxPhotoUrl;
        foxPhotoImg.setAttribute("alt", "photo of a fox");
        // add to page
        document.querySelector(".photo").appendChild(foxPhotoImg);

        // store fox in global array
        earnedFoxes.push(foxPhotoUrl);

        // store fox in localStorage
        // IMPORTANT: add this feature later

    } else {
        // clear existing fox photo and/or message
        document.querySelector(".photo").innerHTML = "";

        // if the answer was incorrect, display a failure message
        var failureMessage = document.createElement("div");
        failureMessage.className = "feedback failure";
        failureMessage.innerHTML = "Sorry, the correct answer was " + questionsList[currentQuestion].correct + ".";

        // add failure message to page
        document.querySelector(".photo").appendChild(failureMessage);
    };
            
    // load next question
    nextQuestion();
};

// load each subsequent question after first one
var nextQuestion = function () {
    currentQuestion = currentQuestion + 1

    // if there are no more questions, end the game after 3.5 seconds
    if (!questionsList[currentQuestion]) {
        endGame();
    } else {
        // if there are more questions, display next question
        // update question text
        var questionNum = parseInt(questionsList[currentQuestion].number) + 1;
        document.querySelector(".question").innerHTML = questionNum + ". " + questionsList[currentQuestion].question;

        // update answer choices
        // clear previous answer choices
        document.querySelector(".answer-choices").innerHTML = "";

        // get and store the number of answer choices for the question
        var numChoices = questionsList[currentQuestion].incorrect.length + 1;

        if (questionsList[currentQuestion].correct !== "True" && questionsList[currentQuestion].correct !== "False") {
            // randomize answer choices
            // create array to hold each answer choice number
            var choiceNumbers = [];
            // push each answer choice number into array
            for (i = 0; i < numChoices; i++) {
                choiceNumbers.push(i);
            };

            // create array to hold random order of choices
            var choiceOrder = [];
            var choicesLeft = numChoices;
            // push choices into array
            for (i = 0; i < numChoices; i++) {
                var randomIndex = Math.floor(Math.random() * choicesLeft);
                if (parseInt(choiceNumbers[randomIndex]) === numChoices - 1) {
                    // if the chosen question number is the highest in the array, push "correct"
                    choiceOrder.push("correct");
                    choiceNumbers.splice(randomIndex, 1);
                    choicesLeft = choicesLeft - 1;
                } else {
                    // otherwise, push the number at that index
                    choiceOrder.push(choiceNumbers[randomIndex]);
                    choiceNumbers.splice(randomIndex, 1);
                    choicesLeft = choicesLeft - 1;
                };
            };
        };

        // add answer choices to answer choices div
        if (questionsList[currentQuestion].correct === "True" || questionsList[currentQuestion].correct === "False") {
            // if it's a true/false question, add True answer choice
            var singleChoiceDiv = document.createElement("div");
            singleChoiceDiv.className = "choice";
            singleChoiceDiv.innerText = "True";
            // check correct answer and add appropriate data attribute
            if (questionsList[currentQuestion].correct === "True") {
                singleChoiceDiv.setAttribute("data-correct", "correct");
            } else {
                singleChoiceDiv.setAttribute("data-correct", "incorrect");
            };
            // append the answer choice to the answer choices div
            document.querySelector(".answer-choices").appendChild(singleChoiceDiv);

            // add False answer choice
            var singleChoiceDiv = document.createElement("div");
            singleChoiceDiv.className = "choice";
            singleChoiceDiv.innerText = "False";
            // check correct answer and add appropriate data attribute
            if (questionsList[currentQuestion].correct === "False") {
                singleChoiceDiv.setAttribute("data-correct", "correct");
            } else {
                singleChoiceDiv.setAttribute("data-correct", "incorrect");
            };

            // append the answer choice to the answer choices div
            document.querySelector(".answer-choices").appendChild(singleChoiceDiv);

        } else {
            // if it's a multiple choice question, add answer choices one by one
            for (i = 0; i < numChoices; i++) {
                var singleChoiceDiv = document.createElement("div");
                singleChoiceDiv.className = "choice";

                // for each answer choice, add a data attribute based on whether it's the correct answer
                if (choiceOrder[i] === "correct") {
                    singleChoiceDiv.innerHTML = questionsList[currentQuestion].correct;
                    singleChoiceDiv.setAttribute("data-correct", "correct");
                } else {
                    singleChoiceDiv.innerHTML = questionsList[currentQuestion].incorrect[choiceOrder[i]];
                    singleChoiceDiv.setAttribute("data-correct", "incorrect");
                };

                // append choice to answer choices div
                document.querySelector(".answer-choices").appendChild(singleChoiceDiv);
            };
        };
    };
};

var endGame = function () {
    // clear main
    $("main").html("");

    // create text div
    var endgameTextDiv = document.createElement("div");
    endgameTextDiv.className = "endgame-text";

    if (earnedFoxes.length > 0) {
        // add success text
        endgameTextDiv.innerHTML = "<p>Well done! The foxes you earned are shown below.</p>";
    } else {
        // add failure text
        endgameTextDiv.innerHTML = "<p>Sorry, you didn't earn any foxes this time.</p>";
    };
    // append endgame text div to main
    document.querySelector("main").appendChild(endgameTextDiv);

    // display difficulty selector and start button to start new 
    // create div to contain select and button
    var newGameDiv = document.createElement("div");
    newGameDiv.className = "new-game";
    newGameDiv.innerHTML = "<p>Want to play again?</p>";

    // create label
    var difficultyLabel = document.createElement("label");
    difficultyLabel.setAttribute("for", "new-difficulty");
    difficultyLabel.innerText = "Choose your difficulty:";
    // add label to new game div
    newGameDiv.appendChild(difficultyLabel);

    // create select
    var selectDifficulty = document.createElement("select");
    selectDifficulty.setAttribute("id", "new-difficulty");
    selectDifficulty.setAttribute("name", "new-difficulty");
    selectDifficulty.innerHTML = "<option value='easy'>Easy</option><option value='medium'>Medium</option><option value='hard'>Hard</option><option value='random'>Random</option>"
    // add select to new game div
    newGameDiv.appendChild(selectDifficulty);

    // create button
    var newGameButton = document.createElement("button");
    newGameButton.setAttribute("type", "btn");
    newGameButton.setAttribute("id", "start-new");
    newGameButton.setAttribute("class", "start");
    newGameButton.innerText = "New Game";
    // add button to new game div
    newGameDiv.appendChild(newGameButton);

    // add new game div to main
    document.querySelector("main").appendChild(newGameDiv);

    if (earnedFoxes.length > 0) {
        // if fox photos were earned, display each one in a div
        // create container div
        var foxPhotosDiv = document.createElement("div");
        foxPhotosDiv.className = "endgame-fox-photos";

        // put each photo in a div and add it
        for (i = 0; i < earnedFoxes.length; i++) {
            // create div to hold photo
            var singlePhotoDiv = document.createElement("div");
            singlePhotoDiv.className = "endgame-photo";

            var foxPhotoImg = document.createElement("img");
            foxPhotoImg.className = "endgame-img";
            foxPhotoImg.src = earnedFoxes[i];
            foxPhotoImg.setAttribute("alt", "photo of a fox");
            // add photo to div
            singlePhotoDiv.appendChild(foxPhotoImg);

            // add single photo div to photos div
            foxPhotosDiv.appendChild(singlePhotoDiv);
        };

        // add all fox photos to page
        document.querySelector("main").appendChild(foxPhotosDiv);
    };

    // check localstorage for stored fox photos and give option to display those
    // IMPORTANT: add this content later

    // add listener for new game button
    $("#start-new").on("click", function (event) {
        var difficulty = $("#new-difficulty").val();
        getQuestions(difficulty);
    });
}

// add listener for start button to start game
$(".start").on("click", function (event) {
    var difficulty = $("#difficulty").val();
    getQuestions(difficulty);
});







// Open Trivia Database API request variables
var openTdbUrl = "https://opentdb.com/api.php?";
var numQuestions = 10; // number of questions to request
var questCategory = 27 // 27 is the animals category

// quiz questions
    // IMPORTANT: set questionsList to empty array when testing is done
    // IMPORTANT: un-comment portion of getQuestions that calls the API when testing is done
var questionsList = [
    {
        number: "0",
        question: "A slug&rsquo;s blood is green.",
        correct: "True",
        incorrect: ["False"],

    },
    {
        number: "1",
        question: "What is the scientific name for modern day humans?",
        correct: "Homo Sapiens",
        incorrect: ['Homo Ergaster', 'Homo Erectus', 'Homo Neanderthalensis'],
    },
    {
        number: "2",
        question: "How many legs do butterflies have?",
        correct: "6",
        incorrect: ["2", "4", "0"],
    },
];
var currentQuestion = 0;

// fox photos
var earnedFoxes = [];

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
    // console.log(openTdbUrl + "amount=" + numQuestions + "&category=" + questCategory + questDifficulty)
    // // API request to Open Trivia Database
    // fetch(openTdbUrl + "amount=" + numQuestions + "&category=" + questCategory + questDifficulty)
    //     // difficulty can be set to random (default), easy, medium, or hard
    //     .then(function (response) {
    //         if (response.ok) {
    //             // if response is good, get the data
    //             response.json().then(function (data) {
    //                 // clear old questions
    //                 questionsList.length = 0;
    //                 // store new questions
    //                 for (i = 0; i < numQuestions; i++) {
    //                     // get data for each question and add it to questions list

    //                     // copy each question's incorrect answers to an array
    //                     var tempArray = [];
    //                     for (j = 0; j < data.results[i].incorrect_answers.length; j++) {
    //                         tempArray.push(data.results[i].incorrect_answers[j])
    //                     };

    //                     // make a new object with each question's info
    //                     var newQuestion = {
    //                         'number': i.toString(),
    //                         'question': data.results[i].question,
    //                         'correct': data.results[i].correct_answer,
    //                         'incorrect': tempArray
    //                     };
    //                     // add the question info to the question list
    //                     questionsList.push(newQuestion);

                         $(".start").on("click", startGame);
    //                 };
    //             });
    //         } else {
    //             // need to add error message
    //             console.log("The page encountered an error retrieving questions.");
    //         };
    //         console.log(questionsList);
    //     })
    //     .catch(function (error) {
    //         // need to add error message
    //         console.log("Please check your connection and try again.");
    //     });
};

var startGame = function () {
    // reset current question number
    currentQuestion = 0;

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

    // append answer choices div to main
    document.querySelector("main").appendChild(answerChoicesDiv);

    // create and add photo div for feedback when a question is answered
    var photoDiv = document.createElement("div");
    photoDiv.className = "photo";
    photoDiv.innerHTML = "";
    document.querySelector("main").appendChild(photoDiv);

    // add listener for answer choices
    $(".answer-choices").on("click", checkAnswer);
};

// check for right/wrong answer, display feedback, and store fox photo
var checkAnswer = function (event) {
    if (event.target.dataset.correct === "correct") {
        // if the answer was correct, get fox photo and display to page with success message
        // var foxPhotoUrl = getFoxPhoto();
        var foxPhotoUrl = "https://randomfox.ca/images/26.jpg"
            // IMPORTANT: set foxPhotoUrl to getFoxPhoto() after testing

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
        console.log(earnedFoxes);

        // store fox in localStorage
        
    } else {
        // clear existing fox photo and/or message
        document.querySelector(".photo").innerHTML = "";

        // if the answer was incorrect, display a failure message
        var failureMessage = document.createElement("div");
        failureMessage.className = "feedback failure";
        failureMessage.innerText

        // add failure message to page
        document.querySelector(".photo").appendChild(failureMessage);
    };

    // // load next question
    // nextQuestion();
};

// var nextQuestion = function() {

// }

getQuestions("easy");








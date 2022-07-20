// Brett's Note: search for "IMPORTANT" to find unfinished/hard-coded sections that will need to be changed

// Open Trivia Database API request variables
const openTdbUrl = "https://opentdb.com/api.php?";
const numQuestions = 6; // number of questions to request from Open Trivia Database
// IMPORTANT: set numQuestions to 10 (or whatever) when finished testing
const questCategory = 27 // 27 is the animals category

// quiz questions
let questionsList = [];
let currentQuestion = 0;

// fox photos
let earnedFoxes = [];
const pictureUrl = "https://randomfox.ca/floof/";
let pictureNum = [];

// Element to use for modal popups. Append data to this for modal popups
let modalData = document.createElement('div')
let modal = document.getElementById('modal') // add 'is-active' to class list to open modal
let modalContent = document.getElementById('modal-content')
var showFoxBtn = document.getElementById('header-btn')
// append modalData to this

// get new questions from Open Trivia Database based on selected difficulty
const getQuestions = (difficulty) => {
    let questDifficulty = ''
    // get difficulty selection
    // if the selected difficulty is easy, medium, or hard, add a parameter for the query URL, or do nothing if it's random
    difficulty !== 'random' ? questDifficulty = "&difficulty=" + difficulty : null
    // IMPORTANT: the code below in this function needs to be un-commented after testing is finished
    // API request to Open Trivia Database
    fetch(openTdbUrl + "amount=" + numQuestions + "&category=" + questCategory + questDifficulty)
        // difficulty can be set to random (default), easy, medium, or hard
        .then((response) => {
            if (!response.ok) {
                modalData.textContent = `Error. Status: ${response.status}`
                modalContent.append(modalData)
                modal.classList.add('is-active')
                throw new Error(`Error. Status: ${response.status}`)
            }
            return response.json()
                // if response is good, get the data
                .then((data) => {
                    // clear old questions
                    questionsList.length = 0
                    // store new questions
                    for (i = 0; i < numQuestions; i++) {
                        // get data for each question and add it to questions list
                        // copy each question's incorrect answers to an array
                        let tempArray = [];
                        for (j = 0; j < data.results[i].incorrect_answers.length; j++) {
                            tempArray.push(data.results[i].incorrect_answers[j])
                        };

                        // make a new object with each question's info
                        let newQuestion = {
                            'number': i.toString(),
                            'question': data.results[i].question,
                            'correct': data.results[i].correct_answer,
                            'incorrect': tempArray
                        }
                        // add the question info to the question list
                        questionsList.push(newQuestion);
                    }
                    return startGame()
                })
        })
}

// Important!!! btn header when its click itll run function
var showMyFoxes = function () {
    //clear mainelement
    document.querySelector("main").innerHTML = "";

    var container = document.createElement("div");
    container.className = "column is-full";

    var exists;

    // check localstorage "foxHut"
    if (localStorage.getItem("foxHut")) {
        exists = true;

        // add text
        var feedbackDiv = document.createElement("div");
        feedbackDiv.className = "endgame-text pt-4 column is-full";
        feedbackDiv.innerHTML = "<p>Here are the foxes you've collected.</p>";
        container.appendChild(feedbackDiv);
    } else {
        exists = false;

        // add text
        var feedbackDiv = document.createElement("div");
        feedbackDiv.className = "endgame-text pt-4 column is-full";
        feedbackDiv.innerHTML = "<p>There are no foxes in your collection.</p>";
        container.appendChild(feedbackDiv);
    };

    // add elements to play again
    // create div to contain select and button
    var newGameDiv = document.createElement("div");
    newGameDiv.className = "new-game column is-full my-1";
    newGameDiv.innerHTML = "<p>Want to add to your collection? Start a new game!</p>";

    // create label
    var difficultyLabel = document.createElement("label");
    difficultyLabel.classList.add('tag', 'is-large', 'mt-2');
    difficultyLabel.setAttribute("for", "new-difficulty");
    difficultyLabel.innerText = "Choose your difficulty:";
    // add label to new game div
    newGameDiv.appendChild(difficultyLabel);

    // create select
    let selectContainerDiv = document.createElement('div');
    selectContainerDiv.classList.add("select", "is-multiple", "mt-2", "mx-2");
    var selectDifficulty = document.createElement("select");
    selectDifficulty.setAttribute("id", "new-difficulty");
    selectDifficulty.setAttribute("name", "new-difficulty");
    selectDifficulty.setAttribute("class", "difficulty");
    selectDifficulty.innerHTML = "<option value='easy'>Easy</option><option value='medium'>Medium</option><option value='hard'>Hard</option><option value='random'>Random</option>"
    // add select to new game div
    selectContainerDiv.appendChild(selectDifficulty);
    newGameDiv.appendChild(selectContainerDiv)

    // create button
    var newGameButton = document.createElement("button");
    newGameButton.setAttribute("type", "btn");
    newGameButton.setAttribute("id", "start-new");
    newGameButton.setAttribute("class", "start button is-green mx-5 mt-2");
    newGameButton.innerText = "New Game";
    // add button to new game div
    newGameDiv.appendChild(newGameButton);

    // add new game div to the page
    container.appendChild(newGameDiv);

    if (exists) {
        // if there's an array in localStorage, display the images in the array
        var foxHut = JSON.parse(localStorage.getItem("foxHut"));

        // add button to clear saved foxes
        // create div container
        var clearDiv = document.createElement("div");
        clearDiv.className = "new-game column is-full";
        clearDiv.innerHTML = "<p>Want to delete your collection and start over?</p>";
        // create button and add to div
        var clearButton = document.createElement("button");
        clearButton.setAttribute("type", "btn");
        clearButton.setAttribute("id", "clear-btn");
        clearButton.setAttribute("class", "start button is-red mx-5 mt-2");
        clearButton.innerText = "Clear Foxes";
        clearDiv.appendChild(clearButton);
        // add div to page
        container.appendChild(clearDiv);

        // create container for photos
        let photoContainer = document.createElement("div");
        photoContainer.className = "endgame-fox-photos columns is-multiline is-full";

        for (let i = 0; i < foxHut.length; i++) {
            // for each URL, create a div and an img
            var foxPicUrl = foxHut[i];
            // create div
            var foxPicDiv = document.createElement("div");
            foxPicDiv.className = "endgame-photo column is-one-quarter-desktop is-one-third-tablet mt-4"
            // create img
            var foxPic = document.createElement("img");
            foxPic.src = foxPicUrl;
            foxPic.className = "endgame-img";
            foxPic.setAttribute("id", "photo of a fox");
            // append img to div and div to container
            foxPicDiv.appendChild(foxPic);
            photoContainer.appendChild(foxPicDiv);
        };

        // add photo container to main container
        container.appendChild(photoContainer);
    };
        // add main container to page
        document.querySelector("main").appendChild(container);

        // add listener for new game button
        $("#start-new").on("click", function (event) {
            var difficulty = $("#new-difficulty").val();
            getQuestions(difficulty);
        });

        // add event listener for clear button
        $("#clear-btn").on("click", function () {
            clearStorage();
            showMyFoxes();
        });
};

var startGame = function () {
    // reset current question number
    currentQuestion = 0;

    // reset earned foxes
    earnedFoxes.length = 0;

    // clear main element
    $("main").html("");

    // load first question
    // create container div
    let questionContainerDiv = document.createElement("div");
    questionContainerDiv.className = "question-container column is-full"

    // create question div and add question text
    let questionTextDiv = document.createElement("div");
    questionTextDiv.className = "question tag is-light is-large my-3";
    let questionNum = parseInt(questionsList[currentQuestion].number) + 1;
    questionTextDiv.innerHTML = questionNum + ". " + questionsList[currentQuestion].question;
    // append question div to main element
    questionContainerDiv.appendChild(questionTextDiv);

    // get and store the number of answer choices for the question
    let numChoices = questionsList[currentQuestion].incorrect.length + 1;

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
    answerChoicesDiv.className = "answer-choices py-4";

    // add answer choices to answer choices div
    if (questionsList[currentQuestion].correct === "True" || questionsList[currentQuestion].correct === "False") {
        // if it's a true/false question, add True answer choice
        var singleChoiceDiv = document.createElement("div");
        singleChoiceDiv.className = "choice button mx-3";
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
        singleChoiceDiv.className = "choice button mx-3";
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
            singleChoiceDiv.className = "choice button mx-3";

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

    // append answer choices div to container div
    questionContainerDiv.appendChild(answerChoicesDiv);

    // create and add photo div for feedback when a question is answered
    var photoDiv = document.createElement("div");
    photoDiv.className = "photo";
    photoDiv.innerHTML = "";
    questionContainerDiv.appendChild(photoDiv);

    // add container div to main
    document.querySelector("main").appendChild(questionContainerDiv);

    // add listener for answer choices
    $(".answer-choices").on("click", checkAnswer);
};

// get random fox photo from RandomFox
const foxPicQuery = () => {
    // api request
    fetch(pictureUrl)
        .then((response) => {
            if (!response.ok) {
                modalData.textContent = `Error. Status: ${response.status}`
                modalContent.append(modalData)
                modal.classList.add('is-active')
                throw new Error(`Error. Status: ${response.status}`)
            }
            {
                response.json().then(function (data) {
                    // add image to array
                    pictureNum.push(data.image);
                });
            };
        })
    return pictureNum[pictureNum.length - 1];
};

// check for right/wrong answer, display feedback, and store fox photo
const checkAnswer = (event) => {

    if (event.target.dataset.correct === "correct") {
        // if the answer was correct, get fox photo
        var foxPhotoUrl = foxPicQuery();

        // clear existing fox photo and/or message
        document.querySelector(".photo").innerHTML = "";

        // create success message
        var successMessage = document.createElement("div");
        successMessage.className = "feedback notification center is-large is-green my-3";
        successMessage.textContent = "That's right! You earned a fox!";
        // add to page
        document.querySelector(".photo").appendChild(successMessage);

        // create div to hold photo
        var foxPhotoDiv = document.createElement("div");
        foxPhotoDiv.className = "endgame-photo";
        // create img element to display photo
        var foxPhotoImg = document.createElement("img");
        foxPhotoImg.className = "endgame-img";
        foxPhotoImg.src = foxPhotoUrl;
        foxPhotoImg.setAttribute("alt", "photo of a fox");
        // add to div
        foxPhotoDiv.appendChild(foxPhotoImg);
        // add div to page
        document.querySelector(".photo").appendChild(foxPhotoDiv);

        // store fox in global array
        earnedFoxes.push(foxPhotoUrl);

        // store fox in localStorage
        // IMPORTANT: add this feature later

    } else {
        // clear existing fox photo and/or message
        document.querySelector(".photo").innerHTML = "";

        // if the answer was incorrect, display a failure message
        var failureMessage = document.createElement("div");
        failureMessage.className = "feedback notification center is-large is-red my-3";
        failureMessage.innerHTML = "Sorry, the correct answer was " + questionsList[currentQuestion].correct + ".";

        // add failure message to page
        document.querySelector(".photo").appendChild(failureMessage);
    };

    // load next question
    nextQuestion();
};

// load each subsequent question after first one
const nextQuestion = () => {
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
            singleChoiceDiv.className = "choice button mx-3";
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
            singleChoiceDiv.className = "choice button mx-3";
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
                singleChoiceDiv.className = "choice button mx-3";

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
    // clear container div
    $("main").html("");

    // create endgame div
    var endgameContainerDiv = document.createElement("div");
    endgameContainerDiv.className = "endgame-container column is-full"

    // create text div
    var endgameTextDiv = document.createElement("div");
    endgameTextDiv.className = "endgame-text pt-1";

    if (earnedFoxes.length > 0) {
        // add success text
        endgameTextDiv.innerHTML = "<p>Well done! The foxes you earned are shown below.</p>";
    } else {
        // add failure text
        endgameTextDiv.innerHTML = "<p>Sorry, you didn't earn any foxes this time.</p>";
    };

    //check localstorage for existing array
    if (localStorage.getItem("foxHut")) {
        //if in localstorage, get it and add button to display
        //get array
        var foxHut = JSON.parse(localStorage.getItem("foxHut"));
        //add current array to it
        foxHut = foxHut.concat(earnedFoxes);
        //store new array in local storage
        localStorage.setItem("foxHut", JSON.stringify(foxHut));
        //add text and btn
        //createparagraph element and add to page 
        var paragraph = document.createElement("p");
        paragraph.className = "mt-4"
        paragraph.innerHTML = "If you want to see all the foxes you've collected, click this button.";
        endgameTextDiv.appendChild(paragraph);
        //create and style button and add to page
        var button = document.createElement("button");
        button.id = "my-foxes";
        button.className = "start button is-green my-2";
        button.setAttribute("type", "btn");
        button.innerHTML = "Show My Foxes";
        endgameTextDiv.appendChild(button);

    } else {
        //if theres nothing in localstorage, add current array to localstorag
        var foxHut = earnedFoxes
        localStorage.setItem("foxHut", JSON.stringify(foxHut));
    };

    // append endgame text div to endgame container
    endgameContainerDiv.appendChild(endgameTextDiv);

    // display difficulty selector and start button to start new 
    // create div to contain select and button
    var newGameDiv = document.createElement("div");
    newGameDiv.className = "new-game my-3";
    newGameDiv.innerHTML = "<p>Want to play again?</p>";

    // create label
    var difficultyLabel = document.createElement("label");
    difficultyLabel.classList.add('tag', 'is-large', 'mt-2');
    difficultyLabel.setAttribute("for", "new-difficulty");
    difficultyLabel.innerText = "Choose your difficulty:";
    // add label to new game div
    newGameDiv.appendChild(difficultyLabel);

    // create select
    let selectContainerDiv = document.createElement('div');
    selectContainerDiv.classList.add("select", "is-multiple", "mt-2", "mx-2");
    var selectDifficulty = document.createElement("select");
    selectDifficulty.setAttribute("id", "new-difficulty");
    selectDifficulty.setAttribute("name", "new-difficulty");
    selectDifficulty.setAttribute("class", "difficulty");
    selectDifficulty.innerHTML = "<option value='easy'>Easy</option><option value='medium'>Medium</option><option value='hard'>Hard</option><option value='random'>Random</option>"
    // add select to new game div
    selectContainerDiv.appendChild(selectDifficulty);
    newGameDiv.appendChild(selectContainerDiv)

    // create button
    var newGameButton = document.createElement("button");
    newGameButton.setAttribute("type", "btn");
    newGameButton.setAttribute("id", "start-new");
    newGameButton.setAttribute("class", "start button is-green mx-5 mt-2");
    newGameButton.innerText = "New Game";
    // add button to new game div
    newGameDiv.appendChild(newGameButton);

    // add new game div to endgame container
    endgameContainerDiv.appendChild(newGameDiv);

    if (earnedFoxes.length > 0) {
        // if fox photos were earned, display each one in a div
        // create container div
        var foxPhotosDiv = document.createElement("div");
        foxPhotosDiv.className = "endgame-fox-photos columns is-multiline";

        // put each photo in a div and add it
        for (i = 0; i < earnedFoxes.length; i++) {
            // create div to hold photo
            var singlePhotoDiv = document.createElement("div");
            singlePhotoDiv.className = "endgame-photo column is-one-quarter-desktop is-one-third-tablet mt-4";

            var foxPhotoImg = document.createElement("img");
            foxPhotoImg.className = "endgame-img";
            foxPhotoImg.src = earnedFoxes[i];
            foxPhotoImg.setAttribute("alt", "photo of a fox");
            // add photo to div
            singlePhotoDiv.appendChild(foxPhotoImg);

            // add single photo div to photos div
            foxPhotosDiv.appendChild(singlePhotoDiv);
        };
        // add all fox photos to container div
        endgameContainerDiv.appendChild(foxPhotosDiv);
    };
    // add container div to page
    document.querySelector("main").appendChild(endgameContainerDiv);

    // add listener for new game button
    $("#start-new").on("click", function (event) {
        var difficulty = $("#new-difficulty").val();
        getQuestions(difficulty);
    });

    // add listener for Show My Foxes button
    $("#my-foxes").on("click", showMyFoxes);
};

// clear stored foxes
var clearStorage = function () {
    if (localStorage.getItem("foxHut")) {
        // if there's a stored array in localStorage, delete it
        localStorage.removeItem("foxHut");
    };
};

// adding this fixes the bug of the first correct answer loading an undefined URL
foxPicQuery();

// add listener for start button to start game
$(".start").on("click", function (event) {
    var difficulty = $("#difficulty").val();
    getQuestions(difficulty);
});

// listener for My Foxes button in header
showFoxBtn.addEventListener('click', showMyFoxes);
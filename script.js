let score = 0;
let questionIndex = 0;
let questions = [];
const apiUrl = "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
const adUrl = "https://dummyjson.com/products";

// Elementos del DOM
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score-value");
const nextQuestionButton = document.getElementById("next-question");
const adSection = document.getElementById("ad-section");
const adImage = document.getElementById("ad-image");
const adTitle = document.getElementById("ad-title");
const adDescription = document.getElementById("ad-description");
const adPrice = document.getElementById("ad-price");

// Cargar preguntas al iniciar
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        questions = data.results;
        showQuestion();
    });

// Mostrar una pregunta
function showQuestion() {
    if (questionIndex >= questions.length) {
        feedbackElement.innerHTML = `¡Juego terminado! Puntuación final: ${score}`;
        feedbackElement.classList.remove("hidden");
        nextQuestionButton.classList.add("hidden");
        return;
    }
    
    const currentQuestion = questions[questionIndex];
    questionElement.innerHTML = currentQuestion.question;

    const answers = [...currentQuestion.incorrect_answers];
    answers.push(currentQuestion.correct_answer);
    answers.sort(() => Math.random() - 0.5);

    optionsElement.innerHTML = "";
    feedbackElement.classList.add("hidden");

    answers.forEach(answer => {
        const li = document.createElement("li");
        li.innerHTML = answer;
        li.addEventListener("click", () => checkAnswer(li, answer, currentQuestion.correct_answer));
        optionsElement.appendChild(li);
    });

    nextQuestionButton.classList.add("hidden");
}

// Verificar respuesta
function checkAnswer(selectedOption, selectedAnswer, correctAnswer) {
    const allOptions = optionsElement.querySelectorAll("li");

    allOptions.forEach(option => {
        option.style.pointerEvents = "none"; 
        if (option.innerHTML === correctAnswer) {
            option.classList.add("correct"); // Solo la correcta en verde
        } else if (option.innerHTML === selectedAnswer) {
            option.classList.add("incorrect"); // Solo la seleccionada incorrecta en rojo
        }
    });

    if (selectedAnswer === correctAnswer) {
        score++;
        scoreElement.innerHTML = score;
        feedbackElement.innerHTML = "¡Enhorabuena! Respuesta correcta.";
        feedbackElement.classList.add("correct");
    } else {
        feedbackElement.innerHTML = `Incorrecto. La respuesta correcta era: ${correctAnswer}`;
        feedbackElement.classList.add("incorrect");
    }

    feedbackElement.classList.remove("hidden");

    questionIndex++;
    if (questionIndex % 2 === 0) {
        showAd();
    } else {
        nextQuestionButton.classList.remove("hidden");
    }
}


// Mostrar anuncio de publicidad cada 2 preguntas
function showAd() {
    fetch(`${adUrl}?limit=1&skip=${Math.floor(Math.random() * 30)}`)
        .then(response => response.json())
        .then(data => {
            const product = data.products[0];
            adImage.src = product.thumbnail;
            adTitle.innerHTML = product.title;
            adDescription.innerHTML = product.description;
            adPrice.innerHTML = `Precio: $${product.price}`;
            adSection.classList.remove("hidden");
            nextQuestionButton.classList.remove("hidden");
        });
}

// Siguiente pregunta
nextQuestionButton.addEventListener("click", () => {
    adSection.classList.add("hidden");
    showQuestion();
});

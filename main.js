const root = document.querySelector(':root')
const quiz = document.querySelector('.quiz')
const questionBox = document.querySelector('.quiz__question')
const answerBoxes = document.querySelectorAll('.quiz__answer')
const nextQuestionBtn = document.querySelector('.quiz__next-btn')
const timer = document.querySelector('.app__timer')
const scoreBox = document.querySelector('.quiz__score-box')
const poinstBox = document.querySelector('.points')
const questionNumberBox = document.querySelector('.question-number')
const nextGameBtn = document.querySelector('.quiz__next-game-btn')
let questionNumber = 1
let points = 0

const maxQuestionNumber = 2

async function handleQuiz() {
	if (questionNumber <= maxQuestionNumber) {
		reset()
		await fetch('https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple')
			.then(res => res.json())
			.then(res => {
				//QUESTION
				const question = res.results[questionNumber].question
				questionBox.textContent = question
				//ANSWERS
				const correctAnswer = res.results[questionNumber].correct_answer
				const incorrectAnswers = res.results[questionNumber].incorrect_answers
				const answers = incorrectAnswers.toSpliced(Math.floor(Math.random() * 4), 0, correctAnswer)
				for (let i = 0; i < answers.length; i++) {
					answerBoxes[i].textContent = answers[i]
				}

				answerBoxes.forEach(answer => {
					if (answer.textContent == correctAnswer) {
						answer.classList.add('correct-answer')
						answer.classList.remove('wrong-answer')
					} else {
						answer.classList.remove('correct-answer')
						answer.classList.add('wrong-answer')
					}
				})
				console.log(questionNumber)
			})
			.catch(error => console.log('error'))
	} else {
		showScore()
	}
}
const chooseAnswer = e => {
	const correctAnswerBox = document.querySelector('.correct-answer')
	for (const btn of answerBoxes) {
		btn.disabled = true
	}
	if (e.target.classList.contains('correct-answer')) {
		points++
	}
	e.target.style.border = '3px solid #000'

	answerBoxes.forEach(answer => {
		answer.style.backgroundColor = 'tomato'
	})
	nextQuestionBtn.disabled = false
	correctAnswerBox.style.backgroundColor = 'limegreen'
}

const handleAnimation = () => {
	nextQuestionBtn.disabled = true
	setTimeout(() => {
		nextQuestionBtn.style.display = 'block'
	}, 5500)
	timer.classList.add('start-timer')
}
const nextQuestion = () => {
	questionNumber++
	handleQuiz()
	handleAnimation()
}

const showScore = () => {
	quiz.classList.add('disabled')
	timer.classList.add('disabled')
	scoreBox.classList.remove('disabled')
	poinstBox.textContent = points
	questionNumberBox.textContent = maxQuestionNumber
}

const nextGame = () => {
	quiz.classList.remove('disabled')
	timer.classList.remove('disabled')
	scoreBox.classList.add('disabled')
	questionNumber = 0
	points = 0
}

const reset = () => {
	answerBoxes.forEach(answer => {
		answer.style.backgroundColor = '#fff'
		answer.style.border = '1px solid #000'
	})
	nextQuestionBtn.style.display = 'none'
	for (const btn of answerBoxes) {
		btn.disabled = false
	}
	timer.classList.remove('start-timer')
}

answerBoxes.forEach(btn => {
	btn.addEventListener('click', chooseAnswer)
})
nextQuestionBtn.addEventListener('click', nextQuestion)
nextGameBtn.addEventListener('click', nextGame)
handleQuiz()
handleAnimation()

const CONFIG = {
  TIMER_SECONDS: 15,
  POINTS_PER_QUESTION: 10,
};

const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  startTime: null,
  timerInterval: null,
  timeLeft: CONFIG.TIMER_SECONDS,
};

// Screen management
function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  state.questions = shuffle(QUESTIONS);
  state.currentIndex = 0;
  state.score = 0;
  state.correctCount = 0;
  state.startTime = Date.now();
  showScreen("quiz-screen");
  renderQuestion();
}

function startTimer() {
  clearTimer();
  state.timeLeft = CONFIG.TIMER_SECONDS;
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearTimer();
      handleTimeout();
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const pct = (state.timeLeft / CONFIG.TIMER_SECONDS) * 100;
  const bar = document.getElementById("timer-bar");
  bar.style.width = `${pct}%`;
  bar.className =
    "timer-bar" + (pct <= 33 ? " danger" : pct <= 60 ? " warning" : "");
  document.getElementById("timer-label").textContent = state.timeLeft;
}

function handleTimeout() {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => (btn.disabled = true));
  const q = state.questions[state.currentIndex];
  buttons[q.correct].classList.add("correct");
  setTimeout(nextQuestion, 900);
}

function updateScoreDisplay() {
  document.getElementById("score-display").textContent =
    `Score: ${state.score}`;
}

function showScorePopup(text) {
  const popup = document.getElementById("score-popup");
  popup.textContent = text;
  popup.classList.add("visible");
  setTimeout(() => popup.classList.remove("visible"), 700);
}

function renderAnswers(q) {
  const grid = document.getElementById("answers-grid");
  grid.innerHTML = "";
  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.addEventListener("click", () => handleAnswer(i));
    grid.appendChild(btn);
  });
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  document.getElementById("question-counter").textContent =
    `Question ${state.currentIndex + 1} / ${total}`;
  updateScoreDisplay();
  document.getElementById("question-text").textContent = q.question;
  renderAnswers(q);
  startTimer();
}

function handleAnswer(selectedIndex) {
  clearTimer();
  const q = state.questions[state.currentIndex];
  const buttons = document.querySelectorAll(".answer-btn");

  // Disable all buttons after selection
  buttons.forEach((btn) => (btn.disabled = true));

  const isCorrect = selectedIndex === q.correct;

  // Highlight correct and wrong
  buttons[q.correct].classList.add("correct");
  if (!isCorrect) {
    buttons[selectedIndex].classList.add("wrong");
  } else {
    state.score += CONFIG.POINTS_PER_QUESTION;
    state.correctCount++;
    updateScoreDisplay();
    showScorePopup(`+${CONFIG.POINTS_PER_QUESTION}`);
  }

  // Advance after short delay
  setTimeout(nextQuestion, 900);
}

function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex < state.questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function getPerformanceMessage(accuracy) {
  if (accuracy === 100) return { emoji: "🏆", message: "Perfect Score!" };
  if (accuracy >= 80) return { emoji: "🎉", message: "Great Job!" };
  if (accuracy >= 60) return { emoji: "👍", message: "Good Effort!" };
  if (accuracy >= 40) return { emoji: "📚", message: "Keep Practicing!" };
  return { emoji: "💪", message: "Don't Give Up!" };
}

function showResults() {
  const elapsed = Math.round((Date.now() - state.startTime) / 1000);
  const total = state.questions.length;
  const accuracy = Math.round((state.correctCount / total) * 100);
  const wrongCount = total - state.correctCount;
  const { emoji, message } = getPerformanceMessage(accuracy);

  document.getElementById("result-emoji").textContent = emoji;
  document.getElementById("result-message").textContent = message;
  document.getElementById("final-score").textContent = state.score;
  document.getElementById("final-accuracy").textContent = `${accuracy}%`;
  document.getElementById("final-time").textContent = `${elapsed}s`;
  document.getElementById("correct-count").textContent = state.correctCount;
  document.getElementById("wrong-count").textContent = wrongCount;

  showScreen("results-screen");
}

function init() {
  document.getElementById("start-btn").addEventListener("click", startQuiz);
  document
    .getElementById("play-again-btn")
    .addEventListener("click", startQuiz);
}

init();

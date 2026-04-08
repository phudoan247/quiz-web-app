const DIFFICULTY = {
  easy: { seconds: 20, label: "🟢 Easy" },
  medium: { seconds: 15, label: "🟡 Medium" },
  hard: { seconds: 10, label: "🔴 Hard" },
};

const CONFIG = {
  TIMER_SECONDS: 15,
  POINTS_PER_QUESTION: 10,
  STREAK_2X: 3,
  STREAK_3X: 5,
};

const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  streak: 0,
  difficulty: "easy",
  startTime: null,
  timerInterval: null,
  timeLeft: DIFFICULTY.easy.seconds,
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

function getTimerSeconds() {
  return (DIFFICULTY[state.difficulty] ?? DIFFICULTY.easy).seconds;
}

function startQuiz() {
  state.questions = shuffle(QUESTIONS);
  state.currentIndex = 0;
  state.score = 0;
  state.correctCount = 0;
  state.streak = 0;
  state.startTime = Date.now();
  document.getElementById("difficulty-badge").textContent =
    DIFFICULTY[state.difficulty].label;
  showScreen("quiz-screen");
  renderQuestion();
}

function getMultiplier() {
  if (state.streak >= CONFIG.STREAK_3X) return 3;
  if (state.streak >= CONFIG.STREAK_2X) return 2;
  return 1;
}

function updateStreakDisplay() {
  const badge = document.getElementById("streak-badge");
  if (state.streak >= CONFIG.STREAK_2X) {
    const multiplier = getMultiplier();
    badge.textContent = `🔥 ${state.streak} streak (${multiplier}x)`;
    badge.className = "streak-badge active";
  } else if (state.streak > 0) {
    badge.textContent = `🔥 ${state.streak} streak`;
    badge.className = "streak-badge building";
  } else {
    badge.textContent = "";
    badge.className = "streak-badge";
  }
}

function startTimer() {
  clearTimer();
  state.timeLeft = getTimerSeconds();
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
  const pct = (state.timeLeft / getTimerSeconds()) * 100;
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
  state.streak = 0;
  updateStreakDisplay();
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

function updateProgressBar() {
  const total = state.questions.length;
  const answered = state.currentIndex;
  const pct = (answered / total) * 100;
  document.getElementById("progress-bar").style.width = `${pct}%`;
  document.getElementById("progress-label").textContent =
    `${answered} / ${total}`;
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  document.getElementById("question-counter").textContent =
    `Question ${state.currentIndex + 1} / ${total}`;
  updateScoreDisplay();
  updateStreakDisplay();
  updateProgressBar();
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
    state.streak = 0;
    updateStreakDisplay();
  } else {
    state.streak++;
    const multiplier = getMultiplier();
    const points = CONFIG.POINTS_PER_QUESTION * multiplier;
    state.score += points;
    state.correctCount++;
    updateScoreDisplay();
    updateStreakDisplay();
    const popupText =
      multiplier > 1
        ? `+${points} x${multiplier}`
        : `+${CONFIG.POINTS_PER_QUESTION}`;
    showScorePopup(popupText);
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

// Leaderboard — localStorage (scores only, no personal data)
const LEADERBOARD_KEY = "quiz_leaderboard";
const LEADERBOARD_MAX = 10;

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch {
    return [];
  }
}

function saveToLeaderboard(score, accuracy, elapsed) {
  const id = Date.now();
  const entries = loadLeaderboard();
  entries.push({ id, score, accuracy, elapsed });
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, LEADERBOARD_MAX);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage unavailable (e.g. private browsing) — continue without saving
  }
  return { entries: trimmed, currentId: id };
}

function renderLeaderboard(entries, currentId) {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "No scores yet — you're the first!";
    list.appendChild(empty);
    return;
  }
  entries.forEach((entry, i) => {
    const li = document.createElement("li");
    li.className =
      "leaderboard-item" + (entry.id === currentId ? " current" : "");
    const rank = document.createElement("span");
    rank.className = "lb-rank";
    rank.textContent = `#${i + 1}`;
    const info = document.createElement("span");
    info.className = "lb-info";
    info.textContent = `${entry.score} pts · ${entry.accuracy}% · ${entry.elapsed}s`;
    li.appendChild(rank);
    li.appendChild(info);
    list.appendChild(li);
  });
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

  const { entries, currentId } = saveToLeaderboard(
    state.score,
    accuracy,
    elapsed,
  );
  renderLeaderboard(entries, currentId);

  showScreen("results-screen");
}

function init() {
  document.querySelectorAll(".btn-difficulty").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-difficulty")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.difficulty = btn.dataset.difficulty;
    });
  });

  document.getElementById("start-btn").addEventListener("click", startQuiz);
  document
    .getElementById("play-again-btn")
    .addEventListener("click", () => showScreen("start-screen"));
}

init();

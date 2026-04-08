const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  startTime: null,
};

// Screen management
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
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
  showScreen('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  document.getElementById('question-counter').textContent =
    `Question ${state.currentIndex + 1} / ${total}`;
  document.getElementById('score-display').textContent =
    `Score: ${state.score}`;
  document.getElementById('question-text').textContent = q.question;

  const grid = document.getElementById('answers-grid');
  grid.innerHTML = '';

  q.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = answer;
    btn.addEventListener('click', () => handleAnswer(i));
    grid.appendChild(btn);
  });
}

function handleAnswer(selectedIndex) {
  const q = state.questions[state.currentIndex];
  const buttons = document.querySelectorAll('.answer-btn');

  // Disable all buttons after selection
  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = selectedIndex === q.correct;

  // Highlight correct and wrong
  buttons[q.correct].classList.add('correct');
  if (!isCorrect) {
    buttons[selectedIndex].classList.add('wrong');
  } else {
    state.score += 10;
    state.correctCount++;
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

function showResults() {
  const elapsed = Math.round((Date.now() - state.startTime) / 1000);
  const accuracy = Math.round((state.correctCount / state.questions.length) * 100);

  document.getElementById('final-score').textContent = state.score;
  document.getElementById('final-accuracy').textContent = `${accuracy}%`;
  document.getElementById('final-time').textContent = `${elapsed}s`;

  showScreen('results-screen');
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('play-again-btn').addEventListener('click', startQuiz);

const GOALS = { easy: 15, normal: 25, hard: 35 };
const TIMES = { easy: 40, normal: 30, hard: 20 };

let currentCans = 0;
let gameActive = false;
let spawnInterval;
let countdown;
let goal = GOALS.normal;
let timeLeft = TIMES.normal;

// Create the 3x3 grid dynamically
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Spawn a water can in a random empty cell
function spawnWaterCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  // Clear all cells first
  cells.forEach(cell => (cell.innerHTML = ''));

  // Pick a random cell
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Create water can element
  const can = document.createElement('div');
  can.className = 'water-can-wrapper';
  can.innerHTML = `<div class="water-can"></div>`;

  // Add click handler to collect can
  can.onclick = () => collectCan(can);

  randomCell.appendChild(can);
}

// Called when a water can is clicked
function collectCan(can) {
  if (!gameActive) return;
  can.remove();
  currentCans++;
  document.getElementById('current-cans').textContent = currentCans;

  // Play click sound if exists
  const clickSound = document.getElementById('click-sound');
  if (clickSound) clickSound.play();

  checkMilestones();

  if (currentCans >= goal) endGame(true);
}

// Show milestone messages at key scores
function checkMilestones() {
  const achievement = document.getElementById('achievements');
  if (currentCans === 5) achievement.textContent = 'Great Start!';
  else if (currentCans === 15) achievement.textContent = 'Halfway There!';
  else if (currentCans === goal) achievement.textContent = 'Mission Accomplished!';
  else achievement.textContent = '';
}

// Start a new game based on selected difficulty
function startGame() {
  if (gameActive) return;
  const levelSelect = document.getElementById('difficulty');
  const level = levelSelect ? levelSelect.value : 'normal';
  goal = GOALS[level] || GOALS.normal;
  timeLeft = TIMES[level] || TIMES.normal;
  currentCans = 0;
  gameActive = true;

  document.getElementById('current-cans').textContent = 0;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('achievements').textContent = '';

  createGrid();

  spawnInterval = setInterval(spawnWaterCan, 1000);

  countdown = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

// Ends the game and displays win/lose messages randomly from arrays
function endGame(won) {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(countdown);

  const achievement = document.getElementById('achievements');

  const winMessages = [
    "You won! Clean water for all!",
    "Amazing job! You made a difference!",
    "Congrats! Water heroes unite!"
  ];

  const loseMessages = [
    "Time’s up! Try again!",
    "Keep going, you can do it!",
    "Almost there! Don't give up!"
  ];

  if (won) {
    // Pick random win message
    achievement.textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
  } else {
    achievement.textContent = loseMessages[Math.floor(Math.random() * loseMessages.length)];
  }

  // Clear all water cans from grid
  document.querySelectorAll('.grid-cell').forEach(cell => (cell.innerHTML = ''));
}

// Attach event listener for start button
document.getElementById('start-game').addEventListener('click', startGame);

// Initialize grid on page load
createGrid();
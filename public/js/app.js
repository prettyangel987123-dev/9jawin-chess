// Global UI Functions
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show selected screen
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
  }
}

function backToMenu() {
  closeModal();
  showScreen('mainMenu');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
}

function showModal(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = content;
  modal.classList.add('active');
}

// Quick Match Functions
function cancelQuickMatch() {
  socketClient.cancelQuickMatch();
  backToMenu();
}

let quickMatchStartTime = Date.now();
setInterval(() => {
  const elapsed = Math.floor((Date.now() - quickMatchStartTime) / 1000);
  const waitTimeEl = document.getElementById('waitTime');
  if (waitTimeEl) {
    waitTimeEl.textContent = `Waiting for ${elapsed}s...`;
  }
}, 1000);

// Public Rooms Functions
function refreshRooms() {
  socketClient.getPublicRooms();
}

// Create Room Functions
function createNewRoom(event) {
  event.preventDefault();
  
  const roomName = document.getElementById('roomName').value;
  const isPublic = document.getElementById('isPublic').checked;
  const password = document.getElementById('roomPassword').value || null;

  socketClient.createRoom(roomName, isPublic, password);
}

// Join Private Room Functions
function joinPrivateRoom(event) {
  event.preventDefault();
  
  const code = document.getElementById('roomCode').value;
  const password = document.getElementById('joinPassword').value || null;

  socketClient.joinRoomByCode(code, password);
}

// Bot Mode Functions
function startBotGame(event) {
  event.preventDefault();
  // TODO: Implement bot game
  Helpers.showNotification('Bot mode coming soon!', 'info');
}

// Offline Mode Functions
function startOfflineGame(event) {
  event.preventDefault();
  // TODO: Implement offline game
  Helpers.showNotification('Offline mode coming soon!', 'info');
}

// Statistics Functions
function showStatistics() {
  const stats = Storage.getGameStats();
  const statsContent = document.getElementById('statsContent');
  
  statsContent.innerHTML = `
    <div class="stat-card">
      <h3>Games Played</h3>
      <div class="value">${stats.gamesPlayed}</div>
    </div>
    <div class="stat-card">
      <h3>Wins</h3>
      <div class="value">${stats.wins}</div>
    </div>
    <div class="stat-card">
      <h3>Losses</h3>
      <div class="value">${stats.losses}</div>
    </div>
    <div class="stat-card">
      <h3>Draws</h3>
      <div class="value">${stats.draws}</div>
    </div>
    <div class="stat-card">
      <h3>Highest Score</h3>
      <div class="value">${stats.highestScore}</div>
    </div>
    <div class="stat-card">
      <h3>Win Rate</h3>
      <div class="value">${stats.gamesPlayed > 0 ? Math.round(stats.wins / stats.gamesPlayed * 100) : 0}%</div>
    </div>
  `;
  
  showScreen('statistics');
}

// Game Functions
function undoMove() {
  Helpers.showNotification('Undo not available', 'warning');
}

function offerDraw() {
  socketClient.offerDraw();
  Helpers.showNotification('Draw offer sent', 'info');
}

function acceptDraw() {
  socketClient.acceptDraw();
  closeModal();
}

function resignGame() {
  if (confirm('Are you sure you want to resign?')) {
    socketClient.resign();
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // Check for saved player data
  const savedPlayer = Storage.getPlayerData();
  
  if (!savedPlayer) {
    // Show username input
    showModal(`
      <h2>Enter Username</h2>
      <form onsubmit="joinGameWithUsername(event)">
        <div class="form-group">
          <input type="text" id="usernameInput" placeholder="Your username" required>
        </div>
        <button type="submit" class="btn btn-primary">Join Game</button>
      </form>
    `);
  }
});

function joinGameWithUsername(event) {
  event.preventDefault();
  
  const username = document.getElementById('usernameInput').value;
  Storage.setPlayerData({ username });
  
  socketClient.joinGame(username);
  closeModal();
  showScreen('mainMenu');
}

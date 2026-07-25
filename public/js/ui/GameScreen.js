// Game Screen UI Manager
class GameScreenUI {
  constructor() {
    this.board = new Board();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Game started
    socketClient.onGameStarted((data) => {
      gameState.fromJSON(data.game);
      this.displayBoard();
      this.updateGameInfo();
      timerManager.startTurnTimer();
      timerManager.startMatchTimer();
      showScreen('gameScreen');
    });

    // Move made
    socketClient.onGameMoved((data) => {
      gameState.fromJSON(data.game);
      this.displayBoard();
      this.updateGameInfo();
      this.addMoveToHistory(data.move);
    });

    // Game ended
    socketClient.onGameEnded((data) => {
      this.handleGameEnd(data);
    });

    // Draw offered
    socketClient.onDrawOffered((data) => {
      this.showDrawOffer(data.player);
    });

    // Opponent disconnected
    socketClient.onOpponentDisconnected((data) => {
      Helpers.showNotification(data.message, 'warning');
    });

    // Opponent reconnected
    socketClient.onOpponentReconnected((data) => {
      Helpers.showNotification(data.message, 'success');
    });
  }

  onSquareClick(row, col) {
    // Handle square selection
    const piece = chessLogic.getPiece(row, col);

    if (!moveHandler.selectedSquare) {
      if (piece) {
        moveHandler.selectSquare(row, col);
        board.select(row, col);
        // TODO: Get legal moves from server
      }
    } else {
      if (moveHandler.isSquareSelected(row, col)) {
        moveHandler.clearSelection();
        board.clearSelection();
        board.clearLegalMoves();
      } else if (moveHandler.isLegalMove(row, col)) {
        const fromRow = moveHandler.selectedSquare.row;
        const fromCol = moveHandler.selectedSquare.col;
        moveHandler.handleMove(fromRow, fromCol, row, col);
        board.clearSelection();
        board.clearLegalMoves();
      }
    }
  }

  displayBoard() {
    this.board.reset();
    // TODO: Display board from gameState.board
  }

  updateGameInfo() {
    document.getElementById('gameStatus').textContent = 
      gameState.currentTurn === 'white' ? "White's turn" : "Black's turn";
  }

  addMoveToHistory(move) {
    const moveList = document.getElementById('moveList');
    const moveItem = document.createElement('div');
    moveItem.className = 'move-item last';
    moveItem.textContent = `${move.from}${move.to}`;
    moveList.appendChild(moveItem);
  }

  handleGameEnd(data) {
    timerManager.endMatchTimer();
    
    let message = '';
    if (data.endReason === 'checkmate') {
      message = `Checkmate! ${data.winner.username} wins!`;
      audio.playCheckmate();
    } else if (data.endReason === 'resignation') {
      message = `${data.winner.username} wins by resignation!`;
      audio.playVictory();
    } else if (data.endReason === 'draw' || data.endReason === 'stalemate') {
      message = 'Game ended in a draw!';
      audio.playDraw();
    }

    this.showGameEndModal(message, data);
  }

  showGameEndModal(message, data) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
      <h2>${message}</h2>
      <div class="stats">
        <p>Player 1: ${data.player1.points} points</p>
        <p>Player 2: ${data.player2.points} points</p>
      </div>
      <button class="btn btn-primary" onclick="backToMenu()">Back to Menu</button>
    `;
    
    modal.classList.add('active');
  }

  showDrawOffer(playerName) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
      <h2>${playerName} offers a draw</h2>
      <p>Do you accept?</p>
      <button class="btn btn-success" onclick="acceptDraw()">Accept</button>
      <button class="btn btn-danger" onclick="closeModal()">Decline</button>
    `;
    
    modal.classList.add('active');
  }
}

const gameScreenUI = new GameScreenUI();
window.gameScreenUI = gameScreenUI;

// Game State Management
class GameState {
  constructor() {
    this.gameId = null;
    this.board = null;
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.gameStatus = 'playing';
    this.inCheck = false;
    this.inCheckmate = false;
    this.inStalemate = false;
    this.selectedSquare = null;
    this.lastMove = null;
    this.legalMoves = [];
  }

  fromJSON(data) {
    Object.assign(this, data);
    return this;
  }

  reset() {
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.gameStatus = 'playing';
    this.inCheck = false;
    this.inCheckmate = false;
    this.inStalemate = false;
    this.selectedSquare = null;
    this.lastMove = null;
    this.legalMoves = [];
  }

  addMove(move) {
    this.moveHistory.push(move);
  }

  setSelectedSquare(square) {
    this.selectedSquare = square;
  }

  clearSelectedSquare() {
    this.selectedSquare = null;
  }

  setLegalMoves(moves) {
    this.legalMoves = moves;
  }

  clearLegalMoves() {
    this.legalMoves = [];
  }
}

const gameState = new GameState();

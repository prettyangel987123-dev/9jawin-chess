// Chess Logic
class ChessLogic {
  constructor() {
    this.board = this.initializeBoard();
  }

  initializeBoard() {
    const board = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    return board;
  }

  getPiece(row, col) {
    if (!Helpers.isValidSquare(row, col)) return null;
    return this.board[row][col];
  }

  setPiece(row, col, piece) {
    if (Helpers.isValidSquare(row, col)) {
      this.board[row][col] = piece;
    }
  }

  isWhitePiece(piece) {
    return piece && piece === piece.toUpperCase();
  }

  isBlackPiece(piece) {
    return piece && piece === piece.toLowerCase();
  }

  getPieceType(piece) {
    if (!piece) return null;
    return piece.toLowerCase();
  }

  reset() {
    this.board = this.initializeBoard();
  }
}

const chessLogic = new ChessLogic();

// Move Handler
class MoveHandler {
  constructor() {
    this.selectedSquare = null;
    this.legalMoves = [];
  }

  selectSquare(row, col) {
    this.selectedSquare = { row, col };
    const piece = chessLogic.getPiece(row, col);
    return piece;
  }

  clearSelection() {
    this.selectedSquare = null;
    this.legalMoves = [];
  }

  isSquareSelected(row, col) {
    return this.selectedSquare && 
           this.selectedSquare.row === row && 
           this.selectedSquare.col === col;
  }

  isLegalMove(row, col) {
    return this.legalMoves.some(move => move.row === row && move.col === col);
  }

  async handleMove(fromRow, fromCol, toRow, toCol, promotion = null) {
    const from = Helpers.positionToCoordinate(fromRow, fromCol);
    const to = Helpers.positionToCoordinate(toRow, toCol);
    
    socketClient.makeMove(from, to, promotion);
    audio.playMove();
  }
}

const moveHandler = new MoveHandler();

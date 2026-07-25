const { Chess } = require('chess.js');
const PointCalculator = require('./PointCalculator');

class GameEngine {
  constructor() {
    this.chess = null;
  }

  /**
   * Initialize new game
   */
  initializeGame() {
    this.chess = new Chess();
  }

  /**
   * Validate move on server
   */
  validateMove(fen, from, to, promotion = null) {
    try {
      const testChess = new Chess(fen);
      const move = {
        from,
        to,
        promotion: promotion || undefined
      };

      const result = testChess.move(move, { sloppy: true });
      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Execute move
   */
  executeMove(fen, from, to, promotion = null) {
    try {
      const testChess = new Chess(fen);
      const move = {
        from,
        to,
        promotion: promotion || undefined
      };

      const result = testChess.move(move, { sloppy: true });
      if (!result) {
        return { success: false, error: 'Invalid move' };
      }

      return {
        success: true,
        move: result,
        newFEN: testChess.fen(),
        isCapture: PointCalculator.isCaptureMove(result),
        isCastling: PointCalculator.isCastlingMove(result),
        isPromotion: PointCalculator.isPromotionMove(result),
        inCheck: testChess.in_check(),
        inCheckmate: testChess.in_checkmate(),
        inStalemate: testChess.in_stalemate()
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get legal moves for position
   */
  getLegalMoves(fen, square = null) {
    try {
      const testChess = new Chess(fen);
      if (square) {
        return testChess.moves({ square, verbose: true });
      }
      return testChess.moves({ verbose: true });
    } catch (error) {
      return [];
    }
  }

  /**
   * Get board from FEN
   */
  getBoard(fen) {
    try {
      const testChess = new Chess(fen);
      return testChess.board();
    } catch (error) {
      return null;
    }
  }

  /**
   * Check game end conditions
   */
  checkGameEndCondition(fen) {
    try {
      const testChess = new Chess(fen);
      
      const condition = {
        isCheckmate: testChess.in_checkmate(),
        isStalemate: testChess.in_stalemate(),
        isInsufficientMaterial: testChess.insufficient_material(),
        isThreefoldRepetition: testChess.threefold_repetition(),)
        isFiftyMoveRule: testChess.fifty_move_rule(),
        inCheck: testChess.in_check()
      };

      return condition;
    } catch (error) {
      return null;
    }
  }

  /**
   * Simulate move
   */
  simulateMove(fen, from, to, promotion = null) {
    try {
      const testChess = new Chess(fen);
      const move = {
        from,
        to,
        promotion: promotion || undefined
      };

      const result = testChess.move(move, { sloppy: true });
      if (!result) return null;

      return {
        fen: testChess.fen(),
        board: testChess.board(),
        inCheck: testChess.in_check(),
        inCheckmate: testChess.in_checkmate(),
        inStalemate: testChess.in_stalemate()
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = new GameEngine();

const GAME_CONSTANTS = require('../config/constants');
const { Chess } = require('chess.js');

class BotEngine {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.evaluationCache = {};
  }

  /**
   * Get best move for bot
   */
  getBestMove(fen) {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });

    if (moves.length === 0) {
      return null;
    }

    switch (this.difficulty) {
      case GAME_CONSTANTS.BOT_DIFFICULTY.EASY:
        return this.getRandomMove(moves);
      case GAME_CONSTANTS.BOT_DIFFICULTY.MEDIUM:
        return this.getMediumMove(chess, moves);
      case GAME_CONSTANTS.BOT_DIFFICULTY.HARD:
        return this.getHardMove(chess, moves, fen);
      default:
        return this.getRandomMove(moves);
    }
  }

  /**
   * Get random move (Easy difficulty)
   */
  getRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  /**
   * Get medium difficulty move
   */
  getMediumMove(chess, moves) {
    // Prefer capturing moves
    const capturingMoves = moves.filter(m => m.capture);
    if (capturingMoves.length > 0 && Math.random() > 0.3) {
      return capturingMoves[Math.floor(Math.random() * capturingMoves.length)];
    }

    // Check for check moves
    const checkMoves = moves.filter(m => {
      const testChess = new Chess(chess.fen());
      testChess.move(m);
      return testChess.in_check();
    });

    if (checkMoves.length > 0 && Math.random() > 0.5) {
      return checkMoves[Math.floor(Math.random() * checkMoves.length)];
    }

    return this.getRandomMove(moves);
  }

  /**
   * Get hard difficulty move (Minimax)
   */
  getHardMove(chess, moves, fen) {
    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of moves) {
      const testChess = new Chess(fen);
      testChess.move(move);

      const score = this.minimax(testChess, 3, -Infinity, Infinity, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove || this.getRandomMove(moves);
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  minimax(chess, depth, alpha, beta, maximizing) {
    if (depth === 0 || chess.in_checkmate() || chess.in_stalemate()) {
      return this.evaluatePosition(chess);
    }

    const moves = chess.moves({ verbose: true });

    if (maximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const eval_ = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(eval_, maxEval);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const eval_ = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(eval_, minEval);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  /**
   * Evaluate board position
   */
  evaluatePosition(chess) {
    if (chess.in_checkmate()) {
      return chess.turn() === 'w' ? 10000 : -10000;
    }

    if (chess.in_stalemate()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

    for (let row of board) {
      for (let piece of row) {
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.color === 'w' ? value : -value;
        }
      }
    }

    return score;
  }

  /**
   * Set difficulty level
   */
  setDifficulty(difficulty) {
    if (Object.values(GAME_CONSTANTS.BOT_DIFFICULTY).includes(difficulty)) {
      this.difficulty = difficulty;
      return true;
    }
    return false;
  }
}

module.exports = BotEngine;

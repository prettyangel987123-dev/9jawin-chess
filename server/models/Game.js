const { Chess } = require('chess.js');
const GAME_CONSTANTS = require('../config/constants');
const { deepClone } = require('../utils/helpers');

class Game {
  constructor(gameId, player1, player2, timeControl = 'blitz') {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.timeControl = timeControl;
    
    // Initialize chess engine
    this.chess = new Chess();
    
    // Game state
    this.currentTurn = 'white';
    this.status = 'playing';
    this.endReason = null;
    this.winner = null;
    
    // Timers
    this.turnStartTime = Date.now();
    this.matchStartTime = Date.now();
    this.moveHistory = [];
    
    // Game history for draw detection
    this.positionHistory = [];
    this.halfmoveClock = 0;
    
    // Setup player colors
    player1.color = 'white';
    player2.color = 'black';
  }

  /**
   * Get current player
   */
  getCurrentPlayer() {
    return this.currentTurn === 'white' ? this.player1 : this.player2;
  }

  /**
   * Get opponent of current player
   */
  getOpponent() {
    return this.currentTurn === 'white' ? this.player2 : this.player1;
  }

  /**
   * Make a move
   */
  makeMove(from, to, promotion = null) {
    try {
      const move = {
        from,
        to,
        promotion: promotion || undefined
      };

      const result = this.chess.move(move, { sloppy: true });
      
      if (!result) {
        return { success: false, error: 'Invalid move' };
      }

      // Record move
      this.moveHistory.push(result);
      this.turnStartTime = Date.now();
      
      // Toggle turn
      this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
      
      return { success: true, move: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if current player is in check
   */
  isInCheck() {
    return this.chess.in_check();
  }

  /**
   * Check if current player is checkmated
   */
  isCheckmate() {
    return this.chess.in_checkmate();
  }

  /**
   * Check if game is stalemate
   */
  isStalemate() {
    return this.chess.in_stalemate();
  }

  /**
   * Get legal moves for a square
   */
  getLegalMoves(square) {
    return this.chess.moves({ square, verbose: true });
  }

  /**
   * Get all legal moves
   */
  getAllLegalMoves() {
    return this.chess.moves({ verbose: true });
  }

  /**
   * Get board position
   */
  getBoard() {
    return this.chess.board();
  }

  /**
   * Get FEN notation
   */
  getFEN() {
    return this.chess.fen();
  }

  /**
   * Get PGN notation
   */
  getPGN() {
    return this.chess.pgn();
  }

  /**
   * Check if insufficient material
   */
  isInsufficientMaterial() {
    return this.chess.insufficient_material();
  }

  /**
   * Check for threefold repetition
   */
  isThreefoldRepetition() {
    return this.chess.threefold_repetition();
  }

  /**
   * Get game state
   */
  getState() {
    return {
      gameId: this.gameId,
      board: this.getBoard(),
      fen: this.getFEN(),
      currentTurn: this.currentTurn,
      moveHistory: this.moveHistory,
      player1: this.player1.toJSON(),
      player2: this.player2.toJSON(),
      status: this.status,
      endReason: this.endReason,
      winner: this.winner,
      inCheck: this.isInCheck(),
      inCheckmate: this.isCheckmate(),
      inStalemate: this.isStalemate()
    };
  }

  /**
   * Get elapsed time for current turn
   */
  getTurnElapsedTime() {
    return Date.now() - this.turnStartTime;
  }

  /**
   * Get elapsed match time
   */
  getMatchElapsedTime() {
    return Date.now() - this.matchStartTime;
  }
}

module.exports = Game;

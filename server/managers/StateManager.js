const Logger = require('../utils/logger');

const logger = new Logger('StateManager');

class StateManager {
  constructor() {
    this.gameStates = new Map();
  }

  /**
   * Create game state
   */
  createGameState(gameId, game) {
    const state = {
      gameId,
      game,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      moveCount: 0,
      capturedPieces: {
        white: [],
        black: []
      }
    };

    this.gameStates.set(gameId, state);
    return state;
  }

  /**
   * Update game state
   */
  updateGameState(gameId, updates) {
    const state = this.gameStates.get(gameId);
    if (!state) {
      logger.warn('Game state not found', { gameId });
      return null;
    }

    Object.assign(state, updates);
    state.lastUpdated = Date.now();
    return state;
  }

  /**
   * Get game state
   */
  getGameState(gameId) {
    return this.gameStates.get(gameId);
  }

  /**
   * Record capture
   */
  recordCapture(gameId, capturedPiece, captureColor) {
    const state = this.gameStates.get(gameId);
    if (!state) return false;

    const color = captureColor === 'white' ? 'white' : 'black';
    state.capturedPieces[color].push(capturedPiece);
    state.lastUpdated = Date.now();

    return true;
  }

  /**
   * Increment move count
   */
  incrementMoveCount(gameId) {
    const state = this.gameStates.get(gameId);
    if (!state) return false;

    state.moveCount++;
    state.lastUpdated = Date.now();
    return true;
  }

  /**
   * Get game state snapshot for transmission
   */
  getStateSnapshot(gameId) {
    const state = this.gameStates.get(gameId);
    if (!state) return null;

    return {
      gameId: state.gameId,
      board: state.game.getBoard(),
      fen: state.game.getFEN(),
      moveCount: state.moveCount,
      capturedPieces: state.capturedPieces,
      currentTurn: state.game.currentTurn,
      player1: state.game.player1.toJSON(),
      player2: state.game.player2.toJSON(),
      inCheck: state.game.isInCheck(),
      inCheckmate: state.game.isCheckmate(),
      inStalemate: state.game.isStalemate()
    };
  }

  /**
   * Delete game state
   */
  deleteGameState(gameId) {
    this.gameStates.delete(gameId);
    logger.info('Game state deleted', { gameId });
  }

  /**
   * Clear all states (cleanup)
   */
  clearAllStates() {
    this.gameStates.clear();
    logger.info('All game states cleared');
  }
}

module.exports = new StateManager();

class MoveValidator {
  /**
   * Validate move timing
   */
  static validateMoveTiming(turnStartTime, turnTimeout) {
    const elapsed = Date.now() - turnStartTime;
    return elapsed <= turnTimeout;
  }

  /**
   * Validate player turn
   */
  static validatePlayerTurn(currentTurn, playerId, player1Id, player2Id) {
    if (currentTurn === 'white' && playerId === player1Id) {
      return true;
    }
    if (currentTurn === 'black' && playerId === player2Id) {
      return true;
    }
    return false;
  }

  /**
   * Validate connection status
   */
  static validateConnection(player) {
    return player && player.isConnected;
  }

  /**
   * Validate game status
   */
  static validateGameStatus(gameStatus) {
    return gameStatus === 'playing';
  }

  /**
   * Validate all move conditions
   */
  static validateMove(moveData, gameState, turnTimeout) {
    const { playerId, from, to, promotion } = moveData;
    const { currentTurn, player1, player2, status, turnStartTime } = gameState;

    // Validate game is active
    if (!this.validateGameStatus(status)) {
      return { valid: false, error: 'Game is not active' };
    }

    // Validate it's player's turn
    if (!this.validatePlayerTurn(currentTurn, playerId, player1.id, player2.id)) {
      return { valid: false, error: 'Not your turn' };
    }

    // Validate move timing
    if (!this.validateMoveTiming(turnStartTime, turnTimeout)) {
      return { valid: false, error: 'Move time exceeded' };
    }

    // Validate player connection
    const player = playerId === player1.id ? player1 : player2;
    if (!this.validateConnection(player)) {
      return { valid: false, error: 'Player not connected' };
    }

    // Validate move format
    if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
      return { valid: false, error: 'Invalid move format' };
    }

    return { valid: true };
  }
}

module.exports = MoveValidator;

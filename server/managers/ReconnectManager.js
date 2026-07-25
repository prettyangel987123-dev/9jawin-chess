const GAME_CONSTANTS = require('../config/constants');
const Logger = require('../utils/logger');

const logger = new Logger('ReconnectManager');

class ReconnectManager {
  constructor() {
    this.disconnectedPlayers = new Map();
    this.reconnectTimeout = GAME_CONSTANTS.RECONNECT_TIMEOUT;
  }

  /**
   * Register player disconnect
   */
  registerDisconnect(player, roomId, gameId) {
    const disconnectEntry = {
      player,
      roomId,
      gameId,
      disconnectedAt: Date.now(),
      reconnected: false
    };

    this.disconnectedPlayers.set(player.id, disconnectEntry);
    player.isConnected = false;

    logger.warn('Player disconnected', {
      player: player.username,
      roomId,
      gameId
    });

    // Schedule cleanup
    setTimeout(() => {
      this.checkReconnectTimeout(player.id);
    }, this.reconnectTimeout);
  }

  /**
   * Handle player reconnection
   */
  handleReconnect(playerId, newSocketId) {
    const entry = this.disconnectedPlayers.get(playerId);
    
    if (!entry) {
      return { success: false, error: 'No disconnect record found' };
    }

    // Check if reconnection window is still open
    const timeElapsed = Date.now() - entry.disconnectedAt;
    if (timeElapsed > this.reconnectTimeout) {
      return { success: false, error: 'Reconnection window expired' };
    }

    entry.player.socketId = newSocketId;
    entry.player.isConnected = true;
    entry.reconnected = true;

    logger.info('Player reconnected', {
      player: entry.player.username,
      timeElapsed: timeElapsed
    });

    return {
      success: true,
      roomId: entry.roomId,
      gameId: entry.gameId,
      player: entry.player
    };
  }

  /**
   * Check if reconnection has timed out
   */
  checkReconnectTimeout(playerId) {
    const entry = this.disconnectedPlayers.get(playerId);
    
    if (!entry || entry.reconnected) {
      return;
    }

    const timeElapsed = Date.now() - entry.disconnectedAt;
    if (timeElapsed > this.reconnectTimeout) {
      logger.warn('Reconnection timeout', {
        player: entry.player.username,
        roomId: entry.roomId
      });

      // Mark for permanent disconnect
      this.disconnectedPlayers.delete(playerId);
      return { expired: true, roomId: entry.roomId, gameId: entry.gameId };
    }
  }

  /**
   * Get disconnect entry
   */
  getDisconnectEntry(playerId) {
    return this.disconnectedPlayers.get(playerId);
  }

  /**
   * Remove disconnect entry
   */
  removeDisconnectEntry(playerId) {
    this.disconnectedPlayers.delete(playerId);
  }

  /**
   * Get all disconnected players
   */
  getDisconnectedPlayers() {
    return Array.from(this.disconnectedPlayers.values())
      .filter(entry => !entry.reconnected)
      .map(entry => ({
        playerId: entry.player.id,
        username: entry.player.username,
        disconnectedAt: entry.disconnectedAt,
        roomId: entry.roomId
      }));
  }
}

module.exports = new ReconnectManager();

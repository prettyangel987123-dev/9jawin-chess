const GAME_CONSTANTS = require('../config/constants');
const Logger = require('../utils/logger');

const logger = new Logger('MatchmakingManager');

class MatchmakingManager {
  constructor() {
    this.waitingQueue = [];
    this.matchmaking = false;
  }

  /**
   * Add player to matchmaking queue
   */
  addToQueue(player, timeControl = 'blitz') {
    const queueEntry = {
      player,
      timeControl,
      joinedAt: Date.now()
    };

    this.waitingQueue.push(queueEntry);
    logger.info('Player added to matchmaking queue', {
      player: player.username,
      queueSize: this.waitingQueue.length
    });

    return this.findMatch();
  }

  /**
   * Remove player from queue
   */
  removeFromQueue(playerId) {
    const index = this.waitingQueue.findIndex(entry => entry.player.id === playerId);
    if (index !== -1) {
      const removed = this.waitingQueue.splice(index, 1)[0];
      logger.info('Player removed from queue', {
        player: removed.player.username,
        queueSize: this.waitingQueue.length
      });
      return true;
    }
    return false;
  }

  /**
   * Find match between waiting players
   */
  findMatch() {
    if (this.waitingQueue.length < 2) {
      return null;
    }

    // Get first two players with same time control
    const player1Entry = this.waitingQueue[0];
    
    for (let i = 1; i < this.waitingQueue.length; i++) {
      const player2Entry = this.waitingQueue[i];
      
      if (player1Entry.timeControl === player2Entry.timeControl) {
        // Remove from queue
        this.waitingQueue.splice(i, 1);
        this.waitingQueue.splice(0, 1);

        const match = {
          player1: player1Entry.player,
          player2: player2Entry.player,
          timeControl: player1Entry.timeControl,
          matchedAt: Date.now()
        };

        logger.info('Match found', {
          player1: match.player1.username,
          player2: match.player2.username,
          timeControl: match.timeControl
        });

        return match;
      }
    }

    return null;
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      waitingPlayers: this.waitingQueue.length,
      players: this.waitingQueue.map(entry => ({
        id: entry.player.id,
        username: entry.player.username,
        waitTime: Date.now() - entry.joinedAt,
        timeControl: entry.timeControl
      }))
    };
  }

  /**
   * Clear queue (for cleanup)
   */
  clearQueue() {
    this.waitingQueue = [];
    logger.info('Matchmaking queue cleared');
  }
}

module.exports = new MatchmakingManager();

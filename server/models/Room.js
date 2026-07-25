const GAME_CONSTANTS = require('../config/constants');

class Room {
  constructor(roomId, creator, roomName = 'Chess Room', isPublic = true, password = null) {
    this.roomId = roomId;
    this.creator = creator;
    this.roomName = roomName;
    this.isPublic = isPublic;
    this.password = password;
    
    this.players = [creator];
    this.status = GAME_CONSTANTS.ROOM_STATES.WAITING;
    this.game = null;
    
    this.createdAt = Date.now();
    this.startedAt = null;
    this.finishedAt = null;
    
    this.timeControl = 'blitz'; // 'blitz', 'rapid', 'classical'
    this.maxPlayers = GAME_CONSTANTS.ROOM_MAX_PLAYERS;
    this.spectators = [];
  }

  /**
   * Add player to room
   */
  addPlayer(player) {
    if (this.players.length < this.maxPlayers) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  /**
   * Remove player from room
   */
  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
  }

  /**
   * Add spectator
   */
  addSpectator(player) {
    this.spectators.push(player);
  }

  /**
   * Remove spectator
   */
  removeSpectator(playerId) {
    this.spectators = this.spectators.filter(p => p.id !== playerId);
  }

  /**
   * Check if room is full
   */
  isFull() {
    return this.players.length >= this.maxPlayers;
  }

  /**
   * Check if room is empty
   */
  isEmpty() {
    return this.players.length === 0;
  }

  /**
   * Get room info
   */
  getInfo() {
    return {
      roomId: this.roomId,
      roomName: this.roomName,
      creator: this.creator.username,
      isPublic: this.isPublic,
      players: this.players.map(p => ({ id: p.id, username: p.username })),
      status: this.status,
      playerCount: this.players.length,
      maxPlayers: this.maxPlayers,
      isFull: this.isFull(),
      timeControl: this.timeControl,
      createdAt: this.createdAt
    };
  }

  /**
   * Start game
   */
  startGame(game) {
    this.game = game;
    this.status = GAME_CONSTANTS.ROOM_STATES.PLAYING;
    this.startedAt = Date.now();
  }

  /**
   * End game
   */
  endGame(endReason, winner) {
    this.status = GAME_CONSTANTS.ROOM_STATES.FINISHED;
    this.finishedAt = Date.now();
    if (this.game) {
      this.game.status = 'finished';
      this.game.endReason = endReason;
      this.game.winner = winner;
    }
  }
}

module.exports = Room;

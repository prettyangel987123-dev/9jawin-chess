const GAME_CONSTANTS = require('../config/constants');
const Room = require('../models/Room');
const Game = require('../models/Game');
const { generateRoomId, generateRoomCode } = require('../utils/helpers');
const Logger = require('../utils/logger');

const logger = new Logger('RoomManager');

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.roomsByCode = new Map();
    this.playerRooms = new Map();
  }

  /**
   * Create new room
   */
  createRoom(creator, roomName, isPublic = true, password = null) {
    const roomId = generateRoomId();
    const room = new Room(roomId, creator, roomName, isPublic, password);
    
    this.rooms.set(roomId, room);
    this.playerRooms.set(creator.id, roomId);
    
    if (isPublic) {
      logger.info('Public room created', { roomId, creator: creator.username });
    } else {
      const roomCode = generateRoomCode();
      room.code = roomCode;
      this.roomsByCode.set(roomCode, roomId);
      logger.info('Private room created', { roomId, code: roomCode, creator: creator.username });
    }

    return room;
  }

  /**
   * Get room by ID
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  /**
   * Get room by code
   */
  getRoomByCode(code) {
    const roomId = this.roomsByCode.get(code);
    return roomId ? this.rooms.get(roomId) : null;
  }

  /**
   * Get player's current room
   */
  getPlayerRoom(playerId) {
    const roomId = this.playerRooms.get(playerId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  /**
   * Get all public rooms
   */
  getPublicRooms() {
    return Array.from(this.rooms.values())
      .filter(room => room.isPublic && room.status !== GAME_CONSTANTS.ROOM_STATES.FINISHED)
      .map(room => room.getInfo());
  }

  /**
   * Join player to room
   */
  joinRoom(room, player) {
    if (room.isFull()) {
      return { success: false, error: 'Room is full' };
    }

    if (!room.isPublic && room.password && room.password !== player.password) {
      return { success: false, error: 'Invalid password' };
    }

    room.addPlayer(player);
    this.playerRooms.set(player.id, room.roomId);
    logger.info('Player joined room', { roomId: room.roomId, player: player.username });

    return { success: true, room };
  }

  /**
   * Remove player from room
   */
  removePlayerFromRoom(playerId) {
    const roomId = this.playerRooms.get(playerId);
    if (!roomId) return false;

    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.removePlayer(playerId);
    this.playerRooms.delete(playerId);

    logger.info('Player removed from room', { roomId, playerId });

    // Cleanup empty rooms
    if (room.isEmpty()) {
      this.deleteRoom(roomId);
    }

    return true;
  }

  /**
   * Start game in room
   */
  startGameInRoom(roomId) {
    const room = this.getRoom(roomId);
    if (!room || room.players.length < 2) {
      return { success: false, error: 'Not enough players' };
    }

    const gameId = `game_${roomId}`;
    const game = new Game(gameId, room.players[0], room.players[1]);
    
    room.startGame(game);
    logger.info('Game started', { roomId, gameId });

    return { success: true, game, room };
  }

  /**
   * End game in room
   */
  endGameInRoom(roomId, endReason, winner) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    room.endGame(endReason, winner);
    logger.info('Game ended', { roomId, endReason, winner: winner?.username });

    return true;
  }

  /**
   * Delete room
   */
  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.players.forEach(player => {
      this.playerRooms.delete(player.id);
    });

    if (room.code) {
      this.roomsByCode.delete(room.code);
    }

    this.rooms.delete(roomId);
    logger.info('Room deleted', { roomId });

    return true;
  }

  /**
   * Get room statistics
   */
  getStats() {
    return {
      totalRooms: this.rooms.size,
      activeRooms: Array.from(this.rooms.values())
        .filter(r => r.status === GAME_CONSTANTS.ROOM_STATES.PLAYING).length,
      totalPlayers: this.playerRooms.size
    };
  }
}

module.exports = new RoomManager();

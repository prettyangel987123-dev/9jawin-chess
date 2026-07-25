const Logger = require('../../utils/logger');
const RoomManager = require('../../managers/RoomManager');
const MatchmakingManager = require('../../managers/MatchmakingManager');
const ReconnectManager = require('../../managers/ReconnectManager');
const StateManager = require('../../managers/StateManager');
const GameEngine = require('../../services/GameEngine');
const MoveValidator = require('../../services/MoveValidator');
const PointCalculator = require('../../services/PointCalculator');
const BotEngine = require('../../services/BotEngine');
const Player = require('../../models/Player');
const Game = require('../../models/Game');
const { generatePlayerId, delay } = require('../../utils/helpers');
const GAME_CONSTANTS = require('../../config/constants');

const logger = new Logger('SocketEvents');

module.exports = (io, socket) => {
  let currentPlayer = null;
  let currentRoom = null;

  /**
   * Player joins
   */
  socket.on('player:join', (data) => {
    try {
      const { username } = data;
      const playerId = generatePlayerId();
      currentPlayer = new Player(playerId, username, socket.id);

      socket.join(`player:${playerId}`);
      socket.emit('player:joined', { player: currentPlayer.toJSON() });

      logger.info('Player joined', { username, playerId, socketId: socket.id });
    } catch (error) {
      logger.error('Error joining player', { error: error.message });
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  /**
   * Quick match request
   */
  socket.on('quickMatch:start', (data) => {
    try {
      if (!currentPlayer) {
        socket.emit('error', { message: 'Player not initialized' });
        return;
      }

      socket.emit('quickMatch:searching', { message: 'Searching for opponent...' });
      const match = MatchmakingManager.addToQueue(currentPlayer, 'blitz');

      if (match) {
        // Match found, create room and start game
        handleQuickMatchFound(io, socket, match);
      }
    } catch (error) {
      logger.error('Error starting quick match', { error: error.message });
      socket.emit('error', { message: 'Failed to start quick match' });
    }
  });

  /**
   * Cancel quick match
   */
  socket.on('quickMatch:cancel', () => {
    try {
      if (currentPlayer) {
        MatchmakingManager.removeFromQueue(currentPlayer.id);
        socket.emit('quickMatch:cancelled', { message: 'Matchmaking cancelled' });
        logger.info('Quick match cancelled', { player: currentPlayer.username });
      }
    } catch (error) {
      logger.error('Error cancelling quick match', { error: error.message });
    }
  });

  /**
   * Create public room
   */
  socket.on('room:create', (data) => {
    try {
      if (!currentPlayer) {
        socket.emit('error', { message: 'Player not initialized' });
        return;
      }

      const { roomName, isPublic = true, password = null } = data;
      const room = RoomManager.createRoom(currentPlayer, roomName, isPublic, password);
      currentRoom = room;

      socket.join(`room:${room.roomId}`);
      socket.emit('room:created', { room: room.getInfo() });
      io.to(`room:${room.roomId}`).emit('room:updated', { room: room.getInfo() });

      logger.info('Room created', { roomId: room.roomId, creator: currentPlayer.username });
    } catch (error) {
      logger.error('Error creating room', { error: error.message });
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  /**
   * Join public room
   */
  socket.on('room:join', (data) => {
    try {
      if (!currentPlayer) {
        socket.emit('error', { message: 'Player not initialized' });
        return;
      }

      const { roomId, password = null } = data;
      const room = RoomManager.getRoom(roomId);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      currentPlayer.password = password;
      const result = RoomManager.joinRoom(room, currentPlayer);

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      currentRoom = room;
      socket.join(`room:${room.roomId}`);
      socket.emit('room:joined', { room: room.getInfo() });
      io.to(`room:${room.roomId}`).emit('room:updated', { room: room.getInfo() });

      logger.info('Player joined room', { roomId, player: currentPlayer.username });

      // Auto-start if full
      if (room.isFull()) {
        handleGameStart(io, socket, room);
      }
    } catch (error) {
      logger.error('Error joining room', { error: error.message });
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  /**
   * Join private room by code
   */
  socket.on('room:joinByCode', (data) => {
    try {
      if (!currentPlayer) {
        socket.emit('error', { message: 'Player not initialized' });
        return;
      }

      const { code, password = null } = data;
      const room = RoomManager.getRoomByCode(code);

      if (!room) {
        socket.emit('error', { message: 'Invalid room code' });
        return;
      }

      currentPlayer.password = password;
      const result = RoomManager.joinRoom(room, currentPlayer);

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      currentRoom = room;
      socket.join(`room:${room.roomId}`);
      socket.emit('room:joined', { room: room.getInfo() });
      io.to(`room:${room.roomId}`).emit('room:updated', { room: room.getInfo() });

      logger.info('Player joined private room', { code, player: currentPlayer.username });

      if (room.isFull()) {
        handleGameStart(io, socket, room);
      }
    } catch (error) {
      logger.error('Error joining room by code', { error: error.message });
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  /**
   * Get public rooms
   */
  socket.on('rooms:getPublic', () => {
    try {
      const rooms = RoomManager.getPublicRooms();
      socket.emit('rooms:publicList', { rooms });
    } catch (error) {
      logger.error('Error getting public rooms', { error: error.message });
      socket.emit('error', { message: 'Failed to get rooms' });
    }
  });

  /**
   * Leave room
   */
  socket.on('room:leave', () => {
    try {
      if (!currentPlayer || !currentRoom) return;

      socket.leave(`room:${currentRoom.roomId}`);
      RoomManager.removePlayerFromRoom(currentPlayer.id);
      io.to(`room:${currentRoom.roomId}`).emit('room:updated', { room: currentRoom.getInfo() });

      logger.info('Player left room', { roomId: currentRoom.roomId, player: currentPlayer.username });
      currentRoom = null;
    } catch (error) {
      logger.error('Error leaving room', { error: error.message });
    }
  });

  /**
   * Make move
   */
  socket.on('game:move', (data) => {
    try {
      if (!currentPlayer || !currentRoom || !currentRoom.game) {
        socket.emit('error', { message: 'Game not initialized' });
        return;
      }

      const { from, to, promotion } = data;
      const game = currentRoom.game;
      const gameId = game.gameId;

      // Validate move on server
      const validation = MoveValidator.validateMove(
        { playerId: currentPlayer.id, from, to, promotion },
        {
          currentTurn: game.currentTurn,
          player1: game.player1,
          player2: game.player2,
          status: game.status,
          turnStartTime: game.turnStartTime
        },
        GAME_CONSTANTS.TURN_TIMEOUT
      );

      if (!validation.valid) {
        socket.emit('error', { message: validation.error });
        return;
      }

      // Execute move
      const moveResult = game.makeMove(from, to, promotion);

      if (!moveResult.success) {
        currentPlayer.addPoints(PointCalculator.applyIllegalMovePenalty());
        socket.emit('error', { message: moveResult.error });
        return;
      }

      const move = moveResult.move;

      // Calculate points
      if (PointCalculator.isCaptureMove(move)) {
        const points = PointCalculator.calculateCapturePoints(move);
        currentPlayer.addPoints(points);
      }

      if (PointCalculator.isCastlingMove(move)) {
        currentPlayer.addPoints(PointCalculator.calculateCastlingPoints());
      }

      if (PointCalculator.isPromotionMove(move)) {
        currentPlayer.addPoints(PointCalculator.calculatePromotionPoints());
      }

      if (game.isInCheck()) {
        currentPlayer.addPoints(PointCalculator.calculateCheckPoints());
      }

      // Update state
      StateManager.incrementMoveCount(gameId);

      // Check game end conditions
      if (game.isCheckmate()) {
        currentPlayer.addPoints(PointCalculator.calculateCheckmatePoints());
        currentPlayer.recordWin();
        game.getOpponent().recordLoss();
        endGame(io, currentRoom, 'checkmate', currentPlayer);
        return;
      }

      if (game.isStalemate()) {
        currentPlayer.addPoints(PointCalculator.calculateDrawPoints());
        game.getOpponent().addPoints(PointCalculator.calculateDrawPoints());
        currentPlayer.recordDraw();
        game.getOpponent().recordDraw();
        endGame(io, currentRoom, 'stalemate', null);
        return;
      }

      // Broadcast move
      io.to(`room:${currentRoom.roomId}`).emit('game:moved', {
        move,
        game: game.getState(),
        currentPlayer: currentPlayer.toJSON()
      });

      logger.info('Move made', {
        gameId,
        player: currentPlayer.username,
        move: `${move.from}${move.to}`
      });
    } catch (error) {
      logger.error('Error making move', { error: error.message });
      socket.emit('error', { message: 'Failed to make move' });
    }
  });

  /**
   * Resign from game
   */
  socket.on('game:resign', () => {
    try {
      if (!currentPlayer || !currentRoom || !currentRoom.game) return;

      currentPlayer.addPoints(PointCalculator.applyResignationPenalty());
      currentPlayer.recordLoss();
      currentRoom.game.getOpponent().recordWin();
      currentRoom.game.getOpponent().addPoints(PointCalculator.calculateWinPoints());

      endGame(io, currentRoom, 'resignation', currentRoom.game.getOpponent());
      logger.info('Player resigned', { player: currentPlayer.username });
    } catch (error) {
      logger.error('Error resigning', { error: error.message });
    }
  });

  /**
   * Offer draw
   */
  socket.on('game:offerDraw', () => {
    try {
      if (!currentPlayer || !currentRoom || !currentRoom.game) return;

      const opponent = currentRoom.game.getOpponent();
      io.to(`player:${opponent.id}`).emit('game:drawOffered', {
        player: currentPlayer.username
      });

      logger.info('Draw offered', {
        from: currentPlayer.username,
        to: opponent.username
      });
    } catch (error) {
      logger.error('Error offering draw', { error: error.message });
    }
  });

  /**
   * Accept draw
   */
  socket.on('game:acceptDraw', () => {
    try {
      if (!currentPlayer || !currentRoom || !currentRoom.game) return;

      currentPlayer.addPoints(PointCalculator.calculateDrawPoints());
      currentRoom.game.getOpponent().addPoints(PointCalculator.calculateDrawPoints());
      currentPlayer.recordDraw();
      currentRoom.game.getOpponent().recordDraw();

      endGame(io, currentRoom, 'draw', null);
      logger.info('Draw accepted', { player: currentPlayer.username });
    } catch (error) {
      logger.error('Error accepting draw', { error: error.message });
    }
  });

  /**
   * Disconnect
   */
  socket.on('disconnect', () => {
    try {
      if (currentPlayer && currentRoom && currentRoom.game) {
        ReconnectManager.registerDisconnect(
          currentPlayer,
          currentRoom.roomId,
          currentRoom.game.gameId
        );

        io.to(`room:${currentRoom.roomId}`).emit('opponent:disconnected', {
          message: `${currentPlayer.username} has disconnected`
        });

        logger.warn('Player disconnected', {
          player: currentPlayer.username,
          roomId: currentRoom.roomId
        });
      }
    } catch (error) {
      logger.error('Error on disconnect', { error: error.message });
    }
  });

  /**
   * Reconnect
   */
  socket.on('player:reconnect', (data) => {
    try {
      const { playerId } = data;
      const result = ReconnectManager.handleReconnect(playerId, socket.id);

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      currentPlayer = result.player;
      currentRoom = RoomManager.getRoom(result.roomId);

      if (currentRoom) {
        socket.join(`room:${currentRoom.roomId}`);
        io.to(`room:${currentRoom.roomId}`).emit('opponent:reconnected', {
          message: `${currentPlayer.username} has reconnected`
        });
      }

      socket.emit('player:reconnected', { player: currentPlayer.toJSON() });
      logger.info('Player reconnected', { player: currentPlayer.username });
    } catch (error) {
      logger.error('Error reconnecting', { error: error.message });
    }
  });
};

/**
 * Handle quick match found
 */
async function handleQuickMatchFound(io, socket, match) {
  try {
    const roomName = `Quick Match: ${match.player1.username} vs ${match.player2.username}`;
    const room = RoomManager.createRoom(match.player1, roomName, false);
    
    RoomManager.joinRoom(room, match.player2);
    
    socket.join(`room:${room.roomId}`);
    io.to(`room:${room.roomId}`).emit('room:created', { room: room.getInfo() });
    
    await delay(500);
    handleGameStart(io, socket, room);
  } catch (error) {
    logger.error('Error in quick match', { error: error.message });
  }
}

/**
 * Handle game start
 */
function handleGameStart(io, socket, room) {
  try {
    const result = RoomManager.startGameInRoom(room.roomId);
    
    if (!result.success) {
      io.to(`room:${room.roomId}`).emit('error', { message: result.error });
      return;
    }

    const game = result.game;
    StateManager.createGameState(game.gameId, game);

    io.to(`room:${room.roomId}`).emit('game:started', {
      game: game.getState(),
      message: 'Game started! White moves first.'
    });

    logger.info('Game started', {
      gameId: game.gameId,
      roomId: room.roomId,
      player1: game.player1.username,
      player2: game.player2.username
    });
  } catch (error) {
    logger.error('Error starting game', { error: error.message });
  }
}

/**
 * Handle game end
 */
function endGame(io, room, reason, winner) {
  try {
    RoomManager.endGameInRoom(room.roomId, reason, winner);
    
    io.to(`room:${room.roomId}`).emit('game:ended', {
      endReason: reason,
      winner: winner ? winner.toJSON() : null,
      player1: room.game.player1.toJSON(),
      player2: room.game.player2.toJSON()
    });

    StateManager.deleteGameState(room.game.gameId);
    logger.info('Game ended', { roomId: room.roomId, reason, winner: winner?.username });
  } catch (error) {
    logger.error('Error ending game', { error: error.message });
  }
}

// Game Constants and Configuration

const GAME_CONSTANTS = {
  // Timers (in milliseconds)
  TURN_TIMEOUT: 10000,           // 10 seconds per turn
  MATCH_DURATION: 600000,         // 10 minutes total
  RECONNECT_TIMEOUT: 60000,       // 60 seconds to reconnect
  HEARTBEAT_INTERVAL: 5000,       // 5 seconds heartbeat
  ROOM_CLEANUP_INTERVAL: 300000,  // 5 minutes room cleanup

  // Game Rules
  MAX_MISSED_TURNS: 3,
  INITIAL_ELO: 1600,

  // Room Constants
  ROOM_MAX_PLAYERS: 2,
  ROOM_STATES: {
    WAITING: 'waiting',
    SEARCHING: 'searching',
    STARTING: 'starting',
    PLAYING: 'playing',
    PAUSED: 'paused',
    FINISHED: 'finished',
    CANCELLED: 'cancelled'
  },

  // Game End Reasons
  GAME_END_REASONS: {
    CHECKMATE: 'checkmate',
    STALEMATE: 'stalemate',
    RESIGNATION: 'resignation',
    TIMEOUT: 'timeout',
    DRAW: 'draw',
    DISCONNECT: 'disconnect',
    INSUFFICIENT_MATERIAL: 'insufficient_material',
    THREEFOLD_REPETITION: 'threefold_repetition',
    FIFTY_MOVE_RULE: 'fifty_move_rule',
    DISQUALIFICATION: 'disqualification',
    MATCH_TIMEOUT: 'match_timeout'
  },

  // Point System
  POINTS: {
    PAWN_CAPTURE: 10,
    KNIGHT_CAPTURE: 30,
    BISHOP_CAPTURE: 30,
    ROOK_CAPTURE: 50,
    QUEEN_CAPTURE: 90,
    CHECK: 20,
    CASTLING: 25,
    PROMOTION: 80,
    CHECKMATE: 300,
    WINNING_MATCH: 500,
    DRAW: 50,
    ILLEGAL_MOVE: -2,
    MISSED_TURN: -10,
    RESIGNATION: -100
  },

  // Bot Difficulty Levels
  BOT_DIFFICULTY: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  },

  // Game Modes
  GAME_MODES: {
    QUICK_MATCH: 'quick_match',
    PUBLIC_ROOM: 'public_room',
    PRIVATE_ROOM: 'private_room',
    BOT_MODE: 'bot_mode',
    OFFLINE: 'offline'
  }
};

module.exports = GAME_CONSTANTS;

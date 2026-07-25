const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique room code
 */
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Generate unique player ID
 */
function generatePlayerId() {
  return `player_${uuidv4().substring(0, 8)}`;
}

/**
 * Generate unique room ID
 */
function generateRoomId() {
  return `room_${uuidv4()}`;
}

/**
 * Delay execution
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if player is in check
 */
function isInCheck(game, color) {
  return game.in_check();
}

/**
 * Check if game is checkmate
 */
function isCheckmate(game) {
  return game.in_checkmate();
}

/**
 * Check if game is stalemate
 */
function isStalemate(game) {
  return game.in_stalemate();
}

/**
 * Get piece value for point calculation
 */
function getPieceValue(piece) {
  const values = {
    'p': 10,  // pawn
    'n': 30,  // knight
    'b': 30,  // bishop
    'r': 50,  // rook
    'q': 90,  // queen
    'k': 0    // king (not capturable)
  };
  return values[piece.toLowerCase()] || 0;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sanitize string input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 100).replace(/[<>"']/g, '');
}

/**
 * Calculate ELO change
 */
function calculateEloChange(playerElo, opponentElo, result) {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  return Math.round(K * (actualScore - expectedScore));
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  generateRoomCode,
  generatePlayerId,
  generateRoomId,
  delay,
  isInCheck,
  isCheckmate,
  isStalemate,
  getPieceValue,
  isValidEmail,
  sanitizeInput,
  calculateEloChange,
  deepClone
};

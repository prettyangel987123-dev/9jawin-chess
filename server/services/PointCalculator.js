const { getPieceValue } = require('../utils/helpers');
const GAME_CONSTANTS = require('../config/constants');

class PointCalculator {
  /**
   * Calculate points for a capture
   */
  static calculateCapturePoints(capturedPiece) {
    const piece = capturedPiece.type.toLowerCase();
    return getPieceValue(piece);
  }

  /**
   * Calculate points for check
   */
  static calculateCheckPoints() {
    return GAME_CONSTANTS.POINTS.CHECK;
  }

  /**
   * Calculate points for castling
   */
  static calculateCastlingPoints() {
    return GAME_CONSTANTS.POINTS.CASTLING;
  }

  /**
   * Calculate points for pawn promotion
   */
  static calculatePromotionPoints() {
    return GAME_CONSTANTS.POINTS.PROMOTION;
  }

  /**
   * Calculate points for checkmate
   */
  static calculateCheckmatePoints() {
    return GAME_CONSTANTS.POINTS.CHECKMATE;
  }

  /**
   * Calculate points for winning match
   */
  static calculateWinPoints() {
    return GAME_CONSTANTS.POINTS.WINNING_MATCH;
  }

  /**
   * Calculate points for draw
   */
  static calculateDrawPoints() {
    return GAME_CONSTANTS.POINTS.DRAW;
  }

  /**
   * Apply penalty for illegal move
   */
  static applyIllegalMovePenalty() {
    return GAME_CONSTANTS.POINTS.ILLEGAL_MOVE;
  }

  /**
   * Apply penalty for missed turn
   */
  static applyMissedTurnPenalty() {
    return GAME_CONSTANTS.POINTS.MISSED_TURN;
  }

  /**
   * Apply penalty for resignation
   */
  static applyResignationPenalty() {
    return GAME_CONSTANTS.POINTS.RESIGNATION;
  }

  /**
   * Determine if move is castling
   */
  static isCastlingMove(move) {
    return move.flags && (move.flags.includes('k') || move.flags.includes('q'));
  }

  /**
   * Determine if move is promotion
   */
  static isPromotionMove(move) {
    return move.flags && move.flags.includes('p');
  }

  /**
   * Determine if move is capture
   */
  static isCaptureMove(move) {
    return move.flags && move.flags.includes('c');
  }
}

module.exports = PointCalculator;

const GAME_CONSTANTS = require('../config/constants');

class Player {
  constructor(id, username, socketId) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
    this.color = null; // 'white' or 'black'
    this.isConnected = true;
    this.points = 0;
    this.missedTurns = 0;
    this.capturedPieces = [];
    this.statistics = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      highestScore: 0,
      elo: GAME_CONSTANTS.INITIAL_ELO
    };
    this.lastActivity = Date.now();
  }

  addPoints(points) {
    this.points += points;
    if (this.points > this.statistics.highestScore) {
      this.statistics.highestScore = this.points;
    }
  }

  addCapturedPiece(piece) {
    this.capturedPieces.push(piece);
  }

  resetGameState() {
    this.points = 0;
    this.missedTurns = 0;
    this.capturedPieces = [];
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  recordWin() {
    this.statistics.wins++;
    this.statistics.gamesPlayed++;
  }

  recordLoss() {
    this.statistics.losses++;
    this.statistics.gamesPlayed++;
  }

  recordDraw() {
    this.statistics.draws++;
    this.statistics.gamesPlayed++;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      color: this.color,
      points: this.points,
      missedTurns: this.missedTurns,
      capturedPieces: this.capturedPieces,
      statistics: this.statistics
    };
  }
}

module.exports = Player;

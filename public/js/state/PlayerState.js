// Player State Management
class PlayerState {
  constructor() {
    this.id = null;
    this.username = null;
    this.color = null;
    this.points = 0;
    this.missedTurns = 0;
    this.capturedPieces = [];
    this.statistics = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      highestScore: 0
    };
  }

  fromJSON(data) {
    Object.assign(this, data);
    return this;
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

  reset() {
    this.points = 0;
    this.missedTurns = 0;
    this.capturedPieces = [];
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
}

const playerState = new PlayerState();

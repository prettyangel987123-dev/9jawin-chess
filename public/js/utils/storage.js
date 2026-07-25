// Storage Utilities
class Storage {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static setPlayerData(player) {
    this.setItem('currentPlayer', player);
  }

  static getPlayerData() {
    return this.getItem('currentPlayer');
  }

  static setGameStats(stats) {
    this.setItem('gameStats', stats);
  }

  static getGameStats() {
    return this.getItem('gameStats') || {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      highestScore: 0,
      totalPoints: 0
    };
  }

  static updateGameStats(result) {
    const stats = this.getGameStats();
    stats.gamesPlayed++;
    
    if (result === 'win') stats.wins++;
    else if (result === 'loss') stats.losses++;
    else if (result === 'draw') stats.draws++;
    
    this.setGameStats(stats);
    return stats;
  }
}

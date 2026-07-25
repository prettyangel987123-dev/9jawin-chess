// Helper Utilities
class Helpers {
  static formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  static getSquareColor(row, col) {
    return (row + col) % 2 === 0 ? 'light' : 'dark';
  }

  static positionToCoordinate(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
  }

  static coordinateToPosition(coord) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const col = files.indexOf(coord[0]);
    const row = ranks.indexOf(coord[1]);
    return { row, col };
  }

  static getPieceSymbol(type, color) {
    const pieces = {
      'white-king': '♔',
      'white-queen': '♕',
      'white-rook': '♖',
      'white-bishop': '♗',
      'white-knight': '♘',
      'white-pawn': '♙',
      'black-king': '♚',
      'black-queen': '♛',
      'black-rook': '♜',
      'black-bishop': '♝',
      'black-knight': '♞',
      'black-pawn': '♟'
    };
    return pieces[`${color}-${type}`] || '';
  }

  static isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}

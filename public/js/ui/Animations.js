// Animation Manager
class Animations {
  static animatePieceMove(fromSquare, toSquare, duration = 300) {
    return new Promise(resolve => {
      const piece = fromSquare.querySelector('.piece');
      if (!piece) {
        resolve();
        return;
      }

      const fromRect = fromSquare.getBoundingClientRect();
      const toRect = toSquare.getBoundingClientRect();

      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;

      piece.style.setProperty('--dx', `${dx}px`);
      piece.style.setProperty('--dy', `${dy}px`);
      piece.classList.add('moving');

      setTimeout(() => {
        piece.classList.remove('moving');
        resolve();
      }, duration);
    });
  }

  static animatePieceCapture(piece, duration = 300) {
    return new Promise(resolve => {
      piece.classList.add('captured');
      
      setTimeout(() => {
        piece.remove();
        resolve();
      }, duration);
    });
  }

  static highlightSquare(square, duration = 1000) {
    square.classList.add('highlighted');
    
    setTimeout(() => {
      square.classList.remove('highlighted');
    }, duration);
  }

  static pulseSquare(square, count = 2) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        square.style.transform = 'scale(1.1)';
        setTimeout(() => {
          square.style.transform = 'scale(1)';
        }, 100);
      }, i * 200);
    }
  }

  static shakeScreen() {
    const container = document.querySelector('.game-container');
    if (!container) return;

    container.style.animation = 'shake 0.3s';
    setTimeout(() => {
      container.style.animation = '';
    }, 300);
  }

  static celebrateVictory() {
    const header = document.querySelector('.game-header');
    if (!header) return;

    header.classList.add('victory');
    setTimeout(() => {
      header.classList.remove('victory');
    }, 1000);
  }
}

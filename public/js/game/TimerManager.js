// Timer Manager
class TimerManager {
  constructor() {
    this.turnTimeRemaining = 10000;
    this.matchTimeRemaining = 600000;
    this.turnInterval = null;
    this.matchInterval = null;
    this.turnWarningThreshold = 3000;
  }

  startTurnTimer() {
    this.turnTimeRemaining = 10000;
    
    if (this.turnInterval) clearInterval(this.turnInterval);
    
    this.turnInterval = setInterval(() => {
      this.turnTimeRemaining -= 100;
      this.updateTurnDisplay();
      
      if (this.turnTimeRemaining <= 0) {
        this.endTurnTimer();
      } else if (this.turnTimeRemaining <= this.turnWarningThreshold) {
        this.warnTurnExpiring();
      }
    }, 100);
  }

  startMatchTimer() {
    this.matchTimeRemaining = 600000;
    
    if (this.matchInterval) clearInterval(this.matchInterval);
    
    this.matchInterval = setInterval(() => {
      this.matchTimeRemaining -= 100;
      this.updateMatchDisplay();
      
      if (this.matchTimeRemaining <= 0) {
        this.endMatchTimer();
      }
    }, 100);
  }

  updateTurnDisplay() {
    const seconds = Math.ceil(this.turnTimeRemaining / 1000);
    const display = document.getElementById('turnTimer');
    if (display) {
      display.textContent = seconds;
      
      if (this.turnTimeRemaining <= this.turnWarningThreshold) {
        display.parentElement.classList.add('warning');
      } else {
        display.parentElement.classList.remove('warning');
      }
    }
  }

  updateMatchDisplay() {
    const time = Helpers.formatTime(this.matchTimeRemaining);
    const display = document.getElementById('matchTimer');
    if (display) {
      display.textContent = time;
    }
  }

  warnTurnExpiring() {
    audio.playCheck();
  }

  endTurnTimer() {
    clearInterval(this.turnInterval);
    audio.playCheck();
  }

  endMatchTimer() {
    clearInterval(this.turnInterval);
    clearInterval(this.matchInterval);
  }

  pause() {
    if (this.turnInterval) clearInterval(this.turnInterval);
    if (this.matchInterval) clearInterval(this.matchInterval);
  }

  resume() {
    this.startTurnTimer();
    this.startMatchTimer();
  }
}

const timerManager = new TimerManager();

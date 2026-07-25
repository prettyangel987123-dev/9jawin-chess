// Audio Utilities
class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.loadSounds();
  }

  loadSounds() {
    // Use Web Audio API or simple audio elements
    // In production, load actual sound files
    this.sounds = {
      move: this.createSound(),
      capture: this.createSound(),
      check: this.createSound(),
      checkmate: this.createSound(),
      victory: this.createSound(),
      draw: this.createSound()
    };
  }

  createSound() {
    // Create dummy sound object
    return {
      play: () => {}
    };
  }

  playMove() {
    if (this.enabled) {
      this.playTone(400, 100);
    }
  }

  playCapture() {
    if (this.enabled) {
      this.playTone(600, 150);
    }
  }

  playCheck() {
    if (this.enabled) {
      this.playTone(800, 200);
    }
  }

  playCheckmate() {
    if (this.enabled) {
      this.playSequence([800, 600, 1000], [200, 200, 300]);
    }
  }

  playVictory() {
    if (this.enabled) {
      this.playSequence([523, 659, 784, 1047], [300, 300, 300, 600]);
    }
  }

  playDraw() {
    if (this.enabled) {
      this.playTone(523, 300);
    }
  }

  playTone(frequency, duration) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Audio context not available
    }
  }

  playSequence(frequencies, durations) {
    let delay = 0;
    for (let i = 0; i < frequencies.length; i++) {
      setTimeout(() => {
        this.playTone(frequencies[i], durations[i]);
      }, delay);
      delay += durations[i];
    }
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}

const audio = new AudioManager();

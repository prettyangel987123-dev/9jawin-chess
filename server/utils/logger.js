const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor(name) {
    this.name = name;
    this.logFile = path.join(logsDir, 'app.log');
  }

  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] [${this.name}] ${message}${dataStr}`;
  }

  writeLog(level, message, data) {
    const formattedMsg = this.formatMessage(level, message, data);
    
    // Console output
    const consoleLog = console[level.toLowerCase()] || console.log;
    consoleLog(formattedMsg);

    // File output
    try {
      fs.appendFileSync(this.logFile, formattedMsg + '\n');
    } catch (e) {
      console.error('Failed to write to log file:', e);
    }
  }

  error(message, data) {
    this.writeLog(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data) {
    this.writeLog(LOG_LEVELS.WARN, message, data);
  }

  info(message, data) {
    this.writeLog(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data) {
    this.writeLog(LOG_LEVELS.DEBUG, message, data);
  }
}

module.exports = Logger;

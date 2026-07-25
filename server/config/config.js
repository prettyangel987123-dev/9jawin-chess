require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5000',
  
  // Game Settings
  game: {
    turnTimeout: parseInt(process.env.TURN_TIMEOUT) || 10000,
    matchDuration: parseInt(process.env.MATCH_DURATION) || 600000,
    reconnectTimeout: parseInt(process.env.RECONNECT_TIMEOUT) || 60000,
    maxMissedTurns: parseInt(process.env.MAX_MISSED_TURNS) || 3
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};

module.exports = config;

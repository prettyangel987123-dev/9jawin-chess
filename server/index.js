const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const config = require('./config/config');
const Logger = require('./utils/logger');
const socketEvents = require('./socket/events');

const logger = new Logger('Server');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Socket.IO connection
io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });
  socketEvents(io, socket);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server stats endpoint
app.get('/stats', (req, res) => {
  const RoomManager = require('./managers/RoomManager');
  const MatchmakingManager = require('./managers/MatchmakingManager');
  
  res.json({
    rooms: RoomManager.getStats(),
    matchmaking: MatchmakingManager.getQueueStatus(),
    connections: io.engine.clientsCount
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    env: config.env,
    corsOrigin: config.corsOrigin
  });
});

module.exports = { app, server, io };

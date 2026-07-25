# 9ja Chess - Multiplayer Chess Game

**A production-ready, real-time multiplayer chess game built with Node.js, Express, and Socket.IO**

## Features

✨ **Real-time Multiplayer Gaming**
- Live chess matches with instant move updates
- WebSocket-based communication via Socket.IO
- Support for multiple concurrent games

🎮 **Game Modes**
- Quick Match: Automated matchmaking
- Public Rooms: Join open chess rooms
- Private Rooms: Create password-protected games
- Bot Mode: Play against AI (Easy/Medium/Hard)
- Offline Mode: Local multiplayer

⏱️ **Time Management**
- Per-turn timers with warnings
- Match duration tracking
- Automatic time-out handling

📊 **Scoring System**
- Points for captures (piece values)
- Bonus points for check, checkmate
- Penalties for illegal moves
- Win/loss tracking and statistics

🔄 **Reconnection Handling**
- Automatic player reconnection
- Game state recovery
- Connection loss tolerance

🎨 **Responsive UI**
- Mobile-friendly design
- Real-time board updates
- Smooth animations
- Sound effects

## Tech Stack

**Backend:**
- Node.js 16+
- Express.js 4
- Socket.IO 4
- Chess.js

**Frontend:**
- HTML5
- CSS3 (with animations)
- Vanilla JavaScript
- Socket.IO Client

## Installation

### Prerequisites
- Node.js 16+
- npm 8+

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/prettyangel987123-dev/9jawin-chess.git
   cd 9jawin-chess
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

5. **Access the application**
   ```
   http://localhost:3000
   ```

## Project Structure

```
9jawin-chess/
├── server/
│   ├── config/
│   │   ├── config.js          # Configuration management
│   │   └── constants.js       # Game constants
│   ├── models/
│   │   ├── Player.js          # Player model
│   │   ├── Game.js            # Game model
│   │   └── Room.js            # Room model
│   ├── services/
│   │   ├── GameEngine.js      # Chess move validation
│   │   ├── PointCalculator.js # Score calculation
│   │   ├── BotEngine.js       # AI opponent
│   │   └── MoveValidator.js   # Move validation
│   ├── managers/
│   │   ├── RoomManager.js     # Room management
│   │   ├── MatchmakingManager.js
│   │   ├── ReconnectManager.js
│   │   └── StateManager.js    # Game state management
│   ├── socket/
│   │   └── events.js          # Socket.IO event handlers
│   ├── utils/
│   │   ├── logger.js          # Logging utility
│   │   └── helpers.js         # Helper functions
│   └── index.js               # Server entry point
├── public/
│   ├── index.html             # Main HTML
│   ├── css/
│   │   ├── styles.css         # Main styles
│   │   ├── board.css          # Board styles
│   │   ├── responsive.css     # Responsive design
│   │   └── animations.css     # Animations
│   └── js/
│       ├── utils/
│       │   ├── storage.js
│       │   ├── audio.js
│       │   └── helpers.js
│       ├── state/
│       │   ├── PlayerState.js
│       │   └── GameState.js
│       ├── game/
│       │   ├── ChessLogic.js
│       │   ├── MoveHandler.js
│       │   └── TimerManager.js
│       ├── ui/
│       │   ├── Board.js
│       │   ├── Menu.js
│       │   ├── GameScreen.js
│       │   └── Animations.js
│       ├── socket-client.js
│       └── app.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Game Rules

- Standard chess rules apply
- Players alternate turns (white moves first)
- 10-second per-turn timer
- 10-minute match timer
- Checkmate ends the game
- Draw by stalemate, insufficient material, or agreement

## Scoring

| Event | Points |
|-------|--------|
| Pawn capture | 1 |
| Knight capture | 3 |
| Bishop capture | 3 |
| Rook capture | 5 |
| Queen capture | 9 |
| Check | 5 |
| Checkmate | 100 |
| Castling | 10 |
| Pawn promotion | 20 |
| Win | 50 |
| Draw | 25 |
| Illegal move | -50 |
| Missed turn | -20 |
| Resignation | -30 |

## API Events

### Emit (Client → Server)

```javascript
// Player
socket.emit('player:join', { username });
socket.emit('player:reconnect', { playerId });

// Quick Match
socket.emit('quickMatch:start', {});
socket.emit('quickMatch:cancel', {});

// Rooms
socket.emit('room:create', { roomName, isPublic, password });
socket.emit('room:join', { roomId, password });
socket.emit('room:joinByCode', { code, password });
socket.emit('room:leave', {});
socket.emit('rooms:getPublic', {});

// Game
socket.emit('game:move', { from, to, promotion });
socket.emit('game:resign', {});
socket.emit('game:offerDraw', {});
socket.emit('game:acceptDraw', {});
```

### Listen (Server → Client)

```javascript
// Player
socket.on('player:joined', (data) => {});
socket.on('player:reconnected', (data) => {});

// Quick Match
socket.on('quickMatch:searching', (data) => {});
socket.on('quickMatch:cancelled', (data) => {});

// Rooms
socket.on('room:created', (data) => {});
socket.on('room:joined', (data) => {});
socket.on('room:updated', (data) => {});
socket.on('rooms:publicList', (data) => {});

// Game
socket.on('game:started', (data) => {});
socket.on('game:moved', (data) => {});
socket.on('game:ended', (data) => {});
socket.on('game:drawOffered', (data) => {});
socket.on('opponent:disconnected', (data) => {});
socket.on('opponent:reconnected', (data) => {});
```

## Development

### Run tests
```bash
npm test
```

### Code formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku open
```

### Docker
```bash
docker build -t 9ja-chess .
docker run -p 3000:3000 9ja-chess
```

## Performance Considerations

- ✅ Optimized socket events
- ✅ Efficient game state management
- ✅ Move validation on server
- ✅ Connection pooling ready
- ✅ Scalable architecture

## Security

- ✅ Move validation on server
- ✅ Player authentication (ready for JWT)
- ✅ Input validation
- ✅ CORS protection
- ✅ Rate limiting ready

## Future Enhancements

- [ ] User accounts and authentication
- [ ] Game replay and analysis
- [ ] ELO rating system
- [ ] Tournament mode
- [ ] Chat and messaging
- [ ] Mobile app
- [ ] Spectator mode
- [ ] Sound library integration

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Email: support@9jachess.com

## Acknowledgments

- Chess.js library for chess logic
- Socket.IO for real-time communication
- Express.js community

---

**Made with ♟️ by the 9ja Chess Team**

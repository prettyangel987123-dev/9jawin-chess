// Socket.IO Client
class SocketClient {
  constructor(url = window.location.origin) {
    this.socket = null;
    this.url = url;
    this.connect();
  }

  connect() {
    this.socket = io(this.url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      Helpers.showNotification(error.message, 'error');
    });
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event) {
    this.socket.off(event);
  }

  // Player Events
  joinGame(username) {
    this.emit('player:join', { username });
  }

  // Quick Match Events
  startQuickMatch() {
    this.emit('quickMatch:start', {});
  }

  cancelQuickMatch() {
    this.emit('quickMatch:cancel', {});
  }

  // Room Events
  createRoom(roomName, isPublic, password) {
    this.emit('room:create', { roomName, isPublic, password });
  }

  joinRoom(roomId, password) {
    this.emit('room:join', { roomId, password });
  }

  joinRoomByCode(code, password) {
    this.emit('room:joinByCode', { code, password });
  }

  getPublicRooms() {
    this.emit('rooms:getPublic', {});
  }

  leaveRoom() {
    this.emit('room:leave', {});
  }

  // Game Events
  makeMove(from, to, promotion) {
    this.emit('game:move', { from, to, promotion });
  }

  resign() {
    this.emit('game:resign', {});
  }

  offerDraw() {
    this.emit('game:offerDraw', {});
  }

  acceptDraw() {
    this.emit('game:acceptDraw', {});
  }

  reconnect(playerId) {
    this.emit('player:reconnect', { playerId });
  }

  // Listeners
  onPlayerJoined(callback) {
    this.on('player:joined', callback);
  }

  onQuickMatchSearching(callback) {
    this.on('quickMatch:searching', callback);
  }

  onQuickMatchCancelled(callback) {
    this.on('quickMatch:cancelled', callback);
  }

  onRoomCreated(callback) {
    this.on('room:created', callback);
  }

  onRoomJoined(callback) {
    this.on('room:joined', callback);
  }

  onRoomUpdated(callback) {
    this.on('room:updated', callback);
  }

  onRoomsPublicList(callback) {
    this.on('rooms:publicList', callback);
  }

  onGameStarted(callback) {
    this.on('game:started', callback);
  }

  onGameMoved(callback) {
    this.on('game:moved', callback);
  }

  onGameEnded(callback) {
    this.on('game:ended', callback);
  }

  onDrawOffered(callback) {
    this.on('game:drawOffered', callback);
  }

  onOpponentDisconnected(callback) {
    this.on('opponent:disconnected', callback);
  }

  onOpponentReconnected(callback) {
    this.on('opponent:reconnected', callback);
  }

  onPlayerReconnected(callback) {
    this.on('player:reconnected', callback);
  }
}

const socketClient = new SocketClient();

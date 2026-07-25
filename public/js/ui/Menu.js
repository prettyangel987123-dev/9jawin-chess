// Menu UI Manager
class MenuUI {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for player join
    socketClient.onPlayerJoined((data) => {
      playerState.fromJSON(data.player);
      console.log('Player joined:', playerState.username);
    });

    // Listen for room creation
    socketClient.onRoomCreated((data) => {
      console.log('Room created:', data.room);
      showScreen('gameScreen');
    });

    // Listen for room join
    socketClient.onRoomJoined((data) => {
      console.log('Room joined:', data.room);
      if (data.room.playerCount === 2) {
        // Room is full, wait for game to start
      }
    });

    // Listen for public rooms
    socketClient.onRoomsPublicList((data) => {
      this.displayRooms(data.rooms);
    });

    // Listen for quick match
    socketClient.onQuickMatchSearching(() => {
      showScreen('quickMatch');
    });
  }

  displayRooms(rooms) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';

    if (rooms.length === 0) {
      roomsList.innerHTML = '<p>No rooms available</p>';
      return;
    }

    rooms.forEach(room => {
      const roomCard = document.createElement('div');
      roomCard.className = 'room-card';
      roomCard.innerHTML = `
        <h3>${room.roomName}</h3>
        <p>Created by: ${room.creator}</p>
        <p>Players: ${room.playerCount}/${room.maxPlayers}</p>
        <p>Time Control: ${room.timeControl}</p>
        <div class="room-status">
          <span>${room.isFull ? 'Full' : 'Waiting'}</span>
          <button class="btn btn-secondary" onclick="joinRoomUI('${room.roomId}')" ${room.isFull ? 'disabled' : ''}>Join</button>
        </div>
      `;
      roomsList.appendChild(roomCard);
    });
  }
}

const menuUI = new MenuUI();

function joinRoomUI(roomId) {
  socketClient.joinRoom(roomId, null);
}

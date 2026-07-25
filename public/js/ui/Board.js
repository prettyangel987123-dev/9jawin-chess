// Board UI Manager
class Board {
  constructor(containerId = 'board') {
    this.container = document.getElementById(containerId);
    this.squares = [];
    this.initializeBoard();
  }

  initializeBoard() {
    this.container.innerHTML = '';
    this.squares = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.createSquare(row, col);
        this.container.appendChild(square);
        this.squares.push(square);
      }
    }
  }

  createSquare(row, col) {
    const square = document.createElement('div');
    const color = Helpers.getSquareColor(row, col);
    const coordinate = Helpers.positionToCoordinate(row, col);

    square.className = `square ${color}`;
    square.dataset.row = row;
    square.dataset.col = col;
    square.dataset.coordinate = coordinate;
    square.id = `square-${coordinate}`;

    square.addEventListener('click', (e) => this.handleSquareClick(row, col, e));

    return square;
  }

  handleSquareClick(row, col, event) {
    if (window.gameScreenUI) {
      window.gameScreenUI.onSquareClick(row, col);
    }
  }

  getSquare(row, col) {
    return this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  setPiece(row, col, piece, color) {
    const square = this.getSquare(row, col);
    if (square) {
      const pieceEl = square.querySelector('.piece');
      if (pieceEl) pieceEl.remove();

      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece ${color}-${piece}`;
        square.appendChild(pieceEl);
      }
    }
  }

  highlight(row, col) {
    const square = this.getSquare(row, col);
    if (square) {
      square.classList.add('highlight-' + Helpers.getSquareColor(row, col));
    }
  }

  clearHighlights() {
    this.container.querySelectorAll('.highlight-light, .highlight-dark').forEach(el => {
      el.classList.remove('highlight-light', 'highlight-dark');
    });
  }

  select(row, col) {
    const square = this.getSquare(row, col);
    if (square) {
      square.classList.add('selected');
    }
  }

  clearSelection() {
    this.container.querySelectorAll('.selected').forEach(el => {
      el.classList.remove('selected');
    });
  }

  showLegalMoves(moves) {
    moves.forEach(move => {
      const square = this.getSquare(move.row, move.col);
      if (square) {
        if (move.capture) {
          square.classList.add('legal-capture');
        } else {
          square.classList.add('legal-move');
        }
      }
    });
  }

  clearLegalMoves() {
    this.container.querySelectorAll('.legal-move, .legal-capture').forEach(el => {
      el.classList.remove('legal-move', 'legal-capture');
    });
  }

  setCheck(row, col) {
    const square = this.getSquare(row, col);
    if (square) {
      square.classList.add('check');
    }
  }

  clearCheck() {
    this.container.querySelectorAll('.check').forEach(el => {
      el.classList.remove('check');
    });
  }

  reset() {
    this.clearSelection();
    this.clearHighlights();
    this.clearLegalMoves();
    this.clearCheck();
  }
}

const board = new Board();

// Player factory function
const Player = (marker) => {
  let score = 0;

  const getScore = () => score;

  const addPoint = () => {
    score += 1;
  }

  return { marker,getScore, addPoint };
}

// Gameboard module
const gameBoard = (() => {
  const boardArray = [
    ['', '', ''], 
    ['', '', ''], 
    ['', '', '']
  ];
  
  const getBoardArray = () => boardArray;
  const updateBoardArray = (row, col, marker) => {
    if (boardArray[row][col] === '') {
      boardArray[row][col] = marker;
    }
  };

  const clearArray = () => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        boardArray[r][c] = '';
      }
    }
  }

  return { getBoardArray, updateBoardArray, clearArray };
})();

// Display controller module
const gameController = (() => {
  const playerx = Player('media/icon-cross.svg');
  const playero = Player('media/icon-circle.svg');
  const xScore = document.querySelector('.x-score');
  const oScore = document.querySelector('.o-score');
  const tieScore = document.querySelector('.tie-score');
  const squares = document.querySelectorAll('.board-square');
  const spaces = document.querySelectorAll('.space');
  const restartButton = document.querySelector('.restart-btn');
  let ties = 0;
  let winner;
  let currentPlayer = playerx.marker;

  // Updates boardArray and the board display and swaps turns when a square is clicked
  squares.forEach(function(square) {
    square.addEventListener('click', function() {
      if (!square.classList.contains('full')) {
        gameBoard.updateBoardArray(square.dataset.row, square.dataset.col, currentPlayer);
        updateBoardDisplay();
        changeTurn();
        checkWinner(gameBoard.getBoardArray());
        updateScore();
        square.classList.toggle('full');
      }
    });
  });

  // Updates the board display based on the values in the boardArray
  const updateBoardDisplay = () => {
    const arr = gameBoard.getBoardArray();
    spaces.forEach(space => {
      space.src = arr[space.dataset.row][space.dataset.col];
    });
  };

  const changeTurn = () => {
    currentPlayer = currentPlayer === playerx.marker ? playero.marker : playerx.marker;
  };

  const areEqual = (a, b, c) => {
    return a === b && b === c && a !== '';
  }

  const checkWinner = (board) => {
    winner = null;
    for (let r = 0; r < 3; r++) {
      if (areEqual(board[r][0], board[r][1], board[r][2])) {
        winner = board[r][0] === playerx.marker ? 'X' : 'O';
      }
    } 

    for (let c = 0; c < 3; c++) {
      if (areEqual(board[0][c], board[1][c], board[2][c])) {
        winner = board[0][c] === playerx.marker ? 'X' : 'O';
      }
    } 

    if (areEqual(board[0][0], board[1][1], board[2][2])) {
      winner = board[1][1] === playerx.marker ? 'X' : 'O';
    }

    if (areEqual(board[2][0], board[1][1], board[0][2])) {
      winner = board[1][1] === playerx.marker ? 'X' : 'O';
    }

    let openSpaces = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] == '') {
          openSpaces++;
        }
      }
    }
    console.log(openSpaces);
    console.log(winner);

    if (winner === null && openSpaces === 0) {
      winner = 'tie';
      return winner;
    } 
    return winner;
  };

  const updateScore = () => {
    if (winner === 'X') {
      playerx.addPoint();
    } 
    if (winner === 'O') {
      playero.addPoint();
    }
    if (winner === 'tie') {
      ties += 1;
    }
    xScore.textContent = playerx.getScore();
    oScore.textContent = playero.getScore();
    tieScore.textContent = ties;
    winner = '';
  }

  const resetBoard = () => {
    spaces.forEach(space => {
      space.src = '';
    })
    squares.forEach(square => {
      square.classList.remove('full');
    })
    currentPlayer = playerx.marker;
    gameBoard.clearArray();
  }

  restartButton.addEventListener('click', resetBoard);

  return { };
})();
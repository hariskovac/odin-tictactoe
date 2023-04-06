// Player factory function
const Player = (marker) => {
  let score = 0;

  const getScore = () => score;

  const addPoint = () => {
    score += 1;
  }

  const clearScore = () => {
    score = 0;
  }

  return { marker, getScore, addPoint, clearScore };
}

// Gameboard module
const gameBoard = (() => {
  let boardArray = [
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
  const xScoreDisplay = document.querySelector('.x-score');
  const oScoreDisplay = document.querySelector('.o-score');
  const tieScoreDisplay = document.querySelector('.tie-score');
  const squares = document.querySelectorAll('.board-square');
  const spaces = document.querySelectorAll('.space');
  const restartButton = document.querySelector('.restart-btn');
  let ties = 0;
  let winner;

  // Updates boardArray and the board display and swaps turns when a square is clicked
  squares.forEach(function(square) {
    square.addEventListener('click', function() {
      if (!square.classList.contains('full')) {
        gameBoard.updateBoardArray(square.dataset.row, square.dataset.col, playerx.marker);
        updateBoardDisplay();
        checkWinner(gameBoard.getBoardArray());
        updateScore();
        square.classList.toggle('full');
        aiLogic.findBestMove(gameBoard.getBoardArray());
      }
    });
  });

  const fillSquare = (row, col) => {
    squares.forEach(square => {
      if (square.dataset.row == row && square.dataset.col == col) {
        console.log('aye');
        square.classList.toggle('full');
      }
    })
  }

  // Updates the board display based on the values in the boardArray
  const updateBoardDisplay = () => {
    const arr = gameBoard.getBoardArray();
    spaces.forEach(space => {
      space.src = arr[space.dataset.row][space.dataset.col];
    });
  }

  // Checks for a winner or tie game
  const checkWinner = (board) => {
    for (let r = 0; r < 3; r++) {
      winner = '';
      if (board[r][0] === board[r][1] && board[r][1] === board[r][2]) {
          if (board[r][0] === playerx.marker) {
            winner = 'X';
            return -10;
          } else if (board[r][0] === playero.marker) {
            winner = 'O';
            return 10;
          }
        }
    }

    for (let c = 0; c < 3; c++) {
      if (board[0][c] === board[1][c] && board[1][c] === board[2][c]) {
          if (board[0][c] === playerx.marker) {
            winner = 'X';
            return -10;
          } else if (board[0][c] === playero.marker) {
            winner = 'O';
            return 10;
          }
        }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[1][1] === playerx.marker) {
        winner = 'X';
        return -10;
      } else if (board[1][1] === playero.marker) {
        winner = 'O';
        return 10;
      }
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[1][1] === playerx.marker) {
        winner = 'X';
        return -10;
      } else if (board[1][1] === playero.marker) {
        winner = 'O';
        return 10;
      }
    }

    let openSpaces = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] == '') {
          openSpaces++;
        }
      }
    }

    if (openSpaces === 0) {
      winner = 'tie';
      return 0;
    } 
  }

  // Updates the score display
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
    xScoreDisplay.textContent = playerx.getScore();
    oScoreDisplay.textContent = playero.getScore();
    tieScoreDisplay.textContent = ties;
    winner = '';
  }

  // Resets the board
  const resetBoard = () => {
    spaces.forEach(space => {
      space.src = '';
    })
    squares.forEach(square => {
      square.classList.remove('full');
    })
    gameBoard.clearArray();
  }

  restartButton.addEventListener('click', resetBoard);

  return { fillSquare, updateBoardDisplay, checkWinner, updateScore };
})();

const aiLogic = (() => {
  // The images used for the X and O icons
  const huPlayer = 'media/icon-cross.svg';
  const aiPlayer = 'media/icon-circle.svg';

  const minimax = (board, depth, isMax) => {
    // Checks to see if anyone won the game and returns -10 for X, 10 for O, or 0 in case of a tie
    let score = gameController.checkWinner(board);

    if (score === 10) {
      return 10 - depth;
    }
    if (score === -10) {
      return -10 + depth;
    }
    if (score === 0) {
      return 0;
    }

    if (isMax) {
      let best = -1000;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === '') {
            board[r][c] = aiPlayer;
            best = Math.max(best, minimax(board, depth + 1, false));
            board[r][c] = '';
          }
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === '') {
            board[r][c] = huPlayer;
            best = Math.min(best, minimax(board, depth + 1, true));
            board[r][c] = '';
          }
        }
      }
      return best;
    }
  }

  const findBestMove = (board) => {
    let bestVal = -1000;
    let bestMove;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === '') {
          board[r][c] = aiPlayer;
          let moveVal = minimax(board, 0, false);
          board[r][c] = '';

          if (moveVal > bestVal) {
            bestVal = moveVal;
            bestMove = { row: r, col: c };
          }
        }
      }
    }
    // Plays the AI's move by updating the array and the display
    gameBoard.updateBoardArray(bestMove.row, bestMove.col, aiPlayer);
    gameController.fillSquare(bestMove.row, bestMove.col);
    gameController.updateBoardDisplay();
    gameController.checkWinner(gameBoard.getBoardArray());
    gameController.updateScore();
  }

  return { findBestMove };
})();
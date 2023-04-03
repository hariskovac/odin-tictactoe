// Player factory function
const Player = () => {
  let score = 0;

  const getScore = () => score;

  const addPoint = () => {
    score += 1;
  }

  return { getScore, addPoint };
}

// Gameboard module
const gameBoard = (() => {
  const boardArray = ['', '', '', '', '', '', '', '', ''];
  
  const getBoardArray = () => boardArray;
  const updateBoardArray = (index, marker) => {
    if (boardArray[index] === '') {
      boardArray[index] = marker;
    }
  };

  const clearArray = () => {
    for (let i = 0; i < boardArray.length; i++) {
      boardArray[i] = '';
    }
  }

  return { getBoardArray, updateBoardArray, clearArray };
})();

// Display controller module
const displayController = (() => {
  const playerx = Player('x');
  const playero = Player('o');
  const xMarker = 'media/icon-cross.svg';
  const oMarker = 'media/icon-circle.svg';
  const xScore = document.querySelector('.x-score');
  const oScore = document.querySelector('.o-score');
  const tieScore = document.querySelector('.tie-score');
  const squares = document.querySelectorAll('.board-square');
  const spaces = document.querySelectorAll('.space');
  const restartButton = document.querySelector('.restart-btn');
  let ties = 0;
  let winner;
  let currentMarker = xMarker;

  // Updates boardArray and the board display and swaps turns when a square is clicked
  squares.forEach(function(square) {
    square.addEventListener('click', function() {
      if (!square.classList.contains('full')) {
        gameBoard.updateBoardArray(square.dataset.index, currentMarker);
        updateBoardDisplay();
        changeTurn();
        checkWinner();
        square.classList.toggle('full');
      }
    });
  });

  // Updates the board display based on the values in the boardArray
  const updateBoardDisplay = () => {
    let index = 0;
    const arr = gameBoard.getBoardArray();
    spaces.forEach(space => {
      space.src = arr[index];
      index += 1;
    });
  };

  const changeTurn = () => {
    currentMarker = currentMarker === xMarker ? oMarker : xMarker;
  };

  const checkWinner = () => {
    const arr = gameBoard.getBoardArray();
    const winningMoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    // Checks for a winning combination of plays
    for (let i = 0; i < winningMoves.length; i++) {
      if (
        arr[winningMoves[i][0]] !== ''
        && arr[winningMoves[i][0]] === arr[winningMoves[i][1]] 
        && arr[winningMoves[i][1]] === arr[winningMoves[i][2]]
      ) {
        winner = arr[winningMoves[i][0]] === xMarker ? 'X wins!' : 'O wins!';
        updateScore();
      }
    } 

    if (!arr.includes('')) {
      ties += 1;
      updateScore();
    }
  };

  const updateScore = () => {
    if (winner === 'X wins!') {
      playerx.addPoint();
    } 
    if (winner === 'O wins!') {
      playero.addPoint();
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
    currentMarker = xMarker;
    gameBoard.clearArray();
  }

  restartButton.addEventListener('click', resetBoard);

  return { updateBoardDisplay, changeTurn, checkWinner, resetBoard, updateScore };
})();

const aiLogic = (() => {
  let boardState = [];

  const updateBoardState = () => {
    let arr = gameBoard.getBoardArray();
    boardState = [];
    for (let i = 0; i < 9; i = i + 3) {
      boardState.push(arr.slice(i, i + 3));
    }
  }

  const areMovesLeft = () => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (boardState[r][c] === '') { 
          return true 
        }
      }
    }
    return false;
  }

  const evaluateBoard = () => {
    updateBoardState();
    for (let r = 0; r < 3; r++) {
      if (
        boardState[r][0] === boardState[r][1]
        && boardState[r][1] === boardState[r][2]
      ) {
        if (boardState[r][0] === 'media/icon-cross.svg') {
          return 10;
        } else if (boardState[r][0] === 'media/icon-circle.svg') {
          return -10;
        }
      }
    }

    for (let c = 0; c < 3; c++) {
      if (
        boardState[0][c] === boardState[1][c]
        && boardState[1][c] === boardState[2][c]
      ) {
        if (boardState[0][c] === 'media/icon-cross.svg') {
          return 10;
        } else if (boardState[0][c] === 'media/icon-circle.svg') {
          return -10;
        }
      }
    }

    if (boardState[0][0] === boardState[1][1] && boardState[1][1] === boardState[2][2]) {
      if (boardState[0][0] === 'media/icon-cross.svg') {
        return 10;
      } else if (boardState[0][0] === 'media/icon-circle.svg') {
        return -10;
      }
    }

    if (boardState[0][2] === boardState[1][1] && boardState[1][1] === boardState[2][0]) {
      if (boardState[0][2] === 'media/icon-cross.svg') {
        return 10;
      } else if (boardState[0][2] === 'media/icon-circle.svg') {
        return -10;
      }
    }
  }

  const minimax = (board, depth, isMax) => {
    let score = evaluateBoard();

    if (score === 10) return score;
    if (score === -10) return score;
    if (areMovesLeft() === false) return 0;
    if (isMax) {
      let best = -1000;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === '') {
            // Make move here

            best = Math.max(best, minimax(board, depth + 1, !isMax));

            // Undo move
          }
        }
      }
      return best;
    } else {
      let best = -1000;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === '') {
            // Make move here

            best = Math.min(best, minimax(board, depth + 1, !isMax));

            // Undo move
          }
        }
      }
      return best;
    }
  }

  const bestMove = (board) => {
    let bestVal = -1000;
    let bestMove = {
      row: -1,
      col: -1
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === '') {
          // Make move here

          let moveVal = minimax(board, 0, false);

          // Undo move

          if (moveVal > bestVal) {
            bestMove.row = r;
            bestMove.col = c;
            bestVal = moveVal;
          }
        }       
      }
    }

    console.log(`The optimal move is [${bestMove.row}][${bestMove.col}]`);
    return bestMove;
  }

  updateBoardState();
  evaluateBoard();
  minimax(boardState, 0, true);
  return { updateBoardState, areMovesLeft, evaluateBoard, minimax, bestMove };
})();
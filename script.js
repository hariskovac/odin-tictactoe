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
  const boardArray = ['x', 'x', 'x', 'o', 'o', 'o', 'x', 'x', 'x'];
  
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
  let currentBoardState = [];

  const updateBoardState = () => {
    let arr = gameBoard.getBoardArray();
    currentBoardState = [];
    for (let i = 0; i < 9; i = i + 3) {
      currentBoardState.push(arr.slice(i, i + 3));
    }
    console.log(currentBoardState);
  }

  return { updateBoardState };
})();
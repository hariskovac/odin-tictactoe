const gameBoard = (() => {
  const boardArray = ['', '', '', '', '', '', '', '', ''];
  
  const getBoardArray = () => boardArray;
  const updateBoardArray = (index, marker) => {
    if (boardArray[index] === '') {
      boardArray[index] = marker;
    }
  };

  return { getBoardArray, updateBoardArray };
})();

const displayController = (() => {
  const xMarker = 'media/icon-cross.svg';
  const oMarker = 'media/icon-circle.svg';
  const square = document.querySelectorAll('.board-square');
  const spaces = document.querySelectorAll('.space');
  let ties = 0;
  let currentMarker = xMarker;

  // Updates boardArray and the board display and swaps turns when a square is clicked
  square.forEach(function(square) {
    square.addEventListener('click', function() {
      gameBoard.updateBoardArray(square.dataset.index, currentMarker);
      updateBoardDisplay();
      changeTurn();
      checkWinner();
    });
  });

  // Updates the board display based on the values in the boardArray
  const updateBoardDisplay = () => {
    let index = 0;
    const array = gameBoard.getBoardArray();
    spaces.forEach(space => {
      space.src = array[index];
      index += 1;
    });
  };

  const changeTurn = () => {
    currentMarker = currentMarker === xMarker ? oMarker : xMarker;
  };

  const checkWinner = () => {
    const array = gameBoard.getBoardArray();
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
        array[winningMoves[i][0]] !== ''
        && array[winningMoves[i][0]] === array[winningMoves[i][1]] 
        && array[winningMoves[i][1]] === array[winningMoves[i][2]]
      ) {
        console.log('Winner!');
      }
    } 

    if (!array.includes('')) {
      console.log('Tie Game');
    }
  };

  return { updateBoardDisplay, changeTurn, checkWinner };
})();

const Player = (name) => {
  let score = 0;

  const getScore = () => score;

  return { getScore };
}
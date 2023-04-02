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
  let ties = 0;
  let currentMarker;
  const xMarker = 'media/icon-cross.svg';
  const oMarker = 'media/icon-circle.svg';
  const square = document.querySelectorAll('.board-square');
  const spaces = document.querySelectorAll('.space');

  // Updates boardArray and the board display when a square is clicked
  square.forEach(function(square) {
    square.addEventListener('click', function() {
      gameBoard.updateBoardArray(square.dataset.index, currentMarker);
      updateBoardDisplay();
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

  return { updateBoardDisplay };
})();

const Player = (name) => {
  let score = 0;

  const getScore = () => score;

  return { getScore };
}
const gameBoard = (() => {
  const boardArray = ['', '', '', '', '', '', '', '', ''];
  
  const getBoardArray = () => boardArray;
  const updateBoardArray = (index, marker) => {
    if (boardArray[index] === '') {
      boardArray[index] = marker;
    }
  };

  return { getBoardArray };
})();

const displayController = (() => {
  let ties = 0;

  const updateBoardDisplay = () => {
    let index = 0;
    const array = gameBoard.getBoardArray();
    const spaces = document.querySelectorAll('.space');
    spaces.forEach(space => {
      space.textContent = array[index];
      index += 1;
    });
  };

  return { updateBoardDisplay };
})();
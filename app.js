// Get all of the boxes as a nodelist and
// convert it to an actual array so we can use
// all of the array methods!
const gameBoard = Array.from(document.querySelectorAll('.box'));
// Get the reset button so we can add an eventlistener
const resetBtn = document.getElementById('reset');
// Get the h1 element inside the element with an id of messages
const playerMessage = document.querySelector('#messages > h1');

// Set up some variables for the players
// This method makes it easier for us to change the
// tokens without having to change our code
// Later we could even add some functionality to have each
// player choose their own token!
// For example try replacing the line const playerOne = 'X' with:
// const playerOne = prompt('PlayerOne choose your token', '🎲')
const playerOne = 'X';
const playerTwo = 'O';

// Initialize the current player with the value
// stored in the playerOne variable
let currentPlayer = playerOne;
// We'll flip this variable whenever the game is over
let gameOver = false;

// Create a function to reset the game when it's over
const resetGame = () => {
  // hide the resetBtn
  resetBtn.style.display = 'none';
  // Reset the currentPlayer to playerOne
  currentPlayer = playerOne;
  // reset the the message to Player X Starts
  playerMessage.innerText = `Player ${currentPlayer} Starts`;
  // Loop over all of the elements in the gameboard array
  // and reset them back to their original state
  gameBoard.forEach((box) => {
    // Empty the text
    box.innerText = '';
    // Remove the win class (if it exists)
    box.classList.remove('win');
    // Reset the cursor so it's not the
    // 'not-allowed' cursor on hover
    box.style.cursor = '';
    // set the gameOver variable back to false
    gameOver = false;
  });
};

const onBoxClick = (event) => {
  // if the gameOver variable is set to true just return immediately
  // so no other lines of code in the function run
  if (gameOver) return;
  // Store the box that was clicked in a variable (just for readability)
  const box = event.target;
  // If the box has no text,
  if (!box.innerText) {
    // Set the text to the currentPlayer's token
    box.innerText = currentPlayer;
    // Check if the move resulted in a win
    checkWinner();
  } else {
    // otherwise...
    // Tell the player that the space they clicked is occupied
    playerMessage.innerText = 'That square is taken!';
  }
};

const checkWinner = () => {
  // Create an array of all of the possible winning combinations
  // using the index of the box starting with 0
  const winCombinations = [
    [0, 1, 2], // top row
    [3, 4, 5], // second row
    [6, 7, 8], // third row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // left diagonal
    [2, 4, 6], // right diagonal
  ];

  // Map over the winCombinations array
  // each time the loop runs, one of the winCombination
  // arrays is passed to the callback

  // The callback then uses the every array method
  // which will return true if EVERYthing in it's callback
  // returns true.  So, we check every element at the index
  // of the current win combo to see if it matches the
  // currentPlayer's token.

  // The last thing we do here, is store the index of the
  // winning combination that was true. Map returns an array, so
  // when the map runs it'll return something like:
  // [false, true, false, false, false, false, false]
  // indexOf will check that array for the first element that matches
  // true and return the index of it, if it doesn't find a match it
  // returns -1.

  // If we didn't want to highlight the winning squares, we could just
  // use a true or false here with some instead of map and skip the
  // indexOf at the end
  const winIndex = winCombinations
    .map((winCombo) =>
      winCombo.every(
        (boxIndex) => gameBoard[boxIndex].innerText === currentPlayer
      )
    )
    .indexOf(true);

  // If there's a win...
  if (winIndex !== -1) {
    // call the endGame function
    // endGame can accept two arguments. The first is
    // a boolean which is true if there's a win (versus a tie)
    // The second argument is the array of the winning element indices
    endGame(true, winCombinations[winIndex]);
  } else if (gameBoard.every((box) => box.innerText)) {
    // To check for a tie, check if everybox has innerText
    // call the endGame function but set the first argument to false
    endGame(false);
  } else {
    // there's no win or no tie so ...
    // switch the player
    switchPlayer();
  }
};

const switchPlayer = () => {
  // If the currentPlayer is playerOne, assign it playerTwo's value
  // otherwise assign it playerOne's value
  currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  // After the currentPlayer variable has been switched,
  // change the text of the message area to tell the next
  // player it's their turn
  playerMessage.innerText = `Player ${currentPlayer}'s Turn`;
};

const endGame = (isWin, winBoxes) => {
  // flip the gameOver variable to true
  gameOver = true;
  // if the isWin parameter is set to true,
  // set the msg variable to contain a string indicating that
  // the currentPlayer won otherwise it was a tie so
  // the message that is stored reads: no one won
  msg = isWin ? 'Player ' + currentPlayer + ' wins the match!' : 'No one wins';
  // Set the text of the message area to whatever is
  // stored in the msg variable
  playerMessage.innerText = msg;
  // Show the reset button
  resetBtn.style.display = 'block';
  // Loop over all of the elements in the gameboard array
  // and add an inline style so the cursor shows as the
  // 'not-allowed' symbol
  gameBoard.forEach((box) => {
    box.style.cursor = 'not-allowed';
  });

  // If isWin is true...
  if (isWin) {
    // call the showWinner function and pass it the winning
    // element indices
    showWinner(winBoxes);
  }
};

const showWinner = (winIndices) => {
  // loop over the array of winning indices
  // use the index to select the element in the
  // gameboard array and add a class of 'win' to it
  // so that it is highlighted
  winIndices.forEach((index) => gameBoard[index].classList.add('win'));
};

const init = () => {
  // initialize our event listeners once
  gameBoard.forEach((box) => box.addEventListener('click', onBoxClick));
  resetBtn.addEventListener('click', resetGame);
};
// call init to initialize the event listeners when the page loads
init();

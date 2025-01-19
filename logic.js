// console.log("Hello world");

// Variables - stores and represents specific values that can be used throughout the game
let board; // This will hold the game board (a 2D array)
let score = 0; // Initial score is 0
let rows = 4; // The number of rows on the board
let columns = 4; // The number of columns on the board

let startX = 0; // Starting X coordinate (not currently used in the code)
let startY = 0; // Starting Y coordinate (not currently used in the code)

// Default existence states of tiles 2048, 4096, 8192 (not yet used, maybe for advanced game logic)
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// This function sets up the game board and initializes the tiles
function setGame() {
  // Initialize a 4x4 board with all values set to 0 (empty spaces)
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // Loop through each row and column to create the tiles on the screen
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // Create a new div element for each tile
      let tile = document.createElement("div");

      // Assign an ID to the tile based on its position in the grid (row and column)
      tile.id = r.toString() + "-" + c.toString();

      // Get the value of the tile from the board array
      let num = board[r][c];

      // Update the appearance of the tile with the number and style
      updateTile(tile, num);

      // Add the tile to the board container in the HTML
      document.getElementById("board").append(tile);
    }
  }

  // Call setTwo() to add two random tiles to the board at the start
  setTwo();
  setTwo();
}

// This function updates the looks and style of a tile
function updateTile(tile, num) {
  // Reset tile content and classes
  tile.innerText = "";
  tile.classList.value = "";

  // Add the basic class for the tile
  tile.classList.add("tile");

  // If the number on the tile is greater than 0, display the number and style the tile
  if (num > 0) {
    tile.innerText = num.toString();

    // Style the tile based on the number (e.g., different colors for different numbers)
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

// This function runs when the page is loaded and starts the game
window.onload = function () {
  setGame();
};

// This function shows a modal with a message (e.g., "Game Over!")
function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.innerText = message; // Set the message text
  modal.style.display = "flex"; // Show the modal

  // Close the modal when the close button is clicked
  const closeBtn = document.getElementById("close-btn");
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal if the user clicks outside the modal content
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// This function handles the arrow key presses to slide tiles in different directions
function handleSlide(e) {
  // Prevent the default action (e.g., scrolling)
  e.preventDefault();

  // Check if the key pressed is one of the arrow keys
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
    if (e.code == "ArrowLeft") {
      slideLeft();
      setTwo();
    } else if (e.code == "ArrowRight") {
      slideRight();
      setTwo();
    } else if (e.code == "ArrowUp") {
      slideUp();
      setTwo();
    } else if (e.code == "ArrowDown") {
      slideDown();
      setTwo();
    }
  }

  // Update the score on the screen
  document.getElementById("score").innerText = score;

  // Check if the player has lost or won after a short delay
  setTimeout(() => {
    if (hasLost()) {
      showModal("Game Over! You have lost the game. Game will restart.");
      restartGame(); // Restart the game if lost
    } else {
      checkWin(); // Check if the player has won the game
    }
  }, 100); // Delay of 100 milliseconds before checking
}

// Listen for the keydown event (when the player presses a key)
document.addEventListener("keydown", handleSlide);

// This function filters out zeroes from an array (e.g., [0,2,0,2] becomes [2, 2])
function filterZero(tiles) {
  return tiles.filter((num) => num != 0);
}

// This function slides the tiles to the left and merges tiles if possible
function slide(tiles) {
  // Remove zeroes from the array (empty spaces)
  tiles = filterZero(tiles);

  // Merge tiles if two adjacent tiles have the same value
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] == tiles[i + 1]) {
      tiles[i] *= 2; // Double the value of the first tile
      tiles[i + 1] = 0; // Set the second tile to 0 (empty space)
      score += tiles[i]; // Add the merged value to the score
    }
  }

  // Remove zeroes again after merging
  tiles = filterZero(tiles);

  // Add empty spaces (zeroes) to the end of the array to fill the row
  while (tiles.length < columns) {
    tiles.push(0);
  }

  return tiles; // Return the updated row of tiles
}

// Slide tiles to the left
function slideLeft() {
  // Loop through each row
  for (let r = 0; r < rows; r++) {
    let row = board[r]; // Get the current row
    let originalRow = row.slice(); // Make a copy of the original row

    // Call the slide function to slide and merge tiles in the row
    row = slide(row);

    // Update the board with the new row after the slide
    board[r] = row;

    // Loop through each column in the row to update the tiles on the screen
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString()); // Get the tile element
      let num = board[r][c]; // Get the number of the tile in this position

      // Apply animation only if the tile has moved (i.e., its value has changed)
      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-left 0.3s ease"; // Add animation to the tile
        setTimeout(() => {
          tile.style.animation = ""; // Remove animation after 0.3 seconds
        }, 300);
      }

      // Update the appearance of the tile
      updateTile(tile, num);
    }
  }
}

// Slide tiles to the right
function slideRight() {
  // Loop through each row
  for (let r = 0; r < rows; r++) {
    let row = board[r].slice().reverse(); // Reverse the row to treat it like sliding to the left
    let originalRow = row.slice(); // Make a copy of the original row

    // Call the slide function to slide and merge tiles in the row
    row = slide(row);
    row.reverse(); // Reverse the row back to its original order

    // Update the board with the new row after the slide
    board[r] = row;

    // Loop through each column in the row to update the tiles on the screen
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString()); // Get the tile element
      let num = board[r][c]; // Get the number of the tile in this position

      // Apply animation only if the tile has moved (i.e., its value has changed)
      if (originalRow[columns - 1 - c] !== num && num !== 0) {
        tile.style.animation = "slide-right 0.3s ease"; // Add animation to the tile
        setTimeout(() => {
          tile.style.animation = ""; // Remove animation after 0.3 seconds
        }, 300);
      }

      // Update the appearance of the tile
      updateTile(tile, num);
    }
  }
}

// Slide tiles upwards
function slideUp() {
  // Loop through each column
  for (let c = 0; c < columns; c++) {
    let col = []; // Initialize an empty array for the column
    // Collect the column values from the board
    for (let r = 0; r < rows; r++) col.push(board[r][c]);

    let originalCol = col.slice(); // Make a copy of the original column

    // Call the slide function to slide and merge tiles in the column
    col = slide(col);

    // Loop through each row in the column and update the board
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r]; // Update the value in the board

      let tile = document.getElementById(r.toString() + "-" + c.toString()); // Get the tile element
      let num = board[r][c]; // Get the number of the tile in this position

      // Apply animation only if the tile has moved (i.e., its value has changed)
      if (originalCol[r] !== num && num !== 0) {
        tile.style.animation = "slide-up 0.3s ease"; // Add animation to the tile
        setTimeout(() => {
          tile.style.animation = ""; // Remove animation after 0.3 seconds
        }, 300);
      }

      // Update the appearance of the tile
      updateTile(tile, num);
    }
  }
}

// Slide tiles downwards
function slideDown() {
  // Loop through each column
  for (let c = 0; c < columns; c++) {
    let col = []; // Initialize an empty array for the column
    // Collect the column values from the board
    for (let r = 0; r < rows; r++) col.push(board[r][c]);

    col.reverse(); // Reverse the column to treat it like sliding up
    let originalCol = col.slice(); // Make a copy of the original column

    // Call the slide function to slide and merge tiles in the column
    col = slide(col);
    col.reverse(); // Reverse the column back to its original order

    // Loop through each row in the column and update the board
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r]; // Update the value in the board

      let tile = document.getElementById(r.toString() + "-" + c.toString()); // Get the tile element
      let num = board[r][c]; // Get the number of the tile in this position

      // Apply animation only if the tile has moved (i.e., its value has changed)
      if (originalCol[rows - 1 - r] !== num && num !== 0) {
        tile.style.animation = "slide-down 0.3s ease"; // Add animation to the tile
        setTimeout(() => {
          tile.style.animation = ""; // Remove animation after 0.3 seconds
        }, 300);
      }

      // Update the appearance of the tile
      updateTile(tile, num);
    }
  }
}

// Function to check if there is an empty tile (represented by 0) on the board
function hasEmptyTile() {
  // Loop through each row
  for (let r = 0; r < rows; r++) {
    // Loop through each column in the row
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        // If an empty tile (0) is found, return true
        return true;
      }
    }
  }
  return false; // If no empty tile is found, return false
}

// Function to set a '2' tile on the board at a random empty position
function setTwo() {
  // If there are no empty tiles, we don't need to add a new tile
  if (hasEmptyTile() == false) {
    return; // Exit the function if no empty space is available
  }

  let found = false;

  // Keep trying until a valid position for the '2' tile is found
  while (!found) {
    // Randomly choose a row and column
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    // If the chosen position is empty (contains a '0')
    if (board[r][c] == 0) {
      // Set a '2' in that position
      board[r][c] = 2;

      // Update the display of the new tile
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");

      found = true; // Mark that the tile has been placed
    }
  }
}

// Function to check if the player has won the game
function checkWin() {
  // Loop through each row and column
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // Check if a tile with the value 2048 is found, and display a win message
      if (board[r][c] == 2048 && !is2048Exist) {
        showModal("You Win! You got the 2048!");
        is2048Exist = true; // Mark that 2048 has been achieved
      }
      // Check if a tile with the value 4096 is found, and display a special win message
      else if (board[r][c] == 4096 && is4096Exist == false) {
        showModal("You are unstoppable at 4096! Fantastic!");
        is4096Exist = true; // Mark that 4096 has been achieved
      }
      // Check if a tile with the value 8192 is found, and display a victory message
      else if (board[r][c] == 8192 && is8192Exist == false) {
        showModal("Victory! You have reached 8192! Awesome!");
        is8192Exist = true; // Mark that 8192 has been achieved
      }
    }
  }
}

// Function to check if the player has lost the game
function hasLost() {
  // Loop through each row and column
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // If the board has an empty tile, the player hasn't lost yet
      if (board[r][c] == 0) {
        return false;
      }

      const currentTile = board[r][c];

      // Check if there are adjacent tiles that can be merged (left, right, up, or down)
      if (
        (r > 0 && currentTile === board[r - 1][c]) || // Check above
        (r < rows - 1 && currentTile === board[r + 1][c]) || // Check below
        (c > 0 && currentTile === board[r][c - 1]) || // Check left
        (c < columns - 1 && currentTile === board[r][c + 1]) // Check right
      ) {
        return false; // If any adjacent tiles are the same, the player can still move
      }
    }
  }

  // No empty tiles and no possible moves left, meaning the player has lost
  return true;
}

// Function to restart the game
function restartGame() {
  // Reset the board to an empty state (all zeros)
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0; // Reset the score to zero
  setTwo(); // Place the first '2' tile

  // Optionally clear the board and reset the game (uncomment if needed)
  // document.getElementById('board').innerHTML = '';
  // setGame(); // Call the setGame function to set up a new game
}

// Event listener for touchstart, triggered when the user starts touching the screen
document.addEventListener("touchstart", (e) => {
  // Store the initial touch coordinates when the user touches the screen
  startX = e.touches[0].clientX; // X-coordinate of the touch start position
  startY = e.touches[0].clientY; // Y-coordinate of the touch start position
});

// Event listener for touchend, triggered when the user releases their touch on the screen
document.addEventListener("touchend", (e) => {
  // Get the element that was touched
  const target = e.target;

  // Exit if the touched element is not a tile (element with the "tile" class)
  if (!target.className.includes("tile")) {
    return; // Stop execution if the target is not a tile
  }

  // Calculate the difference in X and Y coordinates between the start and end of the touch
  let diffX = startX - e.changedTouches[0].clientX;
  let diffY = startY - e.changedTouches[0].clientY;

  // Check if there was any movement
  if (diffX !== 0 || diffY !== 0) {
    // Determine the direction of the swipe by comparing the differences in X and Y
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe (left or right)
      if (diffX > 0) {
        // If the difference in X is negative, the swipe was to the left
        slideLeft(); // Call the function to slide tiles to the left
        setTwo(); // Add a new "2" tile to the board
      } else {
        // If the difference in X is positive, the swipe was to the right
        slideRight(); // Call the function to slide tiles to the right
        setTwo(); // Add a new "2" tile to the board
      }
    } else {
      // Vertical swipe (up or down)
      if (diffY > 0) {
        // If the difference in Y is negative, the swipe was upwards
        slideUp(); // Call the function to slide tiles upwards
        setTwo(); // Add a new "2" tile to the board
      } else {
        // If the difference in Y is positive, the swipe was downwards
        slideDown(); // Call the function to slide tiles downwards
        setTwo(); // Add a new "2" tile to the board
      }
    }
  }
});

// Display the current score in the element with id "score"
document.getElementById("score").innerText = score;

// Use setTimeout to delay the game over or win check by 100ms
setTimeout(() => {
  // If the player has lost the game, show the game over message and restart the game
  if (hasLost()) {
    showModal("Game Over! You have lost the game. Game will restart.");
    restartGame(); // Restart the game by clearing the board
  } else {
    // If the player has not lost, check if they have won
    checkWin(); // Check if the player has achieved a winning tile (e.g., 2048)
  }
}, 100); // 100ms delay to ensure the game state is updated before checking

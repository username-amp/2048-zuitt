// console.log("Hello world");

// variables - stores a specific value / represents a specific value
// let - allows the values of our variables to be changeable
let board;
let score = 0;
let rows = 4;
let columns = 4;

// default existence states of tile 2048, 4096, 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// funtion to set the board game of the tile with the help of updateTile() function to set looks or display of the tiles.
function setGame() {
  // backend board
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // Creates a div element for tile/s
      let tile = document.createElement("div");
      //   <div> </div>
      //   We added an id to tile based on its seat position(row and column position)
      tile.id = r.toString() + "-" + c.toString();
      //   We retrieve the number of the tile from our backend board
      let num = board[r][c];
      updateTile(tile, num); //Calls the updateTile function //the tile element (div element) and the number inside the tile will be used to update the looks or display of  the tile
      document.getElementById("board").append(tile);
    }
  }
  setTwo();
  setTwo();
}

// responsible for the looks of the tile
function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";

  tile.classList.add("tile"); //   <div class="tile"> </div>
  if (num > 0) {
    tile.innerText = num.toString(); // display the number of the tile to the elemet
    if (num <= 4096) {
      tile.classList.add("x" + num.toString()); //   <div class="tile x"> </div>
    } else {
      tile.classList.add("x8192"); //   <div class="tile x"> </div>
    }
  }
}

window.onload = function () {
  setGame();
};

function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.innerText = message;
  modal.style.display = "flex";

  const closeBtn = document.getElementById("close-btn");
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close modal when clicking outside the content
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function handleSlide(e) {
  console.log(e.code);

  e.preventDefault();

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

  setTimeout(() => {
    if (hasLost()) {
      showModal("Game Over! You have lost the game. Game will restart.");
      restartGame();
    } else {
      checkWin();
    }
  }, 100); // delay time in milliseconds
}

document.addEventListener("keydown", handleSlide);

function filterZero(tiles) {
  return tiles.filter((num) => num != 0);
  // [0,2,0,2] -> [2, 2]
}

// default behavior of slide of function is merging tiles to the left
function slide(tiles) {
  // function slide([0,2,0,2])

  // slide function will use filterZero function
  tiles = filterZero(tiles); // [2, 2]

  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] == tiles[i + 1]) {
      // [2, 2]
      tiles[i] *= 2; // // [4, 2]
      tiles[i + 1] = 0; // [4, 0]
      score += tiles[i];
    }
  }
  tiles = filterZero(tiles); // [4]

  // loop (while loop) - repeats task
  while (tiles.length < columns) {
    tiles.push(0); // [4, 0, 0, 0]
  }
  return tiles; // [4, 0, 0, 0]
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = row.slice();

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      // Apply animation only if the tile moved
      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-left 0.3s ease";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r].slice().reverse();
    let originalRow = row.slice();

    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (originalRow[columns - 1 - c] !== num && num !== 0) {
        tile.style.animation = "slide-right 0.3s ease";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let col = [];
    for (let r = 0; r < rows; r++) col.push(board[r][c]);
    let originalCol = col.slice();

    col = slide(col);

    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (originalCol[r] !== num && num !== 0) {
        tile.style.animation = "slide-up 0.3s ease";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let col = [];
    for (let r = 0; r < rows; r++) col.push(board[r][c]);
    col.reverse();
    let originalCol = col.slice();

    col = slide(col);
    col.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (originalCol[rows - 1 - r] !== num && num !== 0) {
        tile.style.animation = "slide-down 0.3s ease";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }

      updateTile(tile, num);
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        // empty tile
        return true;
      }
    }
  }
  return false;

  /*board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 2],
  ];*/

  // board = [
  //     [2, 4, 2, 4],
  //     [4, 2, 4, 2],
  //     [2, 4, 2, 4],
  //     [4, 2, 4, 2]
  // ];
}

function setTwo() {
  // If it cannot find an empty tile ...
  if (hasEmptyTile() == false) {
    return; // no need to do anything (no need to generate a new tile)
  }

  let found = false;
  /*
    = - assigning value / collection of values
    == - comparing two values
    === - comparing two values but strict in data type
  */
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }
}

function checkWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 2048 && !is2048Exist) {
        showModal("You Win! You got the 2048!");
        is2048Exist = true;
      } else if (board[r][c] == 4096 && is4096Exist == false) {
        showModal("You are unstoppable at 4096! Fantastic!");
        is4096Exist = true;
      } else if (board[r][c] == 8192 && is8192Exist == false) {
        showModal("Victory! You have reached 8192! Awesome!");
        is8192Exist = true;
      }
    }
  }
}

function hasLost() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // if the board has an empty tile, false means, the user is not yet lost
      if (board[r][c] == 0) {
        return false;
      }

      const currentTile = board[r][c];

      // if the board has an same adjacent tile, false means, the user is not yet lost
      if (
        (r > 0 && currentTile === board[r - 1][c]) || // this will check it will has a match to the upper  adjacent tile
        // r < 3
        (r < rows - 1 && currentTile === board[r + 1][c]) || // this will check if it has a match  to the lower adjacent tile
        (c > 0 && currentTile === board[r][c - 1]) || // this will check if it has a match to the left adjacent tile
        (c < columns - 1 && currentTile === board[r][c + 1]) // this will check if it has a match to the right adjacent tile
      ) {
        return false;
      }
    }
    // No empty tiles, and no possible moves left, meaning true, the user hasLost
  }
  return true;
}

function restartGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  setTwo();

  // clear the board and remake
  // document.getElementById('board').innerHTML = '';
  // setGame();
}

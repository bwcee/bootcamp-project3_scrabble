/////////////////////////////////////////////////////////
// create board and tiles functions
/////////////////////////////////////////////////////////
/*-------------------------------------------------- 
create board
-----------------------------------------------------*/
const addSpecial = (arr) => {
  const boardSize = 14;

  const twCoords = { rows: [0, 7, 14], cols: [0, 7, 14] };
  twCoords.rows.forEach((row) => {
    twCoords.cols.forEach((col) => {
      arr[row][col].special = "tw";
    });
  });

  const tlCoordsA = { rows: [1, 13], col: 5 };
  tlCoordsA.rows.forEach((row) => {
    arr[row][tlCoordsA.col].special = "tl";
    arr[row][boardSize - tlCoordsA.col].special = "tl";
  });
  const tlCoordsB = { rows: [5, 9], cols: [1, 5] };
  tlCoordsB.rows.forEach((row) => {
    tlCoordsB.cols.forEach((col) => {
      arr[row][col].special = "tl";
      arr[row][boardSize - col].special = "tl";
    });
  });

  arr[7][3].special = "dl";
  arr[7][7].special = "st";
  arr[7][11].special = "dl";

  const dlCoordsA = { rows: [0, 14], col: 3 };
  dlCoordsA.rows.forEach((row) => {
    arr[row][dlCoordsA.col].special = "dl";
    arr[row][boardSize - dlCoordsA.col].special = "dl";
  });
  const dlCoordsB = { rows: [6, 8], cols: [2, 6] };
  dlCoordsB.rows.forEach((row) => {
    dlCoordsB.cols.forEach((col) => {
      arr[row][col].special = "dl";
      arr[row][boardSize - col].special = "dl";
    });
  });

  const dlCoordsC = { rows: [2, 3], col: 6 };
  dlCoordsC.rows.forEach((row, index) => {
    dlCoordsC.col += index;
    arr[row][dlCoordsC.col].special = "dl";
    arr[row][boardSize - dlCoordsC.col].special = "dl";
    arr[boardSize - row][dlCoordsC.col].special = "dl";
    arr[boardSize - row][boardSize - dlCoordsC.col].special = "dl";
    if (row == 3) {
      arr[row][0].special = "dl";
      arr[row][14].special = "dl";
      arr[boardSize - row][0].special = "dl";
      arr[boardSize - row][14].special = "dl";
    }
  });

  const dwCoords = { rows: [1, 2, 3, 4], col: 1 };
  let dwCol = 0;
  dwCoords.rows.forEach((row) => {
    dwCol += dwCoords.col;
    arr[row][dwCol].special = "dw";
    arr[row][boardSize - dwCol].special = "dw";
    arr[boardSize - row][dwCol].special = "dw";
    arr[boardSize - row][boardSize - dwCol].special = "dw";
  });

  return arr;
};

const buildBoard = () => {
  let board = [];
  for (let i = 0; i < 15; i += 1) {
    board.push([]);
    for (let j = 0; j < 15; j += 1) {
      board[i].push({ coord: `${j}_${i}` });
    }
  }
  board = addSpecial(board);
  return board;
};

/////////////////////////////////////////////////////////
// game ui layout
/////////////////////////////////////////////////////////
/*-------------------------------------------------- 
create skeletal frame to hold diff display elements 
-----------------------------------------------------*/
const createGameFrame = () => {
  /* create and hide letter swap modal */
  document
    .querySelector("body")
    .insertAdjacentHTML(
      "afterbegin",
      `<div id="modal" class="hide">` +
        `<div class="text-right text-muted"><a style="cursor: pointer">x</a></div>` +
        `<p>Please key in letters you want to swap.<br> No commas, spacing needed. <em>Enter</em> when done.</p>` +
        `<input type="text">` +
        `</div>`
    );
  /* create and hide word history modal */
  document
    .querySelector("body")
    .insertAdjacentHTML(
      "afterbegin",
      `<div id="definition" class="hide">` +
        `<div class="text-right text-muted"><a onclick="closeDefn()" style="cursor: pointer">x</a></div>` +
        `<p>This is the definition</p>` +
        `</div>`
    );
  /* create game display structure */
  document
    .getElementById("main")
    .insertAdjacentHTML(
      "afterbegin",
      '<div id="board_area"><div id="board"></div></div>' +
        '<div id="status_area"></div>' +
        '<div id="pHands_area">' +
        '<div id="p1Hand"></div>' +
        '<div id="p2Hand" class="hide"></div>' +
        '<div id="btns_area"></div>'
    );
};
/*-------------------------------------------------- 
create playing board
-----------------------------------------------------*/
const playBoard = buildBoard();

const createPlayBoard = (gameId) => {
  const token = localStorage.getItem("sessionToken");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  playBoard.forEach((row) => {
    row.forEach((square) => {
      if (!square.special) {
        document
          .getElementById("board")
          .insertAdjacentHTML(
            "beforeend",
            `<div class="square" id="${square.coord}"></div>`
          );
      } else {
        document
          .getElementById("board")
          .insertAdjacentHTML(
            "beforeend",
            `<div class="square ${square.special}" id="${square.coord}"></div>`
          );
      }
    });
  });

  /* make all board squares accept drag */
  const allSquares = document.querySelectorAll(".square");

  allSquares.forEach((s) => {
    s.addEventListener("dragover", (ev) => {
      ev.preventDefault();
    });
    s.addEventListener("drop", (ev) => {
      // need to check this to prevent tiles from being dropped into tiles
      if (!ev.target.innerHTML) {
        ev.preventDefault();
        const tile = document.getElementById(ev.dataTransfer.getData("text"));
        ev.target.append(tile);

        let pt = 0;
        if (tile.innerHTML[0] == "q" || tile.innerHTML[0] == "z") {
          pt = Number(tile.innerHTML.slice(6, 8));
        } else {
          pt = Number(tile.innerHTML[6]);
        }

        let wordObj = {
          tileId: tile.id,
          tileLtr: tile.innerHTML[0],
          tilePt: pt,
          squareId: ev.target.id,
          squareSpecial: ev.target.classList[1],
        };

        try {
          /* get variables from db */
          axios.get(`/game/get_game/${gameId}`, auth).then((gameState) => {
            // chk tt tile not alr in boardLetters, remove old posn of tile if so
            const foundBoard = gameState.data.boardLetters.findIndex(
              (el) => el.tileId == tile.id
            );
            foundBoard >= 0
              ? gameState.data.boardLetters.splice(foundBoard, 1)
              : "";
            gameState.data.boardLetters.push(wordObj);
            // chk tt tile not alr in currentWord, remove old posn of tile if so
            const foundCurrWord = gameState.data.currentWord.findIndex(
              (el) => el.tileId == tile.id
            );
            foundCurrWord >= 0
              ? gameState.data.currentWord.splice(foundCurrWord, 1)
              : "";
            gameState.data.currentWord.push(wordObj);
            // remove tiles from playerHands
            if (gameState.data.turn === "player1") {
              const foundHandTile = gameState.data.p1Hand.findIndex(
                (el) => el.id == tile.id
              );
              gameState.data.p1Hand.splice(foundHandTile, 1);
            } else {
              const foundHandTile = gameState.data.p2Hand.findIndex(
                (el) => el.id == tile.id
              );
              gameState.data.p2Hand.splice(foundHandTile, 1);
            }
            /* push updated variables back to db */
            const data = {
              bl: gameState.data.boardLetters,
              cw: gameState.data.currentWord,
              p1Hand: gameState.data.p1Hand,
              p2Hand: gameState.data.p2Hand,
            };
            axios.put(`/game/update_board/${gameId}`, data, auth);
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  });
};

/*--------------------------------------------------
player tiles display
-----------------------------------------------------*/
const rackSize = 7;
const createRackTables = () => {
  document
    .getElementById("p1Hand")
    .insertAdjacentHTML("afterbegin", '<table><tr id="p1_rack"></tr></table>');
  document
    .getElementById("p2Hand")
    .insertAdjacentHTML("afterbegin", '<table><tr id="p2_rack"></tr></table>');
};
/* create player racks for the first time  */
const createRack = (hand, rackId, handId, gameId) => {
  const token = localStorage.getItem("sessionToken");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const tileClass = rackId.slice(0, 2);
  hand.forEach((tile) => {
    document
      .getElementById(rackId)
      .insertAdjacentHTML(
        "afterbegin",
        `<td class="cell"><div class="tile ${tileClass}" id="${tile.id}" draggable="true">${tile.tile}<sup>${tile.pt}</sup></div></td>`
      );

    addDrag(tile.id);
  });
  const cells = document.getElementById(rackId).getElementsByTagName("td");
  for (let i = 0; i < rackSize; i += 1) {
    cells[i].addEventListener("dragover", (ev) => {
      ev.preventDefault();
    });
    cells[i].addEventListener("drop", (ev) => {
      // need to check this to prevent tiles from being dropped into tiles
      if (!ev.target.innerHTML) {
        ev.preventDefault();
        const tile = document.getElementById(ev.dataTransfer.getData("text"));
        ev.target.append(tile);

        try {
          /* get variables from db */
          axios.get(`/game/get_game/${gameId}`, auth).then((gameState) => {
            // remove tile from boardLetters
            const boardLetterToRemove = gameState.data.boardLetters.findIndex(
              (el) => el.tileId == tile.id
            );
            gameState.data.boardLetters.splice(boardLetterToRemove, 1);
            // remove tile from currentWord
            const currWordLtrToRemove = gameState.data.currentWord.findIndex(
              (el) => el.tileId == tile.id
            );
            const removedLetter = gameState.data.currentWord.splice(
              currWordLtrToRemove,
              1
            );
            // put tiles back into playerHands
            gameState.data[handId].push({
              tile: removedLetter[0].tileLtr,
              pt: removedLetter[0].tilePt,
              id: removedLetter[0].tileId,
            });
            /* push updated variables back to db */
            const data = {
              bl: gameState.data.boardLetters,
              cw: gameState.data.currentWord,
              hand: gameState.data[handId],
              player: handId,
            };
            axios.put(`/game/update_rack/${gameId}`, data, auth);
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  }
};


/* make the tile divs draggable */
const addDrag = (tile) => {
  document.getElementById(tile).addEventListener("dragstart", (ev) => {
    ev.stopPropagation();
    ev.dataTransfer.setData("text/plain", ev.target.id);
  });
};

/*--------------------------------------------------
game play buttons
-----------------------------------------------------*/
/* append buttons */
const createButtons = () => {
  document
    .getElementById("btns_area")
    .insertAdjacentHTML(
      "afterbegin",
      `<button class="btn btn-success btn-sm mx-1" id="play_btn">Play</button>` +
        `<button class="btn btn-warning btn-sm mx-1" id="pass_btn">Pass</button>` +
        `<button class="btn btn-warning btn-sm mx-1" id="clear_btn">Clear</button>` +
        `<button class="btn btn-warning btn-sm mx-1" id="swap_btn">Swap</button>` +
        `<button class="btn btn-danger btn-sm mx-1" id="logout_btn">Log Out</button>`
    );
};

/*-------------------------------------------------- 
game status display area
-----------------------------------------------------*/
const createStatusArea = (p1Name, p2Name) => {
  document
    .getElementById("status_area")
    .insertAdjacentHTML(
      "afterbegin",
      `<div id="history"><strong>Word History</strong></div>` +
        `<table>` +
        `<tr ><td>P1: ${p1Name}'s word score:<td><td id="p1WordScore">0<td></tr>` +
        `<tr class="player_score font-weight-bold"><td>P1: ${p1Name}'s total score:<td><td id="p1TotalScore">0<td></tr>` +
        `<tr ><td>P2: ${p2Name}'s word score:<td><td id="p2WordScore">0<td></tr>` +
        `<tr class="player_score font-weight-bold"><td>P2: ${p2Name}'s total score:<td><td id="p2TotalScore">0<td></tr>` +
        `<tr class="font-weight-bold"><td>Tiles left:<td><td id="tilesLeft">98<td></tr>` +
        `</table>`
    );
};



/*-------------------------------------------------- 
play btn functionality
-----------------------------------------------------*/
/* 
chk tt words are either in a row or col + chk tt words are in a dictionary + add up score + clear currentWord + top up tiles + remove draggable="true" from board tiles??
*/
const play = () => {
  /* chk at least one tile placed on board*/
  if (currentWord.length === 0) {
    return alert("Ey must place at least one letter lei!");
  }

  /* always chks to make sure center is covered */
  if (!document.getElementById("7_7").innerHTML) {
    return alert("The first word must use the center square!");
  }

  /* if > 1 letter placed, chk for legit word placement*/
  if (currentWord.length > 1) {
    const legal = chkLegitPlacement();

    if (!legal) {
      return alert("Eh illegal letters placement, pls try  again");
    } else if (legal == "row_placement") {
      let minX = Number(currentWord[0].squareId.split("_")[0]);
      let maxX = Number(
        currentWord[currentWord.length - 1].squareId.split("_")[0]
      );
      let yCoord = Number(currentWord[0].squareId.split("_")[1]);
      addRowLetters(minX, maxX, yCoord);
    } else {
      let minY = Number(currentWord[0].squareId.split("_")[1]);
      let maxY = Number(
        currentWord[currentWord.length - 1].squareId.split("_")[1]
      );
      let xCoord = Number(currentWord[0].squareId.split("_")[0]);
      addColLetters(minY, maxY, xCoord);
    }
  }

  if (currentWord.length == 1) {
    let x = Number(currentWord[0].squareId.split("_")[0]);
    let y = Number(currentWord[0].squareId.split("_")[1]);
    addRowLetters(x, x, y);
    addColLetters(y, y, x);
    if (currentWord.length == 1) {
      return alert(
        "Eh your single letter is not connected to any other letters lei"
      );
    }
  }

  /* by this point, currentWord should be completely formed, so can check dictionary */
  let wordPlayed = "";
  currentWord.forEach((wordObj) => {
    wordPlayed += wordObj.tileLtr;
  });

  if (wordPlayed in dict === false) {
    return alert("Eh word not in dictionary leh");
  }

  document
    .getElementById("history")
    .insertAdjacentHTML(
      "beforeend",
      `<div><p style="display: inline;"class="mb-1">${wordPlayed}</p><span>....<i style="cursor: pointer" onclick="dispDefn('${wordPlayed}')" class="far fa-comment-dots"></i></span></div>`
    );

  let score = getScore();
  if (turn === "player1") {
    document.getElementById("p1WordScore").innerHTML = score;
  } else {
    document.getElementById("p2WordScore").innerHTML = score;
  }

  /* go about resetting stuff */
  if (turn === "player1") {
    hand = p1Hand;
    rack = "p1_rack";
    p1Score += score;
    turn = "player2";
  } else {
    hand = p2Hand;
    rack = "p2_rack";
    p2Score += score;
    turn = "player1";
  }

  document.getElementById("p1Hand").classList.toggle("hide");
  document.getElementById("p2Hand").classList.toggle("hide");

  deal(hand);
  topUpRack(hand, rack);

  /* remove draggable from tiles placed on board once confirmed */
  let tileClass = "tile" + rack.slice(0, 2);
  currentWord.forEach((wordObj) => {
    const tile = document.getElementById(wordObj.tileId);
    tile.classList.add(tileClass);
    tile.removeAttribute("draggable");
  });

  /* reset currentWord */
  currentWord = [];

  updateStatus();
};

const chkLegitPlacement = () => {
  /* if all y coords are the same, then letters placed in a row */
  const isRowPlacement = currentWord.every((wordObj) => {
    return (
      wordObj.squareId.split("_")[1] == currentWord[0].squareId.split("_")[1]
    );
  });

  /* if all x coords are the same, then letters placed in a col */
  const isColPlacement = currentWord.every((wordObj) => {
    return (
      wordObj.squareId.split("_")[0] == currentWord[0].squareId.split("_")[0]
    );
  });

  /* if neither placed in row or col => illegal placement */
  if (!isRowPlacement && !isColPlacement) {
    return false;
  }

  /* if placed in row, chk for legit row placement */
  if (isRowPlacement) {
    /* since letters placed in row, sort letters by x */
    currentWord.sort((a, b) => {
      return (
        Number(a.squareId.split("_")[0]) - Number(b.squareId.split("_")[0])
      );
    });

    /* run through x coords to make sure no gaps */
    currentWord.forEach((wordObj, index) => {
      if (index !== 0) {
        let currX = Number(wordObj.squareId.split("_")[0]);
        let prevX = Number(currentWord[index - 1].squareId.split("_")[0]);

        if (currX - prevX > 1) {
          let diff = currX - prevX;
          let yCoord = wordObj.squareId.split("_")[1];
          for (let i = 1; i < diff; i += 1) {
            let coord = `${prevX + i}_${yCoord}`;
            const ltrOnBoard = boardLetters.find((el) => el.squareId == coord);
            if (!ltrOnBoard) {
              return false;
            } else {
              currentWord.splice(index - 1 + i, 0, ltrOnBoard);
            }
          }
        }
      }
    });
    return "row_placement";
  }

  /* if placed in col, chk for legit col placement */
  if (isColPlacement) {
    /* since letters placed in col, sort letters by y */
    currentWord.sort((a, b) => {
      return (
        Number(a.squareId.split("_")[1]) - Number(b.squareId.split("_")[1])
      );
    });

    /* run through y coords to make sure no gaps */
    currentWord.forEach((wordObj, index) => {
      if (index !== 0) {
        let currY = Number(wordObj.squareId.split("_")[1]);
        let prevY = Number(currentWord[index - 1].squareId.split("_")[1]);

        if (currY - prevY > 1) {
          let diff = currY - prevY;
          let xCoord = wordObj.squareId.split("_")[0];
          for (let i = 1; i < diff; i += 1) {
            let coord = `${xCoord}_${prevY + i}`;
            const ltrOnBoard = boardLetters.find((el) => el.squareId == coord);
            if (!ltrOnBoard) {
              return false;
            } else {
              currentWord.splice(index - 1 + i, 0, ltrOnBoard);
            }
          }
        }
      }
    });
    return "column_placement";
  }
};

const addRowLetters = (minX, maxX, yCoord) => {
  while (boardLetters.find((el) => el.squareId == `${minX - 1}_${yCoord}`)) {
    currentWord.unshift(
      boardLetters.find((el) => el.squareId == `${minX - 1}_${yCoord}`)
    );
    minX -= 1;
  }
  while (boardLetters.find((el) => el.squareId == `${maxX + 1}_${yCoord}`)) {
    currentWord.push(
      boardLetters.find((el) => el.squareId == `${maxX + 1}_${yCoord}`)
    );
    maxX += 1;
  }
};

const addColLetters = (minY, maxY, xCoord) => {
  while (boardLetters.find((el) => el.squareId == `${xCoord}_${minY - 1}`)) {
    currentWord.unshift(
      boardLetters.find((el) => el.squareId == `${xCoord}_${minY - 1}`)
    );
    minY -= 1;
  }
  while (boardLetters.find((el) => el.squareId == `${xCoord}_${maxY + 1}`)) {
    currentWord.push(
      boardLetters.find((el) => el.squareId == `${xCoord}_${maxY + 1}`)
    );
    maxY += 1;
  }
};

const getScore = () => {
  // get base score first
  let score = currentWord.reduce((pv, cv) => {
    return pv + cv.tilePt;
  }, 0);
  // run thru all the letters in currentWord and add pts accordingly
  currentWord.forEach((wordObj) => {
    if (wordObj.squareSpecial === "tw") {
      score = score * 3;
    } else if (
      wordObj.squareSpecial === "st" ||
      wordObj.squareSpecial === "dw"
    ) {
      score = score * 2;
    } else if (wordObj.squareSpecial === "tl") {
      score = score + wordObj.tilePt * 2;
    } else if (wordObj.squareSpecial === "dl") {
      score = score + wordObj.tilePt;
    }
  });
  console.log("Points from currentWord is", score);
  return score;
};

/*-------------------------------------------------- 
pass btn functionality
-----------------------------------------------------*/
const pass = () => {
  if (turn === "player1") {
    turn = "player2";
  } else {
    turn = "player1";
  }

  document.getElementById("p1Hand").classList.toggle("hide");
  document.getElementById("p2Hand").classList.toggle("hide");
};

/*-------------------------------------------------- 
clear btn functionality
-----------------------------------------------------*/
const clear = () => {
  if (turn === "player1") {
    hand = p1Hand;
    rack = "p1_rack";
  } else {
    hand = p2Hand;
    rack = "p2_rack";
  }

  currentWord.forEach((wordObj) => {
    hand.push({
      tile: wordObj.tileLtr,
      pt: wordObj.tilePt,
      id: wordObj.tileId,
    });
    const boardLetterToRemove = boardLetters.findIndex(
      (el) => el.tileId == wordObj.tileId
    );
    boardLetters.splice(boardLetterToRemove, 1);
    document.getElementById(wordObj.squareId).innerHTML = "";
  });

  topUpRack(hand, rack);

  currentWord = [];
  console.log(
    "boardletter after clearing",
    boardLetters,
    "currentWord after clearing",
    currentWord
  );
};

/*-------------------------------------------------- 
swap btn functionality
-----------------------------------------------------*/
const swap = () => {
  document.getElementById("modal").classList.toggle("hide");
};

const doSwap = (hand, rack, letter) => {
  const foundHandTile = hand.findIndex((el) => el.tile === letter);
  if (foundHandTile > 0) {
    gameTiles.push(hand[foundHandTile]);
    hand.splice(foundHandTile, 1);
    hand.push(gameTiles.shift());
    shuffleTiles(gameTiles);
  }
  topUpRack(hand, rack);
};

/*-------------------------------------------------- 
append functions to buttons
-----------------------------------------------------*/
document.getElementById("play_btn").addEventListener("click", play);
document.getElementById("pass_btn").addEventListener("click", pass);
document.getElementById("clear_btn").addEventListener("click", clear);
document.getElementById("swap_btn").addEventListener("click", swap);
/* add eventlistener to x in swap modal to close the  modal */
document.querySelector("#modal a").addEventListener("click", () => {
  document.getElementById("modal").classList.toggle("hide");
});
/* add keydown listener to modal input box */
document.querySelector("#modal input").addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") {
    const swapLtrs = document.querySelector("#modal input").value;
    if (swapLtrs.length == 0) {
      return alert("You did not key in any letters!");
    } else {
      if (turn === "player1") {
        hand = p1Hand;
        rack = "p1_rack";
      } else {
        hand = p2Hand;
        rack = "p2_rack";
      }
      for (let i = 0; i < swapLtrs.length; i += 1) {
        doSwap(hand, rack, swapLtrs[i]);
      }
      document.getElementById("modal").classList.toggle("hide");
      document.querySelector("#modal input").value = "";
    }
  }
});

/* definition modal functions */
const dispDefn = (word) => {
  document.getElementById("definition").classList.toggle("hide")
  const upperWord = word.toUpperCase()
  const defn = dict[word]
  document.querySelector("#definition p").innerHTML= `<p class="mb-1"><strong>${upperWord} Definition</strong></p><p>${defn}</p>`
};

const closeDefn =()=>{
  document.getElementById("definition").classList.toggle("hide")
}




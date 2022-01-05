//////////////////////////////////////////////////////////
// starting up ui
//////////////////////////////////////////////////////////
/* create the initial sign-in page */
document
  .getElementById("main")
  .insertAdjacentHTML(
    "afterbegin",
    '<div id="signInDiv" class="form-row d-flex justify-content-center">' +
      '<div id="emailGrp" class="form-group col-md-6">' +
      '<label for="email">Email: </label>' +
      '<input type="email" id="email" name="email" class="form-control" placeholder="prease input email good person" required=true>' +
      "</div>" +
      '<div id="passGrp" class="form-group col-md-6">' +
      '<label for="password">Password: </label>' +
      '<input type="password" id="password" name="password" class="form-control" placeholder="prease input password good person" required=true>' +
      "</div>" +
      '<div id="btnGrp" class="form-group col-md-12 text-center">' +
      '<input type="submit" id="signInBtn" class="btn btn-success mt-2" value="Let me in!!">' +
      '<button id="signUpBtn" class="btn btn-success mt-2 mx-3">Sign me up!!</button>' +
      "</div>" +
      "</div>"
  );

/* 
1. create select existing or start new game div after sign-in
2. div starts out w .hide
 */
document
  .getElementById("main")
  .insertAdjacentHTML(
    "beforeend",
    '<div id="selectGameDiv" class="hide text-center">' +
      '<button id="newGameBtn" class="btn btn-success d-sm-block">Hit me with a new game!!</button>' +
      '<button id="logOutBtn" class="btn btn-danger mt-3">Log me out!!</button>' +
      "</div>"
  );

//////////////////////////////////////////////////////////
// signin and selecting game functions
//////////////////////////////////////////////////////////
/* sign in btn functionality */
document.getElementById("signInBtn").addEventListener("click", async () => {
  let signInCred = {};
  signInCred.email = document.getElementById("email").value;
  signInCred.password = document.getElementById("password").value;
  try {
    const result = await axios.post("/", signInCred);
    /* result is in e form of a http response... watever was sent bck from bckend will be data key's value */
    if (!result.data) {
      alert("eh salah inputs la");
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    } else {
      const token = result.data;

      localStorage.setItem("sessionToken", token);

      document.getElementById("signInDiv").remove();
      // get hold of any previous games... alr logged in at this point...

      const records = await axios.get("/game/get_records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("This is records", records);
      if (!records.data.length) {
        //result.data is an empty array if there are no results
        document
          .getElementById("selectGameDiv")
          .insertAdjacentHTML(
            "afterbegin",
            "<p>You do not have any other games for now, please start new game</p>"
          );
      } else {
        console.log("This is games_users query result", records.data);
        document
          .getElementById("selectGameDiv")
          .insertAdjacentHTML(
            "afterbegin",
            "<p>Time to figure out how to show existing games and get them</p>"
          );
      }

      document.getElementById("selectGameDiv").classList.toggle("hide");
    }
  } catch (err) {
    console.log(err);
  }
});

/* log out btn functionality */
logOutBtn.addEventListener("click", () => {
  try {
    localStorage.removeItem("sessionToken");
    window.location = "/";
  } catch (err) {
    console.log(err);
  }
});

/* new game btn functionality */
document.getElementById("newGameBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("sessionToken");
  document.getElementById("selectGameDiv").remove();
  createGameFrame();
  createPlayBoard();
  createStatusArea();
  createRackTables();
  createButtons();
  try {
    const game = await axios.post(
      "/game/new_record",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("This is result from post", game);
    /* can only build rack after i get results from game */
    createRack(game.data.p1Hand, "p1_rack", "p1Hand",game.data.id);
    createRack(game.data.p2Hand, "p2_rack", "p2Hand",game.data.id);
  } catch (err) {
    console.log(err);
  }

  // gameAreaDiv.classList.remove("hidden");
  // gameBtnsDiv.append(logOutBtn);
  // try {
  //   const result = await axios.post("/game/new_record");
  //   console.log("This is result from creating new record", result);
  //   document.querySelector("#currentGameId").innerHTML = `${result.data.id}`;
  //   document.querySelector(
  //     "#p1stats"
  //   ).innerHTML = `${result.data.currPlayerEmail}'s score is `;
  //   document.querySelector(
  //     "#p1score"
  //   ).innerHTML = `${result.data.gameState.p1Score}`;
  //   document.querySelector(
  //     "#p2stats"
  //   ).innerHTML = `${result.data.oppoPlayerEmail}'s score is `;
  //   document.querySelector(
  //     "#p2score"
  //   ).innerHTML = `${result.data.gameState.p2Score}`;
  // } catch (err) {
  //   console.log(err);
  // }
});

/* 

//////////////////////////////////////////////////////////
// game layout
//////////////////////////////////////////////////////////
// div to hold all game play elements
const gameAreaDiv = document.createElement("div");
gameAreaDiv.classList.add("container", "mt-3", "hidden");
$("#main").append(gameAreaDiv);

// div to hold game play controls
const gameBtnsDiv = document.createElement("div");
gameBtnsDiv.classList.add("container", "text-center");
gameAreaDiv.append(gameBtnsDiv);

// deal and refresh buttons
gameBtnsDiv.insertAdjacentHTML(
  "afterbegin",
  '<button onclick="deal()" class="btn btn-primary mt-3 mr-2">Deal</button><button class="btn btn-primary mt-3 ml-2 mr-4">Refresh</button>'
);

// div to hold text display
const gameTextDiv = document.createElement("div");
gameTextDiv.classList.add("container", "text-center");
gameAreaDiv.append(gameTextDiv);

// text to display
// currentGameId para used to hold gameState id so can use it when dealing cards
gameTextDiv.insertAdjacentHTML(
  "afterbegin",
  '<p id="currentGameId" class="hidden"></p><p id="p1stats"></p><p id="p1score"></p><p id="p2stats"></p><p id="p2score"></p><div id="p1Cards" class="d-inline">This holds p1 cards</div><div id="p2Cards" class="d-inline">This holds p2 cards</div>'
);



// card display function
const createCard = (cardInfo) => {
  const suit = document.createElement("div");
  suit.innerText = cardInfo.suitPic;

  const name = document.createElement("div");
  name.innerText = cardInfo.name;

  const card = document.createElement("div");
  card.classList.add(cardInfo.colour);

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

// dealBtn functionality
const deal = async () => {
  try {
    // at this pt, haf access to game_id cos stored it in #currentGameId earlier
    const currentGameId = document.querySelector("#currentGameId").innerText;
    console.log("This is gameId from front end", currentGameId);
    const result = await axios.put("/game/deal", {
      gameId: `${currentGameId}`,
    });
    console.log("This is dealing result ", result);
    const resultDataObj = result.data[1][0];
    console.log("This is dealing result data", resultDataObj);
    document.querySelector(
      "#p1score"
    ).innerHTML = `${resultDataObj.gameState.p1Score}`;
    document.querySelector(
      "#p2score"
    ).innerHTML = `${resultDataObj.gameState.p2Score}`;

    // clear card holding divs first
    document.querySelector("#p1Cards").innerHTML = "";
    document.querySelector("#p2Cards").innerHTML = "";

    // append current round cards to card holding divs
    document.querySelector("#p1Cards").append(createCard(resultDataObj.p1Hand));
    document.querySelector("#p2Cards").append(createCard(resultDataObj.p2Hand));
  } catch (err) {
    console.log(err);
  }
};
 */

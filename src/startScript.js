//////////////////////////////////////////////////////////
// starting page w sign-in and sign-up
//////////////////////////////////////////////////////////
// div w starting elements of sign-in and sign-up buttons
const startDiv = document.createElement("div");
startDiv.classList.add("form-row", "d-flex", "justify-content-center");
$("#main").append(startDiv);

// email form group
const emailGrp = document.createElement("div");
emailGrp.classList.add("form-group", "col-md-6");

emailGrp.insertAdjacentHTML(
  "afterbegin",
  '<label for="email">Email: </label> <input type="email" id="email" name="email" class="form-control" placeholder="prease input email good person" required=true>'
);

// password form group
const passGrp = document.createElement("div");
passGrp.classList.add("form-group", "col-md-6");

passGrp.insertAdjacentHTML(
  "afterbegin",
  '<label for="password">Password: </label> <input type="password" id="password" name="password" class="form-control" placeholder="prease input password good person" required=true>'
);

// buttons form group
const btnGrp = document.createElement("div");
btnGrp.classList.add("form-group", "col-md-12", "text-center");

btnGrp.insertAdjacentHTML(
  "afterbegin",
  '<input type="submit" id="signinBtn" class="btn btn-success mt-2" value="Let me in!!"> <button id="signupBtn" class="btn btn-success mt-2 mx-3">Sign me up!!</button>'
);

// append form groups to startDiv
const elToAppendList = [emailGrp, passGrp, btnGrp];

elToAppendList.forEach((el) => {
  startDiv.append(el);
});

//////////////////////////////////////////////////////////
// select/create new game
//////////////////////////////////////////////////////////
// create holding div
const chooseGameDiv = document.createElement("div");
chooseGameDiv.classList.add("hidden", "text-center");
$("#main").append(chooseGameDiv);

// create and append new game button
const newGameBtn = document.createElement("button");
newGameBtn.innerText = "Hit me with a new game!!";
newGameBtn.classList.add("btn", "btn-success", "d-sm-block");
chooseGameDiv.append(newGameBtn);

// logout button
const logOutBtn = document.createElement("button");
logOutBtn.innerText = "Log me out!!";
logOutBtn.classList.add("btn", "btn-danger", "mt-3");
chooseGameDiv.append(logOutBtn);

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

//////////////////////////////////////////////////////////
// functions
//////////////////////////////////////////////////////////
// sign in functionality
document.querySelector("#signinBtn").addEventListener("click", async () => {
  let data = {};
  data.email = document.querySelector("#email").value;
  data.password = document.querySelector("#password").value;
  try {
    const result = await axios.post("/", data);

    if (!result.data) {
      alert("eh salah inputs la");
      document.querySelector("#email").value = "";
      document.querySelector("#password").value = "";
    } else {
      startDiv.remove();
      // get hold of any previous games... alr logged in at this point...
      axios.get("/game/get_records").then((result) => {
        if (!result.data.length) {
          //result.data is an empty array if there are no results
          chooseGameDiv.insertAdjacentHTML(
            "afterbegin",
            "<p>You do not have any other games for now, please start new game</p>"
          );
        } else {
          console.log("This is games_users query result", result.data);
          chooseGameDiv.insertAdjacentHTML(
            "afterbegin",
            "<p>Time to figure out how to show existing games and get them</p>"
          );
        }
      });
      chooseGameDiv.classList.remove("hidden");
    }
  } catch (err) {
    console.log(err);
  }
});

// log out functionality
logOutBtn.addEventListener("click", async () => {
  try {
    await axios.post("/logout");
    window.location = "/";
  } catch (err) {
    console.log(err);
  }
});

// newGameBtn functionality
newGameBtn.addEventListener("click", async () => {
  chooseGameDiv.remove();
  $("#main").removeClass("align-items-center");
  gameAreaDiv.classList.remove("hidden");
  gameBtnsDiv.append(logOutBtn);
  try {
    const result = await axios.post("/game/new_record");
    console.log("This is result from creating new record", result);
    document.querySelector("#currentGameId").innerHTML = `${result.data.id}`;
    document.querySelector(
      "#p1stats"
    ).innerHTML = `${result.data.currPlayerEmail}'s score is `;
    document.querySelector(
      "#p1score"
    ).innerHTML = `${result.data.gameState.p1Score}`;
    document.querySelector(
      "#p2stats"
    ).innerHTML = `${result.data.oppoPlayerEmail}'s score is `;
    document.querySelector(
      "#p2score"
    ).innerHTML = `${result.data.gameState.p2Score}`;
  } catch (err) {
    console.log(err);
  }
});

// card display function
const createCard = (cardInfo) => {
  const suit = document.createElement("div");
  suit.innerText = cardInfo.suitPic;

  const name = document.createElement("div");
  name.innerText = cardInfo.name;

  const card = document.createElement("div");
  card.classList.add(cardInfo.colour)
  
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
    document.querySelector("#p1Cards").innerHTML='';
    document.querySelector("#p2Cards").innerHTML='';
    
    // append current round cards to card holding divs
    document.querySelector("#p1Cards").append(createCard(resultDataObj.p1Hand));
    document.querySelector("#p2Cards").append(createCard(resultDataObj.p2Hand));
  } catch (err) {
    console.log(err);
  }
};

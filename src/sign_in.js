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
    localStorage.removeItem("gameId");
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
  appendDefnModalFunc();
  appendSwapModalFunc();
  createRackTables();
  createButtons();
  appendBtnFuncs();
  try {
    const game = await axios.post(
      "/game/new_record",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    /* 
    1. set gameId in localStorage so able to retrieve correct game state
    2. stuff that can only be built after getting current game's state 
    */
    localStorage.setItem("gameId", game.data.id);
    createStatusArea(game.data.player1Name, game.data.player2Name);
    createPlayBoard(game.data.id);
    createRack(game.data.p1Hand, "p1_rack", "p1Hand", game.data.id);
    createRack(game.data.p2Hand, "p2_rack", "p2Hand", game.data.id);
  } catch (err) {
    console.log(err);
  }
});

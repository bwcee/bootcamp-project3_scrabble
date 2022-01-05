import BaseController from "./baseCtrl.mjs";
import { shuffleTiles, createTiles, deal } from "./gameFuncs.mjs";
import jwt from "jsonwebtoken";
const { SALT } = process.env;

export default class GameController extends BaseController {
  constructor(db, model) {
    super(db, model);
  }

  async getGameRecs(req, res) {
    const userToken = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(userToken, SALT);

    try {
      const records = await this.db.GameUser.findAll({
        where: { userId: payload.id },
        include: this.db.Game,
        order: [["updatedAt", "DESC"]],
        raw: true,
      });
      !records ? res.send("null") : res.send(records);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async doGameRec(req, res) {
    const userToken = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(userToken, SALT);
    const gameTiles = createTiles();
    const p1Hand = [];
    deal(p1Hand, gameTiles);
    const p2Hand = [];
    deal(p2Hand, gameTiles);
    const player1Id = payload.id;

    try {
      /* this part is for sole purpose of getting random player2Id */
      const idObjs = await this.db.User.findAll({
        attributes: ["id"],
        raw: true,
      });
      const allIds = idObjs.map((el) => el.id);
      allIds.splice(allIds.indexOf(player1Id), 1);
      const player2Id = allIds[Math.floor(Math.random() * allIds.length)];

      /* populate game variables so can send bck to front end for use/rendering */
      const game = await this.model.create({
        gameTiles: gameTiles,
        p1Hand: p1Hand,
        p2Hand: p2Hand,
        boardLetters: [],
        currentWord: [],
        p1Id: player1Id,
        p2Id: player2Id,
      });

      console.log("This is create new game result", game);

      // associate both players with game_state in games_users table
      // result.id is id of the created game_state in games_users table
      // await this.db.GameUser.create({
      //   gameId: result.id,
      //   userId: req.cookies.userID,
      // });
      // await this.db.GameUser.create({ gameId: result.id, userId: othPlayer });

      /* get player names and send to front end */
      const player1Name = await this.db.User.findByPk(player1Id).user;
      const player2Name = await this.db.User.findByPk(player2Id).user;

      // let othPlayer;
      // // haf to use == below cos req.cookies.userID is string not integer
      // req.cookies.userID == 1 ? (othPlayer = 2) : (othPlayer = 1);
      // const currPlayerEmail = await this.db.User.findByPk(req.cookies.userID);
      // const oppoPlayerEmail = await this.db.User.findByPk(othPlayer);

      // // add current player info to result before sending it off to the front end
      // result.dataValues.currPlayerEmail = currPlayerEmail.email;
      // result.dataValues.oppoPlayerEmail = oppoPlayerEmail.email;
      res.send(game);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async getCurrentGame(req, res) {
    const gameId = req.params.gameId;
    try {
      const currentGame = await this.model.findByPk(gameId, { raw: true });
      console.log("This is currentGame", currentGame);
      res.send(currentGame);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async updateGame(req, res) {
    const gameId = req.params.gameId;
    const [boardLetters, currentWord, playerHand, handId] = Object.values(
      req.body
    );
    try {
      let updatedGame;
      if (handId === "p1Hand") {
        updatedGame = await this.model.update(
          {
            boardLetters: boardLetters,
            currentWord: currentWord,
            p1Hand: playerHand,
          },
          { where: { id: gameId }, returning: true }
        );
      } else {
        updatedGame = await this.model.update(
          {
            boardLetters: boardLetters,
            currentWord: currentWord,
            p2Hand: playerHand,
          },
          { where: { id: gameId }, returning: true }
        );
      }
      res.send(updatedGame);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }
}

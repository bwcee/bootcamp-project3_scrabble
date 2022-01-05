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

      // associate both players with gameId in games_users table
      await this.db.GameUser.create({
        gameId: game.dataValues.id,
        userId: player1Id,
      });
      await this.db.GameUser.create({
        gameId: game.dataValues.id,
        userId: player2Id,
      });

      /* get player names and send to front end */
      const player1Name = await this.db.User.findByPk(player1Id, { raw: true });
      const player2Name = await this.db.User.findByPk(player2Id, { raw: true });

      game.dataValues.player1Name = player1Name.user;
      game.dataValues.player2Name = player2Name.user;
      console.log("This is game", game);
      res.send(game);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async getCurrentGame(req, res) {
    const gameId = req.params.gameId;
    try {
      const currentGame = await this.model.findByPk(gameId, { raw: true });
      res.send(currentGame);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async updateRack(req, res) {
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

  async updateBoard(req, res) {
    const gameId = req.params.gameId;
    const [boardLetters, currentWord, p1Hand, p2Hand] = Object.values(req.body);
    try {
      const updatedGame = await this.model.update(
        {
          boardLetters: boardLetters,
          currentWord: currentWord,
          p1Hand: p1Hand,
          p2Hand: p2Hand,
        },
        { where: { id: gameId }, returning: true }
      );
      res.send(updatedGame);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

    async updateGame(req, res) {
    const gameId = req.params.gameId;
    const [turn,
        gameTiles,
        p1Hand,
        p2Hand,
        currentWord,
        p1Score,
        p2Score] = Object.values(req.body);
    try {
      const updatedGame = await this.model.update(
        {
          turn: turn,
          gameTiles: gameTiles,
          p1Hand: p1Hand,
          p2Hand: p2Hand,
          currentWord: currentWord,
          p1Score: p1Score,
          p2Score: p2Score,
        },
        { where: { id: gameId }, returning: true }
      );
      res.send(updatedGame);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }
}


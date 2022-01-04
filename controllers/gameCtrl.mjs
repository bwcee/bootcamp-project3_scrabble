import BaseController from "./baseCtrl.mjs";
import { makeDeck, shuffleCards, winner } from "./gameFuncs.mjs";

export default class GameController extends BaseController {
  constructor(db, model) {
    super(db, model);
  }

  async getGameRecs(req, res) {
    try {
      const result = await this.db.GameUser.findAll({
        // it is res.cookie but req.cookies!!
        where: { userId: req.cookies.userID },
        include: this.db.Game,
        order: [["updatedAt", "DESC"]],
        raw: true,
      });
      !result ? res.send("null") : res.send(result);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async doGameRec(req, res) {
    const deck = shuffleCards(makeDeck());
    try {
      let othPlayer;
      // haf to use == below cos req.cookies.userID is string not integer
      req.cookies.userID == 1 ? (othPlayer = 2) : (othPlayer = 1);
      const currPlayerEmail = await this.db.User.findByPk(req.cookies.userID);
      const oppoPlayerEmail = await this.db.User.findByPk(othPlayer);

      const result = await this.model.create({
        gameState: {
          deck: deck,
          p1Id: req.cookies.userID,
          p2Id: othPlayer,
          p1Score: 0,
          p2Score: 0,
        },
      });
      console.log("This is create new game result", result);

      // associate both players with game_state in games_users table
      // result.id is id of the created game_state in games_users table
      await this.db.GameUser.create({
        gameId: result.id,
        userId: req.cookies.userID,
      });
      await this.db.GameUser.create({ gameId: result.id, userId: othPlayer });

      // add current player info to result before sending it off to the front end
      result.dataValues.currPlayerEmail = currPlayerEmail.email;
      result.dataValues.oppoPlayerEmail = oppoPlayerEmail.email;
      res.send(result);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async doDeal(req, res) {
    const { gameId } = req.body;
    console.log("This is doDeal req.body", req.body);
    try {
      // pull out currentGame and make use of the deck stored inside
      const currentGame = await this.model.findByPk(gameId);
      console.log("This is currentGame", currentGame);
      const currentGameObj = currentGame.gameState;
      const p1Hand = currentGameObj.deck.pop();
      const p2Hand = currentGameObj.deck.pop();
      // determine winner, winner() imported from gameFuncs.mjs
      const rdWinner = winner(p1Hand, p2Hand);
      let newp1Score, newp2Score;
      rdWinner == "p1"
        ? (currentGameObj.p1Score += 1)
        : rdWinner == "p2"
        ? (currentGameObj.p2Score += 1)
        : "";
      // put back the modified deck ans scores
      const roundResult = await this.model.update(
        { gameState: currentGameObj },
        { where: { id: gameId }, returning: true }
      );
      console.log("This is roundResult", roundResult);
      // send player hands bck to front end
      roundResult[1][0].dataValues.p1Hand = p1Hand;
      roundResult[1][0].dataValues.p2Hand = p2Hand;
      res.send(roundResult);
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }
}

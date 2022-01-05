import express from "express";

const gameRouters = express.Router();

export default function gameRouteFunc(controller) {
  gameRouters.get("/get_records", controller.getGameRecs.bind(controller));
  gameRouters.post("/new_record", controller.doGameRec.bind(controller));
  gameRouters.get("/get_game/:gameId", controller.getCurrentGame.bind(controller));
  gameRouters.put("/update_rack/:gameId", controller.updateRack.bind(controller));
  gameRouters.put("/update_board/:gameId", controller.updateBoard.bind(controller));
  
  return gameRouters;
}

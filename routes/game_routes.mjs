import express from "express";

const gameRouters = express.Router();

export default function gameRouteFunc(controller) {
  gameRouters.get("/get_records", controller.getGameRecs.bind(controller));
  gameRouters.post("/new_record", controller.doGameRec.bind(controller));
  gameRouters.get(
    "/get_game/:gameId",
    controller.getCurrentGame.bind(controller)
  );
  gameRouters.put(
    "/update_rack/:gameId",
    controller.updateRack.bind(controller)
  );
  gameRouters.put(
    "/update_board/:gameId",
    controller.updateBoard.bind(controller)
  );
  gameRouters.put(
    "/update_game/:gameId",
    controller.updateGame.bind(controller)
  );
  gameRouters.put(
    "/update_turn/:gameId",
    controller.updateTurn.bind(controller)
  );
  gameRouters.put(
    "/do_clear/:gameId",
    controller.doClear.bind(controller)
  );
  gameRouters.put(
    "/do_swap/:gameId",
    controller.doSwap.bind(controller)
  );

  return gameRouters;
}

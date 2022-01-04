import express from "express";

const gameRouters = express.Router();

export default function gameRouteFunc(controller) {
  gameRouters.get("/get_records", controller.getGameRecs.bind(controller));
  gameRouters.post("/new_record", controller.doGameRec.bind(controller));
  gameRouters.put("/deal", controller.doDeal.bind(controller));
  
  return gameRouters;
}

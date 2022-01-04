import express from "express";

const startRouters = express.Router();

export default function startRouteFunc(controller) {
  startRouters.get("/", controller.getStart.bind(controller));
  startRouters.post("/", controller.doSignIn.bind(controller));
  // startRouters.post("/logout", controller.doLogOut.bind(controller));

  return startRouters;
}

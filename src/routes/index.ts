import express from "express";
import authentication from "./authentication";
import users from "./users";
import { errorHandler } from "../middlewares";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  router.use(errorHandler);
  return router;
};

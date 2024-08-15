import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes";
import { initializeRedisClient } from "./middlewares";

import dotenv from "dotenv";
dotenv.config();

async function initializeExpressServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(compression());

  app.use(
    cors({
      credentials: true,
    })
  );

  app.use("/", routes());

  const server = http.createServer(app);

  // await initializeRedisClient();

  server.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
  });

  const MONGO_URL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@0${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.MONGO_INITDB_DATABASE}`;

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL, {
    authSource: "admin",
  });
  mongoose.connection.on("error", (err: Error) => {
    console.error(err);
    process.exit(1);
  });
}

initializeExpressServer()
  .then()
  .catch((e) => console.error(e));

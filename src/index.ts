import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes";

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

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

const MONGO_URL = "mongodb://root:example@0.0.0.0:27017/demo-rest-api-ts";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL, {
  authSource: "admin",
});
mongoose.connection.on("error", (err: Error) => {
  console.error(err);
  process.exit(1);
});

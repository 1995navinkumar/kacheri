import express from "express";
import cors from "cors";
import logger from "./logger.js";
import { ServerPush, Receive } from "./ws-server.js";

// modules

// instantiate
const app = express();

app.use(cors());

app.use(express.static("dist/web"));

app.use(express.json());

app.get("/register", ServerPush);

app.post("/send", Receive);

// listen for request
app.listen(8000, function () {
  logger.log(`server running on port 8000`);
});

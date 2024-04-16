import express from "express";
import logger from "./logger.js";
import Socket from "./ws-server.js";

// modules

// instantiate
const app = express();

app.use(express.static("dist/web"));

// listen for request
app.listen(8000, function () {
  logger.log(`server running on port 8000`);
});

// Creating websocket
Socket(app);

import WebSocket from "ws";
import http from "http";
import { CreateKacheri, deleteKacheri, getKacheri } from "./kacheri.js";
import { createLogger } from "./logger.js";

const logger = createLogger({ moduleName: "wsLogger" });

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);

let liveSockets = {};
let wss;

function noop() {
  // logger.log("pinging active clients");
}

function heartbeat() {
  this.isAlive = true;
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("HTTP server working\n");
});

server.listen(8080);

export default function Socket() {
  wss = new WebSocket.Server({ noServer: true });
  wss.on("connection", function connection(ws, req) {
    logger.log("onConnection called");
    storeClientWS(ws);
    ws.on("message", pipe(messageParser, actionInvoker));
    ws.isAlive = true;
    ws.on("pong", heartbeat);
    ws.on("close", function () {
      logger.log("terminating broken connections");
      liveSockets[ws.protocol] = undefined;
    });
  });

  server.on("upgrade", (request, socket, head) => {
    logger.log("upgrade called");

    // Allow CORS for WebSocket connections
    wss.handleUpgrade(request, socket, head, (ws) => {
      logger.log("upgrade handled");
      wss.emit("connection", ws, request);
    });
  });
}

setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      logger.log("terminating broken connections");
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

function storeClientWS(ws, req) {
  //has to improve
  var user = ws.protocol;
  liveSockets[user] = ws;
  ws.send(
    JSON.stringify({
      type: "connection",
      uuid: user,
    })
  );
}

function messageParser(message) {
  logger.log(message);
  return JSON.parse(message);
}

function actionInvoker(data) {
  var action = data.type;
  return actions[action](data);
}

var actions = {
  "create-kacheri-request": function createKacheri(data) {
    logger.log("creating a kacheri");

    const kacheri = CreateKacheri({ uid: data.clientId });
    kacheri.setDJ({ clientId: data.clientId });
    signal(data.clientId, {
      type: "create-kacheri-response",
      kacheriId: kacheri.id,
      success: true,
    });

    logger.log(`kacheri created - ${kacheri.id}`);
  },

  "delete-kacheri-request": function destroyKacheri(data) {
    deleteKacheri({ id: data.clientId });
    logger.log(`Kacheri deleted - ${data.clientId}`);
  },

  "join-kacheri": function joinKacheri(data) {
    const { kacheriId, clientId } = data;

    logger.log(`Joining kacheri - ${kacheriId}`);

    const kacheri = getKacheri({ id: kacheriId });

    if (!kacheri) {
      signal(clientId, {
        type: "join-kacheri-response",
        success: false,
        reason: `No kacheri found with the ID - ${kacheriId}`,
      });
      return;
    }

    kacheri.addRasigar({ clientId });

    signal(kacheri.getDJ(), {
      type: "offer-request",
      rasigarId: clientId,
    });

    signal(clientId, {
      type: "join-kacheri-response",
      success: true,
    });
  },

  offer: function sendOfferAndRequestAnswer(data) {
    const { rasigarId, offer } = data;

    signal(rasigarId, {
      type: "answer-request",
      offer,
    });
  },

  answer: function sendAnswer(data) {
    const { clientId, kacheriId, answer } = data;

    // send answer to DJ within a kacheri
    const kacheri = getKacheri({ id: kacheriId });
    const dj = kacheri.getDJ();
    signal(dj, {
      type: "answer-response",
      answer,
      rasigarId: clientId,
    });
  },

  "offer-candidate": function offerCandidate(data) {
    const { clientId, kacheriId, candidate, rasigarId } = data;

    const kacheri = getKacheri({ id: kacheriId });

    const message = {
      type: "set-remote-candidate",
      candidate,
    };

    if (rasigarId) {
      // candidate came from DJ
      signal(rasigarId, message);
    } else {
      // candidate came from rasigar. Send it to DJ
      const dj = kacheri.getDJ();
      signal(dj, { ...message, rasigarId: clientId });
    }
  },
};

function signal(client, message) {
  var socket = liveSockets[client];
  logger.log(`signalling socket with clientId : ${client}`);
  socket?.send(JSON.stringify(message));
}

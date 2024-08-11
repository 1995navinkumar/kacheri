import { CreateKacheri, deleteKacheri, getKacheri } from "./kacheri.js";
import { createLogger } from "./logger.js";

const logger = createLogger({ moduleName: "wsLogger" });

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);

let liveSockets = {};

function formatData(data) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export function ServerPush(req, res) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  const clientId = req.query?.clientId;
  if (!clientId) {
    res.status(500).end("No ClientId found");
    return;
  }
  res.writeHead(200, headers);
  storeClientWS(clientId, res);
  res.write(formatData({ clientId, type: "connection" }));
  req.on("close", () => {
    logger.log(`${clientId} Connection closed`);
    delete liveSockets[clientId];
  });
}

export function Receive(req, res) {
  const data = req.body;
  logger.log(data);
  actionInvoker(data);
  res.end("Data Sent");
}

function storeClientWS(clientId, res) {
  liveSockets[clientId] = res;
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
  socket.write(formatData(message));
}

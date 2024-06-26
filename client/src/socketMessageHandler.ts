// Socket

import { createLogger } from "./logger";

const logger = createLogger({ moduleName: "ws" });

let socket: WebSocket;

export function createSocket({
  username,
}: {
  username: string;
}): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === socket.OPEN) {
      logger.log("socket already open, using existing one");
      resolve(socket);
    }
    const hostName = location.hostname;
    let connection: WebSocket;
    if (process.env.ENV === "production") {
      connection = new WebSocket(
        `wss://gently-concise-dogfish.ngrok-free.app/kacheri/ws`,
        username
      );
    } else {
      if (process.env.MODE === "extension") {
        connection = new WebSocket(`ws://localhost:8080`, username);
      } else {
        connection = new WebSocket(`ws://${hostName}:8080`, username);
      }
    }
    connection.onopen = function () {
      resolve(connection);
      socket = connection;
    };
    connection.onerror = function (e) {
      logger.log("error in connection establishment");
      reject(e);
    };
  });
}

export function sendMessageToSocket(message: Record<string, any>) {
  if (!socket) {
    throw new Error("No active socket");
  }
  socket.send(JSON.stringify(message));
}

export function receiveMessageFromSocket(
  messageType: string,
  callback: (message: any) => void
): void {
  if (!socket) {
    throw new Error("No active socket");
  }
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === messageType) {
      callback(message);
    }
  });
}

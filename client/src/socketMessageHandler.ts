// Socket

import { createLogger } from "./logger";

const logger = createLogger({ moduleName: "ws" });

let socket: EventSource;

function getEndpointURL() {
  if (process.env.ENV === "production") {
    return process.env.SERVER_URL;
  } else {
    return `http://localhost:8000`;
  }
}

export function createSocket({
  username,
}: {
  username: string;
}): Promise<EventSource> {
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === socket.OPEN) {
      logger.log("socket already open, using existing one");
      resolve(socket);
    }
    const endpointURL = getEndpointURL();
    let connection: EventSource;
    if (process.env.ENV === "production") {
      connection = new EventSource(
        `${endpointURL}/register?clientId=${username}`
      );
    } else {
      if (process.env.MODE === "extension") {
        connection = new EventSource(
          `${endpointURL}/register?clientId=${username}`
        );
      } else {
        connection = new EventSource(
          `${endpointURL}/register?clientId=${username}`
        );
      }
    }
    console.log(connection);

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
  const endpointURL = getEndpointURL();
  fetch(`${endpointURL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
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

import { createLogger } from "./logger";

export function uuid(): string {
  // Generate a random number between 1000 and 9999 (inclusive)
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return randomNum.toString();
}

// Storage Utils
export function getItem(key: string, fallbackValue: string): string {
  return localStorage.getItem(key) ?? fallbackValue;
}

export function setItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}

// Socket

const logger = createLogger({ moduleName: "ws" });

export default function createSocket({
  username,
}: {
  username: string;
}): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const hostName = location.hostname;
    const pathname = location.pathname;
    let connection: WebSocket;
    if (process.env.ENV === "production") {
      connection = new WebSocket(`wss://${hostName}${pathname}/ws`, username);
    } else {
      if (process.env.MODE === "extension") {
        connection = new WebSocket(`ws://localhost:8080`, username);
      } else {
        connection = new WebSocket(`ws://${hostName}:8080`, username);
      }
    }
    connection.onopen = function () {
      resolve(connection);
    };
    connection.onerror = function (e) {
      logger.log("error in connection establishment");
      reject(e);
    };
  });
}

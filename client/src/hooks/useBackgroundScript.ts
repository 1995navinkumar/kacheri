import { receiveMessage, sendMessage } from "../chromeMessageHandler";
import { useConfig } from "../Providers/ConfigProvider";

export default function useBackgroundScript() {
  const { clientId } = useConfig();
  return {
    createOffscreenDocument: async () => {
      return new Promise((resolve, reject) => {
        sendMessage({ type: "create-offscreen-document" });
        receiveMessage("create-offscreen-document-response", () =>
          resolve(true)
        );
      });
    },
    createSocket: async ({ clientId }: { clientId: string }) => {
      return new Promise((resolve, reject) => {
        sendMessage({ type: "create-socket", clientId });

        receiveMessage("create-socket-response", (message) => {
          if (message.success) {
            resolve("socket-created");
          } else {
            reject("socket-creation-failed");
          }
        });
      });
    },
    captureAudio: async () => {
      return new Promise((resolve, reject) => {
        sendMessage({ type: "capture-audio" });

        receiveMessage("capture-audio-response", (message) => {
          if (message.success) {
            resolve(message);
          } else {
            reject(message);
          }
        });
      });
    },
    createKacheriRequest: async ({
      clientId,
    }: {
      clientId: string;
    }): Promise<{ kacheriId: string }> => {
      return new Promise((resolve, reject) => {
        sendMessage({ type: "create-kacheri-request", clientId });

        receiveMessage("create-kacheri-response", (message) => {
          if (message.success) {
            resolve({ kacheriId: message.kacheriId });
          } else {
            reject(message);
          }
        });
      });
    },

    stopKacheri: async () => {
      sendMessage({ type: "stop-kacheri", clientId });
    },
  };
}

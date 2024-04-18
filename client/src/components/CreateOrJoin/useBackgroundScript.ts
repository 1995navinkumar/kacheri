import { receiveMessage, sendMessage } from "../../chromeMessageHandler";

export default function useBackgroundScript() {
  return {
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
  };
}

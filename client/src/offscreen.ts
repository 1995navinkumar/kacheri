import { receiveMessage, sendMessage } from "./chromeMessageHandler";
import { createLogger } from "./logger";
import { CreateDJPeer } from "./WebRTC";

import {
  createSocket,
  receiveMessageFromSocket,
  sendMessageToSocket,
} from "./socketMessageHandler";

const logger = createLogger({ moduleName: "offscreen" });

let source: MediaStreamAudioSourceNode;
let media: MediaStream;

function debug(message: Record<string, any>) {
  logger.log(JSON.stringify(message));
}

receiveMessage("create-socket", async (message) => {
  try {
    window.wssocket = await createSocket({ username: message.clientId });
    sendMessage({ type: "create-socket-response", success: true });
  } catch (err) {
    sendMessage({ type: "create-socket-response", success: false });
  }
});

receiveMessage("create-kacheri-request", async (message) => {
  sendMessageToSocket({
    type: "create-kacheri-request",
    clientId: message.clientId,
  });
  receiveMessageFromSocket("create-kacheri-response", sendMessage);
});

receiveMessage("delete-kacheri-request", (message) => {
  sendMessageToSocket({
    type: "delete-kacheri-request",
    clientId: message.clientId,
  });
  sendMessage({ type: "delete-offscreen-document" });
});

receiveMessage("capture-stream", async (message) => {
  try {
    debug(message);
    media = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: message.mediaStreamId,
        },
      },
    });

    debug({ mediaOut: media });

    const output = new AudioContext();
    source = output.createMediaStreamSource(media);
    source.connect(output.destination);

    debug({ message: "connected" });

    sendMessage({ type: "capture-audio-response", success: true });
  } catch (err) {
    if (media) {
      media.getTracks().forEach((t) => t.stop());
    }
    debug({ err: err.message });
    sendMessage({ type: "capture-audio-response", success: false, err });
  }
});

receiveMessage("initiate-peer", (message) => {
  CreateDJPeer({
    clientId: message.clientId,
    mediaStream: media,
    kacheriId: message.kacheriId,
  });
});

receiveMessage("stop-kacheri", (message) => {
  debug({ message: "stopping record" });
  if (media) {
    media.getTracks().forEach((t) => t.stop());
    debug({ message: "stopped" });
  } else {
    debug({ message: "no media" });
  }
  sendMessage({ type: "delete-kacheri-request", clientId: message.clientId });
});

export { source, media };

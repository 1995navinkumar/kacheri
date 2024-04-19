import { receiveMessage, sendMessage } from "./chromeMessageHandler";
import { createLogger } from "./logger";
import { CreateDJPeer } from "./WebRTC";

const logger = createLogger({ moduleName: "offscreen" });

let source: MediaStreamAudioSourceNode;
let media: MediaStream;

function debug(message: Record<string, any>) {
  logger.log(JSON.stringify(message));
}

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

receiveMessage("create-dj-peer", (message) => {
  CreateDJPeer({
    clientId: message.clientId,
    mediaStream: media,
    partyId: message.partyId,
  });
});

receiveMessage("stop-streaming", (message) => {
  debug({ message: "stopping record" });
  if (media) {
    media.getTracks().forEach((t) => t.stop());
    debug({ message: "stopped" });
  } else {
    debug({ message: "no media" });
  }
});

export { source, media };

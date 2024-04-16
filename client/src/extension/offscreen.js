import { debug } from "./util.js";

let source;
let media;

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type == "debug") {
    debug(message);
  }
  if (message.type == "streamId") {
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
    } catch (err) {
      if (media) {
        media.getTracks().forEach((t) => t.stop());
      }
      debug({ err: err.message });
    }
  }

  if (message.type == "stop") {
    debug({ message: "stopping record" });
    if (media) {
      media.getTracks().forEach((t) => t.stop());
      debug({ message: "stopped" });
    } else {
      debug({ message: "no media" });
    }
  }
});

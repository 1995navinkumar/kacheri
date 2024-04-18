import { sendMessage, receiveMessage } from "./chromeMessageHandler";
import { createLogger } from "./logger";
import createSocket from "./utils";

const logger = createLogger({ moduleName: "service-worker" });

receiveMessage("create-socket", async (message) => {
  try {
    await createSocket({ username: message.clientId });
    sendMessage({ type: "create-socket-response", success: true });
  } catch (err) {
    sendMessage({ type: "create-socket-response", success: false });
  }
});

receiveMessage("capture-audio", async (message) => {
  try {
    const recording = await createOffScreenDocument();
    if (recording) {
      // return;
    }
    const tabId = await getTab();
    logger.log(tabId.toString());
    const mediaStreamId = await getAudioStream(tabId);
    logger.log(mediaStreamId);

    sendMessage({ mediaStreamId, type: "capture-stream" });
  } catch (err) {
    logger.error(err);
  }
});

async function createOffScreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({});
  let recording = false;

  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === "OFFSCREEN_DOCUMENT"
  );

  if (!offscreenDocument) {
    logger.log("creating new offscreen doc");

    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: [chrome.offscreen.Reason.WEB_RTC],
      justification: "Recording from chrome.tabCapture API",
    });
    logger.log("created new offscreen doc");
  } else {
    logger.log("offscreen doc exists");
    recording = offscreenDocument.documentUrl.endsWith("#recording");
  }

  return recording;
}

async function getTab(): Promise<number> {
  let queryOptions = { active: true, currentWindow: true, audible: true };
  let tabs = await chrome.tabs.query(queryOptions);
  if (tabs.length > 0 && tabs[0].id) {
    return tabs[0].id;
  } else {
    throw new Error("No tab found playing audio");
  }
}

async function getAudioStream(tabId: number): Promise<string> {
  const mediaStreamId = await chrome.tabCapture.getMediaStreamId({
    targetTabId: tabId,
  });
  return mediaStreamId;
}

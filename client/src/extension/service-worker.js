function debug(message) {
  chrome.runtime.sendMessage({
    type: "debug",
    ...message,
  });
}

function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

async function createOffScreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({});
  let recording = false;

  const offscreenDocument = existingContexts.find(
    (c) => c.contextType === "OFFSCREEN_DOCUMENT"
  );

  if (!offscreenDocument) {
    debug({ message: "creating new offscreen doc" });

    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["USER_MEDIA"],
      justification: "Recording from chrome.tabCapture API",
    });
    debug({ message: "created new offscreen doc" });
  } else {
    debug({ message: "offscreen doc exists" });
    recording = offscreenDocument.documentUrl.endsWith("#recording");
  }

  return recording;
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type == "start") {
    try {
      const recording = await createOffScreenDocument();
      if (recording) {
        debug({ message: "already recording" });
        return;
      }
      const tabId = await getTab();
      debug({ tabId });
      const mediaStreamId = await getAudioStream(tabId);
      sendMessage({ mediaStreamId, type: "streamId" });
    } catch (err) {
      debug({ type: "error", err: err.message });
    }
  }
});

async function getTab() {
  let queryOptions = { active: true, currentWindow: true, audible: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].id;
}

async function getAudioStream(tabId) {
  debug({ message: "getting streamId" });
  const mediaStreamId = await chrome.tabCapture.getMediaStreamId({
    targetTabId: tabId,
  });
  debug({ mediaStreamId });
  return mediaStreamId;
}

export function sendMessage(message: Record<string, any>) {
  chrome.runtime.sendMessage(message);
}

export function receiveMessage(
  messageType: string,
  callback: (message: any) => void
): void {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === messageType) {
      callback(message);
    }
  });
}

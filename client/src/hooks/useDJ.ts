import { sendMessage } from "../chromeMessageHandler";
import useBackgroundScript from "./useBackgroundScript";

export default function useDJ({ clientId }: { clientId: string }) {
  const { createSocket, captureAudio, createKacheriRequest } =
    useBackgroundScript();

  const createKacheri = async () => {
    await createSocket({ clientId });
    await captureAudio();
    const { kacheriId } = await createKacheriRequest({ clientId });
    sendMessage({ type: "initiate-peer", clientId, kacheriId });
  };

  return {
    createKacheri,
  };
}

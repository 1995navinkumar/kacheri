import { sendMessage } from "../chromeMessageHandler";
import useBackgroundScript from "./useBackgroundScript";

export default function useDJ({ clientId }: { clientId: string }) {
  const {
    createOffscreenDocument,
    createSocket,
    captureAudio,
    createKacheriRequest,
  } = useBackgroundScript();

  const createKacheri = async () => {
    await createOffscreenDocument();
    await createSocket({ clientId });
    await captureAudio();
    const { kacheriId } = await createKacheriRequest({ clientId });
    sendMessage({ type: "initiate-peer", clientId, kacheriId });
  };

  return {
    createKacheri,
  };
}

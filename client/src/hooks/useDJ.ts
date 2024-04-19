import { sendMessage } from "../chromeMessageHandler";
import useBackgroundScript from "./useBackgroundScript";

export default function useDJ({ clientId }: { clientId: string }) {
  const { createSocket, captureAudio, createPartyRequest } =
    useBackgroundScript();

  const createParty = async () => {
    await createSocket({ clientId });
    await captureAudio();
    const { partyId } = await createPartyRequest({ clientId });
    sendMessage({ type: "initiate-peer", clientId, partyId });
  };

  return {
    createParty,
  };
}

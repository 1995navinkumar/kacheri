import useBackgroundScript from "./useBackgroundScript";

export default function useDJ({ clientId }: { clientId: string }) {
  const { createSocket, captureAudio, createPartyRequest } =
    useBackgroundScript();

  const createParty = async () => {
    await createSocket({ clientId });
    // await captureAudio();
    await createPartyRequest({ clientId });
  };

  return {
    createParty,
  };
}

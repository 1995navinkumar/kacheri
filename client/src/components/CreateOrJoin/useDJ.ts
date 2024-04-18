import useBackgroundScript from "./useBackgroundScript";

export default function useDJ({ clientId }: { clientId: string }) {
  const { createSocket, captureAudio } = useBackgroundScript();

  const createParty = async () => {
    await createSocket({ clientId });
    await captureAudio();
  };

  return {
    createParty,
  };
}

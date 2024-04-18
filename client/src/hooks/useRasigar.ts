import { createSocket, sendMessageToSocket } from "../socketMessageHandler";

export default function useRasigar({ clientId }: { clientId: string }) {
  const joinParty = async ({ partyId }: { partyId: string }) => {
    await createSocket({ username: clientId });
    sendMessageToSocket({ type: "join-party", partyId });
  };

  return {
    joinParty,
  };
}

import {
  createSocket,
  receiveMessageFromSocket,
  sendMessageToSocket,
} from "../socketMessageHandler";
import { CreateRasigarPeer } from "../WebRTC";

export default function useRasigar({ clientId }: { clientId: string }) {
  const joinParty = async ({ partyId }: { partyId: string }) => {
    await createSocket({ username: clientId });
    CreateRasigarPeer({ clientId, partyId });
    await sendJoinPartyRequest({ partyId, clientId });
  };

  return {
    joinParty,
  };
}

function sendJoinPartyRequest({
  partyId,
  clientId,
}: {
  clientId: string;
  partyId: string;
}): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    try {
      sendMessageToSocket({ type: "join-party", partyId, clientId });
      receiveMessageFromSocket("join-party-response", (message) => {
        if (message.success) {
          resolve(message);
        } else {
          reject(message);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

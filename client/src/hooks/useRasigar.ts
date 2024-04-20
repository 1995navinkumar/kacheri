import { useRef } from "react";
import {
  createSocket,
  receiveMessageFromSocket,
  sendMessageToSocket,
} from "../socketMessageHandler";
import { CreateRasigarPeer } from "../WebRTC";

export default function useRasigar({ clientId }: { clientId: string }) {
  const audioRef = useRef(new Audio());

  const joinKacheri = async ({ kacheriId }: { kacheriId: string }) => {
    await createSocket({ username: clientId });
    CreateRasigarPeer({ clientId, kacheriId, audioPlayer: audioRef.current });
    await sendJoinKacheriRequest({ kacheriId, clientId });
  };

  const audioControls = {
    togglePlay: () => {
      audioRef.current.paused
        ? audioRef.current.play()
        : audioRef.current.pause();
    },
    isPlaying: () => !audioRef.current.paused,
  };

  return {
    joinKacheri,
    audioControls,
  };
}

function sendJoinKacheriRequest({
  kacheriId,
  clientId,
}: {
  clientId: string;
  kacheriId: string;
}): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    try {
      sendMessageToSocket({ type: "join-kacheri", kacheriId, clientId });
      receiveMessageFromSocket("join-kacheri-response", (message) => {
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

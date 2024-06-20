import { sendMessage, receiveMessage } from "./chromeMessageHandler";
import { createLogger } from "./logger";
import {
  receiveMessageFromSocket,
  sendMessageToSocket,
} from "./socketMessageHandler";

const logger = createLogger({ moduleName: "WebRTC" });

export type PeerType = "DJ" | "Rasigar";

export type Peer = {
  type: PeerType;
  peer: RTCPeerConnection;
};

const iceServers = [
  {
    url: "stun:144.24.128.160:7001",
    urls: "stun:144.24.128.160:7001",
  },
  {
    url: "turn:144.24.128.160:7001?transport=udp",
    username: "navin",
    urls: "turn:144.24.128.160:7001?transport=udp",
    credential: "rtc",
  },
  {
    url: "turn:144.24.128.160:5349?transport=tcp",
    username: "navin",
    urls: "turn:144.24.128.160:5349?transport=tcp",
    credential: "rtc",
  },
];

export function CreateDJPeer({
  clientId,
  kacheriId,
  mediaStream,
}: {
  clientId: string;
  kacheriId: string;
  mediaStream: MediaStream;
}) {
  let DJPeers: Record<string, RTCPeerConnection> = {};

  const constraints: RTCOfferOptions = {
    offerToReceiveAudio: true,
  };

  function handleMasterICECandidateEvent(
    event: RTCPeerConnectionIceEvent,
    rasigarId: string
  ) {
    if (event.candidate) {
      sendMessageToSocket({
        kacheriId,
        clientId,
        rasigarId,
        type: "offer-candidate",
        candidate: event.candidate,
      });
    }
  }

  receiveMessage("peer-count-request", () => {
    sendMessage({ type: "peer-count-response", count: Object.keys(DJPeers).length });
  });

  async function handleNegotiationNeededEvent(rasigarId: string) {
    try {
      const DJPeer = DJPeers[rasigarId];
      const offer = await DJPeer.createOffer(constraints);
      // If the connection hasn't yet achieved the "stable" state,
      // return to the caller. Another negotiationneeded event
      // will be fired when the state stabilizes.
      if (DJPeer.signalingState != "stable") {
        logger.log("The connection isn't stable yet; postponing...");
        return;
      }

      await DJPeer.setLocalDescription(offer);

      sendMessageToSocket({
        type: "offer",
        clientId,
        rasigarId,
        kacheriId,
        offer: DJPeer.localDescription,
      });
    } catch (error) {
      logger.log(`Failed in Negotiation ${error}`);
    }
  }

  receiveMessageFromSocket("offer-request", (message) => {
    const { rasigarId } = message;

    const DJPeer = new RTCPeerConnection({
      iceServers,
    });

    DJPeers[rasigarId] = DJPeer;

    DJPeer.onicecandidate = (event) =>
      handleMasterICECandidateEvent(event, rasigarId);
    //Event triggered when negotiation can take place as RTCpeer won't be stable
    DJPeer.onnegotiationneeded = () => handleNegotiationNeededEvent(rasigarId);

    DJPeer.onconnectionstatechange = () => {
      if (DJPeer.connectionState === "disconnected") {
        delete DJPeers[rasigarId];
      }
      sendMessage({ type: "peer-count-response", count: Object.keys(DJPeers).length });
    };

    for (const track of mediaStream.getTracks()) {
      DJPeer.addTrack(track, mediaStream);
    }
  });

  receiveMessageFromSocket("answer-response", async (message) => {
    try {
      const { rasigarId } = message;
      const DJPeer = DJPeers[rasigarId];
      var desc = new RTCSessionDescription(message.answer);
      await DJPeer.setRemoteDescription(desc);
    } catch (err) {
      logger.log(`Error in setting remote description ${err}`);
    }
  });

  receiveMessageFromSocket("set-remote-candidate", (message) => {
    const { rasigarId } = message;
    const DJPeer = DJPeers[rasigarId];
    var candidate = new RTCIceCandidate(message.candidate);
    logger.log("Adding received ICE candidate from slave");
    DJPeer.addIceCandidate(candidate);
  });
}

export function CreateRasigarPeer({
  clientId,
  kacheriId,
  audioPlayer = new Audio(),
}: {
  clientId: string;
  kacheriId: string;
  audioPlayer?: HTMLAudioElement;
}) {
  let rasigarPeer = new RTCPeerConnection({
    iceServers,
  });

  function streamReceiver({ streams: [stream] }: RTCTrackEvent) {
    logger.log("Received stream from master");
    if (audioPlayer.srcObject) return;
    audioPlayer.srcObject = stream;
    window.rtcStream = stream;
    audioPlayer.play();
  }

  function handleSlaveICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    logger.log("ice candidate handling");
    if (event.candidate) {
      sendMessageToSocket({
        clientId,
        kacheriId,
        type: "offer-candidate",
        candidate: event.candidate,
      });
    }
  }

  rasigarPeer.ontrack = streamReceiver;
  rasigarPeer.onicecandidate = handleSlaveICECandidateEvent;

  receiveMessageFromSocket("answer-request", async (message) => {
    var desc = new RTCSessionDescription(message.offer);
    logger.log("new RTCSessionDescription");

    const constraints: RTCAnswerOptions = {
      offerToReceiveAudio: true,
    };

    // If the connection isn't stable yet, wait for it...

    if (rasigarPeer.signalingState != "stable") {
      logger.log(
        "  - But the signaling state isn't stable, so triggering rollback"
      );

      // Set the local and remove descriptions for rollback; don't proceed
      // until both return.
      await Promise.all([
        rasigarPeer.setLocalDescription({ type: "rollback" }),
        rasigarPeer.setRemoteDescription(desc),
      ]);
      return;
    } else {
      logger.log("slave.setRemoteDescription");
      await rasigarPeer.setRemoteDescription(desc);

      let answer = await rasigarPeer.createAnswer(constraints);
      logger.log("slave.createAnswer");
      await rasigarPeer.setLocalDescription(answer);
      logger.log("slave.setLocalDescription");

      sendMessageToSocket({
        clientId,
        kacheriId,
        type: "answer",
        answer: rasigarPeer.localDescription,
      });
    }
  });

  receiveMessageFromSocket("set-remote-candidate", (message) => {
    if (rasigarPeer.remoteDescription) {
      var candidate = new RTCIceCandidate(message.candidate);
      logger.log("Adding received ICE candidate from master");
      rasigarPeer.addIceCandidate(candidate);
    }
  });
}

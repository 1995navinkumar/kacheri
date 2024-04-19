import { receiveMessage, sendMessage } from "./chromeMessageHandler";
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
  partyId,
  mediaStream,
}: {
  clientId: string;
  partyId: string;
  mediaStream: MediaStream;
}) {
  let DJPeer: RTCPeerConnection;

  const constraints: RTCOfferOptions = {
    offerToReceiveAudio: true,
  };

  function handleMasterICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      sendMessage({
        partyId,
        clientId,
        type: "offer-candidate",
        candidate: event.candidate,
      });
    }
  }

  async function handleNegotiationNeededEvent() {
    try {
      const offer = await DJPeer.createOffer(constraints);
      // If the connection hasn't yet achieved the "stable" state,
      // return to the caller. Another negotiationneeded event
      // will be fired when the state stabilizes.
      if (DJPeer.signalingState != "stable") {
        logger.log("     -- The connection isn't stable yet; postponing...");
        return;
      }

      await DJPeer.setLocalDescription(offer);
      logger.log("master.setLocalDescription");

      sendMessage({
        type: "offer",
        clientId,
        partyId,
        offer: DJPeer.localDescription,
      });
    } catch (error) {
      logger.log(`Failed in Negotiation ${error}`);
    }
  }

  receiveMessage("offer-request", (message) => {
    DJPeer = new RTCPeerConnection({
      iceServers,
    });

    DJPeer.onicecandidate = handleMasterICECandidateEvent;
    //Event triggered when negotiation can take place as RTCpeer won't be stable
    DJPeer.onnegotiationneeded = handleNegotiationNeededEvent;

    for (const track of mediaStream.getTracks()) {
      DJPeer.addTrack(track, mediaStream);
    }
  });

  receiveMessage("answer-response", async (message) => {
    try {
      logger.log("Answer Received");
      var desc = new RTCSessionDescription(message.answer);
      logger.log("new RTCSessionDescription");
      await DJPeer.setRemoteDescription(desc);
      logger.log("master.setRemoteDescription");
    } catch (err) {
      logger.log(`Error in setting remote description ${err}`);
    }
  });

  receiveMessage("set-remote-candidate", (message) => {
    var candidate = new RTCIceCandidate(message.candidate);
    logger.log("Adding received ICE candidate from slave");
    DJPeer.addIceCandidate(candidate);
  });
}

export function CreateRasigarPeer({
  clientId,
  partyId,
  audioPlayer = new Audio(),
}: {
  clientId: string;
  partyId: string;
  audioPlayer?: HTMLAudioElement;
}) {
  let rasigarPeer = new RTCPeerConnection({
    iceServers,
  });

  function streamReceiver({ streams: [stream] }: RTCTrackEvent) {
    logger.log("Received stream from master");
    if (audioPlayer.srcObject) return;
    audioPlayer.srcObject = stream;
    audioPlayer.play();
  }

  function handleSlaveICECandidateEvent(event: RTCPeerConnectionIceEvent) {
    logger.log("ice candidate handling");
    if (event.candidate) {
      sendMessageToSocket({
        clientId,
        partyId,
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
        partyId,
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

import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import {
  SlidingLeftDJScreen,
  SlidingLeftRasigarScreen,
} from "../SlidingComponents";
import { useConfig } from "../../Providers/ConfigProvider";
import useDJ from "../../hooks/useDJ";
import useRasigar from "../../hooks/useRasigar";

export default function CreateOrJoin(): JSX.Element {
  const { clientId, mode } = useConfig();
  const { transitionTo } = useScreenTransitioner();

  const { createParty } = useDJ({ clientId });
  const { joinParty } = useRasigar({ clientId });

  const onCreateParty = async () => {
    await createParty();
    transitionTo(SlidingLeftDJScreen);
  };

  const onJoinParty = async () => {
    await joinParty({ partyId: "kacheri" });
    transitionTo(SlidingLeftRasigarScreen);
  };

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">
        Get started joining an existing party
      </p>
      {mode === "extension" ? (
        <CreatePartyCta onCreateParty={onCreateParty} />
      ) : (
        <JoinPartyCta onJoinParty={onJoinParty} />
      )}
    </div>
  );
}

function JoinPartyCta({ onJoinParty }: { onJoinParty: () => void }) {
  return (
    <div className="party-cta flex-column">
      <input className="join-input" placeholder="Enter Party ID to join" />
      <button id="join-party-btn" onClick={onJoinParty}>
        Join Party
      </button>
    </div>
  );
}

function CreatePartyCta({ onCreateParty }: { onCreateParty: () => {} }) {
  return (
    <div className="party-cta flex-column">
      <button id="create-party-btn" onClick={onCreateParty}>
        Create Party
      </button>
    </div>
  );
}

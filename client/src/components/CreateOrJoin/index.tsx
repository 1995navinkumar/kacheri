import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import {
  SlidingLeftDJScreen,
  SlidingLeftRasigarScreen,
} from "../SlidingComponents";
import { useConfig } from "../../Providers/ConfigProvider";
import useDJ from "../../hooks/useDJ";
import useRasigar from "../../hooks/useRasigar";
import { useState } from "react";

export default function CreateOrJoin(): JSX.Element {
  const { clientId, mode } = useConfig();
  const { transitionTo } = useScreenTransitioner();

  const { createKacheri } = useDJ({ clientId });
  const { joinKacheri, audioControls } = useRasigar({ clientId });

  const onCreateKacheri = async () => {
    await createKacheri();
    transitionTo(SlidingLeftDJScreen);
  };

  const onJoinKacheri = async (kacheriId: string) => {
    await joinKacheri({ kacheriId });
    const RasigarScreenWithAudio = () => (
      <SlidingLeftRasigarScreen audioControls={audioControls} />
    );
    transitionTo(RasigarScreenWithAudio);
  };

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">
        Get started joining an existing Kacheri
      </p>
      {mode === "extension" ? (
        <CreateKacheriCta onCreateKacheri={onCreateKacheri} />
      ) : (
        <JoinKacheriCta onJoinKacheri={onJoinKacheri} />
      )}
    </div>
  );
}

function JoinKacheriCta({
  onJoinKacheri,
}: {
  onJoinKacheri: (k: string) => void;
}) {
  const [kacheriId, setKacheriId] = useState("");

  return (
    <form
      className="flex-column kacheri-cta"
      onSubmit={(e) => {
        e.preventDefault();
        onJoinKacheri(kacheriId);
      }}
    >
      <input
        required
        className="join-input"
        placeholder="Enter Kacheri ID to join"
        onChange={(e) => setKacheriId(e.target.value)}
      />
      <button className="cta-btn" type="submit">
        Join Kacheri
      </button>
    </form>
  );
}

function CreateKacheriCta({ onCreateKacheri }: { onCreateKacheri: () => {} }) {
  return (
    <div className="flex-column kacheri-cta">
      <button className="cta-btn" onClick={onCreateKacheri}>
        Create Kacheri
      </button>
    </div>
  );
}

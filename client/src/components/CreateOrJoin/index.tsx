import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import {
  SlidingLeftDJScreen,
  SlidingLeftRasigarScreen,
} from "../SlidingComponents";
import { useConfig } from "../../Providers/ConfigProvider";
import useDJ from "../../hooks/useDJ";
import useRasigar from "../../hooks/useRasigar";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../Providers/GlobalStateProvider";
import { AppActions } from "../../Providers/GlobalStateProvider/reducers/app";

export default function CreateOrJoin(): JSX.Element {
  const { clientId, mode } = useConfig();
  const { transitionTo } = useScreenTransitioner();
  const { dispatch } = useGlobalState();

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

  useEffect(() => {
    dispatch(AppActions.setNoOfRasigars(0));
  }, []);

  const linkCopied = false;
  const copyLink = () => {};
  const noOfRasigars = 1;
  const onKacheriStop = () => {};

  return (
    <div className="flex-column full-height" style={{ gap: "48px" }}>
      <div className="flex-1"></div>
      <div className="home-container flex-column" style={{ gap: "24px" }}>
        <p className="create-description ">
          Get started by {mode == "extension" ? "creating" : "joining"} a{" "}
          <span className="styled-app-name">Kacheri</span>
        </p>
        {mode === "extension" ? (
          <CreateKacheriCta onCreateKacheri={onCreateKacheri} />
        ) : (
          <JoinKacheriCta onJoinKacheri={onJoinKacheri} />
        )}
      </div>
    </div>
  );
}

function JoinKacheriCta({
  onJoinKacheri,
}: {
  onJoinKacheri: (k: string) => void;
}) {
  const params = new URLSearchParams(window.location.search);
  const [kacheriId, setKacheriId] = useState(params.get("kacheriId") ?? "");
  const { dispatch } = useGlobalState();

  useEffect(() => {
    const kacheriId = params.get("kacheriId");
    if (kacheriId) {
      dispatch(AppActions.setKacheriId(kacheriId));
    }
  }, []);

  return (
    <form
      className="flex-column kacheri-cta"
      onSubmit={(e) => {
        e.preventDefault();
        onJoinKacheri(kacheriId);
        dispatch(AppActions.setKacheriId(kacheriId));
      }}
    >
      <input
        required
        value={kacheriId}
        className="join-input"
        placeholder="Enter Kacheri ID to join"
        onChange={(e) => setKacheriId(e.target.value)}
      />
      <button className="cta-btn" type="submit">
        Join
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

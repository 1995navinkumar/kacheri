import { useEffect, useState } from "react";
import { receiveMessage } from "../../chromeMessageHandler";
import useBackgroundScript from "../../hooks/useBackgroundScript";
import { useConfig } from "../../Providers/ConfigProvider";
import { useGlobalState } from "../../Providers/GlobalStateProvider";
import { AppActions } from "../../Providers/GlobalStateProvider/reducers/app";
import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import { SlidingRightCreateOrJoin } from "../SlidingComponents";

const SERVER_URL =
  process.env.ENV === "production"
    ? "https://gently-concise-dogfish.ngrok-free.app/kacheri"
    : "http://localhost:8000";

export default function DJScreen(): JSX.Element {
  const { stopKacheri } = useBackgroundScript();
  const { transitionTo } = useScreenTransitioner();
  const { state, dispatch } = useGlobalState();
  const { clientId } = useConfig();
  const [linkCopied, setLinkCopied] = useState(false);
  const { noOfRasigars } = state.app;

  const onKacheriStop = () => {
    stopKacheri();
    dispatch(AppActions.setIsRecording(false));
    transitionTo(SlidingRightCreateOrJoin);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${SERVER_URL}?kacheriId=${clientId}`);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch(AppActions.setIsRecording(true));
    receiveMessage("peer-count", (message) => {
      const { count } = message;
      dispatch(AppActions.setNoOfRasigars(count));
    });
  }, []);

  return (
    <div className="flex-column align-center" style={{ gap: "48px" }}>
      <div className="flex-row align-center" style={{ gap: "12px" }}>
        <p className="create-description">Kacheri Started</p>
        <button className="cta-btn" onClick={copyLink}>
          {linkCopied ? "copied" : "copy link"}
        </button>
      </div>
      <div>Rasigars : {noOfRasigars}</div>
      <button className="cta-btn" onClick={onKacheriStop}>
        Stop Kacheri
      </button>
    </div>
  );
}

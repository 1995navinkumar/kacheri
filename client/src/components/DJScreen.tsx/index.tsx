import { useEffect } from "react";
import useBackgroundScript from "../../hooks/useBackgroundScript";
import { useGlobalState } from "../../Providers/GlobalStateProvider";
import { AppActions } from "../../Providers/GlobalStateProvider/reducers/app";
import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import { SlidingRightCreateOrJoin } from "../SlidingComponents";

export default function DJScreen(): JSX.Element {
  const { stopKacheri } = useBackgroundScript();
  const { transitionTo } = useScreenTransitioner();
  const { dispatch } = useGlobalState();

  const onKacheriStop = () => {
    stopKacheri();
    dispatch(AppActions.setIsRecording(false));
    transitionTo(SlidingRightCreateOrJoin);
  };

  useEffect(() => {
    dispatch(AppActions.setIsRecording(true));
  }, []);

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">Kacheri Started</p>
      <button className="cta-btn" onClick={onKacheriStop}>
        Stop Kacheri
      </button>
    </div>
  );
}

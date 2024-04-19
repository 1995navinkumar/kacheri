import { useEffect } from "react";
import useBackgroundScript from "../../hooks/useBackgroundScript";
import { useConfig } from "../../Providers/ConfigProvider";
import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import { setItem } from "../../utils";
import { SlidingRightCreateOrJoin } from "../SlidingComponents";

export default function DJScreen(): JSX.Element {
  const { clientId } = useConfig();
  const { stopKacheri } = useBackgroundScript();
  const { transitionTo } = useScreenTransitioner();

  const onKacheriStop = () => {
    stopKacheri();
    transitionTo(SlidingRightCreateOrJoin);
    setItem("recording-status", "none");
  };

  useEffect(() => {
    setItem("recording-status", "recording");
  }, []);

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">Kacheri Started</p>
      <button className="stop-btn" onClick={onKacheriStop}>
        Stop Kacheri
      </button>
    </div>
  );
}

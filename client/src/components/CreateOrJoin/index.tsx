import { createLogger } from "../../logger";
import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import {
  SlidingLeftDJScreen,
  SlidingLeftRasigarScreen,
} from "../SlidingComponents";
import { useConfig } from "../../Providers/ConfigProvider";
import useDJ from "./useDJ";

const logger = createLogger({ moduleName: "CreateOrJoin" });

export default function CreateOrJoin(): JSX.Element {
  const { transitionTo } = useScreenTransitioner();
  const { clientId } = useConfig();
  const { createParty } = useDJ({ clientId });

  const onCreateParty = async () => {
    try {
      await createParty();
      transitionTo(SlidingLeftDJScreen);
    } catch (err) {
      logger.error(err);
    }
  };

  const onJoinParty = () => {
    transitionTo(SlidingLeftRasigarScreen);
  };

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">
        Get started by creating a new party or joining an existing party
      </p>
      <div className="party-cta flex-column">
        <button id="create-party-btn" onClick={onCreateParty}>
          Create Party
        </button>
        <button id="join-party-btn" onClick={onJoinParty}>
          Join Party
        </button>
      </div>
    </div>
  );
}

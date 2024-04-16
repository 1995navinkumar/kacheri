import { useScreenTransitioner } from "../../Providers/TransitionProvider";
import { SlidingLeftParty } from "../SlidingComponents";

export default function CreateOrJoin(): JSX.Element {
  const { transitionTo } = useScreenTransitioner();

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">
        Get started by creating a new party or joining an existing party
      </p>
      <div className="party-cta flex-column">
        <button
          id="create-party-btn"
          onClick={() => transitionTo(SlidingLeftParty)}
        >
          Create Party
        </button>
        <button id="join-party-btn">Join Party</button>
      </div>
    </div>
  );
}

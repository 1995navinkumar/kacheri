import { getItem } from "../../../utils";
import { GlobalState, Action } from "../types";
import appReducer from "./app";

const reducers = [appReducer]; // Other reducers can be added as application grows

export function globalStateReducer(
  state: GlobalState,
  action: Action
): GlobalState {
  return reducers.reduce(
    (currentState, nextReducer) => nextReducer(currentState, action),
    state
  );
}

export const getInitialGlobalState = ({
  clientId,
}: {
  clientId: string;
}): GlobalState => {
  const defaultState = {
    app: {
      isRecording: false,
      noOfRasigars: 0,
    },
  };
  const state = getItem("app-state", JSON.stringify(defaultState));
  return {
    ...JSON.parse(state),
  };
};

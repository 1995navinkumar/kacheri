import {
  createContext,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { setItem } from "../../utils";
import { useConfig } from "../ConfigProvider";
import { globalStateReducer, getInitialGlobalState } from "./reducers";
import { GlobalState, StateContext, Action } from "./types";

const GlobalStateContext = createContext<StateContext | null>(null);

export const useGlobalState = (): StateContext => {
  const globalContext = useContext(GlobalStateContext);
  if (!globalContext) {
    throw new Error(
      "Wrap the component with GlobalStateProvider before using useGlobalState"
    );
  }
  return globalContext;
};

export default function GlobalStateProvider({
  children,
  reducer = globalStateReducer,
  initialState,
}: {
  children: React.ReactNode;
  reducer?: Reducer<GlobalState, Action>;
  initialState?: GlobalState;
}): JSX.Element {
  const { clientId } = useConfig();
  const [state, dispatch] = useReducer(
    reducer,
    initialState ?? getInitialGlobalState({ clientId })
  );

  useEffect(() => {
    // update local storage when state changes
    setItem("app-state", JSON.stringify(state));
  }, [state]);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

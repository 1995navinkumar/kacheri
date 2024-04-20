import { GlobalState, AppActionsList, AppActionsTypes } from "../types";

export const ActionTypes = {
  setIsRecording: "isRecording",
  setNoOfRasigars: "setNoOfRasigars",
  setKacheriId: "setKacheriId",
};

export default function appReducer(
  state: GlobalState,
  action: AppActionsList
): GlobalState {
  if (action.type === ActionTypes.setIsRecording) {
    return {
      ...state,
      app: {
        ...state.app,
        isRecording: action.payload.isRecording,
      },
    };
  }
  if (action.type === ActionTypes.setNoOfRasigars) {
    return {
      ...state,
      app: {
        ...state.app,
        noOfRasigars: action.payload.noOfRasigars,
      },
    };
  }

  if (action.type === ActionTypes.setKacheriId) {
    return {
      ...state,
      app: {
        ...state.app,
        kacheriId: action.payload.kacheriId,
      },
    };
  }

  return {
    ...state,
  };
}

export const AppActions = {
  setIsRecording: (isRecording) => ({
    type: ActionTypes.setIsRecording,
    payload: { isRecording },
  }),
  setNoOfRasigars: (noOfRasigars) => ({
    type: ActionTypes.setNoOfRasigars,
    payload: { noOfRasigars },
  }),
  setKacheriId: (kacheriId) => ({
    type: ActionTypes.setKacheriId,
    payload: { kacheriId },
  }),
} as AppActionsTypes;

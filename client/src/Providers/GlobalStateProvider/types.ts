import { Dispatch } from "react";

export type Payload = {
  [key: string]: any;
};

export type Action = {
  type: string;
  payload: Payload;
};

// --------- User Reducer ------------

export type AppState = {
  isRecording: boolean;
  noOfRasigars: number;
};

export type AppAction<T> = {
  type: string;
  payload: T;
};

export type SetIsRecording = {
  isRecording: boolean;
};

export type SetNoOfRasigars = {
  noOfRasigars: number;
};

export type AppActionsList = AppAction<SetIsRecording & SetNoOfRasigars>;

export type AppActionsTypes = {
  setIsRecording: (
    isRecording: boolean
  ) => AppAction<SetIsRecording>;
  setNoOfRasigars: (
    noOfRasigars: number
  ) => AppAction<SetNoOfRasigars>;
};

// --------- User State Ends ------------

export type GlobalState = {
  app: AppState;
};

export type StateContext = {
  state: GlobalState;
  dispatch: Dispatch<Action>;
};

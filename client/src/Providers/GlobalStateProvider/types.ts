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
  kacheriId?: string;
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

export type SetKacheriId = {
  kacheriId: string;
};

export type AppActionsList = AppAction<
  SetIsRecording & SetNoOfRasigars & SetKacheriId
>;

export type AppActionsTypes = {
  setIsRecording: (isRecording: boolean) => AppAction<SetIsRecording>;
  setNoOfRasigars: (noOfRasigars: number) => AppAction<SetNoOfRasigars>;
  setKacheriId: (id: string) => AppAction<SetKacheriId>;
};

// --------- User State Ends ------------

export type GlobalState = {
  app: AppState;
};

export type StateContext = {
  state: GlobalState;
  dispatch: Dispatch<Action>;
};

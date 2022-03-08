import { IpcMainEvent } from "electron";

export interface IIpcChannel {
  getName(): string;

  handle(event: IpcMainEvent, request: IIpcRequest): void;
}

export interface IIpcRequest {
  responseChannel?: string;
  data?: object;
}

export enum IpcChannel {
  SEND_CODE = "send-code",
  SIGN_IN = "sign-in",
}

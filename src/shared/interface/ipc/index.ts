import { IpcMainEvent } from "electron";

export interface IIpcChannel {
  getName(): string;

  handle(event: IpcMainEvent, request: IIpcRequest): void;
}

export interface IIpcRequest {
  action?: string;
  responseChannel?: string;
  data?: object;
}

export enum IpcChannel {
  TELEGRAM_AUTH = "telegram-auth",
  TELEGRAM_FILE = "telegram-file",
  TELEGRAM_MESSAGE = "telegram-message",
  DATABASE = "database",
}

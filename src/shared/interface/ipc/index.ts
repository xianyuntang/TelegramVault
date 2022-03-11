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

export enum TelegramAuthAction {
  CHECK_AUTH = "check-auth",
  SEND_CODE = "send-code",
  SIGN_IN = "sign-in",
  SIGN_IN_WITH_PASSWORD = "sign-in-with-password",
}

export enum TelegramFileAction {
  SAVE_FILE_PART = "save-file-part",
}

export enum IpcChannel {
  TELEGRAM_AUTH = "telegram-auth",
  TELEGRAM_FILE = "telegram-file",
}

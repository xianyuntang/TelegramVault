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
  DOWNLOAD_FILE = "download-file",
}

export enum TelegramMessageAction {
  SEND_MESSAGE_TO_ME = "send-message-to-me",
}

export enum DatabaseAction {
  LIST_DIRECTORIES = "list-directories",
  GET_DIRECTORY = "get-directory",
  GET_ROOT_DIRECTORY = "get-root-directory",
  GET_DIRECTORY_MENU = "get-directory-menu",
}

export enum IpcChannel {
  TELEGRAM_AUTH = "telegram-auth",
  TELEGRAM_FILE = "telegram-file",
  TELEGRAM_MESSAGE = "telegram-message",
  DATABASE = "database",
}

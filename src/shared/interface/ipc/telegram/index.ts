import { IFileEntity } from "../../db/file";
import { IMessage } from "../../gramjs/message";

export enum TelegramAction {
  CHECK_AUTH = "check-auth",
  SEND_CODE = "send-code",
  SIGN_IN = "sign-in",
  SIGN_IN_WITH_PASSWORD = "sign-in-with-password",
  DOWNLOAD_FILE = "download-file",
  SEND_MEDIA_TO_ME = "send-message-to-me",
}

export interface ISendMediaToMeRequestData {
  file: IFileEntity;
}

export interface IEditMessageRequestData extends ISendMediaToMeRequestData {
  id: number;
}

export interface ISendMediaToMeResponseData {
  message: IMessage;
  file: IFileEntity;
}

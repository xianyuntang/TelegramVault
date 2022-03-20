import { IMessage } from "./message";

export interface IDownloadFileRequestData {
  message?: IMessage;
  messageId?: number;
  filename?: string;
}

export interface IDownloadFileResponseData {
  data: Buffer;
}

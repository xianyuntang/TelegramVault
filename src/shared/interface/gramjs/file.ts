import { IMessage } from "./message";

export interface IDownloadFileRequestData {
  message: IMessage;
}

export interface IDownloadFileResponseData {
  data: Buffer;
}

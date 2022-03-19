import { IMessage } from "./message";


export interface Message {}

export interface IDownloadFileRequestData {
  message: IMessage;
}

export interface IDownloadFileResponseData {
  data: Buffer;
}

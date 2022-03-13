import { IMessage } from "./message";

export interface ISaveFilePartRequestData {
  fileId: BigInt;
  filePart: number;
  bytes: string;
}

export interface Message {}

export interface IDownloadFileRequestData {
  message: IMessage;
}

export interface IDownloadFileResponseData {
  data: Buffer;
}

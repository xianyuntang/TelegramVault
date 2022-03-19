export interface IDocument {
  id: { value: BigInt };
  accessHash: { value: BigInt };
  fileReference: Buffer;
  dcId: number;
  attributes: [any];
}

export interface IMedia {
  document: IDocument;
}

export interface IMessage {
  id: number;
  media: IMedia;
}

export interface IFileEntity {
  id?: number;
  directoryId: number;
  filename: string;
  filesize: number;
  filepath: string;
  fileExt: string;
  accessHash?: string;
  fileReference?: Buffer;
  messageId?: number;
}

export interface ISendMediaToMeRequestData {
  message?: string;
  file: IFileEntity;
}

export interface IEditMessageRequestData extends ISendMediaToMeRequestData {
  id: number;
}

export interface ISendMediaToMeResponseData {
  message: IMessage;
  file: IFileEntity;
}

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

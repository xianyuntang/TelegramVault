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

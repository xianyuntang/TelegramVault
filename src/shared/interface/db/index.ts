export interface IDirectoryEntity {
  parentId: number | null;
  id: number;
  name: string;
  expand?: boolean;
  children?: IDirectoryEntity[];
}

export interface IGetDirectoryRequestData {
  parentId: number | null;
}

export interface IGetFilesRequestData {
  directoryId: number;
}

export interface IDirectory {
  parentId: number;
  id: number;
  name: string;
  expand?: boolean;
  children?: IDirectory[];
}

export interface IGetDirectoryRequestData {
  parentId: number | null;
}

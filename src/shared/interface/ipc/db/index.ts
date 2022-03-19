export enum DatabaseAction {
  LIST_DIRECTORIES = "list-directories",
  GET_DIRECTORY = "get-directory",
  CREATE_DIRECTORY = "create-directory",
  DELETE_DIRECTORY = "delete-directory",
  GET_ROOT_DIRECTORY = "get-root-directory",
  GET_FILES = "get-files",
}

export interface IGetDirectoryRequestData {
  parentId: number | null;
}

export interface IGetFilesRequestData {
  directoryId: number;
}

export interface ICreateDirectoryRequestData {
  name: string;
  parentId: number;
}

export interface IDeleteDirectoryRequestData {
  id: number;
}

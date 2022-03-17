import { IDirectory } from "../shared/interface/db";

export enum ExplorerAction {
  SET_ROOT_DIRECTORY,
  SET_CURRENT_DIRECTORY_ID,
}

export interface ISetRootDirectory {
  type: ExplorerAction;
  rootDirectory: IDirectory;
}

export interface ISetCurrentDirectoryId {
  type: ExplorerAction;
  currentDirectoryId: number;
}

export type explorerActionType = ISetRootDirectory | ISetCurrentDirectoryId;

export const setRootDirectory = (
  rootDirectory: IDirectory
): explorerActionType => ({
  type: ExplorerAction.SET_ROOT_DIRECTORY,
  rootDirectory: rootDirectory,
});

export const setCurrentDirectoryId = (
  currentDirectoryId: number
): explorerActionType => ({
  type: ExplorerAction.SET_CURRENT_DIRECTORY_ID,
  currentDirectoryId: currentDirectoryId,
});

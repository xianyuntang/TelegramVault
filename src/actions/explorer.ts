import { IDirectoryEntity } from "../shared/interface/db/directory";

export enum ExplorerAction {
  SET_ROOT_DIRECTORY,
  SET_CURRENT_DIRECTORY,
}

export interface ISetRootDirectory {
  type: ExplorerAction;
  rootDirectory: IDirectoryEntity;
}

export interface ISetCurrentDirectory {
  type: ExplorerAction;
  currentDirectory: IDirectoryEntity;
}

export type explorerActionType = ISetRootDirectory | ISetCurrentDirectory;

export const setRootDirectory = (
  rootDirectory: IDirectoryEntity
): explorerActionType => ({
  type: ExplorerAction.SET_ROOT_DIRECTORY,
  rootDirectory: rootDirectory,
});

export const setCurrentDirectory = (
  currentDirectory: IDirectoryEntity
): explorerActionType => ({
  type: ExplorerAction.SET_CURRENT_DIRECTORY,
  currentDirectory: currentDirectory,
});

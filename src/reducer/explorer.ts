import { combineReducers } from "redux";
import { IDirectoryEntity } from "../shared/interface/db";
import {
  ExplorerAction,
  explorerActionType,
  ISetCurrentDirectory,
  ISetRootDirectory,
} from "../actions/explorer";
import Config from "../Config";

interface IRootDirectory {
  rootDirectory: IDirectoryEntity | null;
  currentDirectory: IDirectoryEntity;
}

const initialRootDirectory: IRootDirectory = {
  rootDirectory: null,
  currentDirectory: {
    id: Config.RootDirectoryId,
    parentId: null,
    name: "Root",
  },
};

export const explorer = (
  state: IRootDirectory = initialRootDirectory,
  action: explorerActionType
): IRootDirectory => {
  switch (action.type) {
    case ExplorerAction.SET_ROOT_DIRECTORY: {
      return {
        ...state,
        rootDirectory: (action as ISetRootDirectory).rootDirectory,
      } as IRootDirectory;
    }
    case ExplorerAction.SET_CURRENT_DIRECTORY: {
      return {
        ...state,
        currentDirectory: (action as ISetCurrentDirectory).currentDirectory,
      };
    }
    default:
      return state;
  }
};

export const explorerReducer = combineReducers({
  explorer,
});

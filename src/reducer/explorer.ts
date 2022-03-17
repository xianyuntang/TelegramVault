import { combineReducers } from "redux";
import { IDirectory } from "../shared/interface/db";
import {
  ExplorerAction,
  explorerActionType,
  ISetCurrentDirectoryId,
  ISetRootDirectory,
} from "../actions/explorer";
import Config from "../Config";

interface IRootDirectory {
  rootDirectory: IDirectory | null;
  currentDirectoryId: number;
}

const initialRootDirectory: IRootDirectory = {
  rootDirectory: null,
  currentDirectoryId: Config.RootDirectoryId,
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
    case ExplorerAction.SET_CURRENT_DIRECTORY_ID: {
      return {
        ...state,
        currentDirectoryId: (action as ISetCurrentDirectoryId)
          .currentDirectoryId,
      };
    }
    default:
      return state;
  }
};

export const explorerReducer = combineReducers({
  explorer,
});

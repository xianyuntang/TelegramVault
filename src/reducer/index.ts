import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { explorerReducer } from "./explorer";

export const rootReducer = combineReducers({
  authReducer,
  explorerReducer,
});

// RootState
export type stateType = ReturnType<typeof rootReducer>;

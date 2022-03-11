import { combineReducers } from "redux";
import { authReducer } from "./auth";

export const rootReducer = combineReducers({
    authReducer,
});

// RootState
export type stateType = ReturnType<typeof rootReducer>;

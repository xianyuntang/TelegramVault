import { combineReducers } from "redux";
import { authActionType } from "../actions/auth";

interface IAuthState {
  isAuth: boolean;
}

const initialAuthState: IAuthState = {
  isAuth: false,
};

export const auth = (
  state: IAuthState = initialAuthState,
  action: authActionType
): IAuthState => {
  switch (action.type) {
    case "SET_IS_AUTH": {
      return {
        ...state,
        isAuth: action.isAuth,
      } as IAuthState;
    }
    default:
      return state;
  }
};

export const authReducer = combineReducers({
  auth,
});

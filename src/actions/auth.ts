export const SET_IS_AUTH = "SET_IS_AUTH";

interface ISetAuth {
  type: typeof SET_IS_AUTH;
  isAuth: boolean;
}

export type authActionType = ISetAuth;

export const setIsAuth = (isAuth: boolean): authActionType => ({
  type: SET_IS_AUTH,
  isAuth: isAuth,
});

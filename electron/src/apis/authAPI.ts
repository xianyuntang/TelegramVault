import client, { apiCredentials } from "./telegramAPI";
import {
  ISignInRequestData,
  ISignInWithPasswordRequestData,
} from "../../../src/shared/interface/gramjs/auth";

const { Api } = require("telegram");
const Password = require("telegram/Password");

export const checkAuthorization = async()=>{
    return await client.checkAuthorization()
}

export const sendCode = async (phoneNumber: string) => {
  return await client.invoke(
    new Api.auth.SendCode({
      ...apiCredentials,
      phoneNumber,
      settings: new Api.CodeSettings({
        allowAppHash: true,
      }),
    })
  );
};

export const signIn = async (props: ISignInRequestData) => {
  return await client.invoke(new Api.auth.SignIn(props));
};

export const signInWithPassword = async (
  props: ISignInWithPasswordRequestData
) => {
  const passwordSrpResult = await client.invoke(
    new Api.account.GetPassword({})
  );
  const passwordSrpCheck = await Password.computeCheck(
    passwordSrpResult,
    props.password
  );
  return await client.invoke(
    new Api.auth.CheckPassword({ password: passwordSrpCheck })
  );
};

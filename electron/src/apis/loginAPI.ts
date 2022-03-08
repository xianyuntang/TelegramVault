import client, { apiCredentials } from "./telegramAPI";
import { ISignInRequestData } from "../../../src/shared/gramjs";

const { Api } = require("telegram");

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

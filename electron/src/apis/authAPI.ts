import client, { apiCredentials } from "./telegramAPI";

const { Api } = require("telegram");
const Password = require("telegram/Password");

export class AuthAPI {
  static checkAuthorization = async () => {
    return await client.checkAuthorization();
  };

  static sendCode = async (phoneNumber: string) => {
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

  static signIn = async (
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string
  ) => {
    return await client.invoke(
      new Api.auth.SignIn({ phoneNumber, phoneCodeHash, phoneCode })
    );
  };

  static signInWithPassword = async (password: string) => {
    const passwordSrpResult = await client.invoke(
      new Api.account.GetPassword({})
    );
    const passwordSrpCheck = await Password.computeCheck(
      passwordSrpResult,
      password
    );
    return await client.invoke(
      new Api.auth.CheckPassword({ password: passwordSrpCheck })
    );
  };
}

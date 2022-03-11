import client, { apiCredentials } from "./telegramAPI";
import {
  IPasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPowRequestData,
  ISignInRequestData,
} from "../../../src/shared/interface/gramjs/auth";

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

export const getPassword = async () => {
  console.log(123);
  return await client.invoke(new Api.account.GetPassword({}));
};

export const passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow =
  async (
    props: IPasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPowRequestData
  ) => {
    const srpGenerator: typeof Api.PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow =
      new Api.PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow(
        props
      );
    console.log(srpGenerator);
  };

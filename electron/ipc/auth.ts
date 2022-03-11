import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
  TelegramAuthAction,
} from "../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import {
  getPassword,
  passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow,
  sendCode,
  signIn,
} from "../src/apis/authAPI";

import {
  IPasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPowRequestData,
  ISendCodeRequestData,
  ISignInRequestData,
} from "../../src/shared/interface/gramjs/auth";
import client from "../src/apis/telegramAPI";

export const telegramAuthChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_AUTH,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    switch (request.action) {
      case TelegramAuthAction.SEND_CODE: {
        (async () => {
          const result = await sendCode(
            (request.data as ISendCodeRequestData).phoneNumber
          );
          event.sender.send(request.responseChannel as string, result);
        })();
        break;
      }
      case TelegramAuthAction.SIGN_IN: {
        (async () => {
          const result = await signIn(request.data as ISignInRequestData);
          event.sender.send(request.responseChannel as string, result);
          client.session.save();
        })();
        break;
      }
      case TelegramAuthAction.GET_PASSWORD: {
        (async () => {
          const result = await getPassword();
          event.sender.send(request.responseChannel as string, result);
          client.session.save();
        })();
        break;
      }
      case TelegramAuthAction.GET_SPR: {
        (async () => {
          const result =
            await passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow(
              request.data as IPasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPowRequestData
            );
          console.log(result);
        })();
      }
    }
  },
};

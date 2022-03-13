import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
  TelegramAuthAction,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { sendCode, signIn, signInWithPassword } from "../../src/apis/authAPI";

import {
  ISendCodeRequestData,
  ISignInRequestData,
  ISignInWithPasswordRequestData,
} from "../../../src/shared/interface/gramjs/auth";
import client from "../../src/apis/telegramAPI";

export const telegramAuthChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_AUTH,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    switch (request.action) {
      case TelegramAuthAction.CHECK_AUTH: {
        (async () => {
          event.sender.send(
            request.responseChannel as string,
            await client.checkAuthorization()
          );
        })();
        break;
      }
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
      case TelegramAuthAction.SIGN_IN_WITH_PASSWORD: {
        (async () => {
          const result = await signInWithPassword(
            request.data as ISignInWithPasswordRequestData
          );
          event.sender.send(request.responseChannel as string, result);
          client.session.save();
        })();
        break;
      }
    }
  },
};

import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { AuthAPI } from "../../src/apis/authAPI";
import {
  ISendCodeRequestData,
  ISignInRequestData,
  ISignInWithPasswordRequestData,
} from "../../../src/shared/interface/gramjs/auth";
import client from "../../src/apis/telegramAPI";
import { TelegramAuthAction } from "../../../src/shared/interface/ipc/telegram";
import { formatError } from "./utils";

export const telegramAuthChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_AUTH,
  async handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    switch (request.action) {
      case TelegramAuthAction.CHECK_AUTH: {
        try {
          const isLogin = await client.checkAuthorization();
          event.sender.send(request.responseChannel as string, isLogin);
        } catch (e) {
          event.sender.send(request.responseChannel as string, formatError(e));
        }

        break;
      }
      case TelegramAuthAction.SEND_CODE: {
        try {
          const result = await AuthAPI.sendCode(
            (request.data as ISendCodeRequestData).phoneNumber
          );
          event.sender.send(request.responseChannel as string, result);
        } catch (e) {
          event.sender.send(request.responseChannel as string, formatError(e));
        }
        break;
      }
      case TelegramAuthAction.SIGN_IN: {
        try {
          const result = await AuthAPI.signIn(
            request.data as ISignInRequestData
          );
          event.sender.send(request.responseChannel as string, result);
          client.session.save();
        } catch (e) {
          event.sender.send(request.responseChannel as string, formatError(e));
        }
        break;
      }
      case TelegramAuthAction.SIGN_IN_WITH_PASSWORD: {
        try {
          const result = await AuthAPI.signInWithPassword(
            request.data as ISignInWithPasswordRequestData
          );
          event.sender.send(request.responseChannel as string, result);
          client.session.save();
        } catch (e) {
          event.sender.send(request.responseChannel as string, formatError(e));
        }
        break;
      }
    }
  },
};

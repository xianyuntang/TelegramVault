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

    if (request.action === TelegramAuthAction.CHECK_AUTH) {
      try {
        const isLogin = await client.checkAuthorization();
        event.sender.send(request.responseChannel, isLogin);
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else if (request.action === TelegramAuthAction.SEND_CODE) {
      const requestData = request.data as ISendCodeRequestData;
      try {
        const response = await AuthAPI.sendCode(requestData.phoneNumber);
        event.sender.send(request.responseChannel, response);
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else if (request.action === TelegramAuthAction.SIGN_IN) {
      const requestData = request.data as ISignInRequestData;
      try {
        const response = await AuthAPI.signIn(
          requestData.phoneNumber,
          requestData.phoneCodeHash,
          requestData.phoneCode
        );
        event.sender.send(request.responseChannel, response);
        client.session.save();
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else if (request.action === TelegramAuthAction.SIGN_IN_WITH_PASSWORD) {
      const requestData = request.data as ISignInWithPasswordRequestData;
      try {
        const response = await AuthAPI.signInWithPassword(requestData.password);
        event.sender.send(request.responseChannel, response);
        client.session.save();
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else {
      throw new Error("Action does not exist");
    }
  },
};

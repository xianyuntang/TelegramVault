import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import {IpcMainEvent} from "electron";
import {AuthAPI} from "../../src/apis/authAPI";
import {
  ISendCodeRequestData,
  ISignInRequestData,
  ISignInWithPasswordRequestData,
} from "../../../src/shared/interface/gramjs/auth";
import client from "../../src/apis/telegramAPI";
import {
  ISendMediaToMeRequestData,
  ISendMediaToMeResponseData,
  TelegramAction,
} from "../../../src/shared/interface/ipc/telegram";
import {formatError} from "./utils";
import {
  IDownloadFileRequestData,
  IDownloadFileResponseData,
} from "../../../src/shared/interface/gramjs/file";
import {getMessage, sendMediaToMe} from "../../src/apis/messageAPI";
import {downloadFileFromMessage} from "../../src/apis/fileAPI";
import path = require("path");

export const telegramChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_AUTH,
  async handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    if (request.action === TelegramAction.CHECK_AUTH) {
      try {
        const isLogin = await client.checkAuthorization();
        event.sender.send(request.responseChannel, isLogin);
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else if (request.action === TelegramAction.SEND_CODE) {
      const requestData = request.data as ISendCodeRequestData;
      try {
        const response = await AuthAPI.sendCode(requestData.phoneNumber);
        event.sender.send(request.responseChannel, response);
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else if (request.action === TelegramAction.SIGN_IN) {
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
    } else if (request.action === TelegramAction.SIGN_IN_WITH_PASSWORD) {
      const requestData = request.data as ISignInWithPasswordRequestData;
      try {
        const response = await AuthAPI.signInWithPassword(requestData.password);
        event.sender.send(request.responseChannel, response);
        client.session.save();
      } catch (e) {
        event.sender.send(request.responseChannel, formatError(e));
      }
    } else if (request.action === TelegramAction.DOWNLOAD_FILE) {
      event.sender.startDrag({
        file: path.join(
            __dirname,
            (request.data as IDownloadFileRequestData).filename as string
        ),
        // @ts-ignore
        icon: path.join(__static, "images", "cloud-download.png"),
      });
      const requestData = request.data as IDownloadFileRequestData;
      const message = await getMessage(requestData.messageId as number);
      const response: IDownloadFileResponseData = await downloadFileFromMessage(
          message
      );
      event.sender.send(request.responseChannel as string, response);
    } else if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    } else if (request.action === TelegramAction.SEND_MEDIA_TO_ME) {
      const requestData = request.data as ISendMediaToMeRequestData;

      const message: ISendMediaToMeResponseData = await sendMediaToMe(
          requestData.file
      );
      event.sender.send(request.responseChannel as string, message);
    } else {
      throw new Error(`${request.action} action does not exist`);
    }
  },
};

import { IIpcChannel, IIpcRequest, IpcChannel } from "../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { signIn } from "../src/apis/authAPI";

import {
  ISendCodeRequestData,
  ISignInRequestData,
} from "../../src/shared/interface/gramjs/auth";
import { sendCode } from "../src/apis/authAPI";
import client from "../src/apis/telegramAPI";


export const sendCodeChannel: IIpcChannel = {
  getName: () => IpcChannel.SEND_CODE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    (async () => {
      const result = await sendCode(
        (request.data as ISendCodeRequestData).phoneNumber
      );
      event.sender.send(request.responseChannel as string, result);
    })();
  },
};

export const signInChannel: IIpcChannel = {
  getName: () => IpcChannel.SIGN_IN,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    (async () => {
      const result = await signIn(request.data as ISignInRequestData);
      event.sender.send(request.responseChannel as string, result);
      client.session.save();
    })();
  },
};

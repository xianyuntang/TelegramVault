import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
  TelegramMessageAction,
} from "../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { sendMediaToMe } from "../src/apis/messageAPI";
import { ISendMediaToMe } from "../../src/shared/interface/gramjs/auth";
import { IMessage } from "../../src/shared/interface/gramjs/message";

export const telegramMessageChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_MESSAGE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    switch (request.action) {
      case TelegramMessageAction.SEND_MESSAGE_TO_ME: {
        (async () => {
          const message: IMessage = await sendMediaToMe(
            request.data as ISendMediaToMe
          );
          event.sender.send(request.responseChannel as string, message);
        })();
        break;
      }
    }
  },
};

import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { sendMediaToMe } from "../../src/apis/messageAPI";
import {
  ISendMediaToMeRequestData,
  ISendMediaToMeResponseData,
  TelegramMessageAction,
} from "../../../src/shared/interface/ipc/telegram";

export const telegramMessageChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_MESSAGE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    switch (request.action) {
      case TelegramMessageAction.SEND_MEDIA_TO_ME: {
        (async () => {
          const message: ISendMediaToMeResponseData = await sendMediaToMe(
            request.data as ISendMediaToMeRequestData
          );
          event.sender.send(request.responseChannel as string, message);
        })();
        break;
      }
    }
  },
};

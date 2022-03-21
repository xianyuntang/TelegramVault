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
  async handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    if (request.action === TelegramMessageAction.SEND_MEDIA_TO_ME) {
      const requestData = request.data as ISendMediaToMeRequestData;

      const message: ISendMediaToMeResponseData = await sendMediaToMe(
        requestData.file,
      );
      event.sender.send(request.responseChannel as string, message);
    }
  },
};

import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { downloadFileFromMessage } from "../../src/apis/fileAPI";
import {
  IDownloadFileRequestData,
  IDownloadFileResponseData,
} from "../../../src/shared/interface/gramjs/file";
import { TelegramFileAction } from "../../../src/shared/interface/ipc/telegram";
import { getMessage } from "../../src/apis/messageAPI";

const path = require("path");

export const telegramFileChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_FILE,
  async handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    if (request.action === TelegramFileAction.DOWNLOAD_FILE) {
      event.sender.startDrag({
        file: path.join(
          __dirname,
          (request.data as IDownloadFileRequestData).filename
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
    }
  },
};

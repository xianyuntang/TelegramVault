import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
  TelegramFileAction,
} from "../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { downloadFileFromMessage } from "../src/apis/fileAPI";
import {
  IDownloadFileRequestData,
  IDownloadFileResponseData,
} from "../../src/shared/interface/gramjs/file";

export const telegramFileChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_FILE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    switch (request.action) {
      case TelegramFileAction.DOWNLOAD_FILE: {
        (async () => {
          const response: IDownloadFileResponseData =
            await downloadFileFromMessage(
              (request.data as IDownloadFileRequestData).message
            );
          event.sender.send(request.responseChannel as string, response);
        })();
        break;
      }
    }
  },
};

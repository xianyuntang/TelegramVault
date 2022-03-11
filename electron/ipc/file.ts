import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
  TelegramFileAction,
} from "../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { saveFilePart } from "../src/apis/fileAPI";
import { ISaveFilePartRequestData } from "../../src/shared/interface/gramjs/file";

export const telegramFileChannel: IIpcChannel = {
  getName: () => IpcChannel.TELEGRAM_FILE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    switch (request.action) {
      case TelegramFileAction.SAVE_FILE_PART: {
        (async () => {
          const result = await saveFilePart(
            request.data as ISaveFilePartRequestData
          );
          event.sender.send(request.responseChannel as string, result);
        })();
        break;
      }
    }
  },
};

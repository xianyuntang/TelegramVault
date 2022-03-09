import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { saveFilePart } from "../src/apis/fileAPI";
import { ISaveFilePartRequestData } from "../../src/shared/interface/gramjs/file";

export const saveFilePartChannel: IIpcChannel = {
  getName: () => IpcChannel.SAVE_FILE_PART,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    (async () => {
      const result = await saveFilePart(
        request.data as ISaveFilePartRequestData
      );
      event.sender.send(request.responseChannel as string, result);
    })();
  },
};

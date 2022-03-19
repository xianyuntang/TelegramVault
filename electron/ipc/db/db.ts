import {
  DatabaseAction,
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { getFiles, getRootDirectory } from "../../src/db/read";
import { IGetFilesRequestData } from "../../../src/shared/interface/db";

export const databaseChannel: IIpcChannel = {
  getName: () => IpcChannel.DATABASE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_${request.action}_response`;
    }
    switch (request.action) {
      case DatabaseAction.GET_ROOT_DIRECTORY: {
        (async () => {
          const response = await getRootDirectory();
          // root should be an element
          event.sender.send(request.responseChannel as string, response);
        })();
        break;
      }
      case DatabaseAction.GET_FILES: {
        (async () => {
          const response = await getFiles(
            (request.data as IGetFilesRequestData).directoryId
          );
          event.sender.send(request.responseChannel as string, response);
        })();
        break;
      }
    }
  },
};

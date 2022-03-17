import {
  DatabaseAction,
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import {getRootDirectory} from "../../src/db/read";

export const databaseChannel: IIpcChannel = {
  getName: () => IpcChannel.DATABASE,
  handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    switch (request.action) {
      case DatabaseAction.GET_DIRECTORY_MENU: {
        {
          (async () => {
            const response = await getRootDirectory();
            // root should be an element
            event.sender.send(request.responseChannel as string, response);
          })();
        }
        break;
      }
    }
  },
};

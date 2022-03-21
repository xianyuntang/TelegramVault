import {
  IIpcChannel,
  IIpcRequest,
  IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";

import { FileProvider } from "../../src/db/provider/file";
import { DirectoryProvider } from "../../src/db/provider/directory";
import {
  DatabaseAction,
  ICreateDirectoryRequestData,
  IDeleteDirectoryRequestData,
  IGetFilesRequestData,
} from "../../../src/shared/interface/ipc/db";
import { IDirectoryEntity } from "../../../src/shared/interface/db/directory";
import { fetchDatabase } from "../../src/db";

export const databaseChannel: IIpcChannel = {
  getName: () => IpcChannel.DATABASE,
  async handle(event: IpcMainEvent, request: IIpcRequest) {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    if (request.action === DatabaseAction.FETCH_DATABASE) {
      await fetchDatabase();
    } else if (request.action === DatabaseAction.GET_ROOT_DIRECTORY) {
      const response = await DirectoryProvider.getRootDirectory();
      // root should be an element
      event.sender.send(request.responseChannel as string, response);
    } else if (request.action === DatabaseAction.GET_FILES) {
      const response = await FileProvider.getFiles(
        (request.data as IGetFilesRequestData).directoryId
      );
      event.sender.send(request.responseChannel as string, response);
    } else if (request.action === DatabaseAction.DELETE_DIRECTORY) {
      const response = await DirectoryProvider.deleteDirectory(
        (request.data as IDeleteDirectoryRequestData).id
      );
      event.sender.send(request.responseChannel as string, response);
    } else if (request.action === DatabaseAction.CREATE_DIRECTORY) {
      const response: IDirectoryEntity =
        await DirectoryProvider.createDirectory(
          (request.data as ICreateDirectoryRequestData).parentId,
          (request.data as ICreateDirectoryRequestData).name
        );
      event.sender.send(request.responseChannel as string, response);
    }
  },
};

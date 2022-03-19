import { ServiceBase } from "../index";

import { IpcChannel } from "../../shared/interface/ipc";
import {
  DatabaseAction,
  IGetFilesRequestData,
} from "../../shared/interface/ipc/db";
import { IFileEntity } from "../../shared/interface/db/file";

class FileService extends ServiceBase {
  public getFiles = async (
    data: IGetFilesRequestData
  ): Promise<IFileEntity[]> => {
    return this.ipc.send(IpcChannel.DATABASE, DatabaseAction.GET_FILES, {
      data: data,
    });
  };
}

export const fileService = new FileService();

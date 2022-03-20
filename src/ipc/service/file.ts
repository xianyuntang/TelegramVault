import { ServiceBase } from "../index";

import { IpcChannel } from "../../shared/interface/ipc";
import {
  DatabaseAction,
  IGetFilesRequestData,
} from "../../shared/interface/ipc/db";
import { IFileEntity } from "../../shared/interface/db/file";
import { IDownloadFileRequestData } from "../../shared/interface/gramjs/file";
import { TelegramFileAction } from "../../shared/interface/ipc/telegram";

class FileService extends ServiceBase {
  public getFiles = async (
    data: IGetFilesRequestData
  ): Promise<IFileEntity[]> => {
    return this.ipc.send(IpcChannel.DATABASE, DatabaseAction.GET_FILES, {
      data: data,
    });
  };
  public downloadFile = async (
    data: IDownloadFileRequestData
  ): Promise<void> => {
    return this.ipc.send(
      IpcChannel.TELEGRAM_FILE,
      TelegramFileAction.DOWNLOAD_FILE,
      {
        data: data,
      }
    );
  };
}

export const fileService = new FileService();

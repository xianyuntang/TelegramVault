import { ServiceBase } from "../index";

import { IpcChannel } from "../../shared/interface/ipc";
import {
  DatabaseAction,
  ICreateDirectoryRequestData,
  IDeleteDirectoryRequestData,
} from "../../shared/interface/ipc/db";
import { IFileEntity } from "../../shared/interface/db/file";
import { IDirectoryEntity } from "../../shared/interface/db/directory";

export class DatabaseService extends ServiceBase {
  public fetchDatabase = async (): Promise<void> => {
    return this.ipc.send(IpcChannel.DATABASE, DatabaseAction.FETCH_DATABASE);
  };
}

export class FileService extends ServiceBase {
  public getFiles = async (directoryId: number): Promise<IFileEntity[]> => {
    return this.ipc.send(IpcChannel.DATABASE, DatabaseAction.GET_FILES, {
      data: { directoryId },
    });
  };
}

export class DirectoryService extends ServiceBase {
  public deleteDirectory = async (id: number): Promise<boolean> => {
    return this.ipc.send(IpcChannel.DATABASE, DatabaseAction.DELETE_DIRECTORY, {
      data: {
        id: id,
      } as IDeleteDirectoryRequestData,
    });
  };

  public createDirectory = async (
    data: ICreateDirectoryRequestData
  ): Promise<IDirectoryEntity> => {
    return this.ipc.send(IpcChannel.DATABASE, DatabaseAction.CREATE_DIRECTORY, {
      data: data,
    });
  };

  public getRootDirectory = async (): Promise<IDirectoryEntity> => {
    return this.ipc.send(
      IpcChannel.DATABASE,
      DatabaseAction.GET_ROOT_DIRECTORY
    );
  };
}


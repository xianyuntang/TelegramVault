import { db } from "./index";
import { IDirectoryEntity } from "../../../src/shared/interface/db";
import Config from "../../../src/Config";
import { IFileEntity } from "../../../src/shared/interface/gramjs/message";

export const getRootDirectory = async () => {
  const directories: IDirectoryEntity[] = await db.all(
    "SELECT * FROM directories"
  );
  const rootDirectoryNode = _createNewNode(directories[0]);
  const directoryMapper: { [key: number]: IDirectoryEntity } = {};
  directoryMapper[Config.RootDirectoryId] = rootDirectoryNode;
  for (let i = 1; i < directories.length; i++) {
    const newNode: IDirectoryEntity = _createNewNode(directories[i]);

    if (!((directories[i].parentId as number) in directoryMapper)) {
      directoryMapper[directories[i].id] = newNode;
    } else {
      directoryMapper[directories[i].parentId as number].children?.push(
        newNode
      );
      directoryMapper[directories[i].id] = newNode;
    }
  }
  return rootDirectoryNode;
};

const _createNewNode = (directory: IDirectoryEntity) => {
  return {
    ...directory,
    expand: false,
    children: [],
  };
};

export const getFiles = async (directoryId: number) => {
  const files: IFileEntity[] = await db.all(
    "SELECT * FROM files WHERE directoryId = ?",
    directoryId
  );
  return files;
};

export const getFile = async (id: number): Promise<IFileEntity> => {
  return db.get("SELECT * FROM files WHERE id = ?", id);
};

import { db } from "./index";
import { IDirectory } from "../../../src/shared/interface/db";
import Config from "../../../src/Config";

export const getRootDirectory = async () => {
  const directories: IDirectory[] = await db.all("SELECT * FROM directories");
  const rootDirectoryNode = createNewNode(directories[0]);
  const directoryMapper: { [key: number]: IDirectory } = {};
  directoryMapper[Config.RootDirectoryId] = rootDirectoryNode;
  for (let i = 1; i < directories.length; i++) {
    const newNode: IDirectory = createNewNode(directories[i]);

    if (!(directories[i].parentId in directoryMapper)) {
      directoryMapper[directories[i].id] = newNode;
    } else {
      directoryMapper[directories[i].parentId].children?.push(newNode);
      directoryMapper[directories[i].id] = newNode;
    }
  }
  return rootDirectoryNode;
};

const createNewNode = (directory: IDirectory) => {
  return {
    ...directory,
    expand: false,
    children: [],
  };
};

import { db, saveDatabase } from "../index";
import { IDirectoryEntity } from "../../../../src/shared/interface/db";
import Config from "../../../../src/Config";

export class DirectoryProvider {
  static getRootDirectory = async (): Promise<IDirectoryEntity> => {
    const directories: IDirectoryEntity[] = await db.all(
      "SELECT * FROM directories"
    );
    const rootDirectoryNode = this._createNewNode(directories[0]);
    const directoryMapper: { [key: number]: IDirectoryEntity } = {};
    directoryMapper[Config.RootDirectoryId] = rootDirectoryNode;
    for (let i = 1; i < directories.length; i++) {
      const newNode: IDirectoryEntity = this._createNewNode(directories[i]);

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
  static createDirectory = async (name: string): Promise<IDirectoryEntity> => {
    const response = await db.run(
      "INSERT INTO directories (name) VALUES (?)",
      name
    );
    await saveDatabase();
    return this.getDirectory(response.lastID);
  };

  static getDirectory = async (id: number): Promise<IDirectoryEntity> => {
    return db.get("SELECT * FROM directories WHERE id = ?", id);
  };
  private static _createNewNode = (directory: IDirectoryEntity) => {
    return {
      ...directory,
      expand: false,
      children: [],
    };
  };
}

import { db, saveDatabase } from "../index";
import Config from "../../../../src/Config";
import { IDirectoryEntity } from "../../../../src/shared/interface/db/directory";

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
        directoryMapper[directories[i].id as number] = newNode;
      } else {
        directoryMapper[directories[i].parentId as number].children?.push(
          newNode
        );
        directoryMapper[directories[i].id as number] = newNode;
      }
    }
    return rootDirectoryNode;
  };
  static createDirectory = async (
    parentId: number,
    name: string
  ): Promise<IDirectoryEntity> => {
    const response = await db.run(
      "INSERT INTO directories (parentId, name) VALUES (?, ?)",
      parentId,
      name
    );
    await saveDatabase();
    return this.getDirectory(response.lastID);
  };

  static deleteDirectory = async (id: number): Promise<boolean> => {
    const exist = await this.getDirectory(id);
    if (exist) {
      const response = await db.run("DELETE FROM directories WHERE id =?", id);
      return !!response.changes;
    } else {
      return false;
    }
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

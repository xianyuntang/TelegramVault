import { db, saveDatabase } from "../index";
import { IFileEntity } from "../../../../src/shared/interface/db/file";

export class FileProvider {
  static createFile = async (fileEntity: IFileEntity): Promise<IFileEntity> => {
    const response = await db.run(
      "INSERT INTO files  (directoryId, filename, filesize,fileExt, accessHash, fileReference, messageId) VALUES (?,?,?,?,?,?,?)",
      fileEntity.directoryId,
      fileEntity.filename,
      fileEntity.filesize,
      fileEntity.fileExt,
      fileEntity.accessHash,
      fileEntity.fileReference,
      fileEntity.messageId
    );
    await saveDatabase();
    return this.getFile(response.lastID);
  };
  static getFiles = async (directoryId: number): Promise<IFileEntity[]> => {
    return db.all("SELECT * FROM files WHERE directoryId = ?", directoryId);
  };
  static getFile = async (id: number): Promise<IFileEntity> => {
    return db.get("SELECT * FROM files WHERE id = ?", id);
  };
}

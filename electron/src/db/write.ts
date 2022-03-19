import { db, saveDatabase } from "./index";
import { IFileEntity } from "../../../src/shared/interface/gramjs/message";
import { getFile } from "./read";

export const createDirectory = (name: string) => {
  const stmt = db.prepare("INSERT INTO directories (name) VALUES (?)");
  stmt.run(name);
};

export const createFile = async (fileEntity: IFileEntity) => {
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
  return getFile(response.lastID);
};

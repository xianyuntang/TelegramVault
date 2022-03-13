import { getDbMessages, sendMediaToMe } from "../apis/messageAPI";
import { ISendMediaToMe } from "../../../src/shared/interface/gramjs/auth";
import { downloadFileFromMessage } from "../apis/fileAPI";

const fs = require("fs");
const temp = require("temp").track();
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const tempDbPath = temp.path({ suffix: ".db" });

export let db: typeof sqlite3.Database = undefined;

export const initDB = async () => {
  await db.run(
    "CREATE TABLE directories\n" +
      "(\n" +
      "    id        INTEGER\n" +
      "        constraint directories_pk\n" +
      "            PRIMARY KEY AUTOINCREMENT,\n" +
      "    parentId INTEGER\n" +
      "        constraint directories_parentId_fk\n" +
      "            references directories (id),\n" +
      "    name      CHAR(50) NOT NULL\n" +
      ")\n"
  );
  await db.run("INSERT INTO directories (name) VALUES ('Root')");
  await db.run("INSERT INTO directories (parentId,name) VALUES (1,'R1')");
  await db.run("INSERT INTO directories (parentId,name) VALUES (2,'R1-1')");
  await db.run("INSERT INTO directories (parentId,name) VALUES (2,'R1-2')");
  await db.run("INSERT INTO directories (parentId,name) VALUES (1,'R2')");

  await db.run(
    "CREATE TABLE files\n" +
      "(\n" +
      "    id             INTEGER\n" +
      "        constraint files_pk\n" +
      "            PRIMARY KEY AUTOINCREMENT,\n" +
      "    directoryId   INTEGER\n" +
      "        constraint files_directoriesId_fk\n" +
      "            references directories (id),\n" +
      "    filename       CHAR(50) NOT NULL,\n" +
      "    filesize       INTEGER  NOT NULL,\n" +
      "    accessHash    INTEGER,\n" +
      "    fileReference BLOB,\n" +
      "    messageId     INTEGER\n" +
      ")"
  );

  await writeDatabase();
};

export const fetchDatabase = async () => {
  db = await sqlite.open({
    filename: tempDbPath,
    driver: sqlite3.Database,
  });
  console.log(db);
  const message = await getDbMessages();
  if (message.total) {
    const file = await downloadFileFromMessage(message[0]);
    fs.writeFileSync(tempDbPath, file.data);
  } else {
    await initDB();
  }
};

const writeDatabase = async () => {
  await sendMediaToMe({
    filename: "telegram-vault.db",
    filepath: tempDbPath,
    message: "Do not delete this file !!!",
  } as ISendMediaToMe);
};

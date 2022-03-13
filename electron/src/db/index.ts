import { getDbMessages, sendMediaToMe } from "../apis/messageAPI";
import { ISendMediaToMe } from "../../../src/shared/interface/gramjs/auth";
import { downloadFileFromMessage } from "../apis/fileAPI";

const fs = require("fs");
const { Database } = require("sqlite3");
const temp = require("temp").track();
const sqlite3 = require("sqlite3").verbose();

const tempDbPath = temp.path({ suffix: ".db" });
export const db: typeof Database = new sqlite3.Database(tempDbPath);

export const initDB = () => {
  db.serialize(() => {
    db.run(
      "CREATE TABLE directories\n" +
        "(\n" +
        "    id        INTEGER\n" +
        "        constraint directories_pk\n" +
        "            PRIMARY KEY AUTOINCREMENT,\n" +
        "    parent_id INTEGER\n" +
        "        constraint directories_parent_id_fk\n" +
        "            references directories (id),\n" +
        "    name      CHAR(50) NOT NULL\n" +
        ")\n"
    );
    db.run("INSERT INTO directories (name) VALUES ('Root')");
    db.run(
      "CREATE TABLE files\n" +
        "(\n" +
        "    id             INTEGER\n" +
        "        constraint files_pk\n" +
        "            PRIMARY KEY AUTOINCREMENT,\n" +
        "    directory_id   INTEGER\n" +
        "        constraint files_directories_id_fk\n" +
        "            references directories (id),\n" +
        "    filename       CHAR(50) NOT NULL,\n" +
        "    filesize       INTEGER  NOT NULL,\n" +
        "    access_hash    INTEGER,\n" +
        "    file_reference BLOB,\n" +
        "    message_id     INTEGER\n" +
        ")"
    );
  });
  db.close(async () => {
    await writeDatabase();
  });
};

export const fetchDatabase = async () => {
  const message = await getDbMessages();
  if (message.total) {
    const file = await downloadFileFromMessage(message[0]);
    fs.writeFileSync(file.filename, file.data);
  } else {
    initDB();
  }
};

const writeDatabase = async () => {
  await sendMediaToMe({
    filename: "telegram-vault.db",
    filepath: tempDbPath,
    message: "Do not delete this file !!!",
  } as ISendMediaToMe);
};

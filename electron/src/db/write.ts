import { db } from "./index";

export const createDirectory = (name: string) => {
  const stmt = db.prepare("INSERT INTO directory (name) VALUES (?)");
  stmt.run(name);
};



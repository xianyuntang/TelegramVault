import client from "./telegramAPI";
import * as fs from "fs";
import { ISendMediaToMe } from "../../../src/shared/interface/gramjs/auth";
import { IMessage } from "../../../src/shared/interface/gramjs/message";

const { CustomFile } = require("telegram/client/uploads");
const { Api } = require("telegram");

export const sendMediaToMe = async (props: ISendMediaToMe) => {
  const fileStat = fs.statSync(props.filepath);

  const updates = await client.invoke(
    new Api.messages.SendMedia({
      peer: "me",
      media: new Api.InputMediaUploadedDocument({
        file: await client.uploadFile({
          file: new CustomFile(props.filename, fileStat.size, props.filepath),
          workers: 1,
        }),
        attributes: [
          new Api.DocumentAttributeFilename({ fileName: props.filename }),
        ],
        mimeType: "",
      }),
      message: props.message || "",
      randomId: BigInt(new Date().getTime()),
      noWebpage: true,
      scheduleDate: 43,
    })
  );
  return updates.updates[1].message as IMessage;
};

export const getDbMessages = async () => {
  return await client.getMessages("me", {
    limit: 1,
    search: "telegram-vault.db",
  });
};

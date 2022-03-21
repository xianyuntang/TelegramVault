import client from "./telegramAPI";

import { FileProvider } from "../db/provider/file";
import { IFileEntity } from "../../../src/shared/interface/db/file";
import { ISendMediaToMeResponseData } from "../../../src/shared/interface/ipc/telegram";
import {IDocument, IMessage} from "../../../src/shared/interface/gramjs/message";

const { CustomFile } = require("telegram/client/uploads");
const { Api } = require("telegram");
const path = require("path");

export const sendMediaToMe = async (
  file: IFileEntity,
  message?: string
): Promise<ISendMediaToMeResponseData> => {
  const updates = await client.invoke(
    new Api.messages.SendMedia({
      peer: "me",
      media: new Api.InputMediaUploadedDocument({
        file: await client.uploadFile({
          file: new CustomFile(file.filename, file.filesize, file.filepath),
          workers: 2,
        }),
        attributes: [
          new Api.DocumentAttributeFilename({ fileName: file.filename }),
        ],
        mimeType: path.extname(file.filepath),
      }),
      message: message || "",
      randomId: BigInt(new Date().getTime()),
      noWebpage: true,
    })
  );
  const document = ((updates.updates[1].message as IMessage).media.document as IDocument)
  const newFile: IFileEntity = {
    ...file,
    fileExt: path.extname(file.filepath),
    fileReference: document.fileReference,
    accessHash: document.accessHash.value.toString(),
    messageId: (updates.updates[1].message as IMessage).id,
  };
  const fileEntity = await FileProvider.createFile(newFile);
  return { message: updates.updates[1].message as IMessage, file: fileEntity };
};

export const editMessage = async (
  id: number,
  file: IFileEntity,
  message?: string
) => {
  const updates = await client.invoke(
    new Api.messages.EditMessage({
      peer: "me",
      id: id,
      media: new Api.InputMediaUploadedDocument({
        file: await client.uploadFile({
          file: new CustomFile(file.filename, file.filesize, file.filepath),
          workers: 2,
        }),
        attributes: [
          new Api.DocumentAttributeFilename({ fileName: file.filename }),
        ],
        mimeType: path.extname(file.filepath),
      }),
      message: message || "",
      randomId: BigInt(new Date().getTime()),
      noWebpage: true,
    })
  );
  // TODO  edit database

  return updates.updates[0].message as IMessage;
};

export const getMessage = async (id: number): Promise<IMessage> => {
    const messages = await client.getMessages("me", { ids: id });
    return messages[0]
};

export const getDbMessages = async (): Promise<IMessage[]> => {
  return await client.getMessages("me", {
    limit: 1,
    search: "telegram-vault.db",
  });
};

import client from "./telegramAPI";

import { FileProvider } from "../db/provider/file";
import { IFileEntity } from "../../../src/shared/interface/db/file";
import {
  IEditMessageRequestData,
  ISendMediaToMeRequestData,
  ISendMediaToMeResponseData,
} from "../../../src/shared/interface/ipc/telegram";
import { IMessage } from "../../../src/shared/interface/gramjs/message";

const { CustomFile } = require("telegram/client/uploads");
const { Api } = require("telegram");
const path = require("path");

export const sendMediaToMe = async (
  props: ISendMediaToMeRequestData
): Promise<ISendMediaToMeResponseData> => {
  const { file, message } = props;

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
  const newFile: IFileEntity = {
    ...file,
    fileExt: path.extname(file.filepath),
    fileReference: (updates.updates[1].message as IMessage).media.document
      .fileReference,
    accessHash: (
      updates.updates[1].message as IMessage
    ).media.document.accessHash.value.toString(),
    messageId: (updates.updates[1].message as IMessage).id,
  };
  const fileEntity = await FileProvider.createFile(newFile);
  return { message: updates.updates[1].message as IMessage, file: fileEntity };
};

export const editMessage = async (props: IEditMessageRequestData) => {
  const { id, file, message } = props;

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

export const getDbMessages = async (): Promise<IMessage[]> => {
  return await client.getMessages("me", {
    limit: 1,
    search: "telegram-vault.db",
  });
};

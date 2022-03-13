import client from "./telegramAPI";
import { IMessage } from "../../../src/shared/interface/gramjs/message";

const { Api } = require("telegram");

export const downloadFileFromMessage = async (message: IMessage) => {
  console.log(message.media.document.attributes);
  return {
    data: await client.downloadFile(
      new Api.InputDocumentFileLocation({
        id: message.media.document.id.value,
        accessHash: message.media.document.accessHash.value,
        fileReference: Buffer.from(message.media.document.fileReference),
        thumbSize: "",
      }),
      {
        dcId: message.media.document.dcId,
      }
    ),
    filename: message.media.document.attributes[0].fileName,
  };
};

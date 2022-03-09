import client from "./telegramAPI";

import { ISaveFilePartRequestData } from "../../../src/shared/interface/gramjs/file";

const { Api } = require("telegram");

export const saveFilePart = async (props: ISaveFilePartRequestData) => {
  return await client.invoke(
    new Api.upload.SaveFilePart({ ...props, bytes: Buffer.from(props.bytes) })
  );
};

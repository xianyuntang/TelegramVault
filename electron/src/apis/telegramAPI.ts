import Config from "../../../src/Config";

const { TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");

interface IApiCredentials {
  apiId: number;
  apiHash: string;
}

export const apiCredentials: IApiCredentials = {
  apiId: parseInt(Config.API_ID as string),
  apiHash: Config.API_HASH as string,
};

const client: typeof TelegramClient = new TelegramClient(
  new StoreSession(Config.TelegramSessionName),
  apiCredentials.apiId,
  apiCredentials.apiHash
);

export const connectTelegramClient = async (
  type: "production" | "development"
) => {
  if (type == "development") {
    // client.session.setDC(2, "149.154.167.40", 443);
  }

  await client.connect();
};

export default client;

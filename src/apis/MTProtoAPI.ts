import {TelegramClient} from "telegram";

import {StringSession} from "telegram/sessions";

interface IApiCredentials {
    apiId: number,
    apiHash: string
}

export const apiCredentials:IApiCredentials = {
    apiId: parseInt(<string>process.env.APIID),
    apiHash: process.env.APIHASH || ""
}


const client = new TelegramClient(new StringSession(''), apiCredentials.apiId, apiCredentials.apiHash, {});

export default client



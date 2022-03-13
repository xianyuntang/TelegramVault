import { telegramAuthChannel } from "./auth";
import { telegramMessageChannel } from "./message";
import { telegramFileChannel } from "./file";

export const registeredChannel = [
  telegramAuthChannel,
  telegramMessageChannel,
  telegramFileChannel,
];

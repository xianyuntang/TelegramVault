import telegramChannel from "./telegram/index";
import databaseChannel from "./db";

export const registeredChannel = [...telegramChannel, ...databaseChannel];

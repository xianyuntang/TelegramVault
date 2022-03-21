import { DatabaseService, DirectoryService, FileService } from "./db";
import { TelegramService } from "./telegram";

export const databaseService = new DatabaseService();
export const fileService = new FileService();
export const directoryService = new DirectoryService();
export const telegramService = new TelegramService();

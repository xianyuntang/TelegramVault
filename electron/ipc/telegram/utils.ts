import {ITelegramError} from "../../../src/shared/interface/gramjs";

export const formatError = (e: unknown): ITelegramError => {
    return JSON.parse(JSON.stringify(e));
};
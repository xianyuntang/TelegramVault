import {IpcChannel} from "../../shared/interface/ipc";
import {ServiceBase} from "../index";

import {
    ISendMediaToMeResponseData,
    TelegramAction,
} from "../../shared/interface/ipc/telegram";
import {
    ISendCodeResponseData,
    ISignInResponseData,
    ISignInWithPasswordRequestData,
} from "../../shared/interface/gramjs/auth";
import {IFileEntity} from "../../shared/interface/db/file";

export class TelegramService extends ServiceBase {
    public downloadFile = async (messageId: number, filename: string) => {
        return await this.ipc.send(
            IpcChannel.TELEGRAM_FILE,
            TelegramAction.DOWNLOAD_FILE,
            {
                data: {messageId, filename},
            }
        );
    };
    public sendMediaToMe = (
        file: IFileEntity
    ): Promise<ISendMediaToMeResponseData> => {
        return this.ipc.send(
            IpcChannel.TELEGRAM_MESSAGE,
            TelegramAction.SEND_MEDIA_TO_ME,
            {
                data: {file},
            }
        );
    };

    public checkAuth = (): Promise<boolean> => {
        return this.ipc.send(IpcChannel.TELEGRAM_AUTH, TelegramAction.CHECK_AUTH);
    };

    public sendCode = (phoneNumber: string): Promise<ISendCodeResponseData> => {
        return this.ipc.send(IpcChannel.TELEGRAM_AUTH, TelegramAction.SEND_CODE, {
            data: {phoneNumber},
        });
    };

    public signIn = (
        phoneNumber: string,
        phoneCodeHash: string,
        phoneCode: string
    ): Promise<ISignInResponseData> => {
        return this.ipc.send(IpcChannel.TELEGRAM_AUTH, TelegramAction.SIGN_IN, {
            data: {phoneNumber, phoneCodeHash, phoneCode},
        });
    };

    public signInWithPassword = (
        password: string
    ): Promise<ISignInWithPasswordRequestData> => {
        return this.ipc.send(
            IpcChannel.TELEGRAM_AUTH,
            TelegramAction.SIGN_IN_WITH_PASSWORD,
            {
                data: {password},
            }
        );
    };
}



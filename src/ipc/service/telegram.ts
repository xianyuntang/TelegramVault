import {IpcChannel} from "../../shared/interface/ipc";
import {IDownloadFileRequestData} from "../../shared/interface/gramjs/file";
import {ServiceBase} from "../index";

import {
    ISendMediaToMeRequestData,
    ISendMediaToMeResponseData,
    TelegramAuthAction,
    TelegramFileAction,
    TelegramMessageAction,
} from "../../shared/interface/ipc/telegram";
import {
    ISendCodeRequestData,
    ISendCodeResponseData,
    ISignInRequestData,
    ISignInResponseData,
    ISignInWithPasswordRequestData,
} from "../../shared/interface/gramjs/auth";

class TelegramService extends ServiceBase {
    public downloadFile = async (data: IDownloadFileRequestData) => {
        return await this.ipc.send(
            IpcChannel.TELEGRAM_FILE,
            TelegramFileAction.DOWNLOAD_FILE,
            {
                data: data,
            }
        );
    };
    public sendMediaToMe = (
        data: ISendMediaToMeRequestData
    ): Promise<ISendMediaToMeResponseData> => {
        return this.ipc.send(
            IpcChannel.TELEGRAM_MESSAGE,
            TelegramMessageAction.SEND_MEDIA_TO_ME,
            {
                data: data,
            }
        );
    };

    public checkAuth = (): Promise<boolean> => {
        return this.ipc.send(
            IpcChannel.TELEGRAM_AUTH,
            TelegramAuthAction.CHECK_AUTH
        );
    };

    public sendCode = (
        data: ISendCodeRequestData
    ): Promise<ISendCodeResponseData> => {
        return this.ipc.send(
            IpcChannel.TELEGRAM_AUTH,
            TelegramAuthAction.SEND_CODE,
            {
                data: data,
            }
        );
    };

    public signIn = (data: ISignInRequestData): Promise<ISignInResponseData> => {
        return this.ipc.send(IpcChannel.TELEGRAM_AUTH, TelegramAuthAction.SIGN_IN, {
            data: data,
        });
    };

    public signInWithPassword = (
        data: ISignInWithPasswordRequestData
    ): Promise<ISignInWithPasswordRequestData> => {
        return this.ipc.send(
            IpcChannel.TELEGRAM_AUTH,
            TelegramAuthAction.SIGN_IN_WITH_PASSWORD,
            {
                data: data,
            }
        );
    };
}


export const telegramService = new TelegramService();

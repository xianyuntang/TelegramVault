import { IpcChannel } from "../../shared/interface/ipc";
import { IDownloadFileRequestData } from "../../shared/interface/gramjs/file";
import { ServiceBase } from "../index";

import {
  ISendMediaToMeRequestData,
  ISendMediaToMeResponseData,
  TelegramFileAction,
  TelegramMessageAction,
} from "../../shared/interface/ipc/telegram";

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
}

export const telegramService = new TelegramService();

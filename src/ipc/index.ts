import { IpcRenderer } from "electron";
import { IIpcRequest } from "../shared/ipc/interface";

export class IpcService {
  private ipcRenderer?: IpcRenderer;

  public send<T>(channel: string, request: IIpcRequest = {}): Promise<T> {
    if (!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`;
    }

    if (!this.ipcRenderer) {
      this.initializeIpcRenderer();
    }
    const ipcRenderer = this.ipcRenderer;
    ipcRenderer?.send(channel, request);
    return new Promise((resolve) => {
      ipcRenderer?.once(
        request.responseChannel as string,
        (event, response) => {
          resolve(response);
        }
      );
    });
  }

  private initializeIpcRenderer() {
    this.ipcRenderer = window.require("electron").ipcRenderer;
  }
}

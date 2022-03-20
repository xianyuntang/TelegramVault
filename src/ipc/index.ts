import {IIpcRequest} from "../shared/interface/ipc";

export class IpcService {
    public send<T>(
        channel: string,
        action: string,
        request: IIpcRequest = {}
    ): Promise<T> {
        if (!request.responseChannel) {
            request.responseChannel = `${channel}_${action}_response_${new Date().getTime()}`;
        }
        if (!request.action) {
            request.action = action;
        }

        // @ts-ignore
        window.api.send(channel, request);
        return new Promise((resolve, reject) => {
            // @ts-ignore
            window.api.receive(request.responseChannel as string, (response: any) => {
                if (response.hasOwnProperty("code")) {
                    reject(response);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

export class ServiceBase {
    protected ipc: IpcService = new IpcService();
}

import {
    DatabaseAction,
    IIpcChannel,
    IIpcRequest,
    IpcChannel,
} from "../../../src/shared/interface/ipc";
import { IpcMainEvent } from "electron";
import { listDirectories } from "../../src/db/read";

export const databaseChannel: IIpcChannel = {
    getName: () => IpcChannel.DATABASE,
    handle(event: IpcMainEvent, request: IIpcRequest) {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        console.log(123)
        switch (request.action) {
            case DatabaseAction.LIST_DIRECTORIES: {
                (async () => {
                    const response = await listDirectories();
                    event.sender.send(request.responseChannel as string, response);
                })();
                break;
            }
        }
    },
};

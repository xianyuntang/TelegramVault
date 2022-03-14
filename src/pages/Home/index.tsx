import React, { useRef, useState } from "react";
import { StyledProps } from "../../shared/interface/component";
import { Box, Button, Drawer, Grid, Input, Paper } from "@mui/material";
import { IpcService } from "../../ipc";
import {
  IpcChannel,
  TelegramFileAction,
  TelegramMessageAction,
} from "../../shared/interface/ipc";
import { ISendMediaToMe } from "../../shared/interface/gramjs/auth";
import { IMessage } from "../../shared/interface/gramjs/message";
import { IDownloadFileRequestData } from "../../shared/interface/gramjs/file";
import styled from "@emotion/styled";
import { DirectoryList } from "./Directory";

const BaseHomePage: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const [openLeftDrawer, setOpenLeftDrawer] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<IMessage | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileOnChange = ({
    currentTarget: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length) {
      setFiles((existing) => existing.concat(Array.from(files)));
    }
  };

  const sendMessage = () => {
    files.forEach(async (file) => {
      const newMessage: IMessage = await ipc.send(
        IpcChannel.TELEGRAM_MESSAGE,
        TelegramMessageAction.SEND_MESSAGE_TO_ME,
        {
          data: {
            filename: file.name,
            filepath: file.path,
          } as ISendMediaToMe,
        }
      );
      setMessage(newMessage);
    });
  };

  const downloadFile = async () => {
    const result = await ipc.send(
      IpcChannel.TELEGRAM_FILE,
      TelegramFileAction.DOWNLOAD_FILE,
      {
        data: { message: message } as IDownloadFileRequestData,
      }
    );
    console.log("download", result);
  };

  return (
    <div className={className}>
      <Drawer
        className="home-page__drawer"
        open={openLeftDrawer}
        variant="persistent"
        anchor="left"
      >
        <DirectoryList />
      </Drawer>
    </div>
  );
};

export const HomePage = styled(BaseHomePage)`
  .home-page__drawer {
    flex-shrink: 0;

    .MuiDrawer-paper {
      width: 240px;
      box-sizing: border-box;
    }
  }
`;

import React, { useRef, useState } from "react";
import { StyledProps } from "../../shared/interface/component";
import { AppBar, Box, Button, Drawer, Grid, Input, Paper } from "@mui/material";
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
import { ExplorerNav } from "./Nav";
import { ExplorerContent } from "./Content";

const BaseExplorerPage: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const [openLeftDrawer, setOpenLeftDrawer] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<IMessage | undefined>(undefined);
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
      <AppBar className="explorer-page__appbar" position="sticky">
          {"測試"}
      </AppBar>
      <Box className="explorer-page__content">
        <ExplorerContent />
      </Box>
      <Drawer
        className="explorer-page__nav"
        open={openLeftDrawer}
        variant="persistent"
        anchor="left"
      >
        <ExplorerNav />
      </Drawer>
    </div>
  );
};

export const ExplorerPage = styled(BaseExplorerPage)`
  .explorer-page__appbar {
    height: 70px;
    width: calc(100vw - 240px);
    margin-left: 240px;
  }

  .explorer-page__nav {
    width: 240px;
    box-sizing: border-box;
  }

  .explorer-page__content {
    margin-left: 240px;
    margin-top: 10px;
    border: 1px solid;
    width: calc(100vw - 260px);
    height: calc(100vh - 120px);
    display: block;
    padding: 8px;
  }
`;

import React, { useRef, useState } from "react";
import { StyledProps } from "../../shared/interface/component";
import {
    AppBar,
    Box,
    Button,
    Drawer,
    Grid,
    Input,
    Paper, TextField,
    Toolbar, Typography,
} from "@mui/material";
import { IpcService } from "../../ipc";
import {
  IpcChannel,
  TelegramFileAction,
  TelegramMessageAction,
} from "../../shared/interface/ipc";
import { ISendMediaToMeRequestData } from "../../shared/interface/gramjs/message";
import { IMessage } from "../../shared/interface/gramjs/message";
import { IDownloadFileRequestData } from "../../shared/interface/gramjs/file";
import styled from "@emotion/styled";
import { ExplorerNav } from "./Nav";
import { ExplorerContent } from "./Content";
import { useSelector } from "react-redux";
import { stateType } from "../../reducer";
import {Search} from "@mui/icons-material";

const BaseExplorerPage: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const [openLeftDrawer, setOpenLeftDrawer] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<IMessage | undefined>(undefined);
  const currentDirectory = useSelector(
    (state: stateType) => state.explorerReducer.explorer.currentDirectory
  );
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
        TelegramMessageAction.SEND_MEDIA_TO_ME,
        {
          data: {
            file: {
              filename: file.name,
              filepath: file.path,
            },
          } as ISendMediaToMeRequestData,
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
  };

  return (
    <div className={className}>
      <AppBar className="explorer-page__appbar" position="sticky">
        <Toolbar>
            <Typography variant="h6">
                {currentDirectory.name}
            </Typography>
        </Toolbar>
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
  display: flex;
  flex-direction: column;
  width: calc(100vw - 240px);
  margin-left: 240px;
  height: 100vh;
  padding: 8px;

  .explorer-page__appbar {
    height: 70px;
  }

  .explorer-page__nav {
    width: 240px;
    box-sizing: border-box;
  }

  .explorer-page__content {
    border: 1px solid;
    height: calc(100% - 70px);
    max-height: 100%;
    display: block;
    flex-grow: 1;
  }
`;

import React, { useRef, useState, DragEvent, useEffect } from "react";
import { StyledProps } from "../../shared/interface/component";
import {
  Box,
  Button,
  Drawer,
  Grid,
  Input,
  Paper,
  Typography,
} from "@mui/material";
import { IpcService } from "../../ipc";

import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { stateType } from "../../reducer";
import {
  DatabaseAction,
  IpcChannel,
  TelegramFileAction,
  TelegramMessageAction,
} from "../../shared/interface/ipc";
import {
  IFileEntity,
  ISendMediaToMeRequestData,
  ISendMediaToMeResponseData,
} from "../../shared/interface/gramjs/message";
import { IGetFilesRequestData } from "../../shared/interface/db";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

interface IFileListProps extends StyledProps {
  files: IFileEntity[];
}

interface IFileProps extends StyledProps {
  file: IFileEntity;
}

interface IFileIcon extends StyledProps {
  ext: string;
}

const BaseExplorerContent: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const [files, setFiles] = useState<IFileEntity[]>([]);
  const currentDirectory = useSelector(
    (state: stateType) => state.explorerReducer.explorer.currentDirectory
  );

  useEffect(() => {
    (async () => {
      const files: IFileEntity[] = await ipc.send(
        IpcChannel.DATABASE,
        DatabaseAction.GET_FILES,
        {
          data: {
            directoryId: currentDirectory.id,
          } as IGetFilesRequestData,
        }
      );
      setFiles(files);
    })();
  }, [currentDirectory]);

  const handleFileOnDragEnter = (evt: DragEvent<HTMLDivElement>) => {
    // console.log(evt);
  };

  const handleFileOnDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const handleFileOnDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    Array.from(evt.dataTransfer.files).forEach(async (file) => {
      const uploadResponse: ISendMediaToMeResponseData = await ipc.send(
        IpcChannel.TELEGRAM_MESSAGE,
        TelegramMessageAction.SEND_MEDIA_TO_ME,
        {
          data: {
            file: {
              filename: file.name,
              filepath: file.path,
              filesize: file.size,
              directoryId: currentDirectory.id,
            } as IFileEntity,
          },
        }
      );
      const newFiles = [...files, uploadResponse.file];
      setFiles(newFiles);
    });
  };
  return (
    <Box
      className={className}
      onDrop={handleFileOnDrop}
      onDragOver={handleFileOnDragOver}
      onDragEnter={handleFileOnDragEnter}
    >
      <Box className="explorer-content__file-list">
        {files.map((file, index) => (
          <FileCard key={index} file={file} />
        ))}
      </Box>
    </Box>
  );
};
export const ExplorerContent = styled(BaseExplorerContent)`
  display: block;
  padding: 4px;
  overflow-y: auto;
  height: 100%;

  .explorer-content__file-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const BaseFileCard: React.FC<IFileProps> = (props) => {
  const { className, file } = props;
  return (
    <Paper draggable elevation={6} className={className}>
      <FileIcon ext={file.fileExt} />
      <Box className="file-card__content">
        <Typography variant="subtitle2">{file.filename}</Typography>
      </Box>
    </Paper>
  );
};
export const FileCard = styled(BaseFileCard)`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  align-content: flex-start;
  width: 150px;
  height: 80px;
  padding: 8px;
  margin: 8px;
  user-select: none;

  :hover {
    opacity: 0.8;
  }

  .file-card__content {
    padding: 0 4px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const BaseFileIcon: React.FC<IFileIcon> = (props) => {
  const { className, ext } = props;
  return (
    <Box className={className}>
      <InsertDriveFileRoundedIcon color="action" className="file-icon__icon" />
      <span className="file-icon__ext">{ext}</span>
    </Box>
  );
};

export const FileIcon = styled(BaseFileIcon)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
`;

import React, { DragEvent, useEffect, useState } from "react";
import { StyledProps } from "../../shared/interface/component";
import { Box, Paper, Typography } from "@mui/material";

import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { stateType } from "../../reducer";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { IFileEntity } from "../../shared/interface/db/file";
import { fileService, telegramService } from "../../ipc/service";

interface IFileProps extends StyledProps {
  file: IFileEntity;
}

interface IFileIcon extends StyledProps {
  ext: string;
}

const BaseExplorerContent: React.FC<StyledProps> = ({ className }) => {
  const [files, setFiles] = useState<IFileEntity[]>([]);
  const currentDirectory = useSelector(
    (state: stateType) => state.explorerReducer.explorer.currentDirectory
  );

  useEffect(() => {
    (async () => {
      const files = await fileService.getFiles(currentDirectory.id as number);
      setFiles(files);
    })();
  }, [currentDirectory]);

  const handleFileOnDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const handleFileOnDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    Array.from(evt.dataTransfer.files).forEach(async (file) => {
      const uploadResponse = await telegramService.sendMediaToMe({
        filename: file.name,
        filepath: file.path,
        filesize: file.size,
        directoryId: currentDirectory.id,
      } as IFileEntity);

      const newFiles = [...files, uploadResponse.file];
      setFiles(newFiles);
    });
  };
  return (
    <Box
      className={className}
      onDrop={handleFileOnDrop}
      onDragOver={handleFileOnDragOver}
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
  const handleDragStart = async (evt: any) => {
    evt.preventDefault();
    telegramService
      .downloadFile(file.messageId as number, file.filename)
      .catch((err) => console.log(err));
  };
  return (
    <Paper
      draggable
      elevation={6}
      className={className}
      onDragStart={handleDragStart}
    >
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

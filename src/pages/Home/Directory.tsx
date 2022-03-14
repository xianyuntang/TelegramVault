import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import { IpcService } from "../../ipc";
import { DatabaseAction, IpcChannel } from "../../shared/interface/ipc";
import { IDirectories } from "../../shared/interface/db";
import { Typography } from "@mui/material";
import styled from "@emotion/styled";
import { StyledProps } from "../../shared/interface/component";

interface IDirectoryItem extends StyledProps {
  depth: number;
  item: IDirectories;
}

export const BaseDirectoryList: React.FC = () => {
  const ipc = new IpcService();
  const [directories, setDirectories] = useState<IDirectories | null>(null);
  const loadDirectories = async () => {
    const newDirectories: IDirectories = await ipc.send(
      IpcChannel.DATABASE,
      DatabaseAction.LIST_DIRECTORIES
    );
    setDirectories(newDirectories);
  };

  useEffect(() => {
    (async () => {
      await loadDirectories();
    })();
  }, []);
  console.log(directories);
  return <>{directories && <DirectoryItem depth={1} item={directories} />}</>;
};

const BaseDirectoryItem: React.FC<IDirectoryItem> = (props) => {
  const { className, depth, item } = props;
  return (
    <div className={className}>
      <Typography>{item.name}</Typography>
      {item.children.map((child, index) => (
        <DirectoryItem depth={depth + 1} key={index} item={child} />
      ))}
    </div>
  );
};

export const DirectoryList = styled(BaseDirectoryList)``;

export const DirectoryItem = styled(BaseDirectoryItem)`
  padding-left: ${({ depth }) => `${depth}rem`};
  border: 1px solid antiquewhite;
`;

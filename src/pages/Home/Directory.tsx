import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import { IpcService } from "../../ipc";
import { DatabaseAction, IpcChannel } from "../../shared/interface/ipc";
import { IDirectories } from "../../shared/interface/db";
import { Typography } from "@mui/material";

interface IDirectoryItem {
  depth: number;
  item: IDirectories;
}

export const DirectoryList: React.FC = () => {
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
  return <>{directories && <DirectoryItem depth={0} item={directories} />}</>;
};

export const DirectoryItem: React.FC<IDirectoryItem> = (props) => {
  const { depth, item } = props;
  return (
    <div>
      <Typography>{item.name}</Typography>
      {item.children.map((child, index) => (
        <DirectoryItem depth={depth + 1} key={index} item={child} />
      ))}
    </div>
  );
};

import React, { useEffect } from "react";
import { IpcService } from "../../ipc";
import { DatabaseAction, IpcChannel } from "../../shared/interface/ipc";
import { IDirectory } from "../../shared/interface/db";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import styled from "@emotion/styled";
import { StyledProps } from "../../shared/interface/component";

import { ExpandLess, ExpandMore, Folder } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentDirectoryId,
  setRootDirectory,
} from "../../actions/explorer";
import { stateType } from "../../reducer";

interface IDirectoryItem extends StyledProps {
  depth: number;
  directory: IDirectory;
  refresh: () => void;
}

export const BaseExplorerNav: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const rootDirectory = useSelector(
    (state: stateType) => state.explorerReducer.explorer.rootDirectory
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newDirectory: IDirectory = await ipc.send(
        IpcChannel.DATABASE,
        DatabaseAction.GET_DIRECTORY_MENU
      );
      dispatch(setRootDirectory(newDirectory));
    })();
  }, []);

  const refresh = () => {
    if (rootDirectory) {
      const newRootDirectory: IDirectory = { ...rootDirectory };
      dispatch(setRootDirectory(newRootDirectory));
    }
  };

  return (
    <>
      {rootDirectory && (
        <List dense className={className}>
          <ListSubheader>Directory</ListSubheader>
          <DirectoryItem
            directory={rootDirectory}
            depth={0}
            refresh={refresh}
          />
        </List>
      )}
    </>
  );
};

const BaseDirectoryItem: React.FC<IDirectoryItem> = (props) => {
  const { className, directory, depth, refresh } = props;
  const dispatch = useDispatch();
  const handleExpandButtonOnClick = (directory: IDirectory) => {
    directory.expand = !directory.expand;
    refresh();
  };
  const handleDirectoryButtonOnClick = (directory: IDirectory) => {
    dispatch(setCurrentDirectoryId(directory.id));
  };
  return (
    <>
      {directory.children?.map((subDirectory, index) => (
        <>
          <ListItem
            className={className}
            key={index}
            secondaryAction={
              <IconButton
                onClick={() => handleExpandButtonOnClick(subDirectory)}
              >
                {subDirectory.children?.length ? (
                  subDirectory.expand ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => handleDirectoryButtonOnClick(subDirectory)}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={subDirectory.name} />
            </ListItemButton>
          </ListItem>
          <Collapse key={index} in={subDirectory.expand}>
            {subDirectory && (
              <DirectoryItem
                depth={depth + 1}
                directory={subDirectory}
                refresh={refresh}
              />
            )}
          </Collapse>
        </>
      ))}
    </>
  );
};

const DirectoryItem = styled(BaseDirectoryItem)`
  padding-left: ${({ depth }) => `${depth * 8}px`};
`;

export const ExplorerNav = styled(BaseExplorerNav)`
`;

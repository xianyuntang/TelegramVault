import React, { useEffect } from "react";
import { IpcService } from "../../ipc";
import { DatabaseAction, IpcChannel } from "../../shared/interface/ipc";
import { IDirectoryEntity } from "../../shared/interface/db";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

import styled from "@emotion/styled";
import { StyledProps } from "../../shared/interface/component";

import { ExpandLess, ExpandMore, Folder } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDirectory, setRootDirectory } from "../../actions/explorer";
import { stateType } from "../../reducer";

interface IDirectoryItem extends StyledProps {
  depth: number;
  directory: IDirectoryEntity;
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
      const newDirectory: IDirectoryEntity = await ipc.send(
        IpcChannel.DATABASE,
        DatabaseAction.GET_ROOT_DIRECTORY
      );
      console.log(newDirectory);
      dispatch(setRootDirectory(newDirectory));
    })();
  }, []);

  const refresh = () => {
    if (rootDirectory) {
      const newRootDirectory: IDirectoryEntity = { ...rootDirectory };
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
  const handleExpandButtonOnClick = (directory: IDirectoryEntity) => {
    directory.expand = !directory.expand;
    refresh();
  };
  const handleDirectoryButtonOnClick = (directory: IDirectoryEntity) => {
    dispatch(setCurrentDirectory(directory));
  };
  return (
    <>
      {directory.children?.map((subDirectory, index) => (
        <Box key={index}>
          <ListItem
            className={className}
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
        </Box>
      ))}
    </>
  );
};

const DirectoryItem = styled(BaseDirectoryItem)`
  padding-left: ${({ depth }) => `${depth * 8}px`};
`;

export const ExplorerNav = styled(BaseExplorerNav)`
  width: 240px;
`;

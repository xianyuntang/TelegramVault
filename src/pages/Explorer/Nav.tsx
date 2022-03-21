import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";

import styled from "@emotion/styled";
import { StyledProps } from "../../shared/interface/component";
import {
  ContentCopy,
  ContentCut,
  ExpandLess,
  ExpandMore,
  Folder,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDirectory, setRootDirectory } from "../../actions/explorer";
import { stateType } from "../../reducer";
import { IDirectoryEntity } from "../../shared/interface/db/directory";
import { directoryService } from "../../ipc/service";

interface IDirectoryItem extends StyledProps {
  depth: number;
  directory: IDirectoryEntity;
  refresh: () => void;
  onClick: (
    anchorEl: null | HTMLElement,
    subDirectory: IDirectoryEntity
  ) => void;
}

export const BaseExplorerNav: React.FC<StyledProps> = ({ className }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [targetDirectory, setTargetDirectory] =
    useState<IDirectoryEntity | null>(null);

  const rootDirectory = useSelector(
    (state: stateType) => state.explorerReducer.explorer.rootDirectory
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newDirectory = await directoryService.getRootDirectory();
      dispatch(setRootDirectory(newDirectory));
    })();
  }, []);

  const refresh = () => {
    if (rootDirectory) {
      const newRootDirectory: IDirectoryEntity = { ...rootDirectory };
      dispatch(setRootDirectory(newRootDirectory));
    }
  };

  const handlePopoverOnClose = () => {
    setAnchorEl(null);
  };

  const handleDirectoryItemOnClick = (
    ele: null | HTMLElement,
    subDirectory: IDirectoryEntity
  ) => {
    setAnchorEl(ele);
    setTargetDirectory(subDirectory);
  };

  const handleAddItemOnClick = async () => {
    await _addDirectory();
  };

  const handleDeleteItemOnClick = async () => {
    if (targetDirectory?.id) {
      const response = await directoryService.deleteDirectory(
        targetDirectory.id
      );
      if (response) {
        setAnchorEl(null);
        await _removeDirectory(targetDirectory.id as number);
      }
    }
  };

  const _addDirectory = async () => {
    if (targetDirectory) {
      setAnchorEl(null);
      const response = await directoryService.createDirectory({
        parentId: targetDirectory.id as number,
        name: "New Folder",
      });

      const newDirectory: IDirectoryEntity = {
        ...response,
        expand: false,
        children: [],
      };
      targetDirectory.children?.push(newDirectory);
      targetDirectory.expand = true;
      const newRootDirectory: IDirectoryEntity = { ...rootDirectory };

      dispatch(setRootDirectory(newRootDirectory));
    }
  };

  const _removeDirectory = async (id: number) => {
    const newRootDirectory: IDirectoryEntity = { ...rootDirectory };
    const helper = (directory: IDirectoryEntity) => {
      directory.children = directory.children?.filter(
        (subDirectory) => subDirectory.id !== id
      );

      if (directory.children) {
        for (let i = 0; i < directory.children?.length; i++) {
          helper(directory.children[i]);
        }
      }
    };
    helper(newRootDirectory);
    dispatch(setRootDirectory(newRootDirectory));
  };

  const handleRootDirectoryOnClick = () => {
    dispatch(setCurrentDirectory(rootDirectory));
  };

  return (
    <>
      <List dense className={className}>
        <ListItem>
          <ListItemButton onClick={handleRootDirectoryOnClick}>
            <ListItemText primary={rootDirectory.name} />
          </ListItemButton>
        </ListItem>
        <DirectoryItem
          directory={rootDirectory}
          depth={0}
          refresh={refresh}
          onClick={handleDirectoryItemOnClick}
        />
      </List>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handlePopoverOnClose}
      >
        <MenuList className="directory-item__popup">
          <MenuItem onClick={handleAddItemOnClick}>
            <ListItemIcon>
              <ContentCut fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Directory</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteItemOnClick}>
            <ListItemIcon>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Directory</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};

const BaseDirectoryItem: React.FC<IDirectoryItem> = (props) => {
  const { className, directory, depth, refresh, onClick } = props;

  const dispatch = useDispatch();

  const handleExpandButtonOnClick = (directory: IDirectoryEntity) => {
    directory.expand = !directory.expand;
    refresh();
  };
  const handleDirectoryButtonOnClick = (directory: IDirectoryEntity) => {
    dispatch(setCurrentDirectory(directory));
  };
  const onContextMenu = (evt: any, subDirectory: IDirectoryEntity) => {
    onClick(evt.currentTarget, subDirectory);
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
              onContextMenu={(evt) => onContextMenu(evt, subDirectory)}
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
                onClick={onClick}
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

  .directory-item__new_directory {
    height: 100%;
    width: 100%;
  }
`;

export const ExplorerNav = styled(BaseExplorerNav)`
  width: 300px;
`;

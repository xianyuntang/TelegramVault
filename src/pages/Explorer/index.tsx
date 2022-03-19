import React from "react";
import { StyledProps } from "../../shared/interface/component";
import { AppBar, Box, Drawer, Toolbar, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { ExplorerNav } from "./Nav";
import { ExplorerContent } from "./Content";
import { useSelector } from "react-redux";
import { stateType } from "../../reducer";

const BaseExplorerPage: React.FC<StyledProps> = ({ className }) => {
  const currentDirectory = useSelector(
    (state: stateType) => state.explorerReducer.explorer.currentDirectory
  );

  return (
    <div className={className}>
      <AppBar className="explorer-page__appbar" position="sticky">
        <Toolbar>
          <Typography variant="h6">{currentDirectory.name}</Typography>
        </Toolbar>
      </AppBar>
      <Box className="explorer-page__content">
        <ExplorerContent />
      </Box>
      <Drawer
        className="explorer-page__nav"
        open={true}
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
  width: calc(100vw - 300px);
  margin-left: 300px;
  height: 100vh;
  padding: 8px;

  .explorer-page__appbar {
    height: 70px;
  }

  .explorer-page__nav {
    width: 300px;
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

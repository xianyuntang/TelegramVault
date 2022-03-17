import React, { useRef, useState } from "react";
import { StyledProps } from "../../shared/interface/component";
import { Box, Button, Drawer, Grid, Input, Paper } from "@mui/material";
import { IpcService } from "../../ipc";

import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { stateType } from "../../reducer";

const BaseExplorerContent: React.FC<StyledProps> = ({ className }) => {
  const ipc = new IpcService();
  const currentDirectoryId = useSelector(
    (state: stateType) => state.explorerReducer.explorer.currentDirectoryId
  );

  return (
    <Box className={className}>
      {currentDirectoryId}
    </Box>
  );
};

export const ExplorerContent = styled(BaseExplorerContent)`

`;

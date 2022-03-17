import React from "react";
import { CssBaseline, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { StyledProps } from "../../shared/interface/component";
import styled from "@emotion/styled";

const BaseLayout: React.FC<StyledProps> = ({ className }) => {
  return (
    <>
      <Grid container component="main" className={className}>
        <CssBaseline />
        <Outlet />
      </Grid>
    </>
  );
};

export const Layout = styled(BaseLayout)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
  *::-webkit-scrollbar {
    width: 0.4em;
  }

  *::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  }

  *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    outline: 1px solid slategray;
  }
`;

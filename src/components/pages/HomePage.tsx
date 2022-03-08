import React from "react";
import { StyledProps } from "../../shared/component/interface";
import { Grid, Paper } from "@mui/material";

export const HomePage: React.FC<StyledProps> = ({ className }) => {
  return (
    <Grid
      className={className}
      item
      xs={8}
      sm={8}
      md={5}
      component={Paper}
      elevation={1}
      square
    >
      123
    </Grid>
  );
};

import { CssBaseline, Grid, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const Layout = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Outlet />
      </Grid>
    </>
  );
};

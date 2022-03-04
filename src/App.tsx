import React from "react";
import "./App.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { RootRouter } from "./router";

function App() {
  const theme = createTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <RootRouter />
      </ThemeProvider>
    </>
  );
}

export default App;

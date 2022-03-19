import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { RootRouter } from "./router";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  const theme = createTheme();
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RootRouter />
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;

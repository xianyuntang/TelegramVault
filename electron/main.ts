import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { IIpcChannel } from "../src/shared/interface/ipc";
import { connectTelegramClient } from "./src/apis/telegramAPI";
import { registeredChannel } from "./ipc";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL("http://localhost:3000/index.html");

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }
}

function registerIpcChannels(ipcChannels: IIpcChannel[]) {
  ipcChannels.forEach((channel) => {
    console.log(`register channel: ${channel.getName()}`);
    ipcMain.on(channel.getName(), (event, request) => {
      channel.handle(event, request);
    });
  });
}

app.whenReady().then(async () => {
  if (app.isPackaged) {
    await connectTelegramClient("production");
  } else {
    await connectTelegramClient("development");
  }
  registerIpcChannels(registeredChannel);

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

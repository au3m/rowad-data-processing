import { app, BrowserWindow } from "electron";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { ipcMainHandle, isDev } from "./util.js";
import { processTextWithPython } from "./pythonBridge.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  mainWindow.setMenuBarVisibility(false); // Disable menu bar

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }
});

// IPC handler for processing text with Python script
ipcMainHandle("processText", async (text: string) => {
  return processTextWithPython(text);
});

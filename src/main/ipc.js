import { app, ipcMain } from "electron";

ipcMain.on("get-path", (event, name) => {
  event.returnValue = app.getPath(name);
});

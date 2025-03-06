import { app, BrowserWindow } from "electron";

app.whenReady().then(() => {
  var win: Electron.BrowserWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");

  //app.quit();
});

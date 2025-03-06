import { app, BrowserWindow } from "electron/main";

// console.log("hellooo", app, BrowserWindow);

app.whenReady().then(() => {
  var win: Electron.BrowserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // yes, electron requires preload paths be absolute.  brilliant.  amazing.  reasonable.  (no.)
      preload: "preload.js",
    },
  });

  // This is apparently relative to wherever the main file is.
  // Which is now in a dist dir.
  // So we either need to start copying static files over during build, or...
  // for now, fuckkit, we're just gonna refer back to source paths.
  win.loadFile("../src/index.html");

  //app.quit();
});

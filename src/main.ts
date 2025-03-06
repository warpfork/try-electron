import { app, BrowserWindow } from "electron/main";
import path from "node:path";

// console.log("hellooo app!", app);
// console.log("app path: ", app.getAppPath());
// console.log("path(home): ", app.getPath("home"));

// app.relaunch();

app.whenReady().then(() => {
  var win: Electron.BrowserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // yes, electron requires preload paths be absolute.  brilliant.  amazing.  reasonable.  (no.)
      // the above is not a real error that stops anything.  just an "ERROR" in stderr, but doesn't stop anything.
      // if the file doesn't exist?  that doesn't show up except in the console in-browser -- no sign on stderr.
      // i feel like i'm being trolled.
      //
      // aaand now it is mad that we're using import statements outside a module.  okaaaay?
      // this import vs require stuff is arcane to me and i am not in love with it.
      preload: path.join(app.getAppPath(), "preload.mjs"),
    },
  });

  // This is apparently relative to wherever the main file is.
  // Which is now in a dist dir.
  // So we either need to start copying static files over during build, or...
  // for now, fuckkit, we're just gonna refer back to source paths.
  win.loadFile("../src/index.html");

  //app.quit();
});

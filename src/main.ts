import { app, BrowserWindow, ipcMain } from "electron/main";
import path from "node:path";
import { opendir } from "node:fs/promises";

// console.log("hellooo app!", app);
// console.log("app path: ", app.getAppPath());
// console.log("path(home): ", app.getPath("home"));

// app.relaunch();

import type { Zow } from "./lib/zow.ts";

// We can assert we implemented the whole backend like this!
// It's not, um, entirely correct, though.
// The function signatures here should permit having event params.  So... much more to do here.
let backend: Zow = {
  ping: function (): Promise<string> {
    return Promise.resolve("pong");
  }
}

app.whenReady().then(() => {
  // Register these before any window is spawned that might use them.
  ipcMain.handle("ping", backend.ping);
  ipcMain.handle("walkies", async () => {
    try {
      const dir = await opendir("./");
      for await (const dirent of dir) console.log(dirent.name);
      // TODO: of course I don't want to console.log here, I want to send a stream back.
      // How shall we do that?
      // an `AsyncIterator` appears to be what I want to get on the far side.
      // But that's not going to survive being passed through the `structuredClone` phase of IPC, iiuc.
      // Has anyone made a library to solve problems like this, or am I going to need to do it myself?
    } catch (err) {
      console.error(err);
    }
  });

  var win: Electron.BrowserWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // yes, electron requires preload paths be absolute.  brilliant.  amazing.  reasonable.  (no.)
      // the above is not a real error that stops anything.  just an "ERROR" in stderr, but doesn't stop anything.
      // if the file doesn't exist?  that doesn't show up except in the console in-browser -- no sign on stderr.
      // i feel like i'm being trolled.
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });

  // This is apparently relative to wherever the main file is.
  // Which is now in a dist dir.
  // So we either need to start copying static files over during build, or...
  // for now, fuckkit, we're just gonna refer back to source paths.
  win.loadFile("../src/index.html");

  //app.quit();
});

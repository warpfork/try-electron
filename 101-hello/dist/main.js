// src/main.ts
import { app, BrowserWindow, ipcMain, nativeTheme } from "electron/main";
import path from "node:path";
import { opendir } from "node:fs/promises";
import { randomInt } from "node:crypto";
nativeTheme.themeSource = "dark";
var backend = {
  ping: function() {
    return Promise.resolve("pong");
  }
};
var counters = new Map;
var seq = ["blorp", "bap", "bep", "shing"];
app.whenReady().then(() => {
  ipcMain.handle("ping", backend.ping);
  ipcMain.handle("counter", async (evt, nonce) => {
    if (nonce == undefined) {
      let nonce2 = randomInt(1e4, 99999);
      counters.set(nonce2, 0);
      return { nonce: nonce2, val: seq[0], exists: true };
    }
    let val = counters.get(nonce) + 1;
    counters.set(nonce, val);
    return { val: seq[val], exists: val < seq.length };
  });
  ipcMain.handle("walkies", async (evt) => {
    try {
      const dir = await opendir("./");
      for await (const dirent of dir) {
        console.log("walking:", dirent);
        evt.sender.send("walkies-123", dirent);
      }
      return "done";
    } catch (err) {
      console.error(err);
    }
  });
  var win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js")
    }
  });
  win.webContents.openDevTools();
  win.loadFile("../src/index.html");
});

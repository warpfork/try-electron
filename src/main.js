const { app, BrowserWindow } = require("electron/main");

const createWindow = () => {
  // Each BrowserWindow gets a renderer process, which is sandboxed.
  // Each BrowserWindow also gets a "preload" script, which is... semi sandboxed.
  // See https://www.electronjs.org/docs/latest/tutorial/tutorial-preload .
  //
  // Values called `ipcRenderer` and `ipcMain` do... what they say on the tin.
  // They *do* pass full values, not serialized things.
  // (As a result, a significant caution about them is to not... pass them to themselves.)
  // (I don't know what this means about concurrency, deep down.)
  // This is used mostly by:
  // - call `ipcMain.handle('callname', thunk)` in the main process;
  // - hand a thunk that calls `ipcRenderer.invoke('callname') to a contextBridge in the preload script
  // - and then call that thunk as desired from the renderer side.
  //
  // I don't really understand why a preload script seems to have to a literal file,
  // and can't just be a thunk.  I probably don't what to know.  Whatever.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
    },
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  //app.quit();
});

// I'm not getting types OOB in Zed; that's unfortunate.  Want.

// I want to know how to allow-list remote content fetching.
// I want to set the allow-list to *nothing*.

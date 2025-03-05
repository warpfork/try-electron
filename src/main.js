const { app, BrowserWindow } = require("electron/main");

process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = true;

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
  // See https://www.electronjs.org/docs/latest/tutorial/ipc for more depth.
  //
  // I don't really understand why a preload script seems to have to a literal file,
  // and can't just be a thunk.  I probably don't what to know.  Whatever.
  // (I guess a considerable part of it is that the require function is Different
  // in a preload script: and specifically the contextBridge object you can get is now
  // for *that* window.  So it's an API artifact from an early day, is my guess.)
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
//
// From https://www.electronjs.org/docs/latest/tutorial/security :
// > To display remote content, use the `<webview>` tag
// > or a `WebContentsView` and make sure to disable the `nodeIntegration`
// > and enable `contextIsolation`.
// ... both of which for WebContentsView have been the default for a good while now, happily.
// (Wtf is contextIsolation?  It's basically "plz no override global vars across renderers".  So... baseline sanity.)
//
// OOH, I think this is it: https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content
//

// ... but this doesnt quite fly because "Session can only be received when app is ready",
// and I haven't sussed beyond that yet.
const { session } = require("electron/main");
const { URL } = require("url");

session
  .fromPartition("some-partition") // ???
  .setPermissionRequestHandler((webContents, permission, callback) => {
    console.log(
      "PERMISSIONS REQUEST:",
      webContents.getURL(),
      permission,
      webContents,
    );
    return callback(false);
  });

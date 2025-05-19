import { app, BrowserWindow, ipcMain, MessageChannelMain } from "electron/main";
import path from "node:path";

console.time("main");
console.timeLog("main", "main started", new Date());

ipcMain.handle("quit", () => {
	console.timeLog("main", "quit instruction received in main", new Date());
	app.quit();
});

ipcMain.on("log", (evt, args) => {
	console.timeLog("main", "from renderer", args);
});

// All of the "state" setup in previous demos?  That's in the "worker" code now.

// This time we're not using the Electron IPC system directly.
// We're going to set up a MessagePort instead.
// The `port2` side will be sent to the renderer.
// The 'port1' side will be sent to the "worker" (which is also a whole window).
// Those two should then be free to communicate directly without the main process stuck playing middleman.
let { port1, port2 } = new MessageChannelMain();

// This window will be the renderer.  It does *not* have nodeIntegration.
app.whenReady().then(async () => {
	var win: Electron.BrowserWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(app.getAppPath(), "../preload/preload.js"),
		},
	});

	win.webContents.openDevTools();

	const pagePath = "src/renderer/index.html";
	console.timeLog("main", "invoking win.loadFile for renderer", new Date());
	const promise_load = win.loadFile("../../" + pagePath);
	win.webContents.postMessage("port-establish", null, [port2]);
	await promise_load;
	console.timeLog("main", "win.loadFile for renderer returned", new Date());
});

// This window will be the "worker".  It *does* have nodeIntegration.
// If this were a "finished" application, we'd set "show: false" on this as well.
app.whenReady().then(async () => {
	var win: Electron.BrowserWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(app.getAppPath(), "../preload/preload.js"),
		},
	});

	win.webContents.openDevTools();

	const pagePath = "src/worker/worker.html";
	console.timeLog("main", "invoking win.loadFile for worker", new Date());
	const promise_load = win.loadFile("../../" + pagePath);
	win.webContents.postMessage("port-establish", null, [port1]);
	await promise_load;
	console.timeLog("main", "win.loadFile for worker returned", new Date());
});

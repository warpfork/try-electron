import { app, BrowserWindow, ipcMain } from "electron/main";
import path from "node:path";

const start = new Date();
console.log("main started", start);

ipcMain.handle("quit", () => {
	const now = new Date();
	console.log(
		"quit instruction received in main",
		now,
		now.getMilliseconds() - start.getMilliseconds(),
	);
	app.quit();
});

app.whenReady().then(async () => {
	var win: Electron.BrowserWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(app.getAppPath(), "../preload/preload.js"),
		},
	});

	win.webContents.openDevTools();

	const pagePath = "src/renderer/index.html";
	win.loadFile("../../" + pagePath);
});

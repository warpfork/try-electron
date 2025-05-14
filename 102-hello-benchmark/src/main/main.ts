import { app, BrowserWindow, ipcMain } from "electron/main";
import path from "node:path";

console.time("main");
console.timeLog("main", "main started", new Date());

ipcMain.handle("quit", () => {
	console.timeLog("main", "quit instruction received in main", new Date());
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
	console.timeLog("main", "invoking win.loadFile", new Date());
	await win.loadFile("../../" + pagePath);
	console.timeLog("main", "win.loadFile returned", new Date());
});

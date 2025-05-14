import { app, BrowserWindow, ipcMain } from "electron/main";
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

let state = {
	count: 0,
	stuff: (() => {
		let arr = [];
		for (let i = 0; i < 1000; i++) {
			arr.push({
				foo: `bar-${i}`,
				//baz: `bar-${i}`, // uncomment for some more variation testing.
				//wok: new Date(), // yes, it'll work; no, it's not good.
			});
		}
		return arr;
	})(),
};
console.timeLog("main", "test data initialized", new Date());
const state_as_json = JSON.stringify(state);
console.log("test data as json string is length=", state_as_json.length);
console.timeLog("main", "test data measurement done", new Date());
JSON.parse(state_as_json);
console.timeLog("main", "test data parse measurement done", new Date());
ipcMain.handle("count", () => {
	state.count++;
	return state; // yes, the whole thing!  This is to test the practical cost of structuredClone.
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

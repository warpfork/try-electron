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

// This time we're not using the Electron IPC system directly.
// We're going to set up a MessagePort instead.
// The `port2` side will be sent to the renderer.
let { port1, port2 } = new MessageChannelMain();

// No bus or channel name system here -- we're doing it barebones and assuming everything's a "count" action like our previous demos.
port1.on("message", (event) => {
	// We're going fast enough that uncommenting this log statement will noticably slow things down!
	// console.log("handling message from renderer process:", event.data);
	state.count++;
	port1.postMessage({
		replyTo: event.data.requestId,
		body: state,
		// body: state.count, // <- Or to transfer just the number, do this.
	});
});
port1.start();

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
	const promise_load = win.loadFile("../../" + pagePath);
	win.webContents.postMessage("port-establish", null, [port2]);
	await promise_load;
	console.timeLog("main", "win.loadFile returned", new Date());
});

import { contextBridge, ipcRenderer } from "electron";

console.time("preload");

contextBridge.exposeInMainWorld("ctrl", {
	quit: () => {
		console.timeLog(
			"preload",
			"quit invoked (as seen by preload contextBridge)",
		);
		ipcRenderer.invoke("quit");
	},
	log: (msg: unknown) => {
		console.timeLog("preload", "renderer sent log:", msg); // FIXME this is now slightly confusing.  Maybe we should have two different preload files now.
		ipcRenderer.send("log", msg);
	},
});

// Sending MessagePort values involves additional kerfufflery, per the Electron docs:

// We need to wait until the renderer world is ready to receive the message before
// sending the port. We create this promise in the preload so it's guaranteed
// to register the onload listener before the load event is fired.
const windowLoaded = new Promise((resolve) => {
	window.onload = resolve;
});

ipcRenderer.on("port-establish", async (event) => {
	await windowLoaded;
	// Use regular window.postMessage to transfer the port
	// from here in the isolated preload world to the renderer world.
	window.postMessage("port-establish", "*", event.ports);
});

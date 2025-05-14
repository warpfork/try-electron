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
	count: async (): Promise<number> => {
		return ipcRenderer.invoke("count");
	},
	log: (msg: unknown) => {
		console.timeLog("preload", "renderer sent log:", msg);
		ipcRenderer.send("log", msg);
	},
});

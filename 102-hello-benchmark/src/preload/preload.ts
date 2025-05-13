import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ctrl", {
	quit: () => {
		console.log("quit invoked (as seen by preload contextBridge)")
		ipcRenderer.invoke("quit")
	},
});

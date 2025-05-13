// src/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});
var zow = {
  ping: () => import_electron.ipcRenderer.invoke("ping")
};
import_electron.contextBridge.exposeInMainWorld("zow", zow);
import_electron.contextBridge.exposeInMainWorld("pow", {
  walkies: () => import_electron.ipcRenderer.invoke("walkies"),
  counter: async () => {
    let ugh = 0;
    let { nonce, val, exists } = await import_electron.ipcRenderer.invoke("counter");
    console.log("preload first call of counter got", { nonce, val, exists });
    return function() {
      ugh++;
      if (ugh > 10) {
        return Promise.reject("fuck, man");
      }
      let sheesh = import_electron.ipcRenderer.invoke("counter", nonce);
      console.log("preload subsequent call of counter got", sheesh);
      return sheesh;
    };
  }
});

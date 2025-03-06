// It has turned out to be impossible to do this file in typescript, as far as I can tell.
//
// The "require" function in this context is *not the normal one*,
// (see https://www.electronjs.org/docs/latest/tutorial/sandbox#preload-scripts for more about that),
// so transpilers tend to do bad things with this file if they touch that function (and they tend to).
//
// Also, the use of modules and the import statement is forbidden in preload scripts,
// which I don't fully understand, but see https://www.electronjs.org/docs/latest/tutorial/esm#sandboxed-preload-scripts-cant-use-esm-imports .
//
// So: I give up.  This one just stays as a javascript file.  Moving on.

const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

// It has turned out to be impossible to do this file in typescript, as far as I can tell.
//
// The "require" function in this context is *not the normal one*,
// (see https://www.electronjs.org/docs/latest/tutorial/sandbox#preload-scripts for more about that),
// so transpilers tend to do bad things with this file if they touch that function (and they tend to).
//
// Also, the use of modules and the import statement is forbidden in preload scripts,
// which I don't fully understand, but see https://www.electronjs.org/docs/latest/tutorial/esm#sandboxed-preload-scripts-cant-use-esm-imports
// and also https://www.electronjs.org/docs/latest/tutorial/esm#summary-esm-support-matrix .
//
// There may also be options to simply disable sandboxing for preload scripts,
// mentioned in https://github.com/electron/electron/issues/35587#issuecomment-1247138429 .
// I don't actually know what negative security implications that might have.
// (I thought preload scripts are out of scope by the time content is happening?  But I'm unsure.)
// For now, poking into that seems like cost and risk.
//
// So: I give up.  This one just stays as a javascript file.  Moving on.

// To minimize the pain of this file being untyped and being unable to import other files,
// I think the way forward is to more or less expose one giant object full of RPC powers,
// and make types for that, and use those types in the main process and in the renderers,
// and just move on.

const { contextBridge } = require("electron");

// Stuff exposed in the "main world" is also available in the chromium debug console!

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

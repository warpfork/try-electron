// apparently there is not an "electron/preload" type definition subset.  Shame.
// import { contextBridge } from "electron";

// Okay, and apparently imports don't work in preload scripts, and never will, because...
// I dunno: https://www.electronjs.org/docs/latest/tutorial/esm#sandboxed-preload-scripts-cant-use-esm-imports

const { contextBridge } = require("electron");
// ^ so this sucks, because then we don't get types in this file.
// ^ and also doesn't work either, because generates a (different) import statement via bun internals, so does not dtrt.
// ^ and ALSO somehow the presence of that line in this file causes "electron/main" to stop resolving in the other file,
//  which is definitely among the more deranged things I've seen today.  Not sure if most deranged.  But up there.

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

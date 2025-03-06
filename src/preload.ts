// apparently there is not an "electron/preload" type definition subset.  Shame.
import { contextBridge } from "electron";

// const { contextBridge } = require('electron')
// ^ but this also generates a (different) import statement via bun internals, so does not dtrt.
// Also somehow the presence of that line in this file causes "electron/main" to stop resolving in the other file,
//  which is definitely among the more deranged things I've seen today.  Not sure if most deranged.  But up there.

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

// So there is some real wild shit going on for me to be able to have this file in Typescript while using Bun.
// I don't know where the blame rests for even half of it, but here's what I've observed:
//   - I *must* have the const+require style import in this file, because preload scripts aren't allowed to use modules, and thus import statements.
//     - You'll see this as "SyntaxError: Cannot use import statement outside a module\nat runPreloadScript" in the browser console.
//     - Electron docs discuss this: https://www.electronjs.org/docs/latest/tutorial/esm#sandboxed-preload-scripts-cant-use-esm-imports .
//   - If I try to use the const+require syntax here, Bun understands it and gives me types... but does several other things that are problematic:
//     - It generates two gnarly lines in the output: `import { createRequire } from "node:module";` and `var __require = /* @__PURE__ */ createRequire(import.meta.url);` .
//       - These obviously do bad things: electron is providing its own `require` here that does special magic!  And this "import" generated isn't valid either.
//     - Deeply bizarrely, it also causes the renderer.js output file to contain the same things.  I don't understand this at all.
//   - I don't know what more knobs in Bun I can turn for this:
//     - We're already running with '--external=electron'.
//     - '--external=require' doesn't have any effect at all.
//
// ... I found an apparently viable solution by having bun generate *just this file* in cjs mode.
// See the build scripts for the madness.
// (I think it would be acceptable-ish to do main and pre-load in that way too, but it appears to generate More Code and seems just weird, so, no.)

// const { contextBridge, ipcRenderer } = require("electron");
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

import type { Zow } from "./lib/zow.ts";

let zow: Zow = {
  ping: () => ipcRenderer.invoke("ping"),
};

contextBridge.exposeInMainWorld("zow", zow);

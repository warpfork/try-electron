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

// The values permitted to pass through the expose methods of contextBridge are EXTREMELY LIMITED.
// See https://www.electronjs.org/docs/latest/api/context-bridge#api for an enumeration, or, quote:
//  > must be a `Function`, `string`, `number`, `Array`, `boolean`,
//  > or an object whose keys are strings and values are a `Function`, `string`, `number`, `Array`, `boolean`,
//  > or another nested object that meets the same conditions.
//
// But Wait!  There's More!
// When you pass a function, that creates a proxy that calls back across the context gap.
// The function can demonstrably increment state here in the preload context, and it sticks.
// HOWEVER... it seems that whatever is *returned* by that function... is subjected to structuredClone all over again.
// So, if you try to pass a class out: no, you will not really succeed.
// (You *can* pass out a method; it will generate another proxy.)
//
// That means: we still cannot construct classes that do anything useful in this file!
// (And that very much includes AsyncIterators, AsyncGenerators, or anything else of use.)
//
// At least.  As far as I can tell.
//
// I really don't understand what the purpose of this preload phase is, frankly.
// It is so very, very limited that I can't imagine it doing anything but proxying calls dumbly.
// It looks to me entirely like boilerplate that I do not need and literally cannot derive benefit from.
// Perhaps there is something I'm missing about the mystical magical security gains of something
// that simply makes me repeat the same strings in multiple places.  But that is... I truly don't know.

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

let state = 0
contextBridge.exposeInMainWorld("pow", {
  walkies: () => ipcRenderer.invoke("walkies"),
  counter: () => {
    return (function(): Promise<{ val: string, done: boolean }> {
      return Promise.resolve({ val: "one", done: true })
    })
  },
});

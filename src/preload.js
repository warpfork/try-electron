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
// ... Yeah this is much worse than that.  It's not preload scripts that you disable sandboxing for: it's the entire renderer.  No.  Bad.
//
// So: I give up.  This one just stays as a javascript file.  Moving on.

// To minimize the pain of this file being untyped and being unable to import other files,
// I think the way forward is to more or less expose one giant object full of RPC powers,
// and make types for that, and use those types in the main process and in the renderers,
// and just move on.
//
// ... The trouble with the theory is we need all those types here, too.
// In fact, I think we pretty much want to iterate over the types to generate all the IPC wrappers.
//
// This is so damned bonkers it's starting to sound like a codegen problem to me.

const { contextBridge, ipcRenderer } = require("electron");

// Stuff exposed in the "main world" is also available in the chromium debug console!

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

// ... I want to either assert types right here,
// or else be importing from some other file that did so.
// And I'm sitting here seriously thinking about using sed on this damn file to have a shot at it.
// Please tell me I'm missing something.
// If I have to keep this magically in sync with interfaces brazenly declared in the renderer, entirely by hand, I'm going to be so sad.
//
// ... ugh.  Then again, `Electron.IpcRenderer.invoke` just leaves us holding a `Promise<any>` anyway, which is pretty dang low value.
let zow = {
  ping: () => ipcRenderer.invoke("ping"),
};

contextBridge.exposeInMainWorld("zow", zow);

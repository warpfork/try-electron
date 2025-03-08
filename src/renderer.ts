// Oh.  Apparently you can also just assert things like this.  Okay.
declare global {
  interface Window {
    versions: Versions;
  }
}
let versions = window.versions;

interface Versions {
  chrome(): Promise<string>;
  node(): Promise<string>;
  electron(): Promise<string>;
}
function presume_Versions(x: any): x is Versions {
  return true;
}

function sayVersionInfo() {
  const information = document.getElementById("info");
  if (information != null) {
    if (!("versions" in window)) {
      return;
    }
    let versions = window.versions;
    if (presume_Versions(versions)) {
      information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
    }
  }
}
sayVersionInfo();

import type { Zow } from "./lib/zow.ts";
import { presume_Zow } from "./lib/zow.ts";

const func = async () => {
  if (!("zow" in window)) {
    return;
  }
  if (!presume_Zow(window.zow)) {
    return;
  }
  let zow: Zow = window.zow;
  const response = await zow.ping();
  console.log(response); // prints out 'pong'
};

func();

declare global {
  interface Window {
    pow: {
      walkies: () => Promise<string>
    };
  }
}
const sheesh = async () => {
  console.log(await window.pow.walkies());
};
sheesh();

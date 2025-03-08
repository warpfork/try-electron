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
      counter: () => AsyncGenerator<number>
      wat: () => any
    };
  }
}
const sheesh = async () => {
  console.log(await window.pow.walkies());
  console.log("okay, now then")

  console.log("wat:", window.pow.wat()) // IS an object.  DOES copy the properties.
  // console.log("watplz:", window.pow.wat().plz()) // mysteriously DOES NOT have this method.  ...yeah, is not type Wat; is type Object.

  // sanity check, does this syntax literally even work.  okay, yes.
  // The thing can be cast to `AsyncIterable<number>` (e.g., you can get an iterator *from* it).
  // But without stating such, it is seen as `AsyncGenerator<number, void, unknown>`.
  // `AsyncGenerator` appears to be both "i am an iterator" *and* "you can get an iterator from me".
  // (So, you can *also* cast it to `AsyncIterator<number>` -- but this you *don't* want to do,
  // because the for-await syntax only accepts an Iter*able*, not an Iter*ator*.  Whew.)
  // This is all very dizzying frankly but I guess that's supposed to just be the superset polyfill-maxxing la la lay.
  let plzcount = (async function* () {
    for (let i = 0; i < 3; i++) {
      yield i;
    }
  })()
  for await (const n of plzcount) {
    console.log("plzcounter = ", n)
  }

  // and this... errors with "An object could not be cloned".  Okayyyyyyy
  // the error points at the `.counter()` part.
  for await (const n of window.pow.counter()) {
    console.log("counter = ", n)
  }
};
sheesh();

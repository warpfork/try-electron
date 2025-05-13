// src/lib/zow.ts
function presume_Zow(x) {
  return true;
}

// src/renderer.ts
var versions = window.versions;
function presume_Versions(x) {
  return true;
}
function sayVersionInfo() {
  const information = document.getElementById("info");
  if (information != null) {
    if (!("versions" in window)) {
      return;
    }
    let versions2 = window.versions;
    if (presume_Versions(versions2)) {
      information.innerText = `This app is using Chrome (v${versions2.chrome()}), Node.js (v${versions2.node()}), and Electron (v${versions2.electron()})`;
    }
  }
}
sayVersionInfo();
var func = async () => {
  if (!("zow" in window)) {
    return;
  }
  if (!presume_Zow(window.zow)) {
    return;
  }
  let zow = window.zow;
  const response = await zow.ping();
  console.log(response);
};
func();
function buildIpcStream(borker) {
  return async function* () {
    let bork = await borker();
    let loop = true;
    while (loop) {
      let { val, exists } = await bork();
      loop = exists;
      if (exists)
        yield val;
    }
  }();
}
var sheesh = async () => {
  console.log(await window.pow.walkies());
  console.log("okay, now then");
  let plzcount = async function* () {
    for (let i = 0;i < 3; i++) {
      yield i;
    }
  }();
  for await (const n of plzcount) {
    console.log("plzcounter = ", n);
  }
  let whew = buildIpcStream(window.pow.counter);
  for await (const n of whew) {
    console.log("whew = ", n);
  }
};
sheesh();

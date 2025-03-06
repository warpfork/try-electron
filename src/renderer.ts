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

const func = async () => {
  const response = await window.zow.ping();
  console.log(response); // prints out 'pong'
};

func();

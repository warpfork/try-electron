const information = document.getElementById("info");
if (information != null) {
  information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
}

const func = async () => {
  const response = await window.zow.ping();
  console.log(response); // prints out 'pong'
};

func();

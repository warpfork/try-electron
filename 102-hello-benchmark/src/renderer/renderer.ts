declare global {
	interface Window {
		ctrl: {
			quit: () => void;
		};
	}
}

console.log("renderer loaded");

window.ctrl.quit();

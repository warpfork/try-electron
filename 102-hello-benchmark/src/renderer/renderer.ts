declare global {
	interface Window {
		ctrl: Ctrl;
	}
}

interface Ctrl {
	quit(): void;
}

console.log("renderer loaded");

window.ctrl.quit();

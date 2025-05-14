interface Ctrl {
	quit(): void;
	count(): Promise<number>;
	log(msg: unknown): void;
}
const ctrl = window.ctrl as Ctrl;

console.log("renderer loaded");

async function foo() {
	ctrl.log(`starting counter.`);
	let answer;
	for (let i = 0; i < 1000; i++) {
		answer = await ctrl.count();
	}
	ctrl.log(`final answer: ${answer}`);
}
foo().then(ctrl.quit);

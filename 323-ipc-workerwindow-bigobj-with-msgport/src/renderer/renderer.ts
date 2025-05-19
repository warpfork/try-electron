interface Ctrl {
	quit(): void;
	log(msg: unknown): void;
}
const ctrl = window.ctrl as Ctrl;

console.log("renderer loaded");

// Set up a message handler to receive the special message that contains the MessagePort.
window.onmessage = (event) => {
	// event.source === window means the message is coming from the preload script, as opposed to from an <iframe> or other source.
	if (event.source === window && event.data === "port-establish") {
		const [port] = event.ports;

		// Once we have the port, we can communicate directly with the main process.
		// Use `port.postMessage` to send;
		// Set a callback to `port.onmessage` to receive.
		// Building a request-response/RPC feel, or anything else at all really (including backpressure) is unfortunately left as an exercise.
		workWithPort(port) //
			.then(ctrl.quit);
	}
};

// In this function, we're going to send "count" messages (like in our earlier demo),
// and also wait for a response before continuing to the next one.
// (Here you see all the Promise-making guts; in the demos earlier using Electron's built-in IPC, it's doing similar things, just slightly out of sight.)
async function workWithPort(port: MessagePort) {
	let resolutions = new Map<string, (arg0: any) => void>();
	port.onmessage = (event) => {
		// console.log("from main process:", event.data);
		let resolver = resolutions.get(event.data.replyTo);
		if (!resolver) return;
		resolutions.delete(event.data.replyTo);
		resolver(event.data.body);
	};

	ctrl.log(`starting counter.`);
	let answer;
	for (let i = 0; i < 1000; i++) {
		let prom = new Promise((resolve, reject) => {
			let requestId = `${i}`;
			port.postMessage({ requestId: requestId }); // This is a synchronous (but fast) fire-and-forget.
			// In contrast to the earlier demos: we're sending a value here because we need something to map responses to.
			resolutions.set(requestId, resolve);
		});
		answer = await prom;
	}
	ctrl.log(`final answer: ${(answer as { count: number }).count}`);
	// ctrl.log(`final answer: ${answer}`); // <- Or if transferring just the number, do this.
}

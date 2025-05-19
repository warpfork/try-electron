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
// and for every one of them we're going to make *a whole new MessagePort* to wait for responses on.
// (Will this be costly?  Let's see!)
// (Do we still get stuck having to make Promise objects ourselves if we want that API?  Let's see!)
async function workWithPort(port: MessagePort) {
	ctrl.log(`starting counter.`);
	let answer;
	for (let i = 0; i < 1000; i++) {
		const channel = new MessageChannel();
		let prom = new Promise((resolve, reject) => {
			port.postMessage({ replyCh: channel.port2 }, [channel.port2]); // This is a synchronous (but fast) fire-and-forget.
			channel.port1.onmessage = (evt: MessageEvent) => {
				resolve(evt.data);
			};
		});
		answer = await prom;
	}
	ctrl.log(`final answer: ${(answer as { count: number }).count}`);
	// ctrl.log(`final answer: ${answer}`); // <- Or if transferring just the number, do this.
}

interface Ctrl {
	quit(): void;
	log(msg: unknown): void;
}
const ctrl = window.ctrl as Ctrl;

console.time("worker");
console.timeLog("worker", "worker loaded");

// Set up a message handler to receive the special message that contains the MessagePort.
window.onmessage = (event) => {
	// event.source === window means the message is coming from the preload script, as opposed to from an <iframe> or other source.
	if (event.source === window && event.data === "port-establish") {
		const [port] = event.ports;

		// Once we have the port, we can communicate directly with the main process.
		// Use `port.postMessage` to send;
		// Set a callback to `port.onmessage` to receive.
		// Building a request-response/RPC feel, or anything else at all really (including backpressure) is unfortunately left as an exercise.
		workWithPort(port);
	}
};

let state = {
	count: 0,
	stuff: (() => {
		let arr = [];
		for (let i = 0; i < 1000; i++) {
			arr.push({
				foo: `bar-${i}`,
				//baz: `bar-${i}`, // uncomment for some more variation testing.
				//wok: new Date(), // yes, it'll work; no, it's not good.
			});
		}
		return arr;
	})(),
};
console.timeLog("worker", "test data initialized", new Date());
const state_as_json = JSON.stringify(state);
console.log("test data as json string is length=", state_as_json.length);
console.timeLog("worker", "test data measurement done", new Date());
JSON.parse(state_as_json);
console.timeLog("worker", "test data parse measurement done", new Date());

async function workWithPort(port: MessagePort) {
	port.onmessage = (event) => {
		state.count++;
		event.data.replyCh.postMessage(state);
		// TODO: play with `port.close()`.
	};
}

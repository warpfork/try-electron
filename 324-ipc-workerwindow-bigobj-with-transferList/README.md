Demo: How fast are MessagePort?  renderer-to-other-renderer with large payloads, with contextIsolation on, but now using the transferList.
========

It would be nice to use MessagePort to transfer payloads between windows,
and it would be *really* nice if we could use the `transferList` feature
to somehow move data in a cheaper way than the (quite underexplained, imo) overhead that `structuredClone` seems to induce.


Results
-------

... This also doesn't work nearly as richly as you probably wish it does.
I wanted to do this demo with the large ragged object tree, but... cannot.
The MessagePort transferList parameter has an allowlist of what it can transfer, and that allowlist is slightly longer than the Electron MainMessagePort list, but still very, very short.

https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects#supported_objects is the list.
And it's a brutally short list.

It looks more or less like you'd have to bring your own serialization,
and use an ArrayBuffer to pass content, if you want to approach "zero copy" transfers.

There's a few other useful things in there for other specific purposes
(`ReadableStream` and `WritableStream` being probably the most general among those),
but none of it is really helping with transfer of objects without requiring a serialization phase.


Sample Output
-------------

None.  Impossible.

You can find all exactly one line that needs to change in the previous demo if you want to play with it, though:
it's the line `// [state]` in the `workWithPort` function in the file
[worker.ts](../323-ipc-workerwindow-bigobj-with-msgport/src/worker/worker.ts).

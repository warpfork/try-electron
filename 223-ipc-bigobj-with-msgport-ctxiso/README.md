Demo: How fast are MessagePort?  renderer-to-main with large payloads, with contextIsolation on.
========

`MessagePort` is yet another option in the modern menagerie of communication APIs.
They're from the wider world, rather than being totally Electron-specific, which is interesting.

In this demo, we set up a `MessagePort` pair in the Electron main process,
and send one side of it to the preload, and let it send it on to the renderer window code,
and then communicate from there.

A very tiny protocol of an object with request ID strings is banged out here,
just so we can make equivalent awaits and a fair comparison.


Results
-------

summary todo

hypothesis: having contextIsolation on in the earlier demos means `structuredClone` is happening *twice*:
once as the value moves from main to preload, and again as it moves from preload to renderer.
That would explain it being about twice as slow as this code using a `MessagePort` (which *also* uses `structuredClone` internally, IIUC).


Sample Output
-------------

In the terminal output:

```
main: 0.065ms main started 2025-05-14T13:23:31.319Z
main: 3.395ms test data initialized 2025-05-14T13:23:31.322Z
test data as json string is length= 17911
main: 3.73ms test data measurement done 2025-05-14T13:23:31.323Z
main: 3.963ms test data parse measurement done 2025-05-14T13:23:31.323Z
main: 80.736ms invoking win.loadFile 2025-05-14T13:23:31.400Z
main: 136.61ms win.loadFile returned 2025-05-14T13:23:31.456Z
main: 137.177ms from renderer starting counter.
main: 930.944ms from renderer final answer: 1000
main: 931.231ms quit instruction received in main 2025-05-14T13:23:32.250Z
```

Is that faster than the demo using Electron's native IPC, when they're both doing the same large object transfer?  _Yes_!
And somewhat significantly: it's almost twice as fast.
(Although it's still slower than a JSON round-trip, which I find staggering.)


### with just the number transferred (instead of the large object):

```
main: 0.066ms main started 2025-05-14T13:20:43.656Z
main: 89.384ms invoking win.loadFile 2025-05-14T13:20:43.746Z
main: 148.39ms win.loadFile returned 2025-05-14T13:20:43.805Z
main: 148.848ms from renderer starting counter.
main: 247.025ms from renderer final answer: 1000
main: 247.33ms quit instruction received in main 2025-05-14T13:20:43.904Z
```

Is that faster than the demo using Electron's native IPC, when they're both doing just a number as payload?  _Yes_, somewhat eyebrow-raisingly.
It's measurably (although I wouldn't say significantly) faster.

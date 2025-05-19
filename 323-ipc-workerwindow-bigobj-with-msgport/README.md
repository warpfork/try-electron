Demo: How fast are MessagePort?  renderer-to-other(!)-renderer, with differing nodeIntegration modes, with large payloads, with contextIsolation on.
========

In this demo, we use MessagePort to transfer payloads between two windows, directly (without bouncing through the main process).

Each of those windows has a different `nodeIntegration` setting -- one is enabled, and the other is not!
This is interesting and potentially useful because it means one of them can run as a "worker" that has full access to the system and filesystem APIs,
while the other is still constrained to just being a renderer and communicating with main and the worker.
(There's lots of reasons that might be interesting, but one in particular is it might be handy that worker window also has its own whole dev console,
which can be a lot more pleasant to interact with than the plain terminal output from the main process!
Another is that the javascript running in a window can be reloaded without restarting the whole Electron process -- whereas the "main" code
can only be reloaded by terminating and relaunching the entire Electron process completely.)

This transfer is still expected to do something like a `structuredClone` operation on the bottom,
meaning its performance will still be proportional to the amount of data being transferred.
(We'll try to change that in the next demo.)


Results
-------

Good news!

Looks like the MessagePort performs similarly between two wholy separate windows as it does between main and renderer, which is not too shabby.

In other words: if you want to use an extra window in order to have a new debug console and to have an isolated context where you can force reloading,
you can have those more or less "for free" in terms of whether there will be extra IPC overhead.

(You will still pay a little extra setup time for that other window, though, of course.  TANSTAAFL.)


Sample Output
-------------

```
main: 0.067ms main started 2025-05-16T23:22:11.427Z
main: 84.642ms invoking win.loadFile for renderer 2025-05-16T23:22:11.512Z
main: 96.267ms invoking win.loadFile for worker 2025-05-16T23:22:11.523Z
main: 176.277ms win.loadFile for renderer returned 2025-05-16T23:22:11.603Z
main: 176.874ms from renderer starting counter.
main: 285.561ms win.loadFile for worker returned 2025-05-16T23:22:11.712Z
main: 1.106s from renderer final answer: 1000
main: 1.107s quit instruction received in main 2025-05-16T23:22:12.534Z
```

(This is a little slower than benchmark-223 was, but it appears to be mostly due to creating the worker window taking slightly longer in the first place, for whatever reason.
After that setup, the transfer seems equivalent.)

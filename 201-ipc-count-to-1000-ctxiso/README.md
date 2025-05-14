Demo: How fast is IPC?  renderer-to-main invoke and answer, simple counting, with contextIsolation on.
========

This demo has a very simple application that starts up,
starts a loop in the renderer,
and in each step of the loop, does an `invoke` to an ipc hook in the main process, and awaits the result.

The main process is doing about the minimum imaginable work:
it's counting up every time this happens.

The renderer also sends a couple log messages to main.
However, it does just a couple of these at the beginning and end of its work...
because we want to get a view of the speed of its work, not the speed of the logging.



Results
-------

It's... not fast.

In the sample data below:

- Electron takes about 80ms to get through creating a window.
- It's another 60ms before the renderer script has loaded.
- Counting to 1000 takes about 130ms.  (Looks similar whether going by numbers seen by the preload code and numbers from the logs that make it back out to main.)

So... seems like you can expect to do something like 7~8k communication roundtrips per second.
When the content is a simple single number.


### Variation: what if the IPC invocations aren't forced to be serial?

Easy to test: move the `await` on the `await window.ctrl.count` down
a couple lines, so that the `${answer}` interpolation in the logging is `${await answer}`.

It seems to be about 3x faster.  (That's still pretty "not fast" overall, though.)


### Contextualization: how fast can javascript just... count to a thousand?

Counting to 1000 in the main process takes about 0.059ms.
Mind the decimal point: that's one half of one tenth of one millisecond.
(That's probably in the realm where the measurement is not very precise anyway, because it's just entirely too fast to clock it sensibly.)


### Contextualization: okay, but does this overhead matter in _real_ tasks?

See other demos for more examination of that.



Sample Output
-------------

In the terminal output:

```
main: 0.067ms main started 2025-05-14T01:13:36.084Z
main: 82.225ms invoking win.loadFile 2025-05-14T01:13:36.166Z
main: 138.544ms from renderer starting counter.
main: 144.298ms win.loadFile returned 2025-05-14T01:13:36.228Z
main: 269.123ms from renderer final answer: 1000
main: 269.406ms quit instruction received in main 2025-05-14T01:13:36.354Z
```

And in the devtools console log of the electron window itself
(if you comment out the `app.quit()` so you have a chance to get it):

```
renderer loaded
preload: 9.640869140625 ms renderer sent log: starting counter.
preload: 141.8349609375 ms renderer sent log: final answer: 1000
preload: 141.94677734375 ms quit invoked (as seen by preload contextBridge)
```

These numbers appear to be decently representative.
(Also, as a sanity check, I confirm the numbers seen from main's POV
don't vary significantly depending on whether or not app.quit happens rapidly.)

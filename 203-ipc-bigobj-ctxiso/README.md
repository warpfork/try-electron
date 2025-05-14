Demo: How fast is IPC?  renderer-to-main with large payloads, with contextIsolation on.
========

This demo is very similar to the count-to-1000 demo,
but responds to each IPC message by sending a significantly larger object back to the renderer.

The purpose of this is to test how costly the `structuredClone` of the IPC transport internals really is.

The sample data, if serialized as JSON, would be about 18kb.
It's approximately 1000 objects, each with a single string:string key:value pair.



Results
-------

Long story short: yeah, message sizes absolutely matter.

In the sample data below:

- It takes about 1937ms to do all the invocations.

Contrast this to the demo which does the same thing with only numbers in the response:

- That took about 130ms.

So: yes: making the data of any moderate size at all does increase the cost of IPC noticably.


### Variation: what if the data is bigger?

Okay, let's increase the size of the array of objects:

- 1000objs/18kb-J -> 1937ms.
- 2000objs/37kb-J -> 3784ms.

So yeah, the costs are proportional to size.


### Variation: what if the data is larger but not more objects?

Okay, let's add a "baz" field next to every "foo" field
(so we have the same number of objects, but they're twice the size):

- 1000objs/34kb-J -> 2335ms.

So, yeah, every byte counts.
(But also, yes, object allocations are a considerable part of any expense.
Probably not a surprise, if you've measured the performance of pretty much anything ever.)



Sample Output
-------------

In the terminal output:

```
main: 0.065ms main started 2025-05-14T01:58:36.073Z
main: 3.367ms test data initialized 2025-05-14T01:58:36.077Z
main: 85.078ms invoking win.loadFile 2025-05-14T01:58:36.158Z
main: 133.95ms from renderer starting counter.
main: 139.992ms win.loadFile returned 2025-05-14T01:58:36.213Z
main: 2.077s from renderer final answer: 1000
main: 2.077s quit instruction received in main 2025-05-14T01:58:38.150Z
```

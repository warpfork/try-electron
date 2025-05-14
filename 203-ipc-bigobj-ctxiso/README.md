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

And to phrase it in terms of what you can get done in a time limit:
this means you can send moderately sized objects of data, like our sample here,
oh... about 500 times a second.


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


### Contextualization: how fast is this compared to, say, JSON serialization?

Ghastly, boggedly, what-are-you-even-doing _slow_.

- Serializing the sample data to JSON takes about 0.349ms.  Mind the decimal point: less than half a millisecond.
- Parsing the same data from JSON to objects takes 0.204ms.  (I think we're in measurment error territories here.)
- But we're seeing 1000 sends take about 1807ms, so, about 1.8ms each.

Now, our sends have awaits on the recieve before the next request and send, and so on.
That means it's fair and symmetric to compare it to the sum of serialize+parse.
And in order to further give the benefit of the doubt to the IPC system, I've also subtracted the time taken by the IPC roundtrips with a more trivial payload.

And we're still seeing IPC being more than three times slower than JSON.

Than ***JSON***.  JSON!
JSON which is not even a length delimited protocol.
JSON which has to do string escaping and parsing on every byte.

I don't know how this is slower than JSON.
That's mad.


Sample Output
-------------

In the terminal output:

```
main: 0.064ms main started 2025-05-14T02:21:01.064Z
main: 3.492ms test data initialized 2025-05-14T02:21:01.068Z
test data as json string is length= 17911
main: 3.841ms test data measurement done 2025-05-14T02:21:01.068Z
main: 4.045ms test data parse measurement done 2025-05-14T02:21:01.068Z
main: 92.818ms invoking win.loadFile 2025-05-14T02:21:01.157Z
main: 150.888ms from renderer starting counter.
main: 157.46ms win.loadFile returned 2025-05-14T02:21:01.222Z
main: 2.075s from renderer final answer: 1000
main: 2.075s quit instruction received in main 2025-05-14T02:21:03.140Z
```

Demo: sending more MessagePort over a MessagePort as the reply channel
========

Our other demos using MessagePort have used a very basic "custom protocol" of message numbers,
and a map that remembers them to associate responses and requests, and makes Promise objects in the requester side.
That works, but is a little... lackluster.

Can we send a new MessagePort along with a message, and have that be the reply mechanism?

Results
-------

YES!  It works, and the overhead is negligible and probably below the threshhold of measurement for any practical purpose.

This is quite nice: it's clear, it's simple, it's robust...
It doesn't require a map (and can't generate dangling garbage objects!); it's great!

And it also gives an easy way to reply with a whole stream of values rather than just one
(although we have not demonstrated that here).


Sample Output
-------------

```
main: 0.066ms main started 2025-05-19T10:14:44.125Z
main: 84.961ms invoking win.loadFile for renderer 2025-05-19T10:14:44.210Z
main: 95.219ms invoking win.loadFile for worker 2025-05-19T10:14:44.220Z
main: 166.922ms win.loadFile for renderer returned 2025-05-19T10:14:44.292Z
main: 167.669ms from renderer starting counter.
main: 302.946ms win.loadFile for worker returned 2025-05-19T10:14:44.428Z
main: 1.126s from renderer final answer: 1000
main: 1.126s quit instruction received in main 2025-05-19T10:14:45.251Z
```

The closest comparison for this is of course demo 323, in which we transfer the same things,
but doing using our little requestID map protocol.
In comparison to that: we see effectively no additional overhead at all.  Nice!

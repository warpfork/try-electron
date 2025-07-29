Trying out Electron
===================

This repo was made for me.  But maybe it's helpful and interesting for you, too.

[Electron](https://www.electronjs.org/) is a popular toolkit for making applications with UIs powered by web technology.

It's also a project that's now of some considerable age,
which has experienced MANY generations of significantly varying APIs,
and in particular has MANY different forms of IPC mechanisms.

Which means you may have to make interesting choices about which IPC mechanisms to use.

And mind you, you CANNOT reasonably choose "none"[‡],
because IPC is not an advanced topic in electron:
it's something you must do in order to get basic features of interacting with the host at all to be possible from the UI.

These IPC mechanisms vary in:

- efficiency,
- whether they work _at all_,
- whether they're capable of backpressure,
- what kinds of objects they can transfer,
- and whether you can _tell_ when they're disconnected and dropping messages (!),

and that variance can be based on:

- which actually mechanisms you're using -- electron IPC, postmessage, messageports, localstorage, etc
- what you're talking between: renderers, the main context, service workers, etc,
- whether or not the renderer(s) involved have a preload code phase (aka `contextIsolation`),
- whether or not some additional sandboxing flags are enabled,
- whether or not nodeIntegration is enabled,
- whether you've remembered to use certain magic arguments of some APIs,
- AND SO ON.

This repo is my exploration into _some_ of those.

**Each subdirectory of this repo is another, small, isolated, all-by-itself Electron project, which tests *one* IPC system.**

The README file in each dir should describe something of the principle of what's being tested,
and contains some timing results.

Enjoy.  If you can.  I guess.



---

- ^‡ -- actually, you *can* choose "none" IPC.  But only by enabling `nodeIntegration` in the renderer, and saying goodbye to all attempts at security.
  Which does, frankly, seem to be what most remotely successful apps do.  And having done the rest of this research: _I can see why_.


License
-------

MIT.

Or Apache2.  Or WTFPL.  Or CC-0.  Or whatever.  I don't fucking care; this isn't interesting enough to hold a claim over.

If it's useful, riff freely.

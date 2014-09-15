replayer
========

A simple Javascript reflection-based method-call recorder and replayer.

## Usage

Simply require the package, watch the class you want and use the returned watcher in place of the existing class.  Once you've watched it, you can then replay on a different instance.

    function demonstrateReplayer() {
		var replayer = require('replayer');
		var toWatch = new MyObject();
		var watched = replayer.watch(toWatch);

		// Invoke some operations....
		var result1 = watched.myMethod(param1, param2);
		var result2 = watched.myMethod(param3, param4);

		// Then replay them on a new instance.
		var newInstance = new MyObject();
		var results = watched.replay(newInstance);

		// results should be [result1, result2];
    }

## Caveats

I almost called this package simple-replayer, because it is *simple*.  There are many ways it could be improved to extend its support for various scenarios, but they would all make it more complicated, and my goal was the simplest thing that would work for my needs.  As such, here are the sharp corners:

* Only proper objects supported
  * Uses ```for (var method in obj)``` to find methods, so built-ins like *string* will fail.
* No serialization of arguments
  * Grabs the argument list and squirrels it away, but doesn't do any sort of round-tripping serialization, so if the arguments are mutable and mutate in between recording and playback, results will be different.
* No support for async methods
  * Doesn't infer callbacks and invoke them, although it's something I'm considering adding.
* Duck-typed
  * The "replay" method doesn't care what object you pass in, as long as it's duck-type compatible with the methods it's recorded.  Check test/basic.js - it records on a non-string and plays back on a string.

## Installation

Installs via *npm*:

```
npm install replayer
```

## License

Apache v2, see LICENSE
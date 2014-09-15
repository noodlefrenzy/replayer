var Replayer = function(obj) {
    this.record = [];
    var self = this;
	for (var k in obj) {
        console.log('Checking '+k);
        debugger;
		if (typeof obj[k] === 'function') {
			console.log('Installing replayer for ' + k);
            self[k] = function() {
                var args = Array.prototype.slice.call(arguments);
                console.log('Recording call to ' + k);
                self.record.push([ k, args ]);
                return obj[k].call(obj, args);
            };
		}
	}
};

Replayer.prototype.replay = function(newSelf) {
    var results = [];
    for (var idx in this.record) {
        var curMethod = this.record[idx][0];
        var curArgs = this.record[idx][1];
        results.push(newSelf[curMethod].call(newSelf, curArgs));
    }

    return results;
};

exports.watch = function(obj) { return new Replayer(obj); };

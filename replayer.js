var Replayer = function(obj) {
    this.record = [];
    var self = this;
	for (var k in obj) {
		if (typeof obj[k] === 'function') {
            // Close on k.
            (function () {
                var fnName = k;
                self[fnName] = function() {
                    var args = Array.prototype.slice.call(arguments);
                    self.record.push([ fnName, args ]);
                    var result = obj[fnName].call(obj, args);
                    console.log('Recording ' + fnName + ': result = ' + result);
                    return result === obj ? self : result;
                };
            })();
		}
	}
};

Replayer.prototype.replay = function(newSelf) {
    var results = [];
    for (var idx in this.record) {
        var curMethod = this.record[idx][0];
        var curArgs = this.record[idx][1];
        var curResult = newSelf[curMethod].call(newSelf, curArgs);
        console.log('Replaying ' + curMethod + ': result = ' + curResult);
        results.push(curResult);
    }

    return results;
};

module.exports.watch = function(obj) { return new Replayer(obj); };


function makeProxy(obj, replayer, fnName) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        replayer.record.push([ fnName, args ]);
        var result;
        if (args.length == 1) {
            result = obj[fnName].call(obj, args[0]);
        } else {
            result = obj[fnName].call(obj, args); 
        }
        return result === obj ? replayer : result;        
    };
}

var Replayer = function(obj) {
    this.record = [];
    var self = this;
    for (var k in obj) {
        if (typeof obj[k] === 'function') {
            self[k] = makeProxy(obj, self, k);
        }
    }
};

Replayer.prototype.replay = function(newSelf) {
    var results = [];
    for (var idx in this.record) {
        var curMethod = this.record[idx][0];
        var curArgs = this.record[idx][1];
        var curResult;
        if (curArgs.length == 1) {
            curResult = newSelf[curMethod].call(newSelf, curArgs[0]);
        } else {
            curResult = newSelf[curMethod].call(newSelf, curArgs); 
        }
        results.push(curResult);
    }

    return results;
};

module.exports.watch = function(obj) { return new Replayer(obj); };

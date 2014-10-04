/**
 * Used internally by the Replayer.
 * Makes a proxy for the given object's function that will wrap it, allowing it to be recorded and replayed later.
 *
 * @param {object} obj              Object to wrap
 * @param {Replayer} replayer       Replayer used to record
 * @param {string} fnName           Name of the function to record
 * @returns {Function}              Proxy function that will do the recording
 */
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

/**
 * Builds a Replayer object, wrapping the given object instance.
 *
 * @param {object} obj              Object instance to wrap
 * @constructor
 */
var Replayer = function(obj) {
    this.record = [];
    this.wrapped = obj;
    var self = this;
    for (var k in obj) {
        if (typeof obj[k] === 'function') {
            self[k] = makeProxy(obj, self, k);
        }
    }
};

/**
 * Allows access to wrapped object.  Should only be used to avoid capturing calls that should avoid capture.
 *
 * @function getWrapped
 * @returns {object}                Wrapped object.
 */
Replayer.prototype.getWrapped = function() { return this.wrapped; };

/**
 * Replays any recorded function calls, in order, on the passed-in instance.
 * Must be duck-type compatible with the original instance for all recorded functions.
 *
 * @param {object} newSelf          Object on which to play back recorded function calls.
 * @returns {Array}                 Results from all calls, in order.  Calls with no result get recorded as 'undefined'.
 */
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

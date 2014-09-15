var should = require('should');
var replayer = require('../replayer.js');

var TestClass = function(str) {
    this.str = str;
};

TestClass.prototype.indexOf = function(substr) {
    return this.str.indexOf(substr);
};

TestClass.prototype.chain1 = function() {
    return this;
};

TestClass.prototype.chain2 = function() {
    return this;
};

describe('Replayer', function() {
    it ('should record and playback', function() {
        var toWatch = new TestClass("123");
        var watcher = replayer.watch(toWatch);
        watcher.indexOf("2").should.eql(1);
        watcher.indexOf("4").should.eql(-1);

        var toReplay = "345";
        var results = watcher.replay(toReplay);
        results.length.should.eql(2);
        results[0].should.eql(-1);
        results[1].should.eql(1);
    });

    it ('should cope with methods returning "this"', function() {
        var toWatch = new TestClass("123");
        var watcher = replayer.watch(toWatch);
        watcher.chain1().chain2().chain1().indexOf("2").should.eql(1);

        var toReplay = new TestClass("456");
        var results = watcher.replay(toReplay);
        results.length.should.eql(4);
        results[3].should.eql(-1);
    });
});
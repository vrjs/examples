var should = require('chai').should();
var sinon = require('sinon');
var recorder = require('../index');

var r = new recorder();

var wp = function() {
    return this.position;
}
var wr = function() {
    return this.quaternion;
}

var pando1 = {
    id : 0,
    name:'test', 
    position: {x:0, y:0, z:0}, 
    quaternion:{x:0, y:0, z:0, w:1 },
    getWorldPosition: wp, 
    getWorldQuaternion: wr
};
var pando2 = {
    id : 0,
    name:'test2', 
    position: {x:0, y:0, z:0}, 
    quaternion:{x:0, y:0, z:0, w:1 }, 
    getWorldPosition: wp, 
    getWorldQuaternion: wr
};


describe ('recorder', function() {
    it ('returns false for active if not activated', function() {
        r.active().should.equal(false);
    });
    it ('returns true for active after activated', function() {
        r.start();
        r.active().should.equal(true);
    });
    it ('starts with no objects being tracked', function (){
    	r.tracked().length.should.equal(0);
    });
    it ('accepts new object via track', function() {
    	r1 = new recorder()
    	r1.track({name:'test'});
    	r1.tracked().length.should.equal(1);
    })
});




describe('recorder export', function() {
    var clock;
    
    it ("should persist one sample per line", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.track(pando2);
        r.start()
        clock.tick(r.interval*10);
        clock = clock.restore();

        r.persist("test.txt", function(err) {
            var i;
            var count = 0;
            require('fs').createReadStream("test.txt")
              .on('data', function(chunk) {
                for (i=0; i < chunk.length; ++i)
                  if (chunk[i] == 10) count++;
              })
              .on('end', function() {
                count.should.equal(22);
                done();
              });
        });
        
    });
});

describe('recorder samples', function() {
    var clock;
    
    it ("should record one sample per interval", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.start()
        clock.tick(r.interval);
        clock = clock.restore();
        r.samples({}, function(err, samples){
          samples.length.should.equal(2);
          done();   
        }) // once on start, once after 50ms
    });

    it ("should record one samples with properties", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.start()
        clock.tick(r.interval);
        clock = clock.restore();
        r.samples({}, function(err, samples){
            var sample = samples[0];
            sample.name.should.equal('test');
            sample.local_position.x.should.equal(0);
            sample.local_orientation.w.should.equal(1);
            sample.world_position.x.should.equal(0);
            sample.world_orientation.w.should.equal(1);
            sample.id.should.equal(0);
            done();   
        }) 
    });

    it ("should record 4 samples after three intervals", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.start()
        clock.tick(r.interval*3);
        clock = clock.restore();
        r.samples({}, function(err, samples){
          samples.length.should.equal(4);   
          done();
        })
    });

    it ("should record 8 samples after three intervals if two objects are tracked", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.track(pando2);
        r.start()
        clock.tick(r.interval*3);
        clock = clock.restore();
        r.samples({}, function(err, samples){
          samples.length.should.equal(8); 
          done();  
        })
    });

    it ("should record 4 samples after three intervals for specific object", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.track(pando2);
        r.start()
        clock.tick(r.interval*3);
        clock = clock.restore();
        r.samples({'name':'test'}, function(err, samples){
          samples.length.should.equal(4);   
          done()
        })
    });

    it ("should record 2 samples after three intervals for specific object if only 2 were requested", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.track(pando2);
        r.start()
        clock.tick(r.interval*3);
        clock = clock.restore();
        r.samples({'name':'test'}, function(err, samples){
          samples.length.should.equal(2);   
          done();
        }, 2)
    });

    it ("should allow removal of tracked objects", function(done) {
        clock = sinon.useFakeTimers();
        r = new recorder();
        r.track(pando1);
        r.track(pando2);
        r.start()
        clock.tick(r.interval*3);
        r.untrack(pando2);
        clock.tick(r.interval);
        clock = clock.restore();
        r.samples({}, function(err, samples){
          samples.length.should.equal(9);   
          done();
        })
    });
})
var Datastore = require('nedb')

module.exports = function () {
	this.objects = [];
    this.interval = 50;
    this.activated = false;
    this.internal_samples = [];
    this.sequence_number = 0;
    this.active = function () {
    	return this.activated;
    }, 
    this.tracked = function () {
    	return this.objects;
    }, 
    this.track = function (obj) {
    	this.objects.push(obj);
    }
    this.untrack = function(obj) {
        var index = this.objects.indexOf(obj);
        this.objects.splice(index, 1);
    }
    this.start = function () {
        this.activated = true;
        record_now(this);
    }
    this.samples = function(query, callback, num_samples) {
        if (num_samples) {
            query.sequence_number = {'$gte':this.sequence_number-num_samples}
        }
        this.data.find(query, function (err, val){
            callback(err, val);
        });
    }

    this.persist = function(filename, callback){
        var fs = require('fs');
        var fs = require('fs');
        var stream = fs.createWriteStream(filename);
        var self = this;
        stream.once('open', function(fd) {
            self.data.find({}, function (err, samples){
                for (var i = 0; i < samples.length; i++ ) {
                    stream.write(samples[i].name + "\n");
                }
                stream.end();
                // delay a bit so we can open the file and get everything...
                setTimeout(callback, 500);
            });
        });

        
    }
    this.record_sample = function() {
        var time_stamp = Date.now();
        for (var i in this.objects) {
            var o = this.objects[i];
            var sample = {
                id : o.id,
                name : o.name,
                local_position : o.position, 
                local_orientation : o.quaternion, 
                world_position : o.getWorldPosition(), 
                world_orientation : o.getWorldQuaternion(),
                time : time_stamp, 
                sequence_number : this.sequence_number
            }
            this.data.insert(sample);
        }

        this.sequence_number++;
    }

    this.data = new Datastore({inMemoryOnly:true});
}

function record_now(recorder) {
    recorder.record_sample()
    setTimeout(record_now, recorder.interval, recorder);
}



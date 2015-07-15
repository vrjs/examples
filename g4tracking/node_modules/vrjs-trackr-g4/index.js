var g4 = require('g4');
var tracker;  

exports.make = function(THREE) {
    var sensors = [];
    for (var i = 0; i < 3; i++ ) {
        sensors.push(
        {
            controlled: [],
            position: new THREE.Vector3(0, 0, 0),
            orientation: new THREE.Quaternion(),
            scale: new THREE.Vector3(1, 1, 1), 
            offset : new THREE.Vector3(0, 0, 0)
        });
    }
    tracker = {
        sensors : sensors,
        poll: function() {
            g4.poll(null);
        },
        add: function(obj, sensor) {
            sensor = sensor || 0
            this.sensors[sensor].controlled.push(obj);
        },
        remove: function(obj, sensor) {
            sensor = sensor || 0
            this.sensors[sensor].controlled.remove(obj);
        },
        scale : function (sensor, scale) {
            if (scale === undefined ) {
                return this.sensors[sensor].scale;
            }
            else {
                this.sensors[sensor].scale = scale;
            }
        }, 
        offset : function (sensor, offset) {
            if (offset === undefined ) {
                return this.sensors[sensor].offset;
            }
            else {
                this.sensors[sensor].offset = offset;
            }
        },
        apply_poll: function(err, po_array) {
            for (var c = 0; c < 3; c++ ) {
                sensor = this.sensors[c];
                for (var i = 0; i < sensor.controlled.length; i++) {
                    var euler = new THREE.Euler(po_array[c].ori.x, po_array[c].ori.y, po_array[c].ori.z, 'ZYX');
                    o = sensor.controlled[i];
                    o.position.x = po_array[c].pos.x * sensor.scale.x + sensor.offset.x;
                    o.position.y = po_array[c].pos.y * sensor.scale.y + sensor.offset.y;
                    o.position.z = po_array[c].pos.z * sensor.scale.z + sensor.offset.z;
                    o.quaternion.setFromEuler(euler);
                }
            }
        }
    }


    g4.initialize(tracker.apply_poll);
    return tracker;
}




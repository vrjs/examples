exports.make = function(THREE) {
    var sensors = [];
    for (var i = 0; i < 10; i++ ) {
        sensors.push(
        {
            controlled: [],
            position: new THREE.Vector3(0, 0, 0),
            orientation: new THREE.Quaternion(),
            scale: new THREE.Vector3(1, 1, 1), 
            offset : new THREE.Vector3(0, 0, 0)
        });
    }
    var tracker = {
        active : 0, 
        sensors : sensors,
        poll: function() {
            this.apply_poll();
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
        handle_key: function(event) {
            if (event.which >= 48 && event.which <= 57) {
                this.active = event.which - 48;
                console.log("Switched keyboard trackr sensor to " + this.active);
                return;
            }

            var make_rotation = function(vector, sign) {
                var quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle(vector, sign * Math.PI / 2 / 20);
                return quaternion
            }
            var sensor = this.sensors[this.active];
            var ramount = Math.PI / 2 / 20;

            if (event.which === 88 && event.shiftKey) { // X moves + in x direction
                sensor.position.x += 1;
            } else if (event.which === 88) {
                sensor.position.x -= 1;
            } else if (event.which === 89 && event.shiftKey) {
                sensor.position.y += 1;
            } else if (event.which === 89) {
                sensor.position.y -= 1;
            } else if (event.which === 90 && event.shiftKey) {
                sensor.position.z += 1;
            } else if (event.which === 90) {
                sensor.position.z -= 1;
            } else if (event.which == 72 && event.shiftKey) {
                sensor.orientation.multiply(make_rotation(new THREE.Vector3(0, 1, 0), 1));
            } else if (event.which == 72) {
                sensor.orientation.multiply(make_rotation(new THREE.Vector3(0, 1, 0), -1));
            } else if (event.which == 74 && event.shiftKey) {
                sensor.orientation.multiply(make_rotation(new THREE.Vector3(1, 0, 0), 1));
            } else if (event.which == 74) {
                sensor.orientation.multiply(make_rotation(new THREE.Vector3(1, 0, 0), -1));
            } else if (event.which == 78 && event.shiftKey) {
                sensor.orientation.multiply(make_rotation(new THREE.Vector3(0, 0, 1), 1));
            } else if (event.which == 78) {
                sensor.orientation.multiply(make_rotation(new THREE.Vector3(0, 0, 1), -1));
            }
        },
        apply_poll: function() {
            for (var c = 0; c < 10; c++ ) {
                sensor = this.sensors[c];
                for (var i = 0; i < sensor.controlled.length; i++) {
                    o = sensor.controlled[i];
                    o.position.x = sensor.position.x * sensor.scale.x + sensor.offset.x;
                    o.position.y = sensor.position.y * sensor.scale.y + sensor.offset.y;
                    o.position.z = sensor.position.z * sensor.scale.z + sensor.offset.z;
                    o.quaternion.copy(sensor.orientation);
                }
            }
        }
    }

    document.addEventListener("keydown", function(e) {
        tracker.handle_key(e)
    });

    return tracker;

}

# vrjs-trackr-key
This is an npm module for the [vrjs]() framework that implements a standard tracker with keyboard controls.  The keyboard tracker has 10 channels/sensors that can be toggled, allowing an application to "track" up to ten different sensors.

## Installation

`npm install vrjs-trackr-key`

## Usage

Keypresses control the current position and orientation of the active sensor
```
x/X - moves the active sensor along the x axis
y/Y - moves the active sensor along the y axis
z/Z - moves the active sensor along the z axis
j/J - rotates the active sensor around x axis
n/N - rotates the active sensor around y axis
h/H - rotates the active sensor around z axis
[0-9] - sets the active sensor
```

In your code, you can create a trackr object with the THREE object:

```js
var keytrackr = require('vrjs-trackr-key')
var trackr = keytrackr.make(THREE);
```

You can add objects to sensors using the add method

```js
trackr.add(object, sensor_number);
```

In your animation loop, simply call the `poll` method and the module will automatically apply the sensor position and orientation to all tracked objects in the scene.

```js
trackr.poll()
```

You can apply optional positional offsets to the sensor and customized scalling using the `offset` and `scale` methods.  See source for details.



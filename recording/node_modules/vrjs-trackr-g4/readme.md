# vrjs-trackr-g4
This is an npm module for the [vrjs]() framework that utilizes the [trackr-polhemus-g4] server to connect to a Polhemus G4 tracking system

## Installation

`npm install vrjs-trackr-g4`

## Usage

**Important** In order for this module to run, you must have the [trackr-polhemus-g4](https://github.com/freezer333/trackr-polhemus-g4) tracking server installed and running on your machine.  This module does not directly communicate with the tracking system, instead it connects over local TCP to the trackr-polhemus-g4 application server.

In your code, you can create a trackr object with the THREE object:

```js
var factory = require('vrjs-trackr-g4')
var trackr = factory.make(THREE);
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


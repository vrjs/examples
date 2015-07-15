var THREE = require('three');
var debug = false;
var back_color = 0x6666ff;

var scene, camera, renderer;
var geometry, material, mesh;
var rift;

var active_renderer;

var g4 = require('vrjs-trackr-g4')
var trackr = g4.make(THREE);

var key = require('vrjs-trackr-key')
var camera_trackr = key.make(THREE);

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(back_color, 500, 10000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 50;
    camera.position.z = 100;

    camera_trackr.sensors[0].offset = new THREE.Vector3(0, 50, 1500);
    camera_trackr.sensors[0].scale = new THREE.Vector3(100, 100, 100);
    camera_trackr.add(camera, 0);


    var loader = new THREE.JSONLoader(); // init the loader util

     // init loading
    loader.load('models/car.js', function (geometry) {
        // create a new material
            var material = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('models/textures/gtare.jpg'),  // specify and load the texture
                    colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
                    colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
                    colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421]
                });
                  
                  // create a mesh with models geometry and material
            car = new THREE.Mesh(
                geometry,
                material
            );
                  
            ///////////////////////////////////////////////////////
            //
            // Setup the positional and rotational offset between 
            // the tracker (sensor_1) and the car.
            //
            ///////////////////////////////////////////////////////
            car.position.y = 0;
            car.position.x = 0;
            car.position.z = 0;
            axis = new THREE.Vector3(0,0,1);
            rad = -90 * Math.PI / 180;
            car.rotateOnAxis(axis,rad);
           

            var axis = require('vrjs-axis')(THREE);
            car.add(axis.make({neg:true, length:3000}));

            scene.add(car);
            trackr.scale(0, new THREE.Vector3(10, 10, 10));
            trackr.add(car, 0);

            ///////////////////////////////////////////////////////
    });



    var groundTexture = THREE.ImageUtils.loadTexture("three/textures/terrain/grasslight-big.jpg");
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshBasicMaterial({
        map: groundTexture
    });

    var ground_mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
    ground_mesh.position.y = -250;
    ground_mesh.rotation.x = -Math.PI / 2;
    ground_mesh.receiveShadow = true;
    scene.add(ground_mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 1);

    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    directionalLight.position.set( 1, 1, 0.5 ).normalize();
    scene.add( directionalLight );

    ////////hmd/////////
    var hmd = require('./vrjs/view/OculusRiftEffect');
    rift = new hmd.Rift(THREE, renderer, {
        worldScale: 1
    });
    rift.setSize(window.innerWidth, window.innerHeight);
    ////////////////////


    //enter_live()
    enter_debug()

    document.body.appendChild(renderer.domElement);
}



function animate() {
    trackr.poll()
    camera_trackr.poll();
    requestAnimationFrame(animate);

    renderer.setClearColor(back_color);
    active_renderer.setSize(window.innerWidth, window.innerHeight);
    active_renderer.render(scene, camera);
}

function enter_live() {
    debug = false;
    renderer.autoClear = false;
    active_renderer = rift;
    require('remote').getCurrentWindow().setFullScreen(true);
}

function enter_debug() {
    debug = true;
    renderer.autoClear = true;
    active_renderer = renderer;
    require('remote').getCurrentWindow().setFullScreen(false);
}

document.addEventListener("keydown", function(e) {
    if (e.which === 123) {
        require('remote').getCurrentWindow().toggleDevTools();
    } else if (e.which === 116) {
        location.reload();
    } else if (e.which === 68) {  //d
        if (debug) {
            enter_live()
        } else {
            enter_debug()
        }
    }
});

var THREE = require('three');
var debug = false;
var back_color = 0x6666ff;

var scene, camera, renderer;
var geometry, material, mesh;
var rift;

var active_renderer;

var keytrackr = require('vrjs-trackr-key')
var trackr = keytrackr.make(THREE);

var g4 = require('vrjs-trackr-g4')
var g4_trackr = g4.make(THREE);

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(back_color, 500, 10000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 50;
    camera.position.z = 1500;

    trackr.offset(0, THREE.Vector3(0, 50, 1500));
    trackr.scale(0 , new THREE.Vector3(100, 100, 100));
    trackr.add(camera, 0);

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    // add cube and attach it to channel 0 of tracker
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    g4_trackr.scale(0, new THREE.Vector3(10, 10, 10));
    g4_trackr.add(mesh, 0);

    // add another cube and attach it to channel 1 of tracker
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    g4_trackr.scale(1, new THREE.Vector3(10, 10, 10));
    g4_trackr.add(mesh, 1);

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
    g4_trackr.poll()
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
    } else if (e.which === 68) {
        if (debug) {
            enter_live()
        } else {
            enter_debug()
        }
    }
});

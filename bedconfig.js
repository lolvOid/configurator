$(document).ready(function () {

})
let scene, camera, orthoCamera, dimensionScene, dimensionRenderer, renderer, directionalLight, ambientLight, controls;
let css2DRenderer;

const viewer = document.getElementById("modelviewer");
const dimensionviewer = document.getElementById("dimensionViewer");


const fwidth = viewer.offsetWidth || dimensionviewer.offsetWidth;
const fheight = viewer.offsetHeight || dimensionviewer.offsetHeight;
let dimensionCanvas;
var dimensionImage;

let wWidth = 3,
    wHeight = 1.75,
    wDepth = 6



const thickness = 0.875;
const ftTom = 0.3048;


let selectedObject = null,
    selectedObjects = [];
let raycaster, pointer, mouse3D, group;
let exporter;

let composer, fxaaPass, outlinePass, planeOultinePass, doorOutlinePass;
let isCreated = false;
var removed = [];
var adjacentParts = [];
var substitubale = 0;
var columns_group = document.getElementById("columns-group");


let top_shelves = [],
    bot_shelves = [];


var clock;
var delta = 0;

var texLoader = new THREE.TextureLoader();

var pmremGenerator;

let ssaoPass;

var thicknessInmeter = 0.022225;

let wall, wallRight, wallLeft, floor;



var totalPrice = 0;


var bedTops = [], bedLegs = [] , bedFloor;

var font;
init();

animate();
getInputs();

dimensionviewer.hidden = true;

function getInputs() {
    $("#depth").on("input", function () {
        wDepth = $("#depth").val();

        // if (wDepth > 3) {
        //     $("#hingedDoor").prop("checked", false);
        //     $("#chooseColumns").hide();

        //     $("#slideDoor").prop("checked", false);
        //     $("#slideDoor").prop("disabled", false);
        // } else {
        //     $("#slideDoor").prop("checked", false);
        //     $("#slideDoor").prop("disabled", true);
        // }



        // reset();

    })


    $("input:radio[name='heightOptions']").click(function () {

        // reset();
        wHeight = $(this).val();

    });


    $("input:radio[name='widthOptions']").click(function () {

        // reset();
        wWidth = $(this).val();

    });

    $("#export").click(function () {
        Export();
    })

}

function init() {


    scene = new THREE.Scene();
    dimensionScene = new THREE.Scene();


    window.scene = scene;
    THREE.Cache.enabled = true;

    font = new THREE.FontLoader().load('./assets/fonts/helvetiker_regular.typeface.json');
    camera = new THREE.PerspectiveCamera(25, fwidth / fheight, 0.01, 100);

    camera.position.set(0, 0, 15);
    camera.aspect = fwidth / fheight;
    camera.layers.enable(0);
    camera.layers.enable(1);
    camera.layers.enable(2);

    orthoCamera = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);


    // orthoCamera.zoom = 250;
    orthoCamera.updateProjectionMatrix();
    dimensionScene.add(orthoCamera);

    // camera.lookAt(wBottom.position);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    group = new THREE.Group();


    create_lights();
    createFloor();

    helpers();

    exporter = new THREE.GLTFExporter();
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(fwidth, fheight);
    renderer.info.autoReset = false;
    renderer.setClearColor(0xFFFFFF, 1);

    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 0.7;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.compile(scene, camera);

    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    dimensionRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,

    })
    dimensionRenderer.setPixelRatio(window.devicePixelRatio);
    dimensionRenderer.setSize(fwidth, fheight);
    dimensionRenderer.compile(dimensionScene, orthoCamera)


    css2DRenderer = new THREE.CSS2DRenderer({

    });
    css2DRenderer.setSize(fwidth, fheight);
    css2DRenderer.domElement.style.position = 'fixed';
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css2DRenderer.domElement.style.color = '#000000';
    css2DRenderer.domElement.style.top = '0px';
    css2DRenderer.domElement.style.left = '0px';
    css2DRenderer.domElement.style.zIndex = 1

    viewer.appendChild(renderer.domElement);

    dimensionviewer.appendChild(css2DRenderer.domElement);
    dimensionviewer.appendChild(dimensionRenderer.domElement);
    // dimensionCanvas = document.querySelector('#dimensionviewer :nth-child(2)')

    post_process();

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = true;

    controls.minDistance = 8;
    controls.maxDistance = 9;
    controls.panSpeed = 0;

    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.target.set(0, 0.5, 0);


    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;
    window.addEventListener('resize', onWindowResize, true);
    // document.addEventListener('pointermove', onPointerMove);
    // document.addEventListener('click', onClick);

    controls.saveState();


    createBedTop();
    createBedLegs();
    bedFloor = createBox("bedFloor");
}

function onWindowResize() {
    const canvas = renderer.domElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {

        camera.aspect = fwidth / fheight;
        camera.updateProjectionMatrix();
        css2DRenderer.setSize(fwidth, fheight);
        // renderer.setSize(fwidth, fheight);
        composer.setSize(fwidth, fheight);

        dimensionRenderer.setSize(fwidth, fheight);
        orthoCamera.updateProjectionMatrix();

    }
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
    render();

}

function animate() {
    requestAnimationFrame(animate);

    controls.update();


    render();

}

function render() {

    updateBedTop()
    updateBedLegs();
    updateBedFloor();
    delta = clock.getDelta();


    dimensionRenderer.render(dimensionScene, orthoCamera);
    css2DRenderer.render(dimensionScene, orthoCamera);

    composer.render();


}


function create_lights() {


    directionalLight = new THREE.DirectionalLight(0xfff3db, 0.5);
    directionalLight.position.set(0.5, 1.5, 10);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default

    scene.add(directionalLight);




    var directionalLight1 = new THREE.DirectionalLight(0xbfe4ff, 0.3);
    directionalLight1.position.set(0, 5, 0);

    directionalLight1.castShadow = true;

    directionalLight1.shadow.mapSize.width = 512; // default
    directionalLight1.shadow.mapSize.height = 512;
    scene.add(directionalLight1);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);


    var directionalLight2 = new THREE.DirectionalLight(0xdedede, 0.3);
    directionalLight2.position.set(0, 3, -3);
    directionalLight2.castShadow = false;

    directionalLight2.shadow.mapSize.width = 512; // default
    directionalLight2.shadow.mapSize.height = 512;
    scene.add(directionalLight2);

    var hemiLight = new THREE.HemisphereLight(0xfff2e3, 0xd1ebff, 0.3);
    scene.add(hemiLight);

}

function createFloor() {
    var g = new THREE.PlaneGeometry(100, 100);
    var m = new THREE.MeshStandardMaterial({
        color: 0xc5c5c3
    });

    floor = new THREE.Mesh(g, m);
    floor.name = "floor";
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;

    floor.rotateX(-90 * THREE.Math.DEG2RAD);
    scene.add(floor)

}

function createWall() {
    var g = new THREE.PlaneGeometry(100, 100);
    var m = new THREE.MeshStandardMaterial({
        color: 0xc5c5c3
    });

    wall = new THREE.Mesh(g, m);
    wall.name = "wall";
    wall.position.set(0, 0, 0);
    wall.receiveShadow = true;
    wall.rotateX(0 * THREE.Math.DEG2RAD);
    scene.add(wall)


    wallLeft = new THREE.Mesh(g, m);
    wallLeft.name = "wallleft";

    wallLeft.receiveShadow = true;
    wallLeft.rotateY(-90 * THREE.Math.DEG2RAD);
    scene.add(wallLeft)

    wallRight = new THREE.Mesh(g, m);
    wallRight.name = "wallleft";

    wallRight.receiveShadow = true;
    wallRight.rotateY(90 * THREE.Math.DEG2RAD);
    scene.add(wallRight);
    wallLeft.position.set(0, 0, 0);
    wallRight.position.set(0, 0, 0);
}

function updateWall() {
    if (wBack && wall) {
        floor.position.setY(wLeft.position.y - wLeft.scale.y / 2);
        wallLeft.position.setX(8);
        wallRight.position.setX(-8)
        wall.position.setZ(wBack.position.z - thickness / 12 * ftTom)

    }
}


function post_process() {
    composer = new THREE.EffectComposer(renderer);

    const renderPass = new THREE.RenderPass(scene, camera);
    renderPass.clearColor = new THREE.Color(0, 0, 0);
    renderPass.clearAlpha = 0;
    composer.addPass(renderPass);
    const pixelRatio = renderer.getPixelRatio();

    // const smaaPass = new THREE.SMAAPass(fwidth * pixelRatio, fheight * pixelRatio);
    // composer.addPass(smaaPass);
    const ssaaPass = new THREE.SSAARenderPass(scene, camera);
    // composer.addPass(ssaaPass);
    const copyPass = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(copyPass);




    ssaoPass = new THREE.SSAOPass(scene, camera, fwidth, fheight);
    ssaoPass.kernalRadius = 16;
    ssaoPass.minDistance = 0.005;
    ssaoPass.maxDistance = 0.1;

    // composer.addPass(ssaoPass);

    outlinePass = new THREE.OutlinePass(new THREE.Vector2(fwidth, fheight), scene, camera);
    outlinePass.edgeStrength = 16;
    outlinePass.edgeGlow = 0;
    outlinePass.edgeThickness = 0.5;
    outlinePass.pulsePeriod = 0;

    planeOultinePass = new THREE.OutlinePass(new THREE.Vector2(fwidth, fheight), scene, camera);
    planeOultinePass.edgeStrength = 16;
    planeOultinePass.edgeGlow = 0;
    planeOultinePass.edgeThickness = 0.5;
    planeOultinePass.pulsePeriod = 0;


    doorOutlinePass = new THREE.OutlinePass(new THREE.Vector2(fwidth, fheight), scene, camera);
    doorOutlinePass.edgeStrength = 16;
    doorOutlinePass.edgeGlow = 0;
    doorOutlinePass.edgeThickness = 0.5;
    doorOutlinePass.pulsePeriod = 0;
    // outlinePass.visibleEdgeColor.set("#ff0000");

    // outlinePass.hiddenEdgeColor.set("#ff0000");
    composer.addPass(outlinePass);
    composer.addPass(planeOultinePass);
    composer.addPass(doorOutlinePass);
    fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);


    fxaaPass.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);

    composer.addPass(fxaaPass);



}

function helpers() {
    // const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    // gridHelper.position.y = 0;
    // gridHelper.position.x = 0;

    // scene.add(gridHelper);

    // const axesHelper = new THREE.AxesHelper(1);
    // scene.add(axesHelper);




}

function createBox(name) {
    var g = new THREE.BoxBufferGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xdedede,
        name: "m_" + name,
        transparent: true,
        opacity: 1
    });
    var mesh = new THREE.Mesh(g, m);
    mesh.name = "b_" + name;
    mesh.castShadow = true;
    mesh.receiveShadow =true;
    scene.add(mesh);
    return mesh;
}



function updateBedTop() {

    var fromFloor = wHeight * ftTom - 6*ftTom/24 ;
    var width = wWidth * ftTom;
    var height = ftTom * 6 / 12;
    var depth = wDepth * ftTom;


    bedTops[0].scale.set(width + ftTom/12, height, ftTom / 12); //0 Back
    bedTops[1].scale.set(width + ftTom/12, height, ftTom / 12); //1 Front
    bedTops[2].scale.set(ftTom / 12, height, depth -  ftTom/12); //2 Left
    bedTops[3].scale.set(ftTom / 12, height, depth  -  ftTom/12); //3 Right

    bedTops[0].position.setZ(-depth/2);
    bedTops[1].position.setZ(depth/2);
    bedTops[2].position.setX(-width/2);
    bedTops[3].position.setX(width/2);

    bedTops.forEach(e => {
        e.position.setY(fromFloor);
    });
}


function updateBedLegs() {

    var fromFloor = wHeight * ftTom/2;
    var width = ftTom/12;
    var height = wHeight *ftTom ;
    var depth = 4* ftTom/12;
    bedLegs.forEach(e => {
        e.position.setY(fromFloor);
        e.scale.set(width , height,depth); 
        
    });

   //0 Back Left
   //1 Back Right
   //2 Front Left
   //3 Front Right

    bedLegs[0].position.setX(-bedTops[0].scale.x/2);
    bedLegs[0].position.setZ(-bedTops[2].scale.z/2+bedLegs[0].scale.z/2.5-bedTops[0].scale.z);
    bedLegs[1].position.setX(bedTops[0].scale.x/2);
    bedLegs[1].position.setZ(-bedTops[2].scale.z/2+bedLegs[1].scale.z/2.5-bedTops[0].scale.z);

    bedLegs[2].position.setX(-bedTops[1].scale.x/2);
    bedLegs[2].position.setZ(bedTops[2].scale.z/2-bedLegs[2].scale.z/2.5+bedTops[0].scale.z);
    bedLegs[3].position.setX(bedTops[1].scale.x/2);
    bedLegs[3].position.setZ(bedTops[2].scale.z/2-bedLegs[3].scale.z/2.5+bedTops[0].scale.z);
    
}
function createBedTop() {
    for (var i = 0; i < 4; i++) {

        bedTops.push(createBox("bedTop_" + i));

    }
}

function createBedLegs(){
    for (var i = 0; i < 4; i++) {

        bedLegs.push(createBox("bedLegs_" + i));

    }
}


function updateBedFloor(){
    var fromFloor = wHeight * ftTom -1.5*ftTom/12;
    bedFloor.position.setY(fromFloor);
    bedFloor.scale.set(wWidth * ftTom - ftTom/12,ftTom/12,wDepth*ftTom-ftTom/12)
}
//Export
{
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    function save(blob, filename) {

        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        sendFileToBackend(blob, filename);



    }

    function sendFileToBackend(blob, filename) {
        const endpoint = "./";
        const formData = new FormData();

        let sceneFile = new File([blob], "wardrobe.gltf");
        console.log(sceneFile)
        formData.append("file", sceneFile);

        const options = {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
        }

        fetch(endpoint, options)
            .then(response => console.log(JSON.stringify(response)))
            .catch(error => console.error('Error:', error))

    }

    function saveString(text, filename) {

        save(new Blob([text], {
            type: 'text/plain'
        }), filename);

    }


    function saveArrayBuffer(buffer, filename) {

        save(new Blob([buffer], {
            type: 'application/octet-stream'
        }), filename);

    }

    function Export() {


        // Parse the input and generate the glTF output
        exporter.parse(
            scene,
            // called when the gltf has been generated
            function (gltf) {

                if (gltf instanceof ArrayBuffer) {

                    saveArrayBuffer(gltf, 'bed.glb');

                } else {

                    const output = JSON.stringify(gltf, null, 2);
                    // console.log(output);
                    saveString(output, 'bed.gltf');

                    floor.visible = true;

                }

            },
            // called when there is an error in the generation
            function (error) {

                console.log('An error happened');

            },

        );
    }


}
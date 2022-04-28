
let scene, camera, orthoCameraTop,orthoCameraLeft, dimensionScene, dimensionRenderer, renderer, directionalLight, ambientLight, controls;
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
var isMeasured = false;

let top_shelves = [],
    bot_shelves = [];

let left = 0;
const bottom = 0;
var clock;
var delta = 0;

var texLoader = new THREE.TextureLoader();

var pmremGenerator;

let ssaoPass;

var thicknessInmeter = 0.022225;

let wall, wallRight, wallLeft, floor;



var totalPrice = 0;


var bedTops = [],
    bedLegs = [],
    bedFloor, bedDrawers = [];
var bedDrawerLeft = new THREE.Group();
var bedDrawerRight = new THREE.Group();
var bedTableLeft = new THREE.Group();
var bedTableRight = new THREE.Group();

var bedDrawerLeft = new THREE.Group();
var bedDrawerRight = new THREE.Group();
var bedTableLeft = new THREE.Group();
var bedTableRight = new THREE.Group();

var bedDrawerLeftEdge = new THREE.Group();
var bedDrawerRightEdge = new THREE.Group();
var bedTableLeftEdge = new THREE.Group();
var bedTableRightEdge = new THREE.Group();

var font;
const gltfLoader = new THREE.GLTFLoader();
var bedMatress, pillowL, pillowR;
var drawerLeft, isDrawerHandleCreated = false;

var bedTopsEdges = [],bedLegsEdges=[], bedDrawersEdges = [];
var whArrowL,whArrowR;

init();

animate();

dimensionviewer.hidden = true;

function getInputs() {
    $("#depth").on("input", function () {
        wDepth = $("#depth").val();
        isDrawerHandleCreated = true;
    })


    $("input:radio[name='heightOptions']").click(function () {


        wHeight = $(this).val();
        isDrawerHandleCreated = true;
    });


    $("input:radio[name='widthOptions']").click(function () {
       
        wWidth = $(this).val();
        isDrawerHandleCreated = true;
    });

    $("#export").click(function () {
        Export();
    })

    $("#addDrawers").click(function () {


        if (!bedDrawerLeft.visible) {
            if(bedDrawerLeft.children[7])bedDrawerLeft.remove(bedDrawerLeft.children[7]);
            $(this).html("Remove Drawers");
            $(this).addClass("btn-outline-danger");
            $(this).removeClass("btn-outline-dark");
            
            bedDrawerLeft.visible = true;
        
            isDrawerHandleCreated = true;
    

        
    

           

        } else {
            $(this).html("Add Drawers");
            $(this).addClass("btn-outline-dark");
            $(this).removeClass("btn-outline-danger");
           
            bedDrawerLeft.visible = false;
            bedDrawerRight.visible = false;
  
        }

    })

    // $("#addMatress").click(function(){

    //     if(!bedMatress.visible && !pillowL.visible){
    //         $(this).html("Remove Matress & Pillow");
    //         $(this).addClass("btn-outline-danger");
    //         $(this).removeClass("btn-outline-dark");

    //         pillowL.visible = true;

    //         bedMatress.visible = true;
    //     }else{

    //         $(this).html("Add Matress & Pillow");
    //         $(this).addClass("btn-outline-dark");
    //         $(this).removeClass("btn-outline-danger");
    //         pillowL.visible = false;
    //         pillowR.visible = false;
    //         bedMatress.visible = false;
    //     }


    // })

    $("#addSideTableLeft").click(function () {



        if (!bedTableLeft.visible) {
            $(this).html("Remove Table Left");
            $(this).addClass("btn-outline-danger");
            $(this).removeClass("btn-outline-dark");
            bedTableLeft.visible = true;
        } else {
            $(this).html("Add Table Left");
            $(this).addClass("btn-outline-dark");
            $(this).removeClass("btn-outline-danger");
            bedTableLeft.visible = false;
        }

    })

    $("#addSideTableRight").click(function () {
        if (!bedTableRight.visible) {
            $(this).html("Remove Table Right");
            $(this).addClass("btn-outline-danger");
            $(this).removeClass("btn-outline-dark");
            bedTableRight.visible = true;
        } else {
            $(this).html("Add Table Right");
            $(this).addClass("btn-outline-dark");
            $(this).removeClass("btn-outline-danger");
            bedTableRight.visible = false;
        }

    })

}

function init() {


    scene = new THREE.Scene();
    dimensionScene = new THREE.Scene();


    window.scene = scene;
    THREE.Cache.enabled = true;

    font = new THREE.FontLoader().load('./assets/fonts/helvetiker_regular.typeface.json');
    camera = new THREE.PerspectiveCamera(25, fwidth / fheight, 0.01, 100);

    camera.position.set(0, 5, 15);
    camera.aspect = fwidth / fheight;
    camera.layers.enable(0);
    camera.layers.enable(1);
    camera.layers.enable(2);

    orthoCameraTop = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);
    
    // orthoCameraTop.rotation.z = 180*THREE.Math.DEG2RAD;
    orthoCameraTop.rotation.x = -90*THREE.Math.DEG2RAD;
    orthoCameraTop.position.y = 2;
   
   
    orthoCameraLeft = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);
    orthoCameraLeft.position.x = -1;
    orthoCameraLeft.rotation.y = -90*THREE.Math.DEG2RAD;

    // orthoCameraTop.zoom = 250;
    orthoCameraTop.updateProjectionMatrix();
    dimensionScene.add(orthoCameraTop);
    dimensionScene.add(orthoCameraLeft);
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
    dimensionRenderer.compile(dimensionScene, orthoCameraTop)




    css2DRenderer = new THREE.CSS2DRenderer({

    });
    css2DRenderer.setSize(fwidth, Math.floor(fheight/2)+100);
    css2DRenderer.domElement.style.position = 'fixed';
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css2DRenderer.domElement.style.color = '#000000';
    css2DRenderer.domElement.style.top = '-100px';
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

    createDrawers();
     createBedLegs();
    bedFloor = createBox("bedFloor");
    createMatress();
    createPillow();
    createWall();
    createBedSideTable();
    getInputs();

}

function onWindowResize() {
    const canvas = renderer.domElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {

        camera.aspect = fwidth / fheight;
        camera.updateProjectionMatrix();
       
        // renderer.setSize(fwidth, fheight);
        composer.setSize(fwidth, fheight);

        dimensionRenderer.setSize(fwidth, fheight);
        css2DRenderer.setSize(fwidth, fheight);
        orthoCameraTop.updateProjectionMatrix();
        orthoCameraLeft.updateProjectionMatrix();
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

    updateBedTop();
    createHorizontalArrow();
    updateBedLegs();
    updateBedFloor();
    updateDrawers();
    updateBedSideTable();
    if (bedMatress) {
        updateMatress();
    }

    if (pillowL) {
        updatePillow();
    }
    updateWall();
    delta = clock.getDelta();

    
    dimensionRenderer.setViewport(left,Math.floor(fheight/2)-100,fwidth,Math.floor(fheight/2));
    dimensionRenderer.setScissor(left, Math.floor(fheight/2)-100, fwidth,Math.floor(fheight/2));
    dimensionRenderer.setScissorTest(true);
    css2DRenderer.setSize(dimensionRenderer.domElement.width, Math.floor (dimensionRenderer.domElement.height/2));
    
    orthoCameraTop.left=fwidth / -2;
    orthoCameraTop.right = fwidth/2;
    orthoCameraTop.top = fheight /4 ;
    orthoCameraTop.bottom = fheight/ -4;
    orthoCameraTop.zoom = 200;
    
    orthoCameraTop.updateProjectionMatrix();

    dimensionRenderer.render(dimensionScene, orthoCameraTop);
    css2DRenderer.render(dimensionScene, orthoCameraTop);

    // css2DRenderer.setSize(fwidth, dimensionRenderer.domElement.height/2+100);
    dimensionRenderer.setViewport(left,-100,fwidth,Math.floor(fheight/2));
    dimensionRenderer.setScissor(left, -100, fwidth,Math.floor(fheight/2));
    dimensionRenderer.setScissorTest(true);
    
    
      
    orthoCameraLeft.left=fwidth / -2;
    orthoCameraLeft.right = fwidth/2;
    orthoCameraLeft.top = fheight /4 ;
    orthoCameraLeft.bottom = fheight/ -4;
    orthoCameraLeft.zoom = 200;
    orthoCameraLeft.updateProjectionMatrix();
    dimensionRenderer.render(dimensionScene, orthoCameraLeft);
  
    

    if (isMeasured) {
        viewer.hidden = true;
        dimensionviewer.hidden = false;
        $(".downloadDimension").show();
        
        $("input:radio[name='renderOptions']").prop("disabled", true);

    } else {
        viewer.hidden = false;
        dimensionviewer.hidden = true;
        $(".downloadDimension").hide();
        $("input:radio[name='renderOptions']").prop("disabled", false);

    }

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
    if (bedTops.length > 0 && wall) {

        wallLeft.position.setX(8);
        wallRight.position.setX(-8)
        wall.position.setZ(bedTops[0].position.z - bedTops[0].scale.z / 2)

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


    });
    var mesh = new THREE.Mesh(g, m);
    mesh.name = "b_" + name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
}



function updateBedTop() {

    var fromFloor = wHeight * ftTom - 6 * ftTom / 24;
    var width = wWidth * ftTom;
    var height = ftTom * 6 / 12;
    var depth = wDepth * ftTom;


    bedTops[0].scale.set(width + ftTom / 12, height, ftTom / 12); //0 Back
    bedTops[1].scale.set(width + ftTom / 12, height, ftTom / 12); //1 Front
    bedTops[2].scale.set(ftTom / 12, height, depth - ftTom / 12); //2 Left
    bedTops[3].scale.set(ftTom / 12, height, depth - ftTom / 12); //3 Right

    bedTops[0].position.setZ(-depth / 2);
    bedTops[1].position.setZ(depth / 2);
    bedTops[2].position.setX(-width / 2);
    bedTops[3].position.setX(width / 2);

    bedTops.forEach(e => {
        e.position.setY(fromFloor);
    });

    // if(bedDrawerLeft.visible){
    bedTops[0].scale.setY(wHeight * ftTom);
    bedTops[0].position.setY(bedTops[0].scale.y / 2);
    bedTops[1].scale.setY(wHeight * ftTom);
    bedTops[1].position.setY(bedTops[1].scale.y / 2);

    for(var i = 0 ; i<bedLegsEdges.length;i++){
        bedLegsEdges[i].position.copy(bedLegs[i].position);
        bedLegsEdges[i].scale.copy(bedLegs[i].scale);
        bedLegsEdges[i].visible = bedLegs[i].visible;
    }
    // }
    // else{

    //     bedTops[0].scale.setY(height);
    //     bedTops[0].position.setY(fromFloor);

    //     bedTops[1].scale.setY(height);
    //     bedTops[1].position.setY(fromFloor);
    // }
    
    for(var i = 0; i<bedTopsEdges.length;i++){
        bedTopsEdges[i].position.copy(bedTops[i].position);
        bedTopsEdges[i].scale.copy(bedTops[i].scale);
    }
}

function updateBedLegs() {
    
    var fromFloor = wHeight * ftTom / 2-3*ftTom/12;
    var depth = ftTom ;
    var height = wHeight * ftTom-6*ftTom/12;
    var width = ftTom/12;
    bedLegs.forEach(e => {
        e.position.setY(fromFloor);
        e.scale.set(width, height, depth);
        e.visible = bedDrawerLeft.visible;
    });

    //0 Back Left
    //1 Back Right
    //2 Front Left
    //3 Front Right

    bedLegs[0].position.setX( bedTops[2].position.x );
    bedLegs[0].position.setZ( bedTops[0].position.z+bedTops[0].scale.z/2+ bedLegs[0].scale.z/2);
    bedLegs[1].position.setX( bedTops[3].position.x );
    bedLegs[1].position.setZ( bedTops[0].position.z+bedTops[0].scale.z/2+ bedLegs[1].scale.z/2);

    
    // bedLegs[0].position.setZ(bedTops[0].position.z - bedLegs[0].scale.z);
    // bedLegs[1].position.setX(bedTops[0].scale.x / 2 - bedLegs[1].scale.x / 2);
    // bedLegs[1].position.setZ(bedTops[0].position.z - bedLegs[1].scale.z);

    // bedLegs[2].position.setX(-bedTops[1].scale.x / 2 + bedLegs[2].scale.x / 2);
    // bedLegs[2].position.setZ(bedTops[1].position.z + bedLegs[2].scale.z);
    // bedLegs[3].position.setX(bedTops[1].scale.x / 2 - bedLegs[3].scale.x / 2);
    // bedLegs[3].position.setZ(bedTops[1].position.z + bedLegs[3].scale.z);

    // if(bedDrawerLeft.visible && bedDrawerLeft.children.length>0){
    //     bedLegs[0].visible = false;
    //     bedLegs[1].visible = false;
    // }else{
    //     bedLegs[0].visible = true;
    //     bedLegs[1].visible = true;
    // }
}

function createBedTop() {
    for (var i = 0; i < 4; i++) {

        bedTops.push(createBox("bedTop_" + i));
        bedTopsEdges.push(createEdges(bedTops[i]));
    }
}

function createBedLegs() {
    for (var i = 0; i < 2; i++) {

        bedLegs.push(createBox("bedLegs_" + i));
        bedLegsEdges.push(createEdges(bedLegs[i]));
    }


}



function updateBedFloor() {
    var fromFloor = wHeight * ftTom - 1.5 * ftTom / 12;
    bedFloor.position.setY(fromFloor);
    bedFloor.scale.set(wWidth * ftTom - ftTom / 12, 0.5 * ftTom / 12, wDepth * ftTom - ftTom / 12)
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
        // sendFileToBackend(blob, filename);



    }

    function sendFileToBackend(blob, filename) {
        const endpoint = "./";
        const formData = new FormData();

        let sceneFile = new File([blob], "bed.gltf");
        
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

        floor.visible = false;
        wall.visible = false;
        wallLeft.visible = false;
        wallRight.visible = false;
        // Parse the input and generate the glTF output
        exporter.parse(
            scene,
            // called when the gltf has been generated
            function (gltf) {

                if (gltf instanceof ArrayBuffer) {

                    saveArrayBuffer(gltf, 'bed.glb');

                } else {

                    const output = JSON.stringify(gltf, null, 2);
                    console.log(output);                   
                    saveString(output, 'bed.gltf');

                    floor.visible = true;
                    wall.visible = true;
                    wallLeft.visible = true;
                    wallRight.visible = true;

                }

            },
            // called when there is an error in the generation
            function (error) {

                console.log('An error happened');

            },

        );
    }


}

function createMatress() {
    importMatress();

}

function setMatress(matress) {
    matress.scale.set(wWidth * ftTom, 4 * ftTom / 12, wDepth * ftTom);
    matress.position.setY(bedFloor.position.y + bedFloor.scale.y / 2)

    var mat = matress.children[0].children[0];


    var texAO = texLoader.load('./models/matress/ao.png');


    mat.castShadow = true;
    mat.receiveShadow = true;
    mat.material.color.set("#ffffff");
    // mat.material = new THREE.MeshStandardMaterial({color:0xf0f0f0,metalness:0, map:matAlbedo, normalMap:matNormal, aoMap:matAO, flatShading:"false", bum});
    mat.material.metalness = 0;

    // mat.material.bumpMap = matNormal;

    this.bedMatress = matress;
    bedMatress.visible = true;

}

function updateMatress() {

    bedMatress.scale.set(wWidth * ftTom, 4 * ftTom / 12, wDepth * ftTom);
    bedMatress.position.setY(bedFloor.position.y + bedFloor.scale.y / 2)
}

function importMatress() {

    gltfLoader.load(
        './models/matress/matress.gltf',
        function (gltf) {
            scene.add(gltf.scene)
            setMatress(gltf.scene);
        }
    )


}

function createPillow() {
    importPilow();
}

function setPillow(pillow) {
    var texNormal = texLoader.load("./models/pillow/p_normal.png");
    var texAO = texLoader.load("./models/pillow/p_ao.png");
    var texRoughness = texLoader.load("./models/pillow/p_roughness.png");

  
    pillow.children[0].material = new THREE.MeshStandardMaterial({color:0xbebebe, normalMap:texNormal,normalScale:new THREE.Vector2(2,2), aoMap: texAO, aoMapIntensity:2,roughness:2, roughnessMap:texRoughness});
    pillow.children[0].material.needsUpdate = true;

    pillow.children[0].castShadow = true;
    pillow.children[0].receiveShadow = true;

    pillowL = pillow;
    pillowL.visible = true;


    pillowR = pillow.clone();

    scene.add(pillowR);

}

function updatePillow() {
    if (bedMatress.visible) {
     
        
        pillowL.scale.set(1.8, 1.8, 1.8)
        pillowR.scale.copy(pillowL.scale)

        if (wWidth > 3) {
            pillowR.visible = true;

            pillowL.position.setX(-bedMatress.scale.x / 4);
            pillowR.position.setX(bedMatress.scale.x / 4);
        } else {


            pillowR.visible = false;

            pillowR.position.setX(0);
            pillowL.position.setX(0);
        }

        pillowL.position.setZ(bedMatress.position.z - bedMatress.scale.z / 2 + 0.25)
        pillowL.position.setY(bedMatress.position.y + bedMatress.scale.y + pillowL.scale.y * ftTom / 12);

        pillowR.position.setZ(bedMatress.position.z - bedMatress.scale.z / 2 + 0.25)
        pillowR.position.setY(bedMatress.position.y + bedMatress.scale.y + pillowL.scale.y * ftTom / 12);
    }

}

function importPilow() {

    gltfLoader.load(
        './models/pillow/pillow_lp.gltf',
        function (gltf) {
            scene.add(gltf.scene)
           
            setPillow(gltf.scene);

        }
    )
}
function setSmoothGeometry(obj) {
    obj.traverse(node => {
        if (node instanceof THREE.Mesh) {
         

           
        }
    })
}

function createBedSideTable() {
    bedTableLeft.name = "BedSideTableLeft";
    bedTableRight.name = "BedSideTableRight";
    for (var i = 0; i < 5; i++) {
        bedTableLeft.add(createBox("bedTableLeftpart_" + i));

        bedTableRight.add(createBox("bedTableRightpart_" + i));

    }
    scene.add(bedTableLeft);
    scene.add(bedTableRight);

    bedTableLeft.visible = false;
    bedTableRight.visible = false;
}

function updateBedSideTable() {
    var fromFloor = wHeight * ftTom / 2;

    bedTableLeft.children.forEach(e => {
        e.position.setY(fromFloor);
    })

    bedTableLeft.children[0].scale.set(1.5 * ftTom, wHeight * ftTom - ftTom / 12, ftTom / 12); //back

    bedTableLeft.children[1].scale.set(ftTom / 12, wHeight * ftTom - ftTom / 12, ftTom - bedTableLeft.children[0].scale.z); //left
    bedTableLeft.children[2].scale.set(ftTom / 12, wHeight * ftTom - ftTom / 12, ftTom - bedTableLeft.children[0].scale.z); // right: 
    bedTableLeft.children[3].scale.set(1.5 * ftTom - ftTom / 6, ftTom / 12, ftTom - bedTableLeft.children[0].scale.z); //bottom
    bedTableLeft.children[4].scale.set(1.5 * ftTom, ftTom / 12, ftTom); //top

    // bedTableLeft.children[0].position.setZ(bedTops[0].position.z);
    bedTableLeft.children[0].position.setY(bedTableLeft.children[0].scale.y / 2);

    bedTableLeft.children[1].position.setX(-bedTableLeft.children[0].scale.x / 2 + bedTableLeft.children[1].scale.x / 2);
    bedTableLeft.children[1].position.setY(bedTableLeft.children[1].scale.y / 2);
    bedTableLeft.children[1].position.setZ(bedTableLeft.children[0].position.z + bedTableLeft.children[1].scale.z / 2 + bedTableLeft.children[0].scale.z / 2);

    bedTableLeft.children[2].position.setY(bedTableLeft.children[2].scale.y / 2);
    bedTableLeft.children[2].position.setX(bedTableLeft.children[0].scale.x / 2 - bedTableLeft.children[1].scale.x / 2);
    bedTableLeft.children[2].position.setZ(bedTableLeft.children[0].position.z + bedTableLeft.children[2].scale.z / 2 + bedTableLeft.children[0].scale.z / 2);

    bedTableLeft.children[3].position.setY(bedTableLeft.children[3].scale.y / 2);
    bedTableLeft.children[3].position.setZ(bedTableLeft.children[0].position.z + bedTableLeft.children[3].scale.z / 2 + bedTableLeft.children[0].scale.z / 2)

    bedTableLeft.children[4].position.setY(bedTableLeft.children[0].scale.y + bedTableLeft.children[4].scale.y / 2);
    bedTableLeft.children[4].position.setZ(bedTableLeft.children[0].position.z + bedTableLeft.children[4].scale.z / 2 - bedTableLeft.children[0].scale.z / 2)


    bedTableRight.children.forEach(e => {
        e.position.setY(fromFloor);
    })

    bedTableRight.children[0].scale.set(1.5 * ftTom, wHeight * ftTom - ftTom / 12, ftTom / 12); //back

    bedTableRight.children[1].scale.set(ftTom / 12, wHeight * ftTom - ftTom / 12, ftTom - bedTableRight.children[0].scale.z); //left
    bedTableRight.children[2].scale.set(ftTom / 12, wHeight * ftTom - ftTom / 12, ftTom - bedTableRight.children[0].scale.z); // right: 
    bedTableRight.children[3].scale.set(1.5 * ftTom - ftTom / 6, ftTom / 12, ftTom - bedTableRight.children[0].scale.z); //bottom
    bedTableRight.children[4].scale.set(1.5 * ftTom, ftTom / 12, ftTom); //top

    // bedTableRight.children[0].position.setZ(bedTops[0].position.z);
    bedTableRight.children[0].position.setY(bedTableRight.children[0].scale.y / 2);

    bedTableRight.children[1].position.setX(-bedTableRight.children[0].scale.x / 2 + bedTableRight.children[1].scale.x / 2);
    bedTableRight.children[1].position.setY(bedTableRight.children[1].scale.y / 2);
    bedTableRight.children[1].position.setZ(bedTableRight.children[0].position.z + bedTableRight.children[1].scale.z / 2 + bedTableRight.children[0].scale.z / 2);

    bedTableRight.children[2].position.setY(bedTableRight.children[2].scale.y / 2);
    bedTableRight.children[2].position.setX(bedTableRight.children[0].scale.x / 2 - bedTableRight.children[1].scale.x / 2);
    bedTableRight.children[2].position.setZ(bedTableRight.children[0].position.z + bedTableRight.children[2].scale.z / 2 + bedTableRight.children[0].scale.z / 2);

    bedTableRight.children[3].position.setY(bedTableRight.children[3].scale.y / 2);
    bedTableRight.children[3].position.setZ(bedTableRight.children[0].position.z + bedTableRight.children[3].scale.z / 2 + bedTableRight.children[0].scale.z / 2)

    bedTableRight.children[4].position.setY(bedTableRight.children[0].scale.y + bedTableRight.children[4].scale.y / 2);
    bedTableRight.children[4].position.setZ(bedTableRight.children[0].position.z + bedTableRight.children[4].scale.z / 2 - bedTableRight.children[0].scale.z / 2)

    bedTableRight.position.set(bedTops[0].position.x +bedTops[0].scale.x/2 + bedTableRight.children[3].scale.x / 2 + bedTableRight.children[1].scale.x, 0, bedTops[0].position.z )
    bedTableLeft.position.set(bedTops[0].position.x -bedTops[0].scale.x/2 - bedTableLeft.children[3].scale.x / 2 - bedTableLeft.children[2].scale.x, 0,bedTops[0].position.z)
}

function createDrawers() {
    bedDrawerLeft.name = "DrawerLeft";
    bedDrawerRight.name = "DrawerRight";

    
    for (var i = 0; i < 5; i++) {

        bedDrawerLeft.add(createBox("drawerLeft_parts" + i));
       
        bedDrawerRight.add(createBox("drawerRight_parts" + i));

        
    }
    
    for(var i = 0;i<bedDrawerLeft.children.length;i++){
        bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[i]));
        bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[i]));
    }
    
    for (var i = 0; i < 2; i++) {

        bedDrawerLeft.add(new THREE.Mesh( new THREE.CylinderGeometry(2 * ftTom / 12, 2 * ftTom / 12, 4 * ftTom / 12, 24, 1), bedDrawerLeft.children[0].material));
        bedDrawerRight.add(new THREE.Mesh( new THREE.CylinderGeometry(2 * ftTom / 12, 2 * ftTom / 12, 4 * ftTom / 12, 24, 1), bedDrawerRight.children[0].material));

        
    }
  
    bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[5].clone()))
    bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[6].clone()))

    bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[5].clone()))
    bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[6].clone()))

    dimensionScene.add(bedDrawerLeftEdge);
    dimensionScene.add(bedDrawerRightEdge);

    scene.add(bedDrawerLeft);
    scene.add(bedDrawerRight);

    bedDrawerLeft.visible = false;
    bedDrawerRight.visible = false;
    bedDrawerLeftEdge.visible = false;
    bedDrawerRightEdge.visible = false;


    // var a=  ThreeCSG.fromMesh(bedDrawerLeft.children[1]);


}

function updateDrawers() {

    var height = wHeight * ftTom - bedTops[2].scale.y;

    if (bedDrawerLeft.children.length > 0) {

        bedDrawerLeft.children.forEach(e => {
            e.material.color.set("#d0d0d0")

        });
        bedDrawerRight.children.forEach(e => {
            e.material.color.set("#d5d5d5")
        });
        bedDrawerLeft.position.setY(wHeight * ftTom / 2 - bedTops[2].scale.y / 2);

        bedDrawerRight.position.setY(wHeight * ftTom / 2 - bedTops[2].scale.y / 2);


        bedDrawerLeft.children[0].scale.set(wWidth * ftTom , ftTom / 12, wDepth * ftTom - bedTops[1].scale.z - ftTom - ftTom / 6); // bottom
        bedDrawerLeft.children[1].scale.set(ftTom / 12, height, bedDrawerLeft.children[0].scale.z + ftTom / 6); // left
        bedDrawerLeft.children[2].scale.set(ftTom / 12, height, bedDrawerLeft.children[1].scale.z); // right
        bedDrawerLeft.children[3].scale.set( bedDrawerLeft.children[0].scale.x, height, ftTom / 12); // front
        bedDrawerLeft.children[4].scale.set( bedDrawerLeft.children[3].scale.x, height, ftTom / 12); // back

        bedDrawerLeft.children[5].position.setX(bedDrawerLeft.children[1].position.x)
        bedDrawerLeft.children[5].position.setZ(bedDrawerLeft.children[1].position.z - bedDrawerLeft.children[1].scale.z / 4)
        bedDrawerLeft.children[5].position.setY(bedDrawerLeft.children[1].position.y + bedDrawerLeft.children[1].scale.y / 2)
        bedDrawerLeft.children[5].rotation.z = (90 * THREE.Math.DEG2RAD)


        bedDrawerLeft.children[6].position.setX(bedDrawerLeft.children[1].position.x)
        bedDrawerLeft.children[6].position.setZ(bedDrawerLeft.children[1].position.z + bedDrawerLeft.children[1].scale.z / 4)
        bedDrawerLeft.children[6].position.setY(bedDrawerLeft.children[1].position.y + bedDrawerLeft.children[1].scale.y / 2)
        bedDrawerLeft.children[6].rotation.z = (90 * THREE.Math.DEG2RAD)

        bedDrawerRight.children[0].scale.set(wWidth * ftTom - ftTom / 12, ftTom / 12, wDepth * ftTom - bedTops[1].scale.z - ftTom - ftTom / 6); // bottom
        bedDrawerRight.children[1].scale.set(ftTom / 12, height, bedDrawerRight.children[0].scale.z + ftTom / 6); // left
        bedDrawerRight.children[2].scale.set(ftTom / 12, height, bedDrawerRight.children[1].scale.z); // right
        bedDrawerRight.children[3].scale.set( bedDrawerRight.children[0].scale.x, height, ftTom / 12); // front
        bedDrawerRight.children[4].scale.set( bedDrawerRight.children[0].scale.x, height, ftTom / 12); // back


        bedDrawerRight.children[5].position.setX(bedDrawerLeft.children[2].position.x)
        bedDrawerRight.children[5].position.setZ(bedDrawerLeft.children[2].position.z - bedDrawerLeft.children[2].scale.z / 4)
        bedDrawerRight.children[5].position.setY(bedDrawerLeft.children[2].position.y + bedDrawerLeft.children[2].scale.y / 2)
        bedDrawerRight.children[5].rotation.z = (90 * THREE.Math.DEG2RAD)


        bedDrawerRight.children[6].position.setX(bedDrawerLeft.children[2].position.x)
        bedDrawerRight.children[6].position.setZ(bedDrawerLeft.children[2].position.z + bedDrawerLeft.children[2].scale.z / 4)
        bedDrawerRight.children[6].position.setY(bedDrawerLeft.children[2].position.y + bedDrawerLeft.children[2].scale.y / 2)
        bedDrawerRight.children[6].rotation.z = (90 * THREE.Math.DEG2RAD)


        if (wWidth == 3) {

            bedDrawerRight.visible = false;
            
            bedDrawerLeft.children[0].scale.setX(wWidth * ftTom - ftTom / 12);
          

            bedDrawerRight.children[0].scale.setX(wWidth * ftTom - ftTom / 12);
          

            bedDrawerLeft.position.setX(0);
            bedDrawerRight.position.setX(0);
        } else {
            bedDrawerRight.visible = bedDrawerLeft.visible;
          
            
            bedDrawerLeft.children[0].scale.setX(wWidth * ftTom / 2 - ftTom / 6+ ftTom/24 );
        

            bedDrawerRight.children[0].scale.setX(wWidth * ftTom / 2 - ftTom / 6+ftTom/24);
         
            bedDrawerLeft.position.setX(-wWidth * ftTom / 4 -ftTom/48);
            bedDrawerRight.position.setX(wWidth * ftTom / 4 +ftTom/48);
            
        }
        bedDrawerLeft.children[3].scale.setX( bedDrawerLeft.children[0].scale.x);
        bedDrawerLeft.children[4].scale.setX( bedDrawerLeft.children[3].scale.x);
        
        bedDrawerRight.children[3].scale.setX( bedDrawerRight.children[0].scale.x);
        bedDrawerRight.children[4].scale.setX( bedDrawerRight.children[3].scale.x);

        bedDrawerLeftEdge.visible =  bedDrawerLeft.visible;
        bedDrawerRightEdge.visible = bedDrawerRight.visible;

        bedDrawerLeft.children[0].position.setY(-wHeight * ftTom / 2 + bedTops[2].scale.y / 2 + ftTom / 24); // bottom
        bedDrawerLeft.children[0].position.setZ(bedTops[1].position.z - bedDrawerLeft.children[0].scale.z / 2 - bedDrawerLeft.children[4].scale.z - bedTops[1].scale.z / 2); // bottom

        bedDrawerLeft.children[1].position.setX(-bedDrawerLeft.children[0].scale.x / 2 - bedDrawerLeft.children[1].scale.x / 2); // left
        bedDrawerLeft.children[1].position.setZ(bedDrawerLeft.children[0].position.z); // left

        bedDrawerLeft.children[2].position.setX(bedDrawerLeft.children[0].scale.x / 2 + bedDrawerLeft.children[2].scale.x / 2); // right
        bedDrawerLeft.children[2].position.setZ(bedDrawerLeft.children[0].position.z); // right

        bedDrawerLeft.children[3].position.setZ(bedDrawerLeft.children[0].position.z + bedDrawerLeft.children[0].scale.z / 2 + bedDrawerLeft.children[3].scale.z / 2); // front
        bedDrawerLeft.children[4].position.setZ(bedDrawerLeft.children[0].position.z - bedDrawerLeft.children[0].scale.z / 2 - bedDrawerLeft.children[4].scale.z / 2); // back


        
        bedDrawerRight.children[0].position.setY(-wHeight * ftTom / 2 + bedTops[2].scale.y / 2 + ftTom / 24); // bottom
        bedDrawerRight.children[0].position.setZ(bedTops[1].position.z - bedDrawerRight.children[0].scale.z / 2 - bedDrawerRight.children[4].scale.z - bedTops[1].scale.z / 2); // bottom

        bedDrawerRight.children[1].position.setX(-bedDrawerRight.children[0].scale.x / 2 - bedDrawerRight.children[1].scale.x / 2); // left
        bedDrawerRight.children[1].position.setZ(bedDrawerRight.children[0].position.z); // left

        bedDrawerRight.children[2].position.setX(bedDrawerRight.children[0].scale.x / 2 + bedDrawerRight.children[2].scale.x / 2); // right
        bedDrawerRight.children[2].position.setZ(bedDrawerRight.children[0].position.z); // right

        bedDrawerRight.children[3].position.setZ(bedDrawerRight.children[0].position.z + bedDrawerRight.children[0].scale.z / 2 + bedDrawerRight.children[3].scale.z / 2); // front
        bedDrawerRight.children[4].position.setZ(bedDrawerRight.children[0].position.z - bedDrawerRight.children[0].scale.z / 2 - bedDrawerRight.children[4].scale.z / 2); // back
      


        bedDrawerLeft.children[1].visible = false;
        bedDrawerLeft.children[5].visible = false;
        bedDrawerLeft.children[6].visible = false;

        bedDrawerRight.children[2].visible = false;
        bedDrawerRight.children[5].visible = false;
        bedDrawerRight.children[6].visible = false;

      
        // if( !bedDrawerLeft.children[7] &&  isDrawerHandleCreated ){


        //     bedDrawerLeft.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerLeft.children[1]).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[5])), bedDrawerLeft.children[1].material));
        //     bedDrawerRight.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerRight.children[2]).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[5])), bedDrawerRight.children[2].material));

        //     // bedDrawerLeftEdge.add(bedDrawerLeft.children[7].clone());
        //     // bedDrawerRightEdge.add(bedDrawerRight.children[7].clone());

        //     isDrawerHandleCreated = false;
        // }
  
        
        
        if( isDrawerHandleCreated){
            if (bedDrawerLeft.children[7] ) {
                bedDrawerLeft.remove(bedDrawerLeft.children[7])
             
            }
            if(bedDrawerLeftEdge.children[7]){
                bedDrawerLeftEdge.remove(bedDrawerLeftEdge.children[7]);
            }
            if (bedDrawerRight.children[7]  ) {

                bedDrawerRight.remove(bedDrawerRight.children[7])
               
            }

            if(bedDrawerRightEdge.children[7]){
                bedDrawerRightEdge.remove(bedDrawerRightEdge.children[7]);
            }

            if(!bedDrawerLeft.children[7] ){
                bedDrawerLeft.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerLeft.children[1]).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[5])), bedDrawerLeft.children[1].material));
               
            }

            if(!bedDrawerLeftEdge.children[7]){
                bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[7].clone()));
          
            }
            if(!bedDrawerRight.children[7]){
                bedDrawerRight.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerRight.children[2]).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[5])), bedDrawerRight.children[2].material));
                
            }

            
            if(!bedDrawerRightEdge.children[7]){
                bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[7].clone()));
            }
           
        }

        if(!isDrawerHandleCreated){
            if (bedDrawerLeft.children[7] ) {
                bedDrawerLeft.remove(bedDrawerLeft.children[7])
      
            }
            if(bedDrawerLeftEdge.children[7]){
                bedDrawerLeftEdge.remove(bedDrawerLeftEdge.children[7]);
            }
            if (bedDrawerRight.children[7]) {

                bedDrawerRight.remove(bedDrawerRight.children[7])
                
            }
            if(bedDrawerRightEdge.children[7]){
                bedDrawerRightEdge.remove(bedDrawerRightEdge.children[7]);
            }
            isDrawerHandleCreated = true;
        }
         
        
        for(var i = 0 ; i<bedDrawerLeftEdge.children.length;i++){
            bedDrawerLeftEdge.children[i].position.copy(bedDrawerLeft.children[i].position);
            bedDrawerLeftEdge.children[i].scale.copy(bedDrawerLeft.children[i].scale);
            bedDrawerLeftEdge.children[i].rotation.copy(bedDrawerLeft.children[i].rotation);
          
            bedDrawerLeftEdge.children[i].visible = bedDrawerLeft.children[i].visible;
        }

      
        for(var i = 0 ; i<bedDrawerRightEdge.children.length;i++){
         
            bedDrawerRightEdge.children[i].position.copy(bedDrawerRight.children[i].position);
            bedDrawerRightEdge.children[i].scale.copy(bedDrawerRight.children[i].scale);
            bedDrawerRightEdge.children[i].rotation.copy(bedDrawerRight.children[i].rotation);
          
            bedDrawerRightEdge.children[i].visible = bedDrawerRight.children[i].visible;
        }
     
        
        bedDrawerLeftEdge.position.copy(bedDrawerLeft.position)
        bedDrawerRightEdge.position.copy(bedDrawerRight.position)
 

    }



}

function reset() {
    if (bedMatress.visible) {
        bedMatress.visible = false;
    }
    if (pillowL.visible) {
        pillowL.visible = false;
    }
    if (pillowR.visible) {
        pillowR.visible = false;
    }

    if (wWidth > 3) {
        wWidth = 3;
    }

    if (wHeight != 1.75) {
        wHeight = 1.75
    }

    if (wDepth > 6) {
        wDepth = 6;
    }


    $("#depth").val("3");



}

function removeDrawerHandle() {





}


function swaprender() {
    isMeasured = !isMeasured;

}

function createEdges(object) {
    let edges = new THREE.EdgesGeometry(object.geometry.clone());

    var subject = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x000000
    }));

    dimensionScene.add(subject);
    return subject;
}

function downloadImage() {

    $(".textOver").removeClass("d-none");
    html2canvas(dimensionviewer).then(canvas => {

        canvas.style.display = 'none'

        document.body.appendChild(canvas)
        return canvas;
    }).then(canvas => {
        const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        const a = document.createElement('a')
        a.setAttribute('download', 'bed_dimension.png')
        a.setAttribute('href', image)
        a.click()
        canvas.remove()
        $(".textOver").addClass("d-none");
    });

}

function createHorizontalArrow() {

    if (bedTops.length>0) {

       
        var from = new THREE.Vector3(bedTops[1].position.x, bedTops[1].position.y - 0.3, bedTops[1].position.z +bedTops[1].scale.z+0.1);
        var to = new THREE.Vector3(-bedTops[1].scale.x/2,bedTops[1].position.y - 0.3, bedTops[1].position.z+bedTops[1].scale.z+0.1 );
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();




        if (whArrowL == null) {
            whArrowL = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            whArrowR = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

            dimensionScene.add(whArrowL);
            dimensionScene.add(whArrowR);

            wValue = document.createElement('div');
            wValue.innerHTML = (wWidth) + " ft";

            wValue.style.fontSize = "15px";


            widthLabel = new THREE.CSS2DObject(wValue);

            whArrowL.add(widthLabel);

        } else {
            whArrowL.setDirection(direction.normalize());
            whArrowL.setLength(length, 0.05, 0.05);
            whArrowL.position.copy(from.clone());

            whArrowR.setDirection(direction.negate().normalize());
            whArrowR.setLength(length, 0.05, 0.05);
            whArrowR.position.copy(from.clone());


            wValue.innerHTML = (wWidth) + " ft(" + wWidth * 12 + " in)";
            // widthLabel.position.set(0, 0,0);
            
            // widthLabel.scale.set(0.15, 0.15, 0.15)
        }

    }


}

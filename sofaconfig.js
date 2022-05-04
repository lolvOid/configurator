let scene, cssScene, camera, orthoCameraTop, orthoCameraLeft, dimensionScene, dimensionRenderer, renderer, directionalLight, ambientLight, controls;
let css2DRenderer, css3DRenderer;

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

let selectedSofa = null;
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

let currentSofaIndex = 0;

var totalPrice = 0;
var isLeft = false,
    isRight = false;


var font;
var sofas = [],
    sofas_group = new THREE.Group();
var s_armL, s_armR;
const gltfLoader = new THREE.GLTFLoader();

var sofaCount = 1;
var isCorner = false;

var boxes = [], box_group= new THREE.Group();
init();

animate();

dimensionviewer.hidden = true;

function getInputs() {
    $("#btn").click(function () {
        console.log("Ok")
    })

    $("#export").click(function () {
        Export();
    })

    $("#addLeft").click(function () {

        addBoxLeft(currentSofaIndex)
        // createSofa(currentSofaIndex, "left");


    })

    $("#addRight").click(function () {
        addBoxRight(currentSofaIndex)
        // createSofa(currentSofaIndex, "right");
    })
    $("#addCornerDouble").click(function () {
        // createSofa(currentSofaIndex, "cornerdouble");
        addCornerDouble(currentSofaIndex)
        isCorner = true;
    })

    $("#addCorner").click(function () {
        addCornerSingle(currentSofaIndex)
        // createSofa(currentSofaIndex, "cornersingle");
        isCorner = true;
    })
}

function init() {

    cssScene = new THREE.Scene();
    scene = new THREE.Scene();
    dimensionScene = new THREE.Scene();


    window.scene = scene;
    THREE.Cache.enabled = true;

    font = new THREE.FontLoader().load('./assets/fonts/helvetiker_regular.typeface.json');
    camera = new THREE.PerspectiveCamera(25, fwidth / fheight, 0.01, 100);

    camera.position.set(0, 5, 15);
    camera.aspect = fwidth / fheight;


    orthoCameraTop = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);

    // orthoCameraTop.rotation.z = 180*THREE.Math.DEG2RAD;
    orthoCameraTop.rotation.x = -90 * THREE.Math.DEG2RAD;
    orthoCameraTop.position.y = 2;

    orthoCameraLeft = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);
    orthoCameraLeft.position.x = -1;
    orthoCameraLeft.rotation.y = -90 * THREE.Math.DEG2RAD;


    // orthoCameraTop.zoom = 250;

    orthoCameraTop.layers.enable(1)
    orthoCameraTop.layers.enable(2)

    orthoCameraLeft.layers.enable(1)
    orthoCameraLeft.layers.enable(2)
    orthoCameraLeft.layers.enable(3)
    orthoCameraLeft.layers.disable(0)


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




    css2DRenderer = new THREE.CSS2DRenderer();

    css2DRenderer.setSize(fwidth, fheight);
    css2DRenderer.domElement.style.position = 'fixed';
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css2DRenderer.domElement.style.color = '#000000';
    css2DRenderer.domElement.style.top = '0px';
    css2DRenderer.domElement.style.left = '0px';
    css2DRenderer.domElement.style.zIndex = 1


    css3DRenderer = new THREE.CSS3DRenderer();
    css3DRenderer.setSize(fwidth, fheight);
    css3DRenderer.domElement.style.position = 'absolute';
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css3DRenderer.domElement.style.color = '#000000';
    css3DRenderer.domElement.style.top = '0px';
    css3DRenderer.domElement.style.left = '0px';


    viewer.appendChild(css3DRenderer.domElement);
    viewer.appendChild(renderer.domElement);


    dimensionviewer.appendChild(css2DRenderer.domElement);
    dimensionviewer.appendChild(dimensionRenderer.domElement);

    // dimensionCanvas = document.querySelector('#dimensionviewer :nth-child(2)')

    post_process();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls = new THREE.OrbitControls(camera, css3DRenderer.domElement);

    //controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = true;

    controls.minDistance = 8;
    controls.maxDistance = 9;
    controls.panSpeed = 0;

    controls.enableDamping = true;
    controls.dampingFactor = 0;
    controls.target.set(0, 0.5, 0);


    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;
    window.addEventListener('resize', onWindowResize, true);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('click', onClick);

    controls.saveState();


    createBufferBox();
    // createSofa(0);

    getInputs();
    // createArmRest();

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
        css2DRenderer.setSize(fwidth, fheight);
        css3DRenderer.setSize(fwidth, fheight);
        dimensionRenderer.setSize(fwidth, fheight);

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

    $("#sofaIndex").html(currentSofaIndex);
    delta = clock.getDelta();
    checkSofas();
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

    dimensionRenderer.setViewport(left, Math.floor(fheight / 2), fwidth, Math.floor(fheight / 2));
    dimensionRenderer.setScissor(left, Math.floor(fheight / 2), fwidth, Math.floor(fheight / 2));
    dimensionRenderer.setScissorTest(true);


    // css2DRenderer.setSize(dimensionRenderer.domElement.width, Math.floor (dimensionRenderer.domElement.height/2));

    orthoCameraTop.left = fwidth / -2;
    orthoCameraTop.right = fwidth / 2;
    orthoCameraTop.top = fheight / 4;
    orthoCameraTop.bottom = fheight / -4;
    orthoCameraTop.zoom = 200;

    orthoCameraTop.updateProjectionMatrix();
    // dimensionRenderer.setClearColor(0x00ff00)
    dimensionRenderer.render(dimensionScene, orthoCameraTop);


    // css2DRenderer.setSize(fwidth, dimensionRenderer.domElement.height/2+100);
    dimensionRenderer.setViewport(left, 0, fwidth, Math.floor(fheight / 2));
    dimensionRenderer.setScissor(left, 0, fwidth, Math.floor(fheight / 2));
    dimensionRenderer.setScissorTest(true);


    orthoCameraLeft.left = fwidth / -2;
    orthoCameraLeft.right = fwidth / 2;
    orthoCameraLeft.top = fheight / 4;
    orthoCameraLeft.bottom = fheight / -4;
    orthoCameraLeft.zoom = 200;
    orthoCameraLeft.updateProjectionMatrix();
    // dimensionRenderer.setClearColor(0xff0000)
    dimensionRenderer.render(dimensionScene, orthoCameraLeft);

    css2DRenderer.setSize(fwidth, fheight);
    css2DRenderer.render(dimensionScene, orthoCameraTop);

    



    composer.render();
    css3DRenderer.render(scene, camera);


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
    mesh.name = "s_" + name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
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

        // Parse the input and generate the glTF output
        exporter.parse(
            scene,
            // called when the gltf has been generated
            function (gltf) {

                if (gltf instanceof ArrayBuffer) {

                    saveArrayBuffer(gltf, 'sofa.glb');

                } else {

                    const output = JSON.stringify(gltf, null, 2);
                    console.log(output);
                    saveString(output, 'sofa.gltf');

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

function createDraftBox(name){
    var g =  new THREE.BoxGeometry(1,1,1);
    var m = new THREE.MeshBasicMaterial({color:0x000000,wireframe:true});
    var mesh = new THREE.Mesh(g,m);
    mesh.name = "s_"+name;
    return mesh;
}
function addBoxLeft(index){
    var s = boxes[index].clone();
    s.position.set(boxes[index].position.x-boxes[index].scale.x,boxes[index].position.y,boxes[index].position.z);
    
    s.name= "sofa_"+(index+1);
    boxes.push(s);
    boxes.forEach(e=>{
        box_group.add(e);
    })
}

function addBoxRight(index){
    var s = boxes[index].clone();
    s.position.set(boxes[index].position.x+boxes[index].scale.x,boxes[index].position.y,boxes[index].position.z);
    
    s.name= "sofa_"+(index+1);
    boxes.push(s);
    boxes.forEach(e=>{
        box_group.add(e);
    })
}

function addCornerSingle(index){
    
    var s = boxes[index];
    

    

    
    var b= s.children[1].clone();
    b.rotation.y = 90 * THREE.Math.DEG2RAD;
    
    b.position.setX(s.children[1].scale.x/2+b.scale.x/7);

    b.position.setZ(s.children[1].scale.z/2-b.scale.z/2);

    s.children[1].scale.setX(s.scale.x/2+b.scale.x)
   s.children[1].position.setX(s.children[0].position.x+s.children[1].scale.x/9)
           

    s.add(b);

    s.name= "sofa_"+(index+1);

    boxes[index] = s;
    boxes.forEach(e=>{
        box_group.add(e);
    })
}
function addCornerDouble(index){
    var s = boxes[index];
    s.scale.setZ( 4*ftTom);
    s.position.set(boxes[index].position.x,boxes[index].position.y,boxes[index].position.z+s.scale.z/4);

    
    boxes[index].remove(boxes[index].children[0])
    boxes[index].remove(boxes[index].children[1])
    box_group.remove(boxes[index]);
           
            
    

    
    s.remove(s.children[0])
    s.remove(s.children[1])
    s.name= "sofa_"+(index+1);

    boxes[index] = s;
    boxes.forEach(e=>{
        box_group.add(e);
    })
}

function createBufferBox(index){
    var size =  2*ftTom;
    var s = createDraftBox("sofa");
    s.scale.set(size,size,size);
    s.position.setY(s.scale.y/2);


    s.add(createSofa())
    s.add(createSofaBack());
    s.children[1].scale.setY(s.scale.y/2+3.5*ftTom);
    s.children[1].scale.setZ(ftTom);
    s.children[1].position.setY(s.children[0].position.y-s.children[0].scale.y/2+s.children[1].scale.y/2)
    s.children[1].position.setZ(-s.children[0].scale.z/2-s.children[1].scale.z/2)
    boxes.push(s);
    
    boxes.forEach(e=>{
        box_group.add(e);
    })
    box_group.name="sofas";
    scene.add(box_group);
    

}
function createSofa(){
    var sofatex = texLoader.load("./Textures/whiteGrad3.jpg");
    sofatex.wrapS = THREE.MirroredRepeatWrapping;
    sofatex.wrapT = THREE.MirroredRepeatWrapping;
    sofatex.repeat.set(1, 1);

   

    var s_body = createBox("body");
    s_body.material.map = sofatex;
       
      return s_body;
}
function createSofaBack(){
    var sofatex = texLoader.load("./Textures/whiteGrad3.jpg");
    sofatex.wrapS = THREE.MirroredRepeatWrapping;
    sofatex.wrapT = THREE.MirroredRepeatWrapping;
    sofatex.repeat.set(1, 1);

    var s_back = createBox("back");
    s_back.material.map = sofatex;
    s_back.material.color.set("#dedede");

 
   

    return s_back;

}
// function createSofa(index, name) {
//     var sofatex = texLoader.load("./Textures/whiteGrad3.jpg");
//     sofatex.wrapS = THREE.MirroredRepeatWrapping;
//     sofatex.wrapT = THREE.MirroredRepeatWrapping;
//     sofatex.repeat.set(1, 1);


//     if (index != -1) {

//         if(name=="cornerdouble"){
//             sofas[index].children[0].scale.setZ(size*2);
//             sofas[index].children[1].scale.setX(sofas[index].children[0].scale.x+6*ftTom/12);
            
//             sofas[index].children[0].position.setZ(sofas[index].position.z +sofas[index].children[0].position.z+ sofas[index].children[0].scale.z/4);
//             sofas[index].children[1].position.setX(sofas[index].children[1].scale.x/2);
            
//             sofas[index].add( sofas[index].children[1].clone());
            
//             sofas[index].children[2].rotation.y = -90 * THREE.MathUtils.DEG2RAD;
//             sofas[index].children[2].position.setX(sofas[index].children[0].position.x+sofas[index].children[2].scale.x/2);
//             sofas[index].children[2].position.setZ(-sofas[index].children[0].scale.z/2+sofas[index].children[2].scale.z+sofas[index].children[1].scale.z/2);
//             s_armR.visible = false;
//         }else if(name=="cornersingle"){
//             sofas[index].add( sofas[index].children[1].clone());
            
//             sofas[index].children[2].rotation.y = -90 * THREE.MathUtils.DEG2RAD;
//             sofas[index].children[2].scale.setX(sofas[index].children[0].scale.z+sofas[index].children[1].scale.z);
//             sofas[index].children[2].position.setX(sofas[index].children[0].position.x+sofas[index].children[2].scale.x/2);
//             sofas[index].children[2].position.setZ(-sofas[index].children[0].scale.z/2-sofas[index].children[2].scale.z/2);
//             // s_armR.visible = false;
//         }
//        else{
//         var sofa = new THREE.Group();

//         var s_body = createBox("body");
//         s_body.material.map = sofatex;
//         size = 2 * ftTom;
//         s_body.scale.set(size, size, size)
//         s_body.position.set(sofa.position.x + s_body.scale.x / 2, s_body.scale.y / 2, sofa.position.z - s_body.scale.z / 2)

//         var s_back = createBox("back");
//         s_back.material.map = sofatex;
//         s_back.material.color.set("#dedede");

//         s_back.scale.set(s_body.scale.x, s_body.scale.y + 1.25 * ftTom, 6 * ftTom / 12);
//         s_back.position.set(s_body.position.x, s_back.scale.y / 2, -s_body.scale.z - s_back.scale.z / 2);

//         sofa.position.set(0, 0, 0);


//         sofa.add(s_body);
//         sofa.add(s_back);
//         // scene.add(s_armL);
   

//         if (name == "left") {
           
//                 sofa.position.setX(sofas[index].position.x - sofas[index].children[0].scale.x / 2 - s_body.scale.x / 2);
            

//         }

//         if (name == "right") {
           
//                 sofa.position.setX(sofas[index].position.x + sofas[index].children[0].scale.x / 2 + s_body.scale.x / 2)
            
//         }
        
//         if (!sofas.includes(sofa)) {
//             sofas.push(sofa);

//         }
//         for (var i = 0; i < sofas.length; i++) {
//             sofas[i].name = "sofa_" + i;
//             sofas_group.add(sofas[i]);
//         }
//         sofas_group.name = "sofas";
//         scene.add(sofas_group);

//        }

//         // console.log(sofas.length)
//     }



//     // var pG = new THREE.PlaneGeometry(0.25, 0.25, 1, 1);

//     // var pMat = new THREE.MeshBasicMaterial({
//     //     color: 0x000000,
//     //     map: texLoader.load("./assets/plus_white.png"),
//     //     alphaMap: texLoader.load("./assets/plus_white.png"),
//     //     transparent: true
//     // });

//     // var pGroup = new THREE.Group();
//     // // var pNorth = new THREE.Mesh(pG,pMat);   
//     // var pEast = new THREE.Mesh(pG, pMat);
//     // // var pSouth = new THREE.Mesh(pG,pMat);  
//     // // var pWest = new THREE.Mesh(pG,pMat);  

//     // // pNorth.position.set(sofa.position.x,floor.position.y+0.01,sofa.position.z-sofa.children[3].scale.z/2-pNorth.scale.z/2-0.15);
//     // // pNorth.rotation.x= -90 * THREE.Math.DEG2RAD;

//     // // pSouth.position.set(sofa.position.x,floor.position.y+0.01,sofa.position.z+sofa.children[0].scale.z/2+pNorth.scale.z/2-0.15);
//     // // pSouth.rotation.x= -90 * THREE.Math.DEG2RAD;


//     // // scene.add(pNorth);
//     // // scene.add(pSouth);
// }

// function createArmRest() {
//     var sofatex = texLoader.load("./Textures/whiteGrad4.jpg");
//     sofatex.wrapS = THREE.MirroredRepeatWrapping;
//     sofatex.wrapT = THREE.MirroredRepeatWrapping;
//     sofatex.repeat.set(1, 1);

//     var armrest_thickness = 6 * ftTom / 12;
//     var armrest_height = sofas[0].children[0].scale.y + 6 * ftTom / 12;
//     var armrest_depth = sofas[0].children[0].scale.z;
//     s_armR = createBox("armrest");
//     s_armR.material.color.set("#d0d0d0")
//     s_armR.material.map = sofatex;
//     s_armR.scale.set(armrest_thickness, armrest_height, armrest_depth);


//     s_armL = createBox("armrest");
//     s_armL.material.color = s_armR.material.color;
//     s_armL.material.map = sofatex;
//     s_armL.scale.set(armrest_thickness, armrest_height, armrest_depth);
//     s_armL.position.set(-s_armL.scale.x / 2 + sofas[0].children[0].scale.x / 2, s_armL.scale.y / 2, sofas[0].position.z);
//     s_armR.position.set(s_armR.scale.x / 2 + sofas[0].children[0].scale.x / 2, s_armR.scale.y / 2, sofas[0].position.z);


//     scene.add(s_armL);
//     scene.add(s_armR);
// }

function updateArmRest(index) {

    s_armL.position.setX(sofas[i].position.x - s_armL.scale.x / 2 - sofas[index].children[0].scale.x / 2);
    s_armL.position.setZ(sofas[index].position.z);

    s_armR.position.setX(sofas[i].position.x + s_armR.scale.x / 2 + sofas[index].children[0].scale.x / 2);
    s_armL.position.setZ(sofas[index].position.z);
}

function checkSofas() {

    // $("#sofaIndex").html(currentSofaIndex);
    isLeft = false;
    isRight = false;
    $("#addLeft").removeClass("disabled");
    $("#addRight").removeClass("disabled");
    var arr = [];
    for (var i = 0; i < boxes.length; i++) {

        if (boxes[i] instanceof THREE.Mesh) {


            // console.log("sofa "+currentSofaIndex + "- "+"sofa "+i+" = "+ ((boxes[currentSofaIndex].position.z-boxes[i].position.z).toFixed(1)))
            if((boxes[currentSofaIndex].position.z- boxes[i].position.z).toFixed(1) > 0){
                $("#addCorner").removeClass("disabled");
            }else if((boxes[currentSofaIndex].position.z- boxes[i].position.z).toFixed(1) < 0){
                $("#addCorner").addClass("disabled");
            }
            
            if ((boxes[currentSofaIndex].position.x - boxes[i].position.x).toFixed(1) > 0) {
                isLeft = true;
                //  console.log("sofa "+currentSofaIndex + "- "+"sofa "+i+" = "+ ((sofas[currentSofaIndex].position.x-sofas[i].position.x).toFixed(1)))
                

                $("#addLeft").addClass("disabled");

            } else if ((boxes[currentSofaIndex].position.x - boxes[i].position.x).toFixed(1) < 0) {

                isRight = true;
                

                $("#addRight").addClass("disabled");
            }
            // if(Math.abs(Math.round(sofas[i].position.x- sofas[currentSofaIndex].position.x))){

            // }
            // arr.push((sofas[currentSofaIndex].position.x - sofas[i].position.x).toFixed(1));


            // var max = Math.max.apply(Math, arr);
            // var min = Math.min.apply(Math, arr);

            // if ((sofas[currentSofaIndex].position.x - sofas[i].position.x).toFixed(1) == max) {
            //     s_armL.position.setX(sofas[i].position.x - s_armL.scale.x / 2);
            //     s_armL.position.setZ(sofas[i].position.z - s_armL.scale.z / 2);

            // }

            // if ((sofas[currentSofaIndex].position.x - sofas[i].position.x).toFixed(1) == min) {
            //     s_armR.position.setX(sofas[i].position.x + s_armR.scale.x / 2 + sofas[i].children[0].scale.x);
            //     s_armR.position.setZ(sofas[i].position.z - s_armR.scale.z / 2);

            // }

        }
    }

}

function onClick() {

    if (selectedSofa) {



        // currentSofaIndex = sofas.indexOf(selectedSofa.parent)
        currentSofaIndex = boxes.indexOf(selectedSofa)
        console.log(currentSofaIndex)
        selectedSofa = null;

      

    }




}


function onPointerMove(event) {





    if (event.changedTouches) {
        pointer.x = event.changedTouches[0].pageX;
        pointer.y = event.changedTouches[0].pageY;
    } else {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    }


    pointer.x = (event.clientX / fwidth) * 2 - 1;
    pointer.y = -(event.clientY / fheight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);


    const intersectsofa = raycaster.intersectObject(box_group, true);
    if (intersectsofa.length > 0) {
        const res = intersectsofa.filter(function (res) {
            return res && res.object;
        })[0];

        if (res && res.object) {
            selectedSofa = res.object;
            
            

        }
    } else {
        selectedSofa = null;
    }
    // console.log(currentSofaIndex);
    // if (mirrorIcons.length > 0) {

    //     const res = mirrorIcons.filter(function (res) {

    //         return res && res.object;

    //     })[0];


    //     if (res && res.object) {

    //         selectedMirror = res.object;
    //         selectedMirror.material.map = onHoverFlipSprite;
    //     }
    // }



}

function addSelectedObject(object) {

    selectedObjects = [];
    selectedObjects.push(object);

}
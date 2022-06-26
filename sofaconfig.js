let scene,
    cssScene,
    camera,
    orthoCameraTop,
    orthoCameraLeft,
    dimensionScene,
    dimensionRenderer,
    renderer,
    directionalLight,
    ambientLight,
    controls;
let css2DRenderer, css3DRenderer, css2DRenderer2;

const viewer = document.getElementById("modelviewer");
const dimensionviewer = document.getElementById("dimensionViewer");

const fwidth = viewer.offsetWidth ;
const fheight = viewer.offsetHeight;
const dwidth = dimensionviewer.offsetWidth ;
const dheight = dimensionviewer.offsetHeight ;
let dimensionCanvas;
var dimensionImage;

let sHeight = 1.5;

const thickness = 0.875;
const ftTom = 0.3048;

let selectedObject = null,
    selectedObjects = [];

let selectedSofa = null;
let selectedBtn = null,
    selectedBtnParent = null;
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
var btnPlus = texLoader.load("assets/plus_white.png");
var btnMinus = texLoader.load("assets/minus_white.png");


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
    armrests = [],
    i_armrests = [],
    i_sofas = [],
    i_armrests = [],

    sofas_group = new THREE.Group();
var s_armL, s_armR;
const gltfLoader = new THREE.GLTFLoader();
const manager = new THREE.LoadingManager();
var sofaCount = 1;
var isCorner = false;
var armrestsOnCorners = [];
var isSideArmrestsAddedLeft = false,
    isSideArmrestsAddedRight = false,
    isSideArmrestsAddedHorizontal = false;
var sofaType = 0;

var sofa = {
    single: null,
    armrestL: null,
    armrestR: null,
    chaise: null,
    chaiseL: null,
    chaiseR: null,
    cornerL: null,
    cornerR: null,
    ottoman: null,
    singleback: null,
    singlebackL: null,
    singlebackR: null,
    bottom: null,
    bottomL: null,
    bottomR: null,
    leg: null,
};

var icons = {
    single: texLoader.load("assets/sofasIcons/sofa_single_wa.png"),
    armrest: texLoader.load("assets/sofasIcons/sofa_armrest.png"),
    chaiseL: texLoader.load("assets/sofasIcons/sofa_chaiseL.png"),
    chaiseR: texLoader.load("assets/sofasIcons/sofa_chaiseR.png"),
    cornerL: texLoader.load("assets/sofasIcons/sofa_cornerL.png"),
    cornerR: texLoader.load("assets/sofasIcons/sofa_cornerR.png"),
    ottoman: texLoader.load("assets/sofasIcons/sofa_ottoman.png"),

};
var legs = [];
var loading = 0;

var singleCount = 0,
    leftCount = 0,
    rightCount = 0;

const add_btn_group = new THREE.Group();
const remove_btn_group = new THREE.Group();
const null_group = new THREE.Group();
var leftIndex = 0,
    rightIndex = 0;

var currentSingleCount = 0,
    currentChaiseCount = 0,
    currentCornerCount = 0,
    currentOttomanCount = 0;
var lastBottomSofa = [],
    lastBottomSofasLV = [],
    lastBottomSofasRV = [],
    lastBackSofa = [],
    lastBackSofaLV = [],
    lastBackSofaRV = [];
var max = 0,
    lmax = 0;
var leftverticalSingleCount = 0,
    rightverticalSingleCount = 0,
    hSingleCount = 0;
var leftverticalIndex = 0,
    rightverticalIndex = 0,
    leftHorizontalIndex = 0;
var isLeftVertical = false,
    isRightVertical = false;
var startVerticalLeft = false,
    isCornerR = false;
var lasthSingleCount = 0,
    lastLeftSingleCount = 0;
var enableHorizontalBottomAdding = false,
    enableLeftVerticalBottomAdding = false;
let posVector = new THREE.Vector3(0, 0, 0);
var isMoved = 1;

var leftIndexs = [];
var leftCornerIndex, leftChaiseIndex;
var rightCornerIndex, rightChaiseIndex;
var rightIndexs = [];
var leftIndexHorizontal, leftIndexVertical, rightIndexVertical;
var hArrowL, hArrowR, vArrowUpL, vArrowDownL, vArrowUpR, vArrowDownR, hLeftLabel, hRightLabel, vValue;
var d = [],
    leftV = [],
    rightV = [];

init();

animate();

dimensionviewer.hidden = false;

function getInputs() {
    $("#btn").click(function () {});

    $("#export").click(function () {
        Export();
    });

    $("input:radio[name='heightOptions']").click(function () {
        sHeight = $(this).val();

    });

    $("#selectSofa").change(function () {
        sofaType = $(this).children("option:selected").val();

    });
    $("#removeL").click(function () {
            for(var i = leftV.length-1;i>=0;i--){
                removeSofas(Math.round(leftV[i].id))
            }
           

         
    })
    $("#removeR").click(function () {
     
        for(var i = rightV.length-1;i>=0;i--){
            removeSofas(Math.round(rightV[i].id))
        }

     
})  


    $("#removeCorner").click(function () {

        addArmrestsOnRemovedCorners()
        removeSofas(leftCornerIndex);
        checkDistance();
        manipulateSofa();
        
        removeSofas(rightCornerIndex);
        checkDistance();
        manipulateSofa();

    })
}

function init() {
    cssScene = new THREE.Scene();
    scene = new THREE.Scene();

    dimensionScene = new THREE.Scene();

    window.scene = scene;
    THREE.Cache.enabled = true;

    font = new THREE.FontLoader().load(
        "./assets/fonts/helvetiker_regular.typeface.json"
    );
    camera = new THREE.PerspectiveCamera(25, fwidth / fheight, 0.01, 100);

    camera.position.set(0, 5, 10);
    camera.aspect = fwidth / fheight;

    orthoCameraTop = new THREE.OrthographicCamera(
        dwidth / -2,
        dwidth / 2,
        dheight / 2,
        dheight / -2,
        0.001,
        1000
    );

    // orthoCameraTop.rotation.z = 180*THREE.Math.DEG2RAD;
    orthoCameraTop.rotation.x = -90 * THREE.Math.DEG2RAD;
    orthoCameraTop.position.y = 2;
    orthoCameraTop.position.z = 1.5;
    // orthoCameraTop.zoom = 250;

    orthoCameraTop.layers.enable(1);
    orthoCameraTop.layers.enable(2);

    orthoCameraTop.updateProjectionMatrix();
    dimensionScene.add(orthoCameraTop);
    
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
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(fwidth, fheight);
    renderer.info.autoReset = false;
    renderer.setClearColor(0xffffff, 1);
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
    });
    dimensionRenderer.setPixelRatio(window.devicePixelRatio);
    dimensionRenderer.setSize(dwidth, dheight);
    dimensionRenderer.compile(dimensionScene, orthoCameraTop);

    css2DRenderer = new THREE.CSS2DRenderer();

    css2DRenderer.setSize(dwidth, dheight);
    css2DRenderer.domElement.style.position = "relative";
    
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css2DRenderer.domElement.style.color = "#000000";
    css2DRenderer.domElement.style.top = "0px";
    css2DRenderer.domElement.style.left = "0px";
    css2DRenderer.domElement.id = "measurement"
    css2DRenderer.domElement.style.zIndex = 2;

    css2DRenderer2 = new THREE.CSS2DRenderer();

    css2DRenderer2.setSize(fwidth, fheight);
    css2DRenderer2.domElement.style.position = "fixed";
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    // css2DRenderer2.domElement.style.color = '#000000';
    css2DRenderer2.domElement.style.top = "0px";
    css2DRenderer2.domElement.style.left = "0px";
    css2DRenderer2.domElement.style.zIndex = 1;


    css3DRenderer = new THREE.CSS3DRenderer();
    css3DRenderer.setSize(fwidth, fheight);
    css3DRenderer.domElement.style.position = "absolute";
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css3DRenderer.domElement.style.color = "#000000";
    css3DRenderer.domElement.style.top = "0px";
    css3DRenderer.domElement.style.left = "0px";

    viewer.appendChild(css3DRenderer.domElement);
    viewer.appendChild(css2DRenderer2.domElement);
    viewer.appendChild(renderer.domElement);

  
    dimensionviewer.appendChild(dimensionRenderer.domElement);
    dimensionviewer.appendChild(css2DRenderer.domElement);
    // dimensionCanvas = document.querySelector('#dimensionviewer :nth-child(2)')

    post_process();
    controls = new THREE.OrbitControls(camera, css2DRenderer2.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls = new THREE.OrbitControls(camera, css3DRenderer.domElement);

    //controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = true;

    controls.minDistance = 8;
    controls.maxDistance = 15;
    controls.panSpeed = 0;

    controls.enableDamping = true;
    controls.dampingFactor = 0;
    controls.target.set(0, 0.5, 0);

    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI / 2;
    // controls.minAzimuthAngle = -Math.PI / 2;
    // controls.maxAzimuthAngle = Math.PI / 2;
    window.addEventListener("resize", onWindowResize, true);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("click", onClick);

    controls.saveState();


    // createBufferBox();
    // createSofa(0);

    getInputs();
    // createArmRest();
    loadSofa();
    
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
        css2DRenderer.setSize(dwidth, dheight);
        css2DRenderer2.setSize(fwidth, fheight);
        css3DRenderer.setSize(fwidth, fheight);
        dimensionRenderer.setSize(dwidth, dheight);

        orthoCameraTop.updateProjectionMatrix();

    }
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (fwidth * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (fheight * pixelRatio);
    render();
}

function animate() {
    requestAnimationFrame(animate);

    update();
    render();
}

function chooseSofaDesign(type) {
    try {

        scene.traverse(function (e) {


            if (e instanceof THREE.Object3D) {

                for (let i in e.children) {
                    if (e.name.match(sofa.single.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.singleback.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }

                    if (e.name.match(sofa.singlebackL.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.singlebackR.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.cornerL.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.cornerR.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.chaiseL.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.chaiseR.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.leg.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.armrestL.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.armrestR.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.ottoman.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.bottom.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.bottomL.name)) {

                        e.children[i].visible = i == type ? true : false;
                    }
                    if (e.name.match(sofa.bottomR.name)) {
                        e.children[i].visible = i == type ? true : false;
                    }


                }


            }
        });


    } catch (err) {

    }




}

function update() {
    controls.update();
    updateFloor();

    var singles = sofas.filter((sofas) => sofas.name == sofa.single.name);
    var chaiseL = sofas.filter((sofas) => sofas.name == sofa.chaiseL.name);
    var chaiseR = sofas.filter((sofas) => sofas.name == sofa.chaiseR.name);
    var cornerL = sofas.filter((sofas) => sofas.name == sofa.cornerL.name);
    var cornerR = sofas.filter((sofas) => sofas.name == sofa.cornerR.name);
    var ottomans = sofas.filter((sofas) => sofas.name == sofa.ottoman.name);

    currentSingleCount = singles.length;
    currentChaiseCount = chaiseL.length + chaiseR.length;
    currentCornerCount = cornerL.length + cornerR.length;
    currentOttomanCount = ottomans.length;
    $(".price").html("$ "+totalPrice)
    chooseSofaDesign(sofaType);

    sofaCount =
        hSingleCount +
        leftverticalSingleCount +
        rightverticalSingleCount +
        currentChaiseCount +
        currentCornerCount;


    if (sofaCount > 0) {
       
        if (leftverticalSingleCount == 7) {
            add_btn_group.children[0].visible = false;
        } else {
            add_btn_group.children[0].visible = true;
        }

        if (rightverticalSingleCount == 7) {
            add_btn_group.children[1].visible = false;
        } else {
            add_btn_group.children[1].visible = true;
        }


        if (chaiseL.length > 0) {
            if (ottomans.length > 1) {
                add_btn_group.children[1].visible = false;
            } else {
                add_btn_group.children[1].visible = true;
            }
        } else if (chaiseR.length > 0) {
            if (ottomans.length > 1) {
                add_btn_group.children[0].visible = false;
            } else {
                add_btn_group.children[0].visible = true;
            }
        }
    }


    $("#sofaCount").html(sofaCount);

    checkDistance();
    manipulateSofa();
    updateButtons(
        leftIndexs[leftIndexs.length - 1],
        rightIndexs[rightIndexs.length - 1]
    );

    if (sofas.length > 0) {
        add_btn_group.position.set(0, 0, 0);
        remove_btn_group.position.set(0, 0, 0);
        null_group.position.set(0, 0, 0);
    }




    adjustHeight();
    updateArmrests(
        leftIndexs[leftIndexs.length - 1],
        rightIndexs[rightIndexs.length - 1]
    );
    if (currentCornerCount > 1 && leftverticalSingleCount > 0 && rightverticalSingleCount > 0) {
        
        $("#removeCorner").removeClass("btn-outline-dark disabled");
        $("#removeCorner").addClass("btn-danger");
    } else {
          
        $("#removeCorner").removeClass("btn-danger");
        $("#removeCorner").addClass("btn-outline-dark disabled");
    }
    
    
    if(leftverticalSingleCount > 0){
        $("#removeL").removeClass("btn-outline-dark disabled");
        $("#removeL").addClass("btn-danger");
    } else {
          
        $("#removeL").removeClass("btn-danger");
        $("#removeL").addClass("btn-outline-dark disabled");
    }
    if(rightverticalSingleCount > 0){
        $("#removeR").removeClass("btn-outline-dark disabled");
        $("#removeR").addClass("btn-danger");
    } else {
          
        $("#removeR").removeClass("btn-danger");
        $("#removeR").addClass("btn-outline-dark disabled");
    }
    
    
    
    
    if(leftverticalSingleCount==0){
        
        isSideArmrestsAddedLeft = false;
    }
    if(rightverticalSingleCount==0){
      
        isSideArmrestsAddedRight = false;
    }


    createMeasurementsWidth(leftIndexs[leftIndexs.length - 1], rightIndexs[rightIndexs.length - 1])
    // createMeasurementsHeightLeft(leftIndexs[leftIndexs.length - 1], rightIndexs[rightIndexs.length - 1])
    // createMeasurementsHeightRight(leftIndexs[leftIndexs.length - 1], rightIndexs[rightIndexs.length - 1])
    delta = clock.getDelta();
    dimensionviewer.hidden = false;
    if (isMeasured) {
        // viewer.hidden = true;
        dimensionviewer.hidden = false;

        $(".downloadDimension").show();

        $("input:radio[name='renderOptions']").prop("disabled", true);
    } else {
         // viewer.hidden = false;
        // dimensionviewer.hidden = true;
        $(".downloadDimension").hide();
        $("input:radio[name='renderOptions']").prop("disabled", false);
    }
}

function addArmrestsOnRemovedCorners() {

    isSideArmrestsAddedHorizontal = true;
    isSideArmrestsAddedLeft = true;
    isSideArmrestsAddedRight = true;
    
}

function updateFloor() {

    if (sofas.length > 0) {
        sofas.forEach(e => {

            var leg = getChildfromSofa(e, "Legs", sofaType);
            if (sofaType < 4) {
                floor.position.setY(-leg.size.y)
            } else {
                floor.position.setY(leg.object.position.y)
            }

        })
    } else {
        floor.position.setY(0);
    }




}

function render() {





    orthoCameraTop.zoom = 40;
  

    orthoCameraTop.updateProjectionMatrix();

    dimensionRenderer.render(dimensionScene, orthoCameraTop);




    css2DRenderer.setSize(dwidth, dheight);
    css2DRenderer.render(dimensionScene, orthoCameraTop);

    css2DRenderer2.render(scene, camera);

    composer.render();
    css3DRenderer.render(scene, camera);
}

function create_lights() {
    directionalLight = new THREE.DirectionalLight(0xfff3db, 1);
    directionalLight.position.set(0.5, 1.5, 10);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default

    scene.add(directionalLight);

    var directionalLight1 = new THREE.DirectionalLight(0xbfe4ff, 0.3);
    directionalLight1.position.set(0, 5, 0);

    // directionalLight1.castShadow = true;

    directionalLight1.shadow.mapSize.width = 512; // default
    directionalLight1.shadow.mapSize.height = 512;
    scene.add(directionalLight1);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
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
        color: 0xc5c5c3,
    });

    floor = new THREE.Mesh(g, m);
    floor.name = "floor";
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;

    floor.rotateX(-90 * THREE.Math.DEG2RAD);
    scene.add(floor);
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

    outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(fwidth, fheight),
        scene,
        camera
    );
    outlinePass.edgeStrength = 16;
    outlinePass.edgeGlow = 0;
    outlinePass.edgeThickness = 0.5;
    outlinePass.pulsePeriod = 0;

    planeOultinePass = new THREE.OutlinePass(
        new THREE.Vector2(fwidth, fheight),
        scene,
        camera
    );
    planeOultinePass.edgeStrength = 16;
    planeOultinePass.edgeGlow = 0;
    planeOultinePass.edgeThickness = 0.5;
    planeOultinePass.pulsePeriod = 0;

    doorOutlinePass = new THREE.OutlinePass(
        new THREE.Vector2(fwidth, fheight),
        scene,
        camera
    );
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

    fxaaPass.material.uniforms["resolution"].value.x = 1 / (fwidth * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (fheight * pixelRatio);

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

//Export
{
    const link = document.createElement("a");
    link.style.display = "none";
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
            method: "POST",
            mode: "no-cors",
            body: formData,
        };

        fetch(endpoint, options)
            .then((response) => console.log(JSON.stringify(response)))
            .catch((error) => console.error("Error:", error));
    }

    function saveString(text, filename) {
        save(
            new Blob([text], {
                type: "text/plain",
            }),
            filename
        );
    }

    function saveArrayBuffer(buffer, filename) {
        save(
            new Blob([buffer], {
                type: "application/octet-stream",
            }),
            filename
        );
    }

    function Export() {
        floor.visible = false;
        add_btn_group.visible = false;
        remove_btn_group.visible = false;
        // Parse the input and generate the glTF output
        exporter.parse(
            scene,
            // called when the gltf has been generated
            function (gltf) {
                if (gltf instanceof ArrayBuffer) {
                    saveArrayBuffer(gltf, "sofa.glb");
                } else {
                    const output = JSON.stringify(gltf, null, 2);
                    console.log(output);
                    saveString(output, "sofa.gltf");

                    floor.visible = true;

                    add_btn_group.visible = true;
                    remove_btn_group.visible = true;
                }
            },
            // called when there is an error in the generation
            function (error) {
                console.log("An error happened");
            }
        );
    }
}

function addButton() {
    if (sofas.length > 0) {
        createNullGroup("left", -0.8);
        createNullGroup("right", 0.8);
        createAddButton("Addleft", -0.8);
        createAddButton("Addright", 0.8);
        createRemoveButton("Removeleft", -0.8);
        createRemoveButton("Removeright", 0.8);
    }
    addArmrest();
    updateArmrests(0, 0);
    //adjustHeight();
}

function createTexturePlane(texture) {
    var g = new THREE.PlaneGeometry(1, 1);
    var m = new THREE.MeshBasicMaterial({
        color: 0x000000,
        map: texture,
        alphaMap: texture,
        transparent: true
    });
    var p = new THREE.Mesh(g, m);

    p.rotation.x = -Math.PI / 2;
    p.position.y = -0.01;
    return p;
}

function addSingle(index) {
    if (sofa.single) {

        var s = sofa.single.clone();
        var p = createTexturePlane(icons.single);

        scene.add(s);
        dimensionScene.add(p);
        // addArmrest();
        // removeButton();
        try {
            if (index != null) {

                var sofaSize = getChildfromSofa(sofa.single, "Seat", sofaType).size;
                var cornerSeatSize = getActualSize(sofa.cornerL, "Seat");



                var armrestSize = new THREE.Box3()
                    .setFromObject(sofa.armrestL)
                    .getSize(new THREE.Vector3());

                if (isLeft) {
                    if (sofas[index].name == sofa.cornerR.name) {
                        
                        s.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

                        s.position.setX(sofas[index].position.x);
                        s.position.setZ(sofas[index].position.z + cornerSeatSize.z);


                        p.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
                        p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                        p.position.setX(i_sofas[index].position.x);
                        p.position.setZ(i_sofas[index].position.z + 2 * ftTom + 3 / 12 * ftTom);

                        leftverticalSingleCount += 1;


                    } else if (sofas[index].rotation.y > 0) {

                        var a = new THREE.Object3D();

                        s.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                        
                        s.translateX((-1 - leftverticalSingleCount) * sofaSize.x);
                        

                        s.position.setX(sofas[index].position.x);

                        p.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
                        p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                        p.position.setX(i_sofas[index].position.x);
                        p.position.setZ(i_sofas[index].position.z + 2 * ftTom);

                        leftverticalSingleCount += 1;

                    } else {

                        hSingleCount += 1;
                        lasthSingleCount = hSingleCount;
                        s.position.setX(sofas[index].position.x - sofaSize.x);

                        p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                        p.position.setX(s.position.x);
                        p.position.setZ(s.position.z - 3 / 12 * ftTom);
                    }
                }
                if (isRight) {
                    if (sofas[index].name == sofa.cornerL.name) {
                        enableHorizontalBottomAdding = false;
                        s.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

                        s.position.setX(sofas[index].position.x);
                        s.position.setZ(sofas[index].position.z + cornerSeatSize.z);


                        p.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
                        p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                        p.position.setX(i_sofas[index].position.x);
                        p.position.setZ(i_sofas[index].position.z + 2 * ftTom + 3 / 12 * ftTom);


                        rightverticalSingleCount += 1;

                    } else if (sofas[index].rotation.y < 0) {

                        s.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
                        s.translateX((1 + rightverticalSingleCount) * sofaSize.x);
                        s.position.setX(sofas[index].position.x);

                        p.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
                        p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                        p.position.setX(i_sofas[index].position.x);
                        p.position.setZ(i_sofas[index].position.z + 2 * ftTom);

                        rightverticalSingleCount += 1;

                    } else {

                        hSingleCount += 1;
                        lasthSingleCount = hSingleCount;
                        s.position.setX(sofas[index].position.x + sofaSize.x);

                        p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                        p.position.setX(s.position.x);
                        p.position.setZ(s.position.z - 3 / 12 * ftTom);
                    }
                }
                totalPrice+=100;
            } else {

                s.position.setX(0);
                p.scale.set(2 * ftTom, 2 * ftTom + 6 / 12 * ftTom)
                p.position.setX(s.position.x);
                p.position.setZ(s.position.z - 3 / 12 * ftTom);
                totalPrice +=100;
            }

            if (!sofas.includes(s)) {
                sofas.push(s);
            }
            if (!i_sofas.includes(p)) {
                i_sofas.push(p);
            }



        } catch (err) {
            console.log(err)
        }

    }

}



function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function SetSofaChildVisiblity(object = new THREE.Object3D(), name = "Seat", type = 3, left = false, right = false, middle = false, full = false,lmost = false, rmost = false) {

    if (getChildfromSofa(object, name, type).object instanceof THREE.Object3D) {
        getChildfromSofa(object, name, type).object.traverse(e => {
            if (e.name.includes("Mid")) {
                e.visible = middle;
            }
            if (e.name.includes("Full")) {
                e.visible = full;
            }
            if (e.name.includes("Left")) {
                e.visible = left;
            }
            if (e.name.includes("Right")) {
                e.visible = right;
            }
            if(e.name.includes("RM")){
                e.visible = rmost;
            }
            if(e.name.includes("LM")){
                e.visible = lmost;
            }
        })
    }

}

function manipulateSofa() {



    d = [], leftV = [], rightV = [];

    leftIndexs.forEach(function (l) {
        if (sofas.includes(sofas[l])) {
            if (sofas[l].rotation.y == 0) {

                if (sofas[l].name == sofa.single.name || sofas[l].name == sofa.cornerR.name) {

               
                        leftIndexHorizontal = leftIndexs[leftIndexs.length-1];
                    


                }
               
            }
        }
    });
  

    leftIndexs.forEach(function (l) {
        if (sofas.includes(sofas[l])) {
            if (sofas[l].name == sofa.single.name) {
                if (sofas[l].rotation.y == 0) {
                   
                        leftIndex = leftIndexs[leftIndexs.length-1];
                    


                }
            }
        }
    });

    rightIndexs.forEach(function (l) {
        if (sofas.includes(sofas[l])) {
            if (sofas[l].name == sofa.single.name) {
                if (sofas[l].rotation.y == 0) {
                    
                        rightIndex = rightIndexs[rightIndexs.length-1];
                    


                }
            }
        }
    });





    for (let i in sofas) {
        if (hSingleCount > 0) {

            if (( sofas[i].rotation.y == 0) && sofas[i].name != sofa.chaiseL.name && sofas[i].name != sofa.ottoman.name && sofas[i].name != sofa.chaiseR.name) {


                //Horizontal Sofa
                var dist = sofas[i].position.x - sofas[leftIndexHorizontal].position.x;

                if (dist >= 0) {

                    if (!d.includes(dist.toFixed(1))) {
                        d.push({
                            "id": i,
                            "dist": dist.toFixed(1)
                        });
                    }

                    d = sortByKey(d, "dist")



                }
            }
               //LeftVertical
        if (leftverticalSingleCount > 0) {

            var cdistL = sofas[i].position.z - sofas[leftHorizontalIndex].position.z;

            if (cdistL > 0 && cdistL < 1) {

                leftIndexVertical = sofas.indexOf(sofas[i]);
            }
            if (sofas[i].name == sofa.single.name && sofas[i].rotation.y > 0) {

                var dist = sofas[i].position.z - sofas[leftIndexVertical].position.z;
                if (dist.toFixed(1) >= 0) {

                    if (!leftV.includes(dist.toFixed(1))) {
                        leftV.push({
                            "id": i,
                            "dist": dist.toFixed(1)
                        });
                    }

                    leftV = sortByKey(leftV, "dist")



                }
            }

        }
        //RightVertical
        if (rightverticalSingleCount > 0) {

            var cdistR = sofas[i].position.z - sofas[leftHorizontalIndex].position.z;

            if (cdistR > 0 && cdistR < 1) {

                rightIndexVertical = sofas.indexOf(sofas[i]);
            }
            if (sofas[i].name == sofa.single.name && sofas[i].rotation.y < 0) {

                var dist = sofas[i].position.z - sofas[rightIndexVertical].position.z;
                if (dist.toFixed(1) >= 0) {

                    if (!rightV.includes(dist.toFixed(1))) {
                        rightV.push({
                            "id": i,
                            "dist": dist.toFixed(1)
                        });
                    }

                    rightV = sortByKey(rightV, "dist")



                }
            }

        }
        }

     
    }


    for (let i in d) {
        if (d.length > 1) {
            if (d.length % 2 == 0) {
                if (i % 2 == 0) {


                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, false, true, false, false)
                    // SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, false, true, false, false)
                    if (i == 0) {
                       
                        
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, !armrests[0].visible, false, false)
                    } else {
                      
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, true, false, false)
                    }



                } else {
                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, true, false, false, false)

                    if (i == d.length - 1) {

                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, !armrests[1].visible, false, false, false)
                    } else {
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, true, false, false, false)
                    }




                }
            } else {
                if (i % 2 == 0) {


                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, false, true, false, false)
                    if (i == 0) {
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, !armrests[0].visible, false, false)
                    } else {
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, true, false, false)
                    }


                } else {
                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, true, false, false, false)

                }
                if (i == d.length - 1) {
                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, !armrests[1].visible, false, false, false)


                } else if (i == d.length - 2) {
                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, false, true, false)

                } else if (i == d.length - 3) {

                    SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, false, true, false, false)
                    if (i == 0) {
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, !armrests[0].visible, false, false)
                    } else {
                        SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, false, true, false, false)
                    }
                }


            }
        } else {

            SetSofaChildVisiblity(sofas[d[i].id], "Seat", sofaType, false, false, false, true)
            SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, false, false, true)
            SetSofaChildVisiblity(sofas[d[i].id], "Bottom", sofaType, false, false, false, true)
            SetSofaChildVisiblity(sofas[d[i].id], "Legs", sofaType, !armrests[1].visible, !armrests[0].visible, false, false)
            

        }
        if(sofaType==2){
            if(d.length>1){
                if(i==0){

                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, !armrests[0].visible, false, false,false,armrests[0].visible)
                }
                if(i==d.length-1){
                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, !armrests[1].visible, false, false, false,armrests[1].visible,false)
                }
            }else{
                if(i==0){

                    SetSofaChildVisiblity(sofas[d[i].id], "Back", sofaType, false, false, false, armrests[1].visible||armrests[0].visible,false,false)
                }
              
            }
           
            
        }
        var armSize = getChildfromSofa(armrests[3], "Armrest", sofaType).size;
        if(isSideArmrestsAddedLeft||isSideArmrestsAddedRight){
            sofas[d[i].id].position.setZ(-armSize.x);
            armrests[2].position.setZ(-armSize.x);
            armrests[3].position.setZ(-armSize.x);
        }else{
            sofas[d[i].id].position.setZ(0);
            armrests[3].position.setZ(0);
            armrests[2].position.setZ(0);
        }
        
        var sofaSize = getChildfromSofa(sofas[d[0].id], "Seat", sofaType).size;
      
        armrests[3].position.setX(sofas[d[d.length - 1].id].position.x+sofaSize.x/2);

        armrests[2].position.setX(sofas[d[0].id].position.x-sofaSize.x/2);
       
    }



    for (let i in leftV) {
        if (leftV.length > 1) {
            if (leftV.length % 2 == 0) {
                if (i % 2 == 0) {

                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, true, false, false, false,false,false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, true, false, false, false)
                    
                    if (i == 0) {
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType,  !armrests[5].visible, false, false, false)
                    }else{
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, true, false, false, false)
                    }
                } else {
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, false, true, false, false)
                    if(sofaType == 2){
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, false, false,false,true)
                    }else{
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, true, false, false)
                    }
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, false, true, false, false)
                    if (i == leftV.length - 1) {
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, false, !armrests[0].visible, false, false)
                    } else {
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, false, true, false, false)
                    }


                }
            } else {
                if (i % 2 == 0) {

                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, true, false, false, false,false,false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, true, false, false, false)
                    if (i == 0) {
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType,  !armrests[5].visible, false, false, false)
                    }else{
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, true, false, false, false)
                    }

                } else {
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, false, true, false, false)
                    if(sofaType == 2){
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, false, false,false,true)
                    }else{
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, true, false, false)
                    }
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, false, true, false, false)

                }
                if (i == leftV.length - 1) {
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, false, true, false, false)
                    if(sofaType == 2){
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, false, false,false,true)
                    }else{
                        SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, true, false, false)
                    }
                    
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, false, !armrests[0].visible, false, false)

                } else if (i == leftV.length - 2) {
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, true, false,false,false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, false, false, false, false)

                } else if (i == leftV.length - 3) {
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, true, false, false, false,false,false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, true, false, false, false)
                }
            }
        } else {

            SetSofaChildVisiblity(sofas[leftV[i].id], "Seat", sofaType, false, false, false, true)
            if(sofaType == 2){
                if(isSideArmrestsAddedLeft){
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, false, true,false,false)
                }else{
                    SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, false, false,false,true)
                }
                
            }else{
                SetSofaChildVisiblity(sofas[leftV[i].id], "Back", sofaType, false, false, false, true)
            }
            
            SetSofaChildVisiblity(sofas[leftV[i].id], "Bottom", sofaType, false, false, false, true)
            SetSofaChildVisiblity(sofas[leftV[i].id], "Legs", sofaType, !armrests[5].visible, !armrests[0].visible, false, false)
        }
      
        var sofaSize = getChildfromSofa(sofas[leftV[0].id], "Seat", sofaType).size;
        var armSize = getChildfromSofa(armrests[5],"Armrest",sofaType).size;

        if(isSideArmrestsAddedLeft){
            var pos = sofas[d[0].id].position.x-armSize.x;         
        }else{      
            var pos = sofas[d[0].id].position.x;
        }
        sofas[leftV[i].id].position.setX(pos)
        armrests[5].rotation.y = Math.PI / 2;
        armrests[5].position.setZ(sofas[leftV[0].id].position.z - sofaSize.z / 2 );
        armrests[5].position.setX(sofas[leftV[0].id].position.x);

    }
    for (let i in rightV) {
        if (rightV.length > 1) {
            if (rightV.length % 2 == 0) {
                if (i % 2 == 0) {

                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, false, true, false, false)
                    
                    if (i == 0) {
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, false, !armrests[4].visible, false, false)
                    }else{
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, false, true, false, false)
                    }
                } else {
                    
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, true, false, false, false)
                    if(sofaType == 2){
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, false, false, false,true,false)
                    }else{
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, true, false, false, false)
                    }
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, true, false, false, false)

                    if (i == rightV.length - 1) {
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, !armrests[1].visible, false, false, false)
                    } else {
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, true, false, false, false)
                    }
                }
            } else {
                if (i % 2 == 0) {

                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, false, true, false, false)
                    if (i == 0) {
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, false, !armrests[4].visible, false, false)
                    }else{
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, false, true, false, false)
                    }
                } else {
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, true, false, false, false)

                }
                if (i == rightV.length - 1) {
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, true, false, false, false)
                    if(sofaType == 2){
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, false, false, false,true,false)
                    }else{
                        SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, true, false, false, false)
                    }
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, true, false, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, !armrests[1].visible, false, false, false)

                } else if (i == rightV.length - 2) {
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, false, false, true, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, false, false, false, false)
                } else if (i == rightV.length - 3) {
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, false, true, false, false)
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, false, true, false, false)

                }

            }
        } else {

            SetSofaChildVisiblity(sofas[rightV[i].id], "Seat", sofaType, false, false, false, true)
            
            if(sofaType == 2){
                if(isSideArmrestsAddedRight){
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, false, false, true,false,false)
                }else{
                    SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, false, false, false,true,false)
                }
                
            }else{
                SetSofaChildVisiblity(sofas[rightV[i].id], "Back", sofaType, false, false, false, true)
            }
            SetSofaChildVisiblity(sofas[rightV[i].id], "Bottom", sofaType, false, false, false, true)
            SetSofaChildVisiblity(sofas[rightV[i].id], "Legs", sofaType, !armrests[1].visible, !armrests[4].visible, false, false)
        }

      
        var sofaSize = getChildfromSofa(sofas[rightV[0].id], "Seat", sofaType).size;
        var armSize = getChildfromSofa(armrests[4],"Armrest",sofaType).size;

        if(isSideArmrestsAddedRight){
            var pos = sofas[d[d.length-1].id].position.x+armSize.x;         
        }else{      
            var pos = sofas[d[d.length-1].id].position.x;
        }
        sofas[rightV[i].id].position.setX(pos)
        armrests[4].rotation.y = -Math.PI / 2;
        armrests[4].position.setZ(sofas[rightV[0].id].position.z - sofaSize.z/2);
        armrests[4].position.setX(sofas[rightV[0].id].position.x);
        
      
   
    
    }

   if(armrests.length>0){
    armrests[2].visible = isSideArmrestsAddedLeft || isSideArmrestsAddedRight;
    armrests[3].visible = isSideArmrestsAddedLeft || isSideArmrestsAddedRight;

    
    armrests[5].visible = isSideArmrestsAddedLeft;
    armrests[4].visible = isSideArmrestsAddedRight;

    
   }
   
  
}

function getActualSize(obj, type) {
    var size;
    for (let i in obj.children) {
        if (i == sofaType) {
            var parent = obj.children[i];
            for (let j in parent.children) {





                if (type != null) {
                    if (parent.children[j].name.includes(type)) {
                        size = new THREE.Box3()
                            .setFromObject(parent.children[j])
                            .getSize(new THREE.Vector3());
                    }
                } else {
                    size = new THREE.Box3()
                        .setFromObject(parent.children[j])
                        .getSize(new THREE.Vector3());
                }

            }

        }

    }
    return size;
}


function addArmrest() {
    if (sofa.armrestL && sofa.armrestR) {




        for (var i = 0; i < 3; i++) {

            armrests.push(sofa.armrestL.clone());


            armrests.push(sofa.armrestR.clone());

        }
        for (var i = 0; i < 3; i++) {

            i_armrests.push(createTexturePlane(icons.armrest));



            i_armrests.push(createTexturePlane(icons.armrest));

        }
        armrests.forEach((e) => {
            if (e instanceof THREE.Object3D) {
                scene.add(e);
                e.visible = false;
            }
        });
        i_armrests.forEach((e) => {
            if (e instanceof THREE.Object3D) {
                dimensionScene.add(e);
                e.visible = false;
            }
        });
    }
}

function updateArmrests(index1, index2) {

    if (sofas.length > 0) {
        var a, b;
        var bkSize = getChildfromSofa(sofa.single, "Back", sofaType).size;
        a = b = getChildfromSofa(sofa.single, "Seat", sofaType).size;


        var armrestSizeL = getChildfromSofa(sofa.armrestL, "Armrest", sofaType).size
        var armrestSizeR = getChildfromSofa(sofa.armrestR, "Armrest", sofaType).size

        if (armrests.length > 0) {
            i_armrests[0].scale.set(armrestSizeL.x, armrestSizeL.z)
            i_armrests[1].scale.set(armrestSizeR.x, armrestSizeR.z)
            if (sofas[index1] instanceof THREE.Object3D) {
                if (sofas[index1].rotation.y > 0) {
                    armrests[0].visible = true;

                    armrests[0].rotation.y = Math.PI / 2;

                    armrests[0].position.setZ(sofas[index1].position.z + a.x / 2);
                    armrests[0].position.setX(sofas[index1].position.x);

                    i_armrests[0].rotation.z = Math.PI / 2;

                    i_armrests[0].position.setX(armrests[0].position.x - 3 / 12 * ftTom);
                    i_armrests[0].position.setZ(armrests[0].position.z + armrestSizeL.x / 2);
                } else {
                    // armrests[0].visible = true;
                    armrests[0].rotation.y = 0;

                    armrests[0].position.setX(sofas[index1].position.x - a.x / 2);
                    armrests[0].position.setZ(sofas[index1].position.z);

                    i_armrests[0].rotation.z = 0;
                    i_armrests[0].position.setX(armrests[0].position.x - armrestSizeL.x / 2);
                    i_armrests[0].position.setZ(armrests[0].position.z - 3 / 12 * ftTom);
                    // armrests[0].position.setZ(0.3)
                }

            }
        }
        if (sofas[index2] instanceof THREE.Object3D) {

            if (sofas[index2].rotation.y < 0) {
                armrests[1].visible = true;

                armrests[1].rotation.y = -Math.PI / 2;

                armrests[1].position.setZ(sofas[index2].position.z + b.x / 2);
                armrests[1].position.setX(
                    sofas[index2].position.x
                );

                i_armrests[1].rotation.z = -Math.PI / 2;

                i_armrests[1].position.setX(armrests[1].position.x + 3 / 12 * ftTom);
                i_armrests[1].position.setZ(armrests[1].position.z + armrestSizeR.x / 2);
            } else {
                // armrests[1].visible = true;
                armrests[1].rotation.y = 0;

                armrests[1].position.setX(sofas[index2].position.x + b.x / 2);
                armrests[1].position.setZ(sofas[index2].position.z);


                i_armrests[1].rotation.z = 0;
                i_armrests[1].position.setX(armrests[1].position.x + armrestSizeR.x / 2);
                i_armrests[1].position.setZ(armrests[1].position.z - 3 / 12 * ftTom);
            }

            // sofas[index1].position.setY(armrests[0].position.y);
            // sofas[index2].position.setY(armrests[1].position.y)
        }

        i_armrests[0].visible = armrests[0].visible;
        i_armrests[1].visible = armrests[1].visible;
    }
}

function addChaise(index) {
    if (sofa.chaiseL && sofa.chaiseR) {
        if (index != null) {

            var sofaSize = getActualSize(sofa.single, "Seat");

            var armSize = getActualSize(sofa.chaiseL, "Armrest");

            var chaiseSofaSize = getActualSize(sofa.chaiseL, "Seat");


            if (isLeft) {
                var s = sofa.chaiseR.clone();
                var p = createTexturePlane(icons.chaiseR);

                var sSize = new THREE.Box3()

                    .setFromObject(s)
                    .getSize(new THREE.Vector3());
                scene.add(s);
                dimensionScene.add(p);

                s.position.setX(sofas[index].position.x - sofaSize.x - chaiseSofaSize.x / 10);

                p.scale.set(sSize.x, sSize.z);
                p.position.setX(i_sofas[index].position.x - 2 * ftTom - 3 / 12 * ftTom);
                p.position.setZ(i_sofas[index].position.z + ftTom);

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }

                if (!i_sofas.includes(p)) {
                    i_sofas.push(p);
                }
                armrests[0].visible = false;
                lasthSingleCount += 1;
                totalPrice+=200;
            }
            if (isRight) {
                var s = sofa.chaiseL.clone();
                var p = createTexturePlane(icons.chaiseL);

                var sSize = new THREE.Box3()

                    .setFromObject(s)
                    .getSize(new THREE.Vector3());
                scene.add(s);
                dimensionScene.add(p);

                s.position.setX(sofas[index].position.x + sofaSize.x + chaiseSofaSize.x / 10);


                p.scale.set(sSize.x, sSize.z);
                p.position.setX(i_sofas[index].position.x + 2 * ftTom + 3 / 12 * ftTom);
                p.position.setZ(i_sofas[index].position.z + ftTom);

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }

                if (!i_sofas.includes(p)) {
                    i_sofas.push(p);
                }
                armrests[1].visible = false;
                lasthSingleCount -= 1;
                totalPrice+=200;
            }

        }
    }
}

function addCorner(index) {
    if (sofa.cornerL && sofa.cornerR) {
        if (index != null) {
            var sofaSize = getActualSize(sofa.single, "Seat");

            
            if (isLeft) {
                var s = sofa.cornerR.clone();
                var p = createTexturePlane(icons.cornerR);

                var sSize = new THREE.Box3()
                    .setFromObject(s)
                    .getSize(new THREE.Vector3());
                scene.add(s);
                dimensionScene.add(p);

                s.position.setX(sofas[index].position.x - sofaSize.x);

                p.scale.set(sSize.x, sSize.z);
                p.position.setX(i_sofas[index].position.x - 2 * ftTom - 3 / 12 * ftTom);
                p.position.setZ(i_sofas[index].position.z);
                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                if (!i_sofas.includes(p)) {
                    i_sofas.push(p);
                }
                armrests[0].visible = false;
                lasthSingleCount += 1;
                totalPrice+=100;
            }
            if (isRight) {
                var s = sofa.cornerL.clone();
                var p = createTexturePlane(icons.cornerL);
                scene.add(s);
                dimensionScene.add(p);

                var sSize = new THREE.Box3()
                    .setFromObject(s)
                    .getSize(new THREE.Vector3());

                s.position.setX(sofas[index].position.x + sofaSize.x);
                p.scale.set(sSize.x, sSize.z);
                p.position.setX(i_sofas[index].position.x + 2 * ftTom + 3 / 12 * ftTom);
                p.position.setZ(i_sofas[index].position.z);
                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                if (!i_sofas.includes(p)) {
                    i_sofas.push(p);
                }
                armrests[1].visible = false;
                lasthSingleCount -= 1;
                totalPrice+=100;
            }
        }
    }
}

function addOttoman(index) {
    if (sofa.ottoman) {
        if (index != null) {
            var s = sofa.ottoman.clone();
            var p = createTexturePlane(icons.ottoman);

            var sofaSize;
            if (
                sofas[index].name == sofa.chaiseL.name ||
                sofas[index].name == sofa.chaiseR.name
            ) {
                sofaSize = getActualSize(sofa.chaiseL, "Seat");

            } else if (sofas[index].name == sofa.ottoman.name) {
                sofaSize = getActualSize(sofa.ottoman, "Seat");
            }
            //0 - Pillow
            //1 - Legs
            //2 - Seat
            //3 - Bottom
            //4 - Armrest
            //5 - Back

            var sSize = new THREE.Box3()
                .setFromObject(s.children[0])
                .getSize(new THREE.Vector3());

            if (isLeft) {

                scene.add(s);
                dimensionScene.add(p);
                s.position.setX(sofas[index].position.x);
                s.position.setZ(sofas[index].position.z + sofaSize.z + 6 / 12 * ftTom);

                p.scale.set(2.5 * ftTom, 2 * ftTom);
                p.position.setX(i_sofas[index].position.x)

                p.position.setZ(s.position.z)

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }

                if (!i_sofas.includes(p)) {
                    i_sofas.push(p);
                }
                lasthSingleCount += 1;
                totalPrice+=100;
            }
            if (isRight) {
                scene.add(s);
                dimensionScene.add(p);
                s.position.setX(sofas[index].position.x);
                s.position.setZ(sofas[index].position.z + sofaSize.z + 6 / 12 * ftTom);

                p.scale.set(2.5 * ftTom, 2 * ftTom);
                p.position.setX(i_sofas[index].position.x)

                p.position.setZ(s.position.z)

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }

                if (!i_sofas.includes(p)) {
                    i_sofas.push(p);
                }
                lasthSingleCount += 1;
                totalPrice+=100;
            }
        }
    }
}

function getLoading(value) {
    loading += value;
}

function loadAsync(url) {

    return new Promise((resolve) => {
        new THREE.GLTFLoader(manager).load(url, resolve);
    });

}

function loadSofa() {

    let p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16;

    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        $("#loadingText").html("Please Wait...");
        controls.enabled = false;
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        $("#progressText").html((itemsLoaded / itemsTotal * 100).toFixed() + '%')
        $("#progressbar").css("width", (itemsLoaded / itemsTotal * 100).toFixed() + "%");

    };
    manager.onLoad = function () {
        $("#loadingScreen").addClass("d-none")
        controls.enabled = true;
    };



    p1 = loadAsync("models/sofas/sofa/components/single.gltf").then((result) => {
        sofa.single = result.scene.children[0];
    });
    p2 = loadAsync("models/sofas/sofa/components/armrestL.gltf").then(
        (result) => {
            sofa.armrestL = result.scene.children[0];
        }
    );
    p3 = loadAsync("models/sofas/sofa/components/armrestR.gltf").then(
        (result) => {
            sofa.armrestR = result.scene.children[0];
        }
    );
    p4 = loadAsync("models/sofas/sofa/components/chaise.gltf").then((result) => {
        sofa.chaise = result.scene.children[0];
    });
    p5 = loadAsync("models/sofas/sofa/components/chaiseL.gltf").then((result) => {
        sofa.chaiseL = result.scene.children[0];
    });
    p6 = loadAsync("models/sofas/sofa/components/chaiseR.gltf").then((result) => {
        sofa.chaiseR = result.scene.children[0];
    });
    p7 = loadAsync("models/sofas/sofa/components/cornerL.gltf").then((result) => {
        sofa.cornerL = result.scene.children[0];
    });
    p8 = loadAsync("models/sofas/sofa/components/cornerR.gltf").then((result) => {
        sofa.cornerR = result.scene.children[0];
    });
    p9 = loadAsync("models/sofas/sofa/components/ottoman.gltf").then((result) => {
        sofa.ottoman = result.scene.children[0];
    });

    p10 = loadAsync("models/sofas/sofa/components/singleback.gltf").then(
        (result) => {
            sofa.singleback = result.scene.children[0];
        }
    );
    p11 = loadAsync("models/sofas/sofa/components/singlebackL.gltf").then(
        (result) => {
            sofa.singlebackL = result.scene.children[0];
        }
    );
    p12 = loadAsync("models/sofas/sofa/components/singlebackR.gltf").then(
        (result) => {
            sofa.singlebackR = result.scene.children[0];
        }
    );
    p13 = loadAsync("models/sofas/sofa/components/bottom.gltf").then((result) => {
        sofa.bottom = result.scene.children[0];
    });
    p14 = loadAsync("models/sofas/sofa/components/bottomL.gltf").then(
        (result) => {
            sofa.bottomL = result.scene.children[0];
        }
    );
    p15 = loadAsync("models/sofas/sofa/components/bottomR.gltf").then(
        (result) => {
            sofa.bottomR = result.scene.children[0];
        }
    );
    p16 = loadAsync("models/sofas/sofa/components/leg.gltf").then((result) => {
        sofa.leg = result.scene.children[0];
    });

    Promise.all([
        p1,
        p2,
        p3,
        p4,
        p5,
        p6,
        p7,
        p8,
        p9,
        p10,
        p11,
        p12,
        p13,
        p14,
        p15,
        p16,
    ]).then(() => {
        setSofa(sofa.single);
        setSofa(sofa.armrestL);
        setSofa(sofa.armrestR);
        setSofa(sofa.chaise);
        setSofa(sofa.chaiseL);
        setSofa(sofa.chaiseR);
        setSofa(sofa.cornerL);
        setSofa(sofa.cornerR);
        setSofa(sofa.ottoman);
        setSofa(sofa.singleback);
        setSofa(sofa.singlebackL);
        setSofa(sofa.singlebackR);
        setSofa(sofa.bottom);
        setSofa(sofa.bottomL);
        setSofa(sofa.bottomR);
        setSofa(sofa.leg);


        addSingle();

        hSingleCount += 1;
        addButton();



    });
}

function setLeg(index) {}

function setSofa(objA) {
    // objA.scale.set(0.01, 0.01, 0.01);

    objA.traverse(function (e) {
        if (e instanceof THREE.Mesh) {
            e.geometry.normalizeNormals();
            e.castShadow = true;
            e.receiveShadow = true;

            // e.material.wireframe = true;

            // if (e.name.includes("Leg")) {
            //     var legSize = new THREE.Box3().setFromObject(e).getSize(new THREE.Vector3());

            //     objA.position.set(0, objA.scale.y / 2 + legSize.y / 100, 0)
            //     e.material.color.set("#59371E")
            // } else {
            //     e.material.color.set("#f0f0f0");
            // }
            // e.material.side = THREE.DoubleSide;
            e.material.metalness = 0;
            e.material.map = null;
            e.material.roughness = 1;

            e.material.normalMap = null;
        }
    });
}

function createNullGroup(name, pos) {
    var nullObject = new THREE.Object3D();
    // var axis = new THREE.AxesHelper(0.4);
    // nullObject.add(axis);
    null_group.add(nullObject);

    nullObject.scale.set(0.5, 0.5, 0.5);
    nullObject.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    nullObject.position.setY(0.01);
    nullObject.position.setX(pos);
    nullObject.name = name;
    scene.add(null_group);
}

function createAddButton(name, pos) {
    var g = new THREE.PlaneGeometry(1, 1);
    var m = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: btnPlus,
        alphaMap: btnPlus,
        transparent: true,
    });
    const btn = new THREE.Mesh(g, m);
    add_btn_group.add(btn);

    btn.scale.set(0.25, 0.25, 0.25);
    btn.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    btn.position.setY(0.01);
    btn.position.setX(pos);
    btn.position.setZ(0.25);
    btn.name = name;
    scene.add(add_btn_group);
}

function createRemoveButton(name, pos) {
    var g = new THREE.PlaneGeometry(1, 1);
    var m = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: btnMinus,
        alphaMap: btnMinus,
        transparent: true,
    });
    const btn = new THREE.Mesh(g, m);
    remove_btn_group.add(btn);

    btn.scale.set(0.245, 0.245, 0.245);
    btn.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    btn.position.setY(0.01);
    btn.position.setX(pos);
    btn.position.setZ(-0.25);
    btn.name = name;
    scene.add(remove_btn_group);
}

function updateButtons(index1, index2) {
    if (
        add_btn_group.children[0] ||
        (add_btn_group.children[1] && remove_btn_group.children[0]) ||
        remove_btn_group.children[1]
    ) {
        var obj1 = add_btn_group.children[0];
        var obj2 = add_btn_group.children[1];
        var obj3 = remove_btn_group.children[0];
        var obj4 = remove_btn_group.children[1];
        var null0 = null_group.children[0];
        var null1 = null_group.children[1];
        var sofaSize;
        var totalHorizontal = hSingleCount + currentCornerCount + currentChaiseCount;

        if (sofas[index1] instanceof THREE.Object3D) {
            //Left Corner

            if (
                sofas[index1].name == sofa.cornerR.name ||
                sofas[index1].name == sofa.chaiseR.name
            ) {
                if (sofas[index1].name == sofa.cornerR.name) {
                    sofaSize = getActualSize(sofa.cornerR, "Seat");
                } else {
                    sofaSize = getActualSize(sofa.chaiseR, "Seat");
                }



                obj1.position.x = sofas[index1].position.x - 0.1;
                obj1.position.z = sofas[index1].position.z + sofaSize.z + 0.15;

                null0.position.x = obj1.position.x;
                null0.position.z = obj1.position.z;

                obj3.position.x = obj1.position.x + 0.25;
                obj3.position.z = obj1.position.z;
            }
            //Left Vertical
            else if (sofas[index1].rotation.y > 0) {
                sofaSize = getActualSize(sofas[index1], "Seat");

                obj1.position.x = sofas[index1].position.x - 0.1;
                obj1.position.z = sofas[index1].position.z + sofaSize.z + 0.25;

                null0.position.x = obj1.position.x;
                null0.position.z = obj1.position.z;

                obj3.position.x = obj1.position.x + 0.25;
                obj3.position.z = obj1.position.z;
            }
            //Ottoman
            else if (sofas[index1].name == sofa.ottoman.name) {
                sofaSize = getActualSize(sofas[index1], "Seat");

                obj1.position.x = sofas[index1].position.x - 0.1;
                obj1.position.z = sofas[index1].position.z + sofaSize.z;

                null0.position.x = obj1.position.x;
                null0.position.z = obj1.position.z;

                obj3.position.x = obj1.position.x + 0.25;
                obj3.position.z = obj1.position.z;
            }
            //Left Single 
            else if (sofas[index1].rotation.y == 0) {
                sofaSize = getActualSize(sofas[index1], "Seat");
                if (totalHorizontal == 8) {

                    obj1.position.x = sofas[index1].position.x - 0.1;
                    obj1.position.z = sofas[index1].position.z + sofaSize.z + 0.25;

                    null0.position.x = obj1.position.x;
                    null0.position.z = obj1.position.z;

                    obj3.position.x = obj1.position.x + 0.25;
                    obj3.position.z = obj1.position.z;
                } else {

                    obj1.position.x = sofas[index1].position.x - sofaSize.x - obj1.scale.x;
                    obj1.position.z = sofas[index1].position.z + 0.1;
                    null0.position.x = obj1.position.x;
                    null0.position.z = obj1.position.z;
                    obj3.position.x = obj1.position.x;
                    obj3.position.z = obj1.position.z - 0.25;
                }

            }
        }
        if (sofas[index2] instanceof THREE.Object3D) {
            //Right Vertical
            if (sofas[index2].rotation.y < 0) {
                sofaSize = getActualSize(sofas[index2], "Seat");

                obj2.position.x = sofas[index2].position.x + 0.1;
                obj2.position.z = sofas[index2].position.z + sofaSize.z + 0.25;
                null1.position.x = obj2.position.x;
                null1.position.z = obj2.position.z;
                obj4.position.x = obj2.position.x + 0.25;
                obj4.position.z = obj2.position.z;
            }
            //Ottoman
            else if (sofas[index2].name == sofa.ottoman.name) {
                sofaSize = getActualSize(sofas[index2], "Seat");

                obj2.position.x = sofas[index2].position.x + 0.1;
                obj2.position.z = sofas[index2].position.z + sofaSize.z;
                null1.position.x = obj2.position.x;
                null1.position.z = obj2.position.z;
                obj4.position.x = obj2.position.x + 0.25;
                obj4.position.z = obj2.position.z;
            }
            //CornerRight
            else if (
                sofas[index2].name == sofa.cornerL.name ||
                sofas[index2].name == sofa.chaiseL.name
            ) {
                if (sofas[index2].name == sofa.cornerL.name) {
                    sofaSize = getActualSize(sofa.cornerL, "Seat");
                } else {

                    sofaSize = getActualSize(sofa.chaiseL, "Seat");
                }



                obj2.position.x = sofas[index2].position.x + 0.1;
                obj2.position.z = sofas[index2].position.z + sofaSize.z + 0.15;
                null1.position.x = obj2.position.x;
                null1.position.z = obj2.position.z;
                obj4.position.x = obj2.position.x + 0.25;
                obj4.position.z = obj2.position.z;
            }
            //Right Single
            else if (sofas[index2].rotation.y == 0) {
                sofaSize = getActualSize(sofas[index2], "Seat");

                if (totalHorizontal == 8) {

                    obj2.position.x = sofas[index2].position.x + 0.1;
                    obj2.position.z = sofas[index2].position.z + sofaSize.z + 0.25;
                    null1.position.x = obj2.position.x;
                    null1.position.z = obj2.position.z;
                    obj4.position.x = obj2.position.x + 0.25;
                    obj4.position.z = obj2.position.z;
                } else {
                    obj2.position.x = sofas[index2].position.x + sofaSize.x + obj2.scale.x;
                    obj2.position.z = sofas[index2].position.z + 0.1;
                    null1.position.x = obj2.position.x;
                    null1.position.z = obj2.position.z;
                    obj4.position.x = obj2.position.x;
                    obj4.position.z = obj2.position.z - 0.25;
                }

            }
        }


    }
}

function updateButton(obj, index) {
    // var cornerSize = new THREE.Box3().setFromObject(sofas[leftIndex]).getSize(new THREE.Vector3());
    var armrestSize = new THREE.Box3()
        .setFromObject(sofa.armrestL)
        .getSize(new THREE.Vector3());

    if (obj == add_btn_group.children[0]) {
        var sofaSize = getActualSize(sofas[index], "Seat");
        var r0 = remove_btn_group.children[0];
        obj.position.x =
            sofas[index].position.x - sofaSize.x - obj.scale.x - armrestSize.x * 2;

        null_group.children[0].position.x = obj.position.x;
        r0.position.x = obj.position.x;
    }
    if (obj == remove_btn_group.children[0]) {
        var sofaSize = getActualSize(sofas[index], "Seat");

        var r0 = add_btn_group.children[0];
        obj.position.setX(
            sofas[index].position.x - sofaSize.x / 4 - obj.scale.x - armrestSize.x * 2
        );

        r0.position.x = obj.position.x;
        null_group.children[0].position.x = r0.position.x;
    }

    if (obj == add_btn_group.children[1]) {
        var sofaSize = getActualSize(sofas[index], "Seat");
        var r1 = remove_btn_group.children[1];
        obj.position.x =
            sofas[index].position.x + sofaSize.x + obj.scale.x + armrestSize.x * 2;
        null_group.children[1].position.x = obj.position.x;
        r1.position.x = obj.position.x;
    }
    if (obj == remove_btn_group.children[1]) {
        var sofaSize = getActualSize(sofas[index], "Seat");
        var r1 = add_btn_group.children[1];
        obj.position.x =
            sofas[index].position.x +
            sofaSize.x / 4 +
            obj.scale.x +
            armrestSize.x * 2;

        r1.position.x = obj.position.x;
        null_group.children[1].position.x = r1.position.x;
    }
}

function removeButton() {
    add_btn_group.traverse(function (e) {
        add_btn_group.remove(e);
    });
}



function getChildfromSofa(obj, name, type) {
    var object, size;
    if (obj instanceof THREE.Object3D) {
        for (let i in obj.children) {
            if (type != null) {
                if (i == type) {
                    var parent = obj.children[i];
                    for (let j in parent.children) {
                        var child = parent.children[j];
                        if (name != null) {
                            if (child.name.includes(name)) {
                                object = child;
                                size = new THREE.Box3().setFromObject(child).getSize(new THREE.Vector3());
                            }
                        }

                    }
                }
            } else {

                if (i == sofaType) {
                    var parent = obj.children[i];
                    for (let j in parent.children) {
                        var child = parent.children[j];
                        if (name != null) {
                            if (child.name.includes(name)) {
                                object = child;
                                size = new THREE.Box3().setFromObject(child).getSize(new THREE.Vector3());
                            }
                        }

                    }
                }
            }

        }
        return {
            object,
            size
        };
    }

}

function adjustHeight() {
    if (sofas.length > 0) {
        sofas.forEach(e => {

            if (e.name != sofa.ottoman.name) {
                var seat = getChildfromSofa(e, "Seat").object;
                var seatSize = getChildfromSofa(e, "Seat").size;
                var backSize = getChildfromSofa(e, "Back").size;
                var bottomSize = getChildfromSofa(e, "Bottom").size;

                armrests.forEach((a) => {

                    var armSize = getChildfromSofa(a, "Armrest").size;

                    if (a instanceof THREE.Object3D) {
                        if (sofaType < 4) {

                            getChildfromSofa(a, "Armrest").object.scale.setY((((sHeight * 1.25) * ftTom * getChildfromSofa(a, "Armrest").object.scale.y / armSize.y).toFixed(2)))
                            if (sofaType == 2) {
                                getChildfromSofa(a, "holder").object.position.setY(a.position.y + getChildfromSofa(a, "Armrest").size.y - 0.01)
                            }
                        } else {
                            var legSize = getChildfromSofa(a, "Legs").size;
                            getChildfromSofa(a, "Legs").object.scale.setY(((((sHeight - 3 / 12) * ftTom * getChildfromSofa(a, "Legs").object.scale.y / legSize.y).toFixed(2))))
                            getChildfromSofa(a, "Armrest").object.position.setY(seat.position.y);
                            // getChildfromSofa(a,"Armrest").object.scale.setY((((sHeight) * ftTom *getChildfromSofa(a,"Armrest").object.scale.y  / armSize.y).toFixed(2)))
                        }

                    }
                });

                if (sofaType < 3) {
                    seat.position.setY(sHeight * ftTom - seatSize.y);

                    getChildfromSofa(e, "Bottom").object.scale.setY(((((sHeight - 5 / 12) * ftTom * getChildfromSofa(e, "Bottom").object.scale.y / bottomSize.y).toFixed(2))));

                    getChildfromSofa(e, "Back").object.scale.setY(((((sHeight * 1.8) * ftTom * getChildfromSofa(e, "Back").object.scale.y / backSize.y).toFixed(2))))

                } else if (sofaType == 3) {

                    seat.scale.setY(sHeight * ftTom * seat.scale.y / seatSize.y)
                    getChildfromSofa(e, "Pillow").object.position.setY(seat.position.y + seatSize.y - 1.5 * ftTom / 12);
                    getChildfromSofa(e, "Back").object.scale.setY(((((sHeight * 1.5) * ftTom * getChildfromSofa(e, "Back").object.scale.y / backSize.y).toFixed(2))))

                } else if (sofaType == 4) {
                    var legSize = getChildfromSofa(e, "Legs").size;
                    seat.position.setY(sHeight * ftTom - seatSize.y);
                    getChildfromSofa(e, "Back").object.position.setY(seat.position.y)
                    getChildfromSofa(e, "Back").object.scale.setY(((((sHeight * 1.5) * ftTom * getChildfromSofa(e, "Back").object.scale.y / backSize.y).toFixed(2))))
                    getChildfromSofa(e, "Legs").object.scale.setY(((((sHeight - 3 / 12) * ftTom * getChildfromSofa(e, "Legs").object.scale.y / legSize.y).toFixed(2))))
                }

                if (sofaType < 3) {
                    getChildfromSofa(e, "Pillow").object.position.setY(seat.position.y + seatSize.y);
                }

                if (e.name == sofa.chaiseL.name || e.name == sofa.chaiseR.name) {
                    var armSize = getChildfromSofa(e, "Armrest").size;

                    if (sofaType == 4) {
                        getChildfromSofa(e, "Armrest").object.position.setY(seat.position.y);
                        // getChildfromSofa(e,"Armrest").object.scale.setY((((sHeight) * ftTom *getChildfromSofa(e,"Armrest").object.scale.y  / armSize.y).toFixed(2)))
                    } else {

                        getChildfromSofa(e, "Armrest").object.scale.setY((((sHeight * 1.25) * ftTom * getChildfromSofa(e, "Armrest").object.scale.y / armSize.y).toFixed(2)))
                    }


                }



            } else {
                var seat = getChildfromSofa(e, "Seat").object;
                var seatSize = getChildfromSofa(e, "Seat").size;
                if (sofaType < 2) {
                    seat.position.setY(sHeight * ftTom - seatSize.y);
                } else if (sofaType == 3 || sofaType==2) {
                    seat.scale.setY(sHeight * ftTom * seat.scale.y / seatSize.y)
                } else if (sofaType == 4) {
                    var legSize = getChildfromSofa(e, "Legs").size;
                    seat.position.setY(sHeight * ftTom - seatSize.y);

                    getChildfromSofa(e, "Legs").object.scale.setY(((((sHeight - 3 / 12) * ftTom * getChildfromSofa(e, "Legs").object.scale.y / legSize.y).toFixed(2))))
                }
            }




        })
    }
  
}

function checkDistance() {
    rightIndexs = [];
    leftIndexs = [];

    sofas.forEach((e) => {
        // var a = add_btn_group.children[0].position.x - e.position.x;
        // var b = add_btn_group.children[1].position.x - e.position.x;

        if (e.position.x <= 0) {

            if (!leftIndexs.includes(sofas.indexOf(e))) {
                leftIndexs.push(sofas.indexOf(e));
            }
            if (e.rotation.y == 0) {
                if (e.name == sofa.cornerR.name) {
                    leftCornerIndex = sofas.indexOf(e);
                }
            }
            if (e.rotation.y == 0) {
                if (e.name == sofa.chaiseR.name) {
                    leftChaiseIndex = sofas.indexOf(e);
                }
            }

        }


        if (e.position.x >= 0) {


            if (!rightIndexs.includes(sofas.indexOf(e))) {
                rightIndexs.push(sofas.indexOf(e));
            }

            if (e.rotation.y == 0) {
                if (e.name == sofa.cornerL.name) {
                    rightCornerIndex = sofas.indexOf(e);
                }
            }

            if (e.rotation.y == 0) {
                if (e.name == sofa.chaiseL.name) {
                    rightChaiseIndex = sofas.indexOf(e);
                }
            }
        }



    });





}

function onClick() {
    if (selectedBtn) {
        if (selectedBtn == add_btn_group.children[0]) {
            removeContextMenu(selectedBtnParent);
            isRight = false;
            isLeft = true;
        
            createContextMenu(selectedBtn, leftIndexs[leftIndexs.length - 1]);
          
            selectedBtnParent = selectedBtn;
            
        } else if (selectedBtn == remove_btn_group.children[0]) {
            isRight = false;
            isLeft = true;
            
           removeSofas(leftIndexs[leftIndexs.length - 1]);

            
        }

        if (selectedBtn == add_btn_group.children[1]) {
            removeContextMenu(selectedBtnParent);
            isLeft = false;
            isRight = true;

            createContextMenu(selectedBtn, rightIndexs[rightIndexs.length - 1]);

            selectedBtnParent = selectedBtn;
           
        } else if (selectedBtn == remove_btn_group.children[1]) {
            isLeft = false;
            isRight = true;

            removeSofas(rightIndexs[rightIndexs.length - 1]);

            
        }
    } else {
        removeContextMenu(selectedBtnParent);
    }
}

function onPointerMove(event) {
    if (selectedBtn) {
        selectedBtn.material.color.set("#ffffff");

        selectedBtn = null;
    }

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

    const intersectButton = raycaster.intersectObject(add_btn_group, true);
    const intersectRemoveButton = raycaster.intersectObject(
        remove_btn_group,
        true
    );
    if (intersectButton.length > 0) {
        const res = intersectButton.filter(function (res) {
            return res && res.object;
        })[0];

        if (res && res.object) {
            if (add_btn_group.visible) {
                if (res.object.visible) {
                    selectedBtn = res.object;
                    selectedBtn.material.color.set("#000000");
                }
            }
        }
    } else if (intersectRemoveButton.length > 0) {
        const res = intersectRemoveButton.filter(function (res) {
            return res && res.object;
        })[0];

        if (res && res.object) {
            if (remove_btn_group.visible) {
                if (res.object.visible) {
                    selectedBtn = res.object;
                    selectedBtn.material.color.set("#000000");
                }
            }
        }
    }


}

function addSelectedObject(object) {
    selectedObjects = [];
    selectedObjects.push(object);
}

function createContextMenu(obj, index) {
    var div = document.createElement("div");
    div.id = "#contextMenu";
    var table = document.createElement("TABLE");

    // table.border = '1';
    table.className = "table table-hover bg-white";
    var tableBody = document.createElement("TBODY");
    table.appendChild(tableBody);



    var totalHorizontal = hSingleCount + currentCornerCount + currentChaiseCount;
    //Create Selector
    for (var i = 0; i < 8; i++) {
        var tr = document.createElement("TR");
        tableBody.appendChild(tr);

        for (var j = 0; j < 1; j++) {
            var td = document.createElement("TD");
            if (i == 0) {
                // td.appendChild(document.createElement("a"));
                // td.innerHTML="<a id='addSingle' >Single</a>";

                td.id = "addSingle";
                if (sofas[index].rotation.y > 0 || sofas[index].name == sofa.cornerR.name) {
                    td.innerHTML = "<span class='sofa-single_l'></span>&nbsp&nbspSingle";
                } else if (sofas[index].rotation.y < 0 || sofas[index].name == sofa.cornerL.name) {
                    td.innerHTML = "<span class='sofa-single_r'></span>&nbsp&nbspSingle";
                } else {
                    td.innerHTML = "<span class='sofa-single'></span>&nbsp&nbspSingle";
                }

                td.addEventListener("pointerdown", function () {



                    addSingle(index);

                    //adjustHeight();
                    // updateButton(obj, index);


                });
            }
            if (i == 1) {
                td.id = "addCorner";
                if (isLeft) {
                    td.innerHTML = "<span class='sofa-corner_r'></span> Corner";
                }
                if (isRight) {
                    td.innerHTML = "<span class='sofa-corner_l'></span> Corner";
                }

                td.addEventListener("pointerdown", function () {
                    addCorner(index);

                    //adjustHeight();
                    // updateButton(obj, index);
                });
            }
            if (i == 2) {
                td.id = "addChaise";
                if (isLeft) {
                    td.innerHTML = "<span class='sofa-chaise_r'></span>&nbspChaise";
                }
                if (isRight) {
                    td.innerHTML = "<span class='sofa-chaise_l'></span>&nbspChaise";
                }
                td.addEventListener("pointerdown", function () {
                    addChaise(index);
                    // updateButton(obj, index);
                });
            }
            if (i == 3) {
                td.id = "addOttoman";
                td.innerHTML = "<span class='sofa-ottoman'>  Ottoman";
                td.addEventListener("pointerdown", function () {
                    addOttoman(index);
                    //adjustHeight();
                    // updateButton(obj, index);
                });
            }
            if (i == 4) {

                td.id = "addArmrest";
                if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                    if (isLeft) {
                        td.innerHTML = "<span class='sofa-armrest_l'>&nbspArmrest";
                    }
                    if (isRight) {
                        td.innerHTML = "<span class='sofa-armrest_r'>&nbspArmrest";
                    }
                } else {
                    td.className = "d-none"
                }


                td.addEventListener("pointerdown", function () {

                    if (isLeft) {
                        armrests[0].visible = true;
                    }
                    if (isRight) {
                        armrests[1].visible = true;
                    }


                });
            }
            if (i == 5) {
                if (totalHorizontal == 8) {
                    if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                        td.id = "single2Corner";
                        if (isLeft) {
                            td.innerHTML = "<span class='sofa-single'> <i class='fa fa-arrow-right'></i> <span class='sofa-corner_r'></span>";
                        }
                        if (isRight) {
                            td.innerHTML = "<span class='sofa-single'>  <i class='fa fa-arrow-right'></i> <span class='sofa-corner_l'></span>";
                        }


                    } else if (sofas[index].name == sofa.cornerR.name) {
                        td.id = "corner2Single";
                        td.innerHTML = "<span class='sofa-corner_r'></span> <i class='fa fa-arrow-right'></i>  <span class='sofa-single'>";
                    } else if (sofas[index].name == sofa.cornerL.name) {
                        td.id = "corner2Single";
                        td.innerHTML = "<span class='sofa-corner_l'></span> <i class='fa fa-arrow-right'></i>  <span class='sofa-single'>";
                    } else {
                        td.className = "d-none"
                    }
                }


                td.addEventListener("pointerdown", function () {

                    if (totalHorizontal == 8) {


                        if (isLeft) {
                            if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(leftIndexs[leftIndexs.length - 1])

                                //updateHorizontalBottoms

                            } else if (sofas[index].name == sofa.cornerR.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(leftIndexs[leftIndexs.length - 1])
                                
                                //updateHorizontalBottoms
                                armrests[0].visible = true;
                            }


                        }
                        if (isRight) {
                            if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(rightIndexs[rightIndexs.length - 1])
                                //updateHorizontalBottoms

                            } else if (sofas[index].name == sofa.cornerL.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(rightIndexs[rightIndexs.length - 1])
                                //updateHorizontalBottoms
                                armrests[1].visible = true;
                            }

                        }
                    } else {

                    }
                });
            }

            if (i == 6) {
                if (totalHorizontal == 8) {
                    if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                        td.id = "single2Chaise";
                        if (isLeft) {
                            td.innerHTML = "<span class='sofa-single'> <i class='fa fa-arrow-right'></i> <span class='sofa-chaise_r'></span>";
                        }
                        if (isRight) {
                            td.innerHTML = "<span class='sofa-single'>  <i class='fa fa-arrow-right'></i> <span class='sofa-chaise_l'></span>";
                        }


                    } else if (sofas[index].name == sofa.chaiseR.name) {
                        td.id = "corner2Single";
                        td.innerHTML = "<span class='sofa-chaise_r'></span> <i class='fa fa-arrow-right'></i>  <span class='sofa-single'>";
                    } else if (sofas[index].name == sofa.chaiseL.name) {
                        td.id = "corner2Single";
                        td.innerHTML = "<span class='sofa-chaise_l'></span> <i class='fa fa-arrow-right'></i>  <span class='sofa-single'>";
                    } else {
                        td.className = "d-none"
                    }


                }


                td.addEventListener("pointerdown", function () {

                    if (totalHorizontal == 8) {


                        if (isLeft) {
                            if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                                removeSofas(index);
                                checkDistance();
                                addChaise(leftIndexs[leftIndexs.length - 1])
                                //updateHorizontalBottoms

                            } else if (sofas[index].name == sofa.chaiseR.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(leftIndexs[leftIndexs.length - 1])
                                //updateHorizontalBottoms
                                armrests[0].visible = true;
                            }


                        }
                        if (isRight) {
                            if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                                removeSofas(index);
                                checkDistance();
                                addChaise(rightIndexs[rightIndexs.length - 1])
                                //updateHorizontalBottoms

                            } else if (sofas[index].name == sofa.chaiseL.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(rightIndexs[rightIndexs.length - 1])
                                //updateHorizontalBottoms
                                armrests[1].visible = true;
                            }

                        }
                    } else {

                    }
                });
            }
            if (i == 7) {
                if (totalHorizontal == 8) {


                    if (sofas[index].name == sofa.cornerL.name || sofas[index].name == sofa.cornerR.name) {
                        td.id = "corner2Chaise";
                        if (isLeft) {
                            td.innerHTML = "<span class='sofa-corner_r'> <i class='fa fa-arrow-right'></i> <span class='sofa-chaise_r'></span>";
                        }
                        if (isRight) {
                            td.innerHTML = "<span class='sofa-corner_l'> <i class='fa fa-arrow-right'></i> <span class='sofa-chaise_l'></span>";
                        }


                    } else if (sofas[index].name == sofa.chaiseL.name || sofas[index].name == sofa.chaiseR.name) {
                        td.id = "corner2Chaise";
                        if (isLeft) {
                            td.innerHTML = "<span class='sofa-chaise_r'> <i class='fa fa-arrow-right'></i> <span class='sofa-corner_r'></span>";
                        }
                        if (isRight) {
                            td.innerHTML = "<span class='sofa-chaise_l'> <i class='fa fa-arrow-right'></i> <span class='sofa-corner_l'></span>";
                        }
                    } else {
                        td.className = "d-none"
                    }

                }


                td.addEventListener("pointerdown", function () {

                    if (totalHorizontal == 8) {


                        if (isLeft) {
                            if (sofas[index].name == sofa.cornerR.name) {
                                removeSofas(index);
                                checkDistance();
                                addChaise(leftIndexs[leftIndexs.length - 1])
                                //updateHorizontalBottoms

                            } else if (sofas[index].name == sofa.chaiseR.name) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(leftIndexs[leftIndexs.length - 1])
                                //updateHorizontalBottoms
                                armrests[0].visible = true;
                            }


                        }
                        if (isRight) {
                            if (sofas[index].name == sofa.cornerL.name) {
                                removeSofas(index);
                                checkDistance();
                                addChaise(rightIndexs[rightIndexs.length - 1])
                                //updateHorizontalBottoms

                            } else if (sofas[index].name == sofa.chaiseL.name) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(rightIndexs[rightIndexs.length - 1])
                                //updateHorizontalBottoms
                                armrests[1].visible = true;
                            }

                        }
                    } else {

                    }
                });
            }
            tr.appendChild(td);
        }
    }
    div.appendChild(table);


    div.style.fontSize = "15px";

    var s = new THREE.CSS2DObject(div);
    var e = s.element.childNodes[0].childNodes[0];
    e.childNodes[7].className = "d-none";


    if (totalHorizontal != 8) {
        e.childNodes[5].className = "d-none";
        e.childNodes[6].className = "d-none";
        e.childNodes[7].className = "d-none";
    } else {
        if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
            e.childNodes[0].className = "d-none";
            e.childNodes[1].className = "d-none";
            e.childNodes[2].className = "d-none";
        }




    }


    if (hSingleCount < 3) {
        e.childNodes[1].className = "d-none";
        e.childNodes[2].className = "d-none";
    }

    if (isLeft) {
        if (leftverticalSingleCount > 0) {
            e.childNodes[1].className = "d-none";
            e.childNodes[2].className = "d-none";
        }
    }
    if (isRight) {
        if (rightverticalSingleCount > 0) {
            e.childNodes[1].className = "d-none";
            e.childNodes[2].className = "d-none";
        }
    }

    if (currentChaiseCount == 1) {
        e.childNodes[2].className = "d-none";

        if (currentCornerCount > 1) {
            e.childNodes[1].className = "d-none";
        }
    }
    if (sofas[index].name == sofa.single.name) {
        e.childNodes[3].className = "d-none";
    }

    if (
        sofas[index].name == sofa.chaiseL.name ||
        sofas[index].name == sofa.chaiseR.name
    ) {
        e.childNodes[0].className = "d-none";
        e.childNodes[1].className = "d-none";
        e.childNodes[2].className = "d-none";
    }

    if (sofas[index].name == sofa.ottoman.name) {
        e.childNodes[0].className = "d-none";
        e.childNodes[1].className = "d-none";
        e.childNodes[2].className = "d-none";
    }
    if (
        sofas[index].name == sofa.cornerL.name ||
        sofas[index].name == sofa.cornerR.name
    ) {
        e.childNodes[1].className = "d-none";
        e.childNodes[2].className = "d-none";
        e.childNodes[3].className = "d-none";
    }

    s.position.setZ(1);
    obj.add(s);
}

function removeContextMenu(parent) {
    if (parent instanceof THREE.Mesh) {
        if (parent.children.length > 0) {
            parent.traverse(function (e) {
                parent.remove(e);
            });
        }
    }
}


function removeSofas(index) {
   
    if (sofas[index] instanceof THREE.Object3D) {
        checkDistance();
        if (sofas[index].name == sofa.single.name) {
            if (sofas[index].rotation.y == 0) {
                if (hSingleCount > 1) {

                    if (index != 0) {

                        if (leftIndexs.includes(index)) {

                            scene.remove(sofas[index]);
                            sofas.splice(index, 1);

                            dimensionScene.remove(i_sofas[index]);
                            i_sofas.splice(index, 1);

                            leftIndexs = [];
                            hSingleCount -= 1;
                            totalPrice-=100;
                        }
                        if (rightIndexs.includes(index)) {

                            scene.remove(sofas[index]);
                            sofas.splice(index, 1);

                            dimensionScene.remove(i_sofas[index]);
                            i_sofas.splice(index, 1);

                            rightIndexs = [];

                            hSingleCount -= 1;
                            totalPrice-=100;
                        }



                    }
                   

                
                
                }

            } else if (sofas[index].rotation.y > 0) {
              
                if (leftverticalSingleCount > 0) {


                    if (leftIndexs.includes(index)) {

                        scene.remove(sofas[index]);
                        sofas.splice(index, 1);
                        leftverticalSingleCount -= 1;
                        dimensionScene.remove(i_sofas[index]);
                        i_sofas.splice(index, 1);

                        leftIndexs = [];
                        
                        totalPrice-=100;
                    }




                }

            } else if (sofas[index].rotation.y < 0) {
                if (rightverticalSingleCount > 0) {

                    if (rightIndexs.includes(index)) {

                        scene.remove(sofas[index]);
                        sofas.splice(index, 1);
                        rightverticalSingleCount -= 1;
                        dimensionScene.remove(i_sofas[index]);
                        i_sofas.splice(index, 1);

                        rightIndexs = [];
                        totalPrice-=100;

                    }




                }

            }
            
        } 
        
        else if (sofas[index].name == sofa.cornerR.name) {
            if (leftIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                dimensionScene.remove(i_sofas[index]);
                i_sofas.splice(index, 1);
                leftIndexs = []
                leftCornerIndex = null;
                d = [];
                totalPrice-=100;
            }
        } 
        else  if (sofas[index].name == sofa.cornerL.name) {
            if (rightIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                dimensionScene.remove(i_sofas[index]);
                i_sofas.splice(index, 1);
                rightIndexs = [];
                rightCornerIndex = null;
                d = [];
                totalPrice-=100;
            }
        } 
        
        else if (sofas[index].name == sofa.chaiseR.name) {
            if (leftIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                dimensionScene.remove(i_sofas[index]);
                i_sofas.splice(index, 1);
                leftIndexs = []
                leftChaiseIndex = null;
                totalPrice-=200;
            }
        }
        
        else if (sofas[index].name == sofa.chaiseL.name) {
            if (rightIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                dimensionScene.remove(i_sofas[index]);
                i_sofas.splice(index, 1);
                rightIndexs = [];
                rightChaiseIndex = null;
                totalPrice-=200;
            }
        } 
        else  if (sofas[index].name == sofa.ottoman.name) {
            if (leftIndexs.includes(index)) {

                
                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                dimensionScene.remove(i_sofas[index]);
                i_sofas.splice(index, 1);
                leftIndexs = []


                
            }
            if (rightIndexs.includes(index)) {

                
                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                dimensionScene.remove(i_sofas[index]);
                i_sofas.splice(index, 1);
                rightIndexs = [];
                
                totalPrice-=100;
            }
        }

        if(leftverticalSingleCount==0){
            armrests[0].visible =false;
        }
        if(rightverticalSingleCount==0){
            armrests[1].visible =false;
        }
    }



}

function swaprender() {
    isMeasured = !isMeasured;
}

function createMeasurementsWidth(index1, index2) {
    if (i_sofas.length > 0) {
        checkDistance();
        var leftSize = new THREE.Box3()
            .setFromObject(sofas[index1])
            .getSize(new THREE.Vector3());
        var rightSize = new THREE.Box3()
            .setFromObject(sofas[index2])
            .getSize(new THREE.Vector3());

        for (let i in sofa.single.children) {
            var parent = sofa.single.children[i];
            for (let j in parent.children) {
                if (parent.children[j].name.includes("Seat")) {
                    var singleSize = new THREE.Box3()
                        .setFromObject(parent.children[j])
                        .getSize(new THREE.Vector3());
                }

            }
        }


        var chaiseSize = new THREE.Box3()
            .setFromObject(sofa.chaiseL)
            .getSize(new THREE.Vector3());

        var cornerSize = new THREE.Box3()
            .setFromObject(sofa.cornerL)
            .getSize(new THREE.Vector3());
        if (armrests[0].visible) {

        } else if (armrests[1].visible) {

        }
        if (sofas[index1].rotation.y == 0 && sofas[index1].name != sofa.ottoman.name) {
            var fromLeft = new THREE.Vector3(sofas[0].position.x, 0, sofas[index1].position.z - 1);
            var toLeft = new THREE.Vector3(sofas[index1].position.x - leftSize.x / 2, 0, sofas[index1].position.z - 1);
            var directionLeft = toLeft.clone().sub(fromLeft);

            var lengthLeft = directionLeft.manhattanLength();

            var fromRight = new THREE.Vector3(sofas[0].position.x, 0, sofas[index1].position.z - 1);
            var toRight = new THREE.Vector3(sofas[index2].position.x + rightSize.x / 2, 0, sofas[index1].position.z - 1);
            var directionRight = toRight.clone().sub(fromRight);

            var lengthRight = directionRight.manhattanLength();
            if (hArrowL == null) {
                hArrowL = new THREE.ArrowHelper(directionLeft.normalize(), fromLeft, lengthLeft, 0x000000, 0.05, 0.05);
                hArrowR = new THREE.ArrowHelper(directionRight.normalize(), fromRight, lengthRight, 0x000000, 0.05, 0.05);

                dimensionScene.add(hArrowL);
                dimensionScene.add(hArrowR);

                wValue = document.createElement('div');
                wValue.style.textAlign = "center";

                wValue.style.fontSize = "15px";


                widthLabel = new THREE.CSS2DObject(wValue);
                dimensionScene.add(widthLabel)


            } else {
                var distanceValue = 0;
                hArrowL.setDirection(directionLeft.normalize());
                hArrowL.setLength(lengthLeft, 0.1, 0.1);
                hArrowL.position.copy(fromLeft.clone());

                hArrowR.setDirection(directionRight.normalize());
                hArrowR.setLength(lengthRight, 0.1, 0.1);
                hArrowR.position.copy(fromRight.clone());
                distanceValue = hSingleCount * (singleSize.x / ftTom).toFixed(2) + currentCornerCount * (2 + 6 / 12) + currentChaiseCount * (2.5 + 6 / 12);



                wValue.innerHTML = distanceValue + " ft(" + distanceValue * 12 + " in)";
                widthLabel.position.set(((toRight.x+ toLeft.x) / 2), 0, -1.25);
                
            }
        }

    }
}

function createMeasurementsHeightLeft(index1, index2) {
    if (i_sofas.length > 0) {
        checkDistance();


        var fromUp = new THREE.Vector3(0, 0, 0);
        var toUp = new THREE.Vector3(0, 0, 0);
        var fromDown = new THREE.Vector3(0, 0, 0);
        var toDown = new THREE.Vector3(0, 0, 0);
        var leftSofas = [];
        var ottomas = [];

        var measurement = 0;
        sofas.forEach(e => {
            if (e.rotation.y > 0) {
                if (!leftSofas.includes(e)) {
                    leftSofas.push(e);
                }
            }

            if (e.name == sofa.ottoman.name) {
                if (!ottomas.includes(e)) {
                    ottomas.push(e);
                }
            }

        })
        var mid = leftSofas[leftSofas.length / 2 | 0];
        var oMid = ottomas[ottomas.length / 2 | 0];

        if (leftCornerIndex != null || leftChaiseIndex != null) {
            if (leftSofas.length > 0) {

                var fup = (mid.position.z - ftTom);
                var tup = sofas[leftCornerIndex].position.z - ftTom - 6 / 12 * ftTom;

                var fdown = (mid.position.z - ftTom);

                var tdown = leftSofas[leftSofas.length - 1].position.z + ftTom + 6 / 12 * ftTom;
                toUp = new THREE.Vector3(sofas[leftCornerIndex].position.x - 0.8, 0, tup);
                fromUp = new THREE.Vector3(sofas[leftCornerIndex].position.x - 0.8, 0, fup);
                toDown = new THREE.Vector3(sofas[leftCornerIndex].position.x - 0.8, 0, tdown);
                fromDown = new THREE.Vector3(sofas[leftCornerIndex].position.x - 0.8, 0, fdown);
                measurement = (leftverticalSingleCount * (2)) + 1 + 2;
            } else {
                if (leftCornerIndex) {
                    var fup = (sofas[leftCornerIndex || leftChaiseIndex].position.z);
                    var tup = sofas[leftCornerIndex || leftChaiseIndex].position.z - ftTom - 6 / 12 * ftTom;
                    var fdown = (sofas[leftCornerIndex || leftChaiseIndex].position.z);
                    var tdown = sofas[leftCornerIndex || leftChaiseIndex].position.z + ftTom;
                    measurement = 6 / 12 + 2;
                } else if (leftChaiseIndex) {

                    for (var i = 0; i < sofas[leftChaiseIndex].children.length; i++) {
                        var sofaSize = new THREE.Box3()
                            .setFromObject(sofas[leftChaiseIndex].children[i].children[3])
                            .getSize(new THREE.Vector3());
                    }

                    if (ottomas.length > 0) {
                        var fup = (sofas[leftChaiseIndex].position.z + ftTom / 2 + oMid.position.z) / 2;
                        var tup = sofas[leftChaiseIndex].position.z - sofaSize.z / 2 + ftTom / 2;

                        var fdown = (sofas[leftChaiseIndex].position.z + ftTom / 2 + oMid.position.z) / 2;
                        var tdown = ottomas[ottomas.length - 1].position.z + ftTom;

                        measurement = 6 / 12 + 4 + (ottomas.length * (2 + 6 / 12));
                    } else {
                        var fup = (sofas[leftChaiseIndex].position.z + ftTom / 2);
                        var tup = sofas[leftChaiseIndex].position.z - sofaSize.z / 2 + ftTom / 2;

                        var fdown = (sofas[leftChaiseIndex].position.z + ftTom / 2);
                        var tdown = sofas[leftChaiseIndex].position.z + sofaSize.z / 2 + ftTom;
                        measurement = 6 / 12 + 4;
                    }

                }

                toUp = new THREE.Vector3(sofas[leftCornerIndex || leftChaiseIndex].position.x - 0.8, 0, tup);
                fromUp = new THREE.Vector3(sofas[leftCornerIndex || leftChaiseIndex].position.x - 0.8, 0, fup);

                toDown = new THREE.Vector3(sofas[leftCornerIndex || leftChaiseIndex].position.x - 0.8, 0, tdown);
                fromDown = new THREE.Vector3(sofas[leftCornerIndex || leftChaiseIndex].position.x - 0.8, 0, fdown);
            }
        } else if (sofas[index1].name == sofa.single.name && sofas[index1].rotation.y == 0) {
            toUp = new THREE.Vector3(sofas[index1].position.x - 0.8, 0, sofas[index1].position.z - ftTom - 6 / 12 * ftTom);
            fromUp = new THREE.Vector3(sofas[index1].position.x - 0.8, 0, sofas[index1].position.z);

            fromDown = new THREE.Vector3(sofas[index1].position.x - 0.8, 0, sofas[index1].position.z);
            toDown = new THREE.Vector3(sofas[index1].position.x - 0.8, 0, sofas[index1].position.z + ftTom);
            measurement = 6 / 12 + 2;
        }







        var directionUp = toUp.clone().sub(fromUp);

        var lengthUp = directionUp.manhattanLength();

        var directionDown = toDown.clone().sub(fromDown);

        var lengthDown = directionDown.manhattanLength();

        if (vArrowUpL == null) {
            vArrowUpL = new THREE.ArrowHelper(directionUp.normalize(), fromUp, lengthUp, 0x000000, 0.05, 0.05);
            vArrowDownL = new THREE.ArrowHelper(directionDown.normalize(), fromDown, lengthDown, 0x000000, 0.05, 0.05);

            dimensionScene.add(vArrowUpL);
            dimensionScene.add(vArrowDownL);

            LValue = document.createElement('div');


            LValue.style.fontSize = "15px";


            hLeftLabel = new THREE.CSS2DObject(LValue);
            dimensionScene.add(hLeftLabel)


        } else {

            vArrowUpL.setDirection(directionUp.normalize());
            vArrowUpL.setLength(lengthUp, 0.1, 0.1);
            vArrowUpL.position.copy(fromUp.clone());

            vArrowDownL.setDirection(directionDown.normalize());
            vArrowDownL.setLength(lengthDown, 0.1, 0.1);
            vArrowDownL.position.copy(fromDown.clone());
            var distanceValue = measurement;



            LValue.innerHTML = distanceValue + " ft(" + distanceValue * 12 + " in)";
            hLeftLabel.position.set(fromUp.x - 0.5, 0, fromUp.z);

        }
    }
}

function createMeasurementsHeightRight(index1, index2) {
    if (i_sofas.length > 0) {
        checkDistance();


        var fromUp = new THREE.Vector3(0, 0, 0);
        var toUp = new THREE.Vector3(0, 0, 0);
        var fromDown = new THREE.Vector3(0, 0, 0);
        var toDown = new THREE.Vector3(0, 0, 0);
        var rightSofas = [];
        var ottomas = [];
        var measurement = 0;

        sofas.forEach(e => {
            if (e.rotation.y < 0) {
                if (!rightSofas.includes(e)) {
                    rightSofas.push(e);
                }
            }

            if (e.name == sofa.ottoman.name) {
                if (!ottomas.includes(e)) {
                    ottomas.push(e);
                }
            }

        })
        var mid = rightSofas[rightSofas.length / 2 | 0];
        var oMid = ottomas[ottomas.length / 2 | 0];

        if (rightCornerIndex != null || rightChaiseIndex != null) {
            if (rightSofas.length > 0) {

                var fup = (mid.position.z - ftTom);
                var tup = sofas[rightCornerIndex].position.z - ftTom - 6 / 12 * ftTom;

                var fdown = (mid.position.z - ftTom);

                var tdown = rightSofas[rightSofas.length - 1].position.z + ftTom + 6 / 12 * ftTom;
                toUp = new THREE.Vector3(sofas[rightCornerIndex].position.x + 0.8, 0, tup);
                fromUp = new THREE.Vector3(sofas[rightCornerIndex].position.x + 0.8, 0, fup);
                toDown = new THREE.Vector3(sofas[rightCornerIndex].position.x + 0.8, 0, tdown);
                fromDown = new THREE.Vector3(sofas[rightCornerIndex].position.x + 0.8, 0, fdown);
                measurement = (leftverticalSingleCount * (2)) + 1 + 2;
            } else {
                if (rightCornerIndex) {
                    var fup = (sofas[rightCornerIndex || rightChaiseIndex].position.z);
                    var tup = sofas[rightCornerIndex || rightChaiseIndex].position.z - ftTom - 6 / 12 * ftTom;
                    var fdown = (sofas[rightCornerIndex || rightChaiseIndex].position.z);
                    var tdown = sofas[rightCornerIndex || rightChaiseIndex].position.z + ftTom;
                    measurement = 6 / 12 + 2;
                } else if (rightChaiseIndex) {

                    for (var i = 0; i < sofas[rightChaiseIndex].children.length; i++) {
                        var sofaSize = new THREE.Box3()
                            .setFromObject(sofas[rightChaiseIndex].children[i].children[3])
                            .getSize(new THREE.Vector3());
                    }

                    if (ottomas.length > 0) {
                        var fup = (sofas[rightChaiseIndex].position.z + ftTom / 2 + oMid.position.z) / 2;
                        var tup = sofas[rightChaiseIndex].position.z - sofaSize.z / 2 + ftTom / 2;

                        var fdown = (sofas[rightChaiseIndex].position.z + ftTom / 2 + oMid.position.z) / 2;
                        var tdown = ottomas[ottomas.length - 1].position.z + ftTom;
                        measurement = 6 / 12 + 4 + (ottomas.length * (2 + 6 / 12));
                    } else {
                        var fup = (sofas[rightChaiseIndex].position.z + ftTom / 2);
                        var tup = sofas[rightChaiseIndex].position.z - sofaSize.z / 2 + ftTom / 2;

                        var fdown = (sofas[rightChaiseIndex].position.z + ftTom / 2);
                        var tdown = sofas[rightChaiseIndex].position.z + sofaSize.z / 2 + ftTom;
                        measurement = 6 / 12 + 4;
                    }


                }

                toUp = new THREE.Vector3(sofas[rightCornerIndex || rightChaiseIndex].position.x + 0.8, 0, tup);
                fromUp = new THREE.Vector3(sofas[rightCornerIndex || rightChaiseIndex].position.x + 0.8, 0, fup);

                toDown = new THREE.Vector3(sofas[rightCornerIndex || rightChaiseIndex].position.x + 0.8, 0, tdown);
                fromDown = new THREE.Vector3(sofas[rightCornerIndex || rightChaiseIndex].position.x + 0.8, 0, fdown);
            }
        } else if (sofas[index2].name == sofa.single.name && sofas[index2].rotation.y == 0) {
            toUp = new THREE.Vector3(sofas[index2].position.x + 0.8, 0, sofas[index2].position.z - ftTom - 6 / 12 * ftTom);
            fromUp = new THREE.Vector3(sofas[index2].position.x + 0.8, 0, sofas[index2].position.z);

            fromDown = new THREE.Vector3(sofas[index2].position.x + 0.8, 0, sofas[index2].position.z);
            toDown = new THREE.Vector3(sofas[index2].position.x + 0.8, 0, sofas[index2].position.z + ftTom);
            measurement = 6 / 12 + 2;
        }

        var directionUp = toUp.clone().sub(fromUp);

        var lengthUp = directionUp.manhattanLength();

        var directionDown = toDown.clone().sub(fromDown);

        var lengthDown = directionDown.manhattanLength();

        if (vArrowUpR == null) {
            vArrowUpR = new THREE.ArrowHelper(directionUp.normalize(), fromUp, lengthUp, 0x000000, 0.05, 0.05);
            vArrowDownR = new THREE.ArrowHelper(directionDown.normalize(), fromDown, lengthDown, 0x000000, 0.05, 0.05);

            dimensionScene.add(vArrowUpR);
            dimensionScene.add(vArrowDownR);

            vValue = document.createElement('div');


            vValue.style.fontSize = "15px";


            hRightLabel = new THREE.CSS2DObject(vValue);
            dimensionScene.add(hRightLabel)


        } else {

            vArrowUpR.setDirection(directionUp.normalize());
            vArrowUpR.setLength(lengthUp, 0.1, 0.1);
            vArrowUpR.position.copy(fromUp.clone());

            vArrowDownR.setDirection(directionDown.normalize());
            vArrowDownR.setLength(lengthDown, 0.1, 0.1);
            vArrowDownR.position.copy(fromDown.clone());
            var distanceValue = measurement;



            vValue.innerHTML = distanceValue + " ft(" + distanceValue * 12 + " in)";
            hRightLabel.position.set(fromUp.x + 0.5, 0, fromUp.z);

        }
    }
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
        a.setAttribute('download', 'sofa_dimension.png')
        a.setAttribute('href', image)
        a.click()
        canvas.remove()
        $(".textOver").addClass("d-none");
    });

}
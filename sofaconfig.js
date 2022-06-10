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

const fwidth = viewer.offsetWidth || dimensionviewer.offsetWidth;
const fheight = viewer.offsetHeight || dimensionviewer.offsetHeight;
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
    sofasV = [];
sofas_group = new THREE.Group();
var s_armL, s_armR;
const gltfLoader = new THREE.GLTFLoader();

var sofaCount = 1;
var isCorner = false;

var boxes = [],
    box_group = new THREE.Group();

var sofaType = 0;

var bottoms = [],
    leftbottoms = [],
    rightbottoms = [],
    backs = [],
    leftbacks = [],
    leftlegs = [],
    rightbacks = [],
    rightlegs = [];
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
var flag = 0;

var leftIndexs = [];
var leftCornerIndex;
var rightCornerIndex;
var rightIndexs = [];
init();

animate();

dimensionviewer.hidden = true;

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
        fwidth / -2,
        fwidth / 2,
        fheight / 2,
        fheight / -2,
        0.001,
        1000
    );

    // orthoCameraTop.rotation.z = 180*THREE.Math.DEG2RAD;
    orthoCameraTop.rotation.x = -90 * THREE.Math.DEG2RAD;
    orthoCameraTop.position.y = 2;

    orthoCameraLeft = new THREE.OrthographicCamera(
        fwidth / -2,
        fwidth / 2,
        fheight / 2,
        fheight / -2,
        0.001,
        1000
    );
    orthoCameraLeft.position.x = -1;
    orthoCameraLeft.rotation.y = -90 * THREE.Math.DEG2RAD;

    // orthoCameraTop.zoom = 250;

    orthoCameraTop.layers.enable(1);
    orthoCameraTop.layers.enable(2);

    orthoCameraLeft.layers.enable(1);
    orthoCameraLeft.layers.enable(2);
    orthoCameraLeft.layers.enable(3);
    orthoCameraLeft.layers.disable(0);

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
    dimensionRenderer.setSize(fwidth, fheight);
    dimensionRenderer.compile(dimensionScene, orthoCameraTop);

    css2DRenderer = new THREE.CSS2DRenderer();

    css2DRenderer.setSize(fwidth, fheight);
    css2DRenderer.domElement.style.position = "fixed";
    // css2DRenderer.domElement.style.fontFamily = "Arial"
    css2DRenderer.domElement.style.color = "#000000";
    css2DRenderer.domElement.style.top = "0px";
    css2DRenderer.domElement.style.left = "0px";
    css2DRenderer.domElement.style.zIndex = 1;

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

    dimensionviewer.appendChild(css2DRenderer.domElement);
    dimensionviewer.appendChild(dimensionRenderer.domElement);

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
        css2DRenderer.setSize(fwidth, fheight);
        css2DRenderer2.setSize(fwidth, fheight);
        css3DRenderer.setSize(fwidth, fheight);
        dimensionRenderer.setSize(fwidth, fheight);

        orthoCameraTop.updateProjectionMatrix();
        orthoCameraLeft.updateProjectionMatrix();
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
    if (
        sofa.singleback != null &&
        sofa.singlebackL != null &&
        sofa.singlebackR != null
    ) {
        if (type == 0) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.singleback.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }

                    if (e.name == sofa.singlebackL.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }

                    if (e.name == sofa.singlebackR.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                }
            });
        }
        if (type == 1) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.singleback.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }

                    if (e.name == sofa.singlebackL.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }

                    if (e.name == sofa.singlebackR.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }
                }
            });
        }
    }
    if (sofa.leg != null) {
        if (type == 0) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.leg.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                }
            });
        }
        if (type == 1) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.leg.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }
                }
            });
        }
    }

    if (sofa.armrestL != null && sofa.armrestR != null) {
        if (type == 0) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.armrestL.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                    if (e.name == sofa.armrestR.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                }
            });
        }
        if (type == 1) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.armrestL.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }

                    if (e.name == sofa.armrestR.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }
                }
            });
        }
    }
    if (sofa.cornerL != null && sofa.cornerR != null) {
        if (type == 0) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.cornerL.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                    if (e.name == sofa.cornerR.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                }
            });
        }
        if (type == 1) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.cornerL.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }

                    if (e.name == sofa.cornerR.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }
                }
            });
        }
    }

    if (sofa.chaiseL != null && sofa.chaiseR != null) {
        if (type == 0) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.chaiseL.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                    if (e.name == sofa.chaiseR.name) {
                        e.children[1].visible = true;
                        e.children[0].visible = false;
                    }
                }
            });
        }
        if (type == 1) {
            scene.traverse(function (e) {
                if (e instanceof THREE.Object3D) {
                    if (e.name == sofa.chaiseL.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }

                    if (e.name == sofa.chaiseR.name) {
                        e.children[0].visible = true;
                        e.children[1].visible = false;
                    }
                }
            });
        }
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

    chooseSofaDesign(sofaType);

    sofaCount =
        hSingleCount +
        leftverticalSingleCount +
        rightverticalSingleCount +
        currentChaiseCount +
        currentCornerCount;


    // if (hSingleCount > 6) {
    //     if (cornerL.length > 0 || chaiseL.length > 0) {
    //         // add_btn_group.children[0].visible = false;
    //     } else if (cornerR.length > 0 || chaiseR.length > 0) {
    //         // add_btn_group.children[1].visible = false;
    //     } else if (hSingleCount == 8) {
    //         // add_btn_group.visible = false;
    //     }
    // } else {
    //     if (leftverticalSingleCount + currentCornerCount > 8) {
    //         add_btn_group.children[0].visible = false;
    //     }
    //     if (rightverticalSingleCount + currentCornerCount > 8) {
    //         add_btn_group.children[1].visible = false;
    //     }
    //     if (chaiseL.length > 0) {
    //         if (ottomans.length > 1) {
    //             add_btn_group.children[1].visible = false;
    //         }
    //     } else if (chaiseR.length > 0) {
    //         if (ottomans.length > 1) {
    //             add_btn_group.children[0].visible = false;
    //         }
    //     }
    // }

    // if (sofaCount < 16) {
    //     add_btn_group.visible = true;
    // } else {
    //     add_btn_group.visible = false;
    // }
    if (sofaCount > 0) {
        if (chaiseL.length > 0) {
            if (ottomans.length > 1) {
                add_btn_group.children[1].visible = false;
            }else{
                add_btn_group.children[1].visible = true;
            }
        } else if (chaiseR.length > 0) {
            if (ottomans.length > 1) {
                add_btn_group.children[0].visible = false;
            }else{
                add_btn_group.children[0].visible = true;
            }
        }
    }

    $("#sofaCount").html(sofaCount);

    checkDistance();

    updateButtons(
        leftIndexs[leftIndexs.length - 1],
        rightIndexs[rightIndexs.length - 1]
    );

    if (sofas.length > 0) {
        add_btn_group.position.set(0, 0, 0);
        remove_btn_group.position.set(0, 0, 0);
        null_group.position.set(0, 0, 0);
    }

    if (lasthSingleCount <= hSingleCount) {
        enableHorizontalBottomAdding = true;
    } else {
        enableHorizontalBottomAdding = false;
    }
    // console.log("last: " + lasthSingleCount + ", single: " + hSingleCount, ", Enable: " + enableHorizontalBottomAdding)
    updateHorizontalBottoms();
    updateVerticalBottomLeft();
    updateVerticalBottomRight();

    updateArmrests(
        leftIndexs[leftIndexs.length - 1],
        rightIndexs[rightIndexs.length - 1]
    );
    adjustHeight();
    delta = clock.getDelta();

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
}

function updateFloor() {
    if (sofa.leg != null) {
        var f = new THREE.Box3()
            .setFromObject(sofa.leg)
            .getSize(new THREE.Vector3());

        floor.position.setY(-f.y);
    }
}

function render() {
    dimensionRenderer.setViewport(
        left,
        Math.floor(fheight / 2),
        fwidth,
        Math.floor(fheight / 2)
    );
    dimensionRenderer.setScissor(
        left,
        Math.floor(fheight / 2),
        fwidth,
        Math.floor(fheight / 2)
    );
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

}

function addSingle(index, rotation) {
    if (sofa.single) {
        var s = sofa.single.clone();

        scene.add(s);

        // addArmrest();
        // removeButton();

        if (index != null) {
            var sofaSize = new THREE.Box3()
                .setFromObject(sofas[index].children[0])
                .getSize(new THREE.Vector3());
            // var cornerSize = new THREE.Box3().setFromObject(sofa.cornerL).getSize(new THREE.Vector3());

            var cornerSeatSize = new THREE.Box3()
                .setFromObject(sofa.cornerL.children[1].children[2])
                .getSize(new THREE.Vector3());

            var armrestSize = new THREE.Box3()
                .setFromObject(sofa.armrestL)
                .getSize(new THREE.Vector3());

            if (isLeft) {
                if (sofas[index].name == sofa.cornerR.name) {
                    enableHorizontalBottomAdding = false;
                    s.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

                    s.position.setX(sofas[index].position.x);
                    s.position.setZ(sofas[index].position.z + cornerSeatSize.z);

                    leftverticalSingleCount += 1;

                    addVerticalBottomLeft();
                } else if (sofas[index].rotation.y > 0) {
                    enableHorizontalBottomAdding = false;
                    var a = new THREE.Object3D();

                    s.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                    s.translateX((-1 - leftverticalSingleCount) * sofaSize.x);
                    s.position.setX(sofas[index].position.x);

                    leftverticalSingleCount += 1;

                    addVerticalBottomLeft();
                } else {
                    enableHorizontalBottomAdding = true;
                    hSingleCount += 1;
                    lasthSingleCount = hSingleCount;
                    s.position.setX(sofas[index].position.x - sofaSize.x);
                }
            }
            if (isRight) {
                if (sofas[index].name == sofa.cornerL.name) {
                    enableHorizontalBottomAdding = false;
                    s.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

                    s.position.setX(sofas[index].position.x);
                    s.position.setZ(sofas[index].position.z + cornerSeatSize.z);

                    rightverticalSingleCount += 1;
                    addVerticalBottomRight();
                } else if (sofas[index].rotation.y < 0) {
                    enableHorizontalBottomAdding = false;
                    s.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
                    s.translateX((1 + rightverticalSingleCount) * sofaSize.x);
                    s.position.setX(sofas[index].position.x);

                    rightverticalSingleCount += 1;
                    addVerticalBottomRight();
                } else {
                    enableHorizontalBottomAdding = true;
                    hSingleCount += 1;
                    lasthSingleCount = hSingleCount;
                    s.position.setX(sofas[index].position.x + sofaSize.x);
                }
            }
        } else {
            s.position.setX(0);
        }

        if (!sofas.includes(s)) {
            sofas.push(s);
        }

        if (sofas.length > 0) {
            if (enableHorizontalBottomAdding) {
                addHorizontalBottom();
            }
        }
    }

}

function addHorizontalBottom(val) {
    var c = hSingleCount;

    if (c > 3) {
        if (c % 2 == 0) {
            max = 2;
        } else {
            max = 3;
        }
    } else {
        max = 3;
    }

    if (singleCount < max) {
        singleCount += 1;
    } else {
        lastBottomSofa = [];
        lastBackSofa = [];

        singleCount = 1;
    }

    // console.log("SC: "+singleCount, ", Max: "+ max, ": HSignle: ",hSingleCount)

    var seatSize = new THREE.Box3()
        .setFromObject(sofa.single.children[0])
        .getSize(new THREE.Vector3());

    if (lastBottomSofa.length > 0) {
        // Bottom

        var btmLSize = new THREE.Box3()
            .setFromObject(lastBottomSofa[1])
            .getSize(new THREE.Vector3());
        var btmSize = new THREE.Box3()
            .setFromObject(lastBottomSofa[0])
            .getSize(new THREE.Vector3());

        // lastBottomSofa[0].position.setZ(sofas[leftHorizontalIndex].position.z);

        // lastBottomSofa[0].scale.setX(singleCount + btmLSize.x * 8);

        var btmSize = new THREE.Box3()
            .setFromObject(lastBottomSofa[0])
            .getSize(new THREE.Vector3());

        //back
        var bkLSize = new THREE.Box3()
            .setFromObject(lastBackSofa[1])
            .getSize(new THREE.Vector3());
        var bkSize = new THREE.Box3()
            .setFromObject(lastBackSofa[0])
            .getSize(new THREE.Vector3());

        lastBackSofa[0].scale.x = singleCount + bkLSize.x * 4;
    } else {
        //Bottom
        {
            var btm = sofa.bottom.clone();
            var btmL = sofa.bottomL.clone();
            var btmR = sofa.bottomR.clone();

            if (!lastBottomSofa.includes(btm)) {
                lastBottomSofa.push(btm);
            }

            if (!lastBottomSofa.includes(btmL)) {
                lastBottomSofa.push(btmL);
            }
            if (!lastBottomSofa.includes(btmR)) {
                lastBottomSofa.push(btmR);
            }

            var btmSize = new THREE.Box3()
                .setFromObject(lastBottomSofa[0])
                .getSize(new THREE.Vector3());
            lastBottomSofa[1].position.setX(
                lastBottomSofa[0].position.x + btmSize.x / 2
            );
            lastBottomSofa[1].position.setZ(lastBottomSofa[0].position.z);

            lastBottomSofa[2].position.setX(
                lastBottomSofa[0].position.x - btmSize.x / 2
            );
            lastBottomSofa[2].position.setZ(lastBottomSofa[0].position.z);

            const btm_group = new THREE.Group();
            btm_group.name = "Bottoms";
            lastBottomSofa.forEach((e) => {
                btm_group.add(e);
            });

            if (!bottoms.includes(btm_group)) {
                bottoms.push(btm_group);
            }
            bottoms.forEach((e) => {
                scene.add(e);
            });
        }

        //Back
        {
            var bk = sofa.singleback.clone();
            var bkL = sofa.singlebackL.clone();
            var bkR = sofa.singlebackR.clone();

            if (!lastBackSofa.includes(bk)) {
                lastBackSofa.push(bk);
            }

            if (!lastBackSofa.includes(bkL)) {
                lastBackSofa.push(bkL);
            }
            if (!lastBackSofa.includes(bkR)) {
                lastBackSofa.push(bkR);
            }

            var bkSize = new THREE.Box3()
                .setFromObject(lastBackSofa[0])
                .getSize(new THREE.Vector3());
            lastBackSofa[0].position.setZ(sofa.single.position.z - seatSize.z / 2);
            lastBackSofa[1].position.setX(lastBackSofa[0].position.x + bkSize.x / 2);
            lastBackSofa[1].position.setZ(lastBackSofa[0].position.z);

            lastBackSofa[2].position.setX(lastBackSofa[0].position.x - bkSize.x / 2);
            lastBackSofa[2].position.setZ(lastBackSofa[0].position.z);

            const bk_group = new THREE.Group();
            bk_group.name = "Backs";
            lastBackSofa.forEach((e) => {
                bk_group.add(e);
            });

            if (!backs.includes(bk_group)) {
                backs.push(bk_group);
            }
            backs.forEach((e) => {
                scene.add(e);
            });
        }

        var leg_group = new THREE.Group();
        leg_group.name = "Legs";
        for (var i = 0; i < 4; i++) {
            leg_group.add(sofa.leg.clone());
        }
        if (!legs.includes(leg_group)) {
            legs.push(leg_group);
        }

        legs.forEach((e) => {
            scene.add(e);
        });
    }
    if (singleCount == 1) {
        // Legs
    }
}

function updateHorizontalBottoms() {
    if (bottoms.length > 0) {
        leftIndexs.forEach(function (l) {
            if (sofas.includes(sofas[l])) {
                if (sofas[l].name == sofa.single.name) {
                    if (sofas[l].rotation.y == 0) {
                        if (leftIndexs.indexOf(l) == leftIndexs.length - 1) {
                            leftHorizontalIndex = l;
                        }


                    }
                }
            }
        });

        // console.log(leftIndexs,leftHorizontalIndex)
        var sofaSize = new THREE.Box3()
            .setFromObject(sofas[leftHorizontalIndex])
            .getSize(new THREE.Vector3());

        for (var i = 0; i < legs.length; i++) {
            if (legs[i] instanceof THREE.Group) {
                for (var j = 0; j < legs[i].children.length; j++) {
                    if (j == 1 || j == legs[i].children.length - 1) {
                        legs[i].children[j].rotation.y = Math.PI;
                    }
                    if (j == 0 || j == 2) {
                        legs[i].children[j].rotation.y = 0;
                    }

                    if (hSingleCount < 4) {
                        legs[i].children[j].visible = false;
                    } else {
                        if (i == 0) {
                            if (j == 2 || j == legs[i].children.length - 1) {
                                legs[i].children[j].visible = true;
                            }
                            if (j == 0 || j == 1) {
                                legs[i].children[j].visible = false;
                            }
                        } else if (i == legs.length - 1) {
                            if (j == 0 || j == 1) {
                                legs[i].children[j].visible = true;
                            }
                            if (j == 2 || j == legs[i].children.length - 1) {
                                legs[i].children[j].visible = false;
                            }
                        } else {
                            legs[i].children[j].visible = true;
                        }
                    }
                }
            }
        }
        for (var i = 0; i < bottoms.length; i++) {
            if (i > 0) {
                var prevBtmLSize = new THREE.Box3()
                    .setFromObject(bottoms[i - 1].children[1])
                    .getSize(new THREE.Vector3());
                if (hSingleCount > 3) {
                    if (hSingleCount % 2 == 0) {
                        bottoms[i].children[0].scale.setX(2 + prevBtmLSize.x * 3);

                        var currentBtmSize = new THREE.Box3()
                            .setFromObject(bottoms[i].children[0])
                            .getSize(new THREE.Vector3());

                        var prevBtmSize = new THREE.Box3()
                            .setFromObject(bottoms[i - 1])
                            .getSize(new THREE.Vector3());

                        var prevBtmLSize = new THREE.Box3()
                            .setFromObject(bottoms[i - 1].children[1])
                            .getSize(new THREE.Vector3());

                        bottoms[i].children[1].position.setX(
                            bottoms[i].children[0].position.x + currentBtmSize.x / 2
                        );
                        bottoms[i].children[1].position.setZ(
                            bottoms[i].children[0].position.z
                        );

                        bottoms[i].children[2].position.setX(
                            bottoms[i].children[0].position.x - currentBtmSize.x / 2
                        );
                        bottoms[i].children[2].position.setZ(
                            bottoms[i].children[0].position.z
                        );

                        bottoms[i].position.setX(
                            bottoms[i - 1].position.x + currentBtmSize.x + prevBtmLSize.x * 2
                        );
                        if (legs.length > 0) {
                            var bkSize = new THREE.Box3()
                                .setFromObject(backs[i].children[0])
                                .getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3()
                                .setFromObject(legs[i].children[0])
                                .getSize(new THREE.Vector3());
                            legs[i].position.setX(bottoms[i].position.x);
                            legs[i].children[0].position.set(
                                -currentBtmSize.x / 2 + lSize.x,
                                0,
                                -currentBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i].children[1].position.set(
                                -currentBtmSize.x / 2 + lSize.x,
                                0,
                                currentBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i].children[2].position.set(
                                currentBtmSize.x / 2 - lSize.x,
                                0,
                                -currentBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i].children[3].position.set(
                                currentBtmSize.x / 2 - lSize.x,
                                0,
                                currentBtmSize.z / 2 - bkSize.z / 2
                            );
                        }
                    } else {
                        bottoms[i - 1].children[0].scale.setX(2 + prevBtmLSize.x * 3);
                        bottoms[i].children[0].scale.setX(3 + prevBtmLSize.x * 6);

                        var prevBtmSize = new THREE.Box3()
                            .setFromObject(bottoms[i - 1].children[0])
                            .getSize(new THREE.Vector3());

                        var prevBtmScale = new THREE.Box3()
                            .setFromObject(bottoms[i - 1])
                            .getSize(new THREE.Vector3());

                        bottoms[i - 1].children[1].position.setX(
                            bottoms[i - 1].children[0].position.x + prevBtmSize.x / 2
                        );
                        bottoms[i - 1].children[1].position.setZ(
                            bottoms[i - 1].children[0].position.z
                        );

                        bottoms[i - 1].children[2].position.setX(
                            bottoms[i - 1].children[0].position.x - prevBtmSize.x / 2
                        );
                        bottoms[i - 1].children[2].position.setZ(
                            bottoms[i - 1].children[0].position.z
                        );

                        var currentBtmSize = new THREE.Box3()
                            .setFromObject(bottoms[i].children[0])
                            .getSize(new THREE.Vector3());

                        if (i - 2 >= 0) {
                            bottoms[i - 1].position.setX(
                                bottoms[i - 2].position.x + prevBtmSize.x + prevBtmLSize.x * 2
                            );
                        }

                        bottoms[i].position.setX(
                            bottoms[i - 1].position.x +
                            currentBtmSize.x / 2 +
                            prevBtmSize.x / 2 +
                            prevBtmLSize.x * 2
                        );

                        bottoms[i].children[1].position.setX(
                            bottoms[i].children[0].position.x + currentBtmSize.x / 2
                        );
                        bottoms[i].children[1].position.setZ(
                            bottoms[i].children[0].position.z
                        );

                        bottoms[i].children[2].position.setX(
                            bottoms[i].children[0].position.x - currentBtmSize.x / 2
                        );
                        bottoms[i].children[2].position.setZ(
                            bottoms[i].children[0].position.z
                        );

                        if (legs.length > 0) {
                            var bkSize = new THREE.Box3()
                                .setFromObject(backs[i].children[0])
                                .getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3()
                                .setFromObject(legs[i].children[0])
                                .getSize(new THREE.Vector3());
                            legs[i].position.setX(bottoms[i].position.x);
                            legs[i].children[0].position.set(
                                -currentBtmSize.x / 2 + lSize.x,
                                0,
                                -currentBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i].children[1].position.set(
                                -currentBtmSize.x / 2 + lSize.x,
                                0,
                                currentBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i].children[2].position.set(
                                currentBtmSize.x / 2 - lSize.x,
                                0,
                                -currentBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i].children[3].position.set(
                                currentBtmSize.x / 2 - lSize.x,
                                0,
                                currentBtmSize.z / 2 - bkSize.z / 2
                            );

                            legs[i - 1].position.setX(bottoms[i - 1].position.x);
                            legs[i - 1].children[0].position.set(
                                -prevBtmSize.x / 2 + lSize.x,
                                0,
                                -prevBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i - 1].children[1].position.set(
                                -prevBtmSize.x / 2 + lSize.x,
                                0,
                                prevBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i - 1].children[2].position.set(
                                prevBtmSize.x / 2 - lSize.x,
                                0,
                                -prevBtmSize.z / 2 - bkSize.z / 2
                            );
                            legs[i - 1].children[3].position.set(
                                prevBtmSize.x / 2 - lSize.x,
                                0,
                                prevBtmSize.z / 2 - bkSize.z / 2
                            );
                        }
                    }
                }
            }
            if (i == 0) {
                var btmSize = new THREE.Box3()
                    .setFromObject(bottoms[i].children[0])
                    .getSize(new THREE.Vector3());
                var btmLSize = new THREE.Box3()
                    .setFromObject(bottoms[i].children[1])
                    .getSize(new THREE.Vector3());
                if (hSingleCount == 3) {
                    bottoms[i].children[0].scale.setX(3 + btmLSize.x * 2);
                    bottoms[i].position.setX(
                        sofas[leftHorizontalIndex].position.x + sofaSize.x
                    );
                } else if (hSingleCount == 2) {
                    bottoms[i].children[0].scale.setX(2 + btmLSize.x * 2);
                    bottoms[i].position.setX(
                        sofas[leftHorizontalIndex].position.x + sofaSize.x / 2
                    );
                } else if (hSingleCount == 1) {
                    bottoms[i].children[0].scale.setX(1 + btmLSize.x * 2);
                    bottoms[i].position.setX(sofas[leftHorizontalIndex].position.x);
                } else if (hSingleCount > 3) {
                    bottoms[i].children[0].scale.setX(2 + btmLSize.x * 2);
                    bottoms[i].position.setX(
                        sofas[leftHorizontalIndex].position.x + sofaSize.x / 2
                    );
                }

                bottoms[i].children[1].position.setX(
                    bottoms[i].children[0].position.x + btmSize.x / 2
                );
                bottoms[i].children[1].position.setZ(bottoms[i].children[0].position.z);

                bottoms[i].children[2].position.setX(
                    bottoms[i].children[0].position.x - btmSize.x / 2
                );
                bottoms[i].children[2].position.setZ(bottoms[i].children[0].position.z);

                if (legs.length > 0) {
                    var bkSize = new THREE.Box3()
                        .setFromObject(backs[i].children[0])
                        .getSize(new THREE.Vector3());
                    var lSize = new THREE.Box3()
                        .setFromObject(legs[i].children[0])
                        .getSize(new THREE.Vector3());
                    legs[i].position.setX(bottoms[i].position.x);
                    legs[i].children[0].position.set(
                        -btmSize.x / 2 + lSize.x,
                        0,
                        -btmSize.z / 2 - bkSize.z / 2
                    );
                    legs[i].children[1].position.set(
                        -btmSize.x / 2 + lSize.x,
                        0,
                        btmSize.z / 2 - bkSize.z / 2
                    );
                    legs[i].children[2].position.set(
                        btmSize.x / 2 - lSize.x / 2,
                        0,
                        -btmSize.z / 2 - bkSize.z / 2
                    );
                    legs[i].children[3].position.set(
                        btmSize.x / 2 - lSize.x / 2,
                        0,
                        btmSize.z / 2 - bkSize.z / 2
                    );
                }
            }
        }
        // var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
        //back
        for (var i = 0; i < backs.length; i++) {
            if (i > 0) {
                var prevBtmLSize = new THREE.Box3()
                    .setFromObject(backs[i - 1].children[1])
                    .getSize(new THREE.Vector3());
                if (hSingleCount > 3) {
                    if (hSingleCount % 2 == 0) {
                        backs[i].children[0].scale.setX(2 + prevBtmLSize.x * 3);

                        var currentBtmSize = new THREE.Box3()
                            .setFromObject(backs[i].children[0])
                            .getSize(new THREE.Vector3());

                        var prevBtmSize = new THREE.Box3()
                            .setFromObject(backs[i - 1])
                            .getSize(new THREE.Vector3());

                        var prevBtmLSize = new THREE.Box3()
                            .setFromObject(backs[i - 1].children[1])
                            .getSize(new THREE.Vector3());

                        backs[i].children[1].position.setX(
                            backs[i].children[0].position.x + currentBtmSize.x / 2
                        );
                        backs[i].children[1].position.setZ(backs[i].children[0].position.z);

                        backs[i].children[2].position.setX(
                            backs[i].children[0].position.x - currentBtmSize.x / 2
                        );
                        backs[i].children[2].position.setZ(backs[i].children[0].position.z);

                        backs[i].position.setX(
                            backs[i - 1].position.x + currentBtmSize.x + prevBtmLSize.x * 2
                        );
                    } else {
                        backs[i - 1].children[0].scale.setX(2 + prevBtmLSize.x * 3);
                        backs[i].children[0].scale.setX(3 + prevBtmLSize.x * 6);

                        var prevBtmSize = new THREE.Box3()
                            .setFromObject(backs[i - 1].children[0])
                            .getSize(new THREE.Vector3());

                        var prevBtmScale = new THREE.Box3()
                            .setFromObject(backs[i - 1])
                            .getSize(new THREE.Vector3());

                        backs[i - 1].children[1].position.setX(
                            backs[i - 1].children[0].position.x + prevBtmSize.x / 2
                        );
                        backs[i - 1].children[1].position.setZ(
                            backs[i - 1].children[0].position.z
                        );

                        backs[i - 1].children[2].position.setX(
                            backs[i - 1].children[0].position.x - prevBtmSize.x / 2
                        );
                        backs[i - 1].children[2].position.setZ(
                            backs[i - 1].children[0].position.z
                        );

                        var currentBtmSize = new THREE.Box3()
                            .setFromObject(backs[i].children[0])
                            .getSize(new THREE.Vector3());

                        if (i - 2 >= 0) {
                            backs[i - 1].position.setX(
                                backs[i - 2].position.x + prevBtmSize.x + prevBtmLSize.x * 2
                            );
                        }

                        backs[i].position.setX(
                            backs[i - 1].position.x +
                            currentBtmSize.x / 2 +
                            prevBtmSize.x / 2 +
                            prevBtmLSize.x * 2
                        );

                        backs[i].children[1].position.setX(
                            backs[i].children[0].position.x + currentBtmSize.x / 2
                        );
                        backs[i].children[1].position.setZ(backs[i].children[0].position.z);

                        backs[i].children[2].position.setX(
                            backs[i].children[0].position.x - currentBtmSize.x / 2
                        );
                        backs[i].children[2].position.setZ(backs[i].children[0].position.z);
                    }
                }
            }
            if (i == 0) {
                var btmSize = new THREE.Box3()
                    .setFromObject(backs[i].children[0])
                    .getSize(new THREE.Vector3());
                var btmLSize = new THREE.Box3()
                    .setFromObject(backs[i].children[1])
                    .getSize(new THREE.Vector3());
                if (hSingleCount == 3) {
                    backs[i].children[0].scale.setX(3 + btmLSize.x * 2);
                    backs[i].position.setX(
                        sofas[leftHorizontalIndex].position.x + sofaSize.x
                    );
                } else if (hSingleCount == 2) {
                    backs[i].children[0].scale.setX(2 + btmLSize.x * 2);
                    backs[i].position.setX(
                        sofas[leftHorizontalIndex].position.x + sofaSize.x / 2
                    );
                } else if (hSingleCount == 1) {
                    backs[i].children[0].scale.setX(1 + btmLSize.x * 2);
                    backs[i].position.setX(sofas[leftHorizontalIndex].position.x);
                } else if (hSingleCount > 3) {
                    backs[i].children[0].scale.setX(2 + btmLSize.x * 2);
                    backs[i].position.setX(
                        sofas[leftHorizontalIndex].position.x + sofaSize.x / 2
                    );
                }

                // backs[i].position.setZ(sofas[leftHorizontalIndex].position.z - .z / 2 );

                backs[i].children[1].position.setX(
                    backs[i].children[0].position.x + btmSize.x / 2
                );
                backs[i].children[1].position.setZ(backs[i].children[0].position.z);

                backs[i].children[2].position.setX(
                    backs[i].children[0].position.x - btmSize.x / 2
                );
                backs[i].children[2].position.setZ(backs[i].children[0].position.z);
            }
        }
    }
}

function addVerticalBottomLeft() {
    var c = leftverticalSingleCount;

    if (c > 3) {
        if (c % 2 == 0) {
            lmax = 2;
        } else {
            lmax = 3;
        }
    } else {
        lmax = 3;
    }

    if (leftCount < lmax) {
        leftCount += 1;
    } else {
        lastBottomSofasLV = [];
        lastBackSofaLV = [];

        leftCount = 1;
    }

    // var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
    if (lastBottomSofasLV.length > 0) {
        // Bottom

        // var btmLSize = new THREE.Box3()
        //     .setFromObject(lastBottomSofasLV[1])
        //     .getSize(new THREE.Vector3());
        // var btmSize = new THREE.Box3()
        //     .setFromObject(lastBottomSofasLV[0])
        //     .getSize(new THREE.Vector3());

        // lastBottomSofasLV[0].scale.x = leftCount + btmLSize.z * 4;

        // //back
        // var bkLSize = new THREE.Box3()
        //     .setFromObject(lastBackSofaLV[1])
        //     .getSize(new THREE.Vector3());
        // var bkSize = new THREE.Box3()
        //     .setFromObject(lastBackSofaLV[0])
        //     .getSize(new THREE.Vector3());

        // lastBackSofaLV[0].scale.x = leftCount + bkLSize.z * 4;
    } else {
        //Bottom
        {
            var btm = sofa.bottom.clone();
            var btmL = sofa.bottomL.clone();
            var btmR = sofa.bottomR.clone();

            if (!lastBottomSofasLV.includes(btm)) {
                lastBottomSofasLV.push(btm);
            }

            if (!lastBottomSofasLV.includes(btmL)) {
                lastBottomSofasLV.push(btmL);
            }
            if (!lastBottomSofasLV.includes(btmR)) {
                lastBottomSofasLV.push(btmR);
            }

            var btmSize = new THREE.Box3()
                .setFromObject(lastBottomSofasLV[0])
                .getSize(new THREE.Vector3());
            lastBottomSofasLV[1].position.setX(lastBottomSofasLV[0].position.x);
            lastBottomSofasLV[1].position.setZ(
                lastBottomSofasLV[0].position.z + btmSize.z / 2
            );

            lastBottomSofasLV[2].position.setX(lastBottomSofasLV[0].position.x);
            lastBottomSofasLV[2].position.setZ(
                lastBottomSofasLV[0].position.z - btmSize.z / 2
            );

            const btm_group = new THREE.Group();
            btm_group.name = "LeftBottoms";
            lastBottomSofasLV.forEach((e) => {
                e.rotation.y = Math.PI / 2;
                btm_group.add(e);
            });

            if (!leftbottoms.includes(btm_group)) {
                leftbottoms.push(btm_group);
            }
            leftbottoms.forEach((e) => {
                scene.add(e);
            });
        }

        //Back
        {
            var bk = sofa.singleback.clone();
            var bkL = sofa.singlebackL.clone();
            var bkR = sofa.singlebackR.clone();

            if (!lastBackSofaLV.includes(bk)) {
                lastBackSofaLV.push(bk);
            }

            if (!lastBackSofaLV.includes(bkL)) {
                lastBackSofaLV.push(bkL);
            }
            if (!lastBackSofaLV.includes(bkR)) {
                lastBackSofaLV.push(bkR);
            }

            var bkSize = new THREE.Box3()
                .setFromObject(lastBackSofaLV[0])
                .getSize(new THREE.Vector3());

            lastBackSofaLV[1].position.setX(lastBackSofaLV[0].position.x);
            lastBackSofaLV[1].position.setZ(
                lastBackSofaLV[0].position.z + bkSize.z / 2
            );

            lastBackSofaLV[2].position.setX(lastBackSofaLV[0].position.x);
            lastBackSofaLV[2].position.setZ(
                lastBackSofaLV[0].position.z - bkSize.z / 2
            );

            const bk_group = new THREE.Group();
            bk_group.name = "LeftBacks";

            lastBackSofaLV.forEach((e) => {
                e.rotation.y = Math.PI / 2;
                bk_group.add(e);
            });

            if (!leftbacks.includes(bk_group)) {
                leftbacks.push(bk_group);
            }
            leftbacks.forEach((e) => {
                scene.add(e);
            });
        }


        var leg_group = new THREE.Group();
        leg_group.name = "LeftLegs";
        for (var i = 0; i < 4; i++) {
            leg_group.add(sofa.leg.clone());
        }
        if (!leftlegs.includes(leg_group)) {
            leftlegs.push(leg_group);
        }

        leftlegs.forEach((e) => {
            scene.add(e);
        });
    }

}

function updateVerticalBottomLeft() {

    leftIndexs.forEach(function (e) {
        if (sofas.includes(sofas[e])) {
            if (sofas[e].name == sofa.single.name) {
                if (sofas[e].rotation.y > 0) {
                    if (leftIndexs.indexOf(e) == leftIndexs.length - 1) {
                        leftverticalIndex = e;
                    }

                }
            }
        }
    });
    if (leftbottoms.length > 0) {

        if (leftverticalSingleCount > 0 && sofas[leftverticalIndex] instanceof THREE.Object3D) {

            var sofaSize = new THREE.Box3()
                .setFromObject(sofas[leftverticalIndex])
                .getSize(new THREE.Vector3());
            for (var i = 0; i < leftlegs.length; i++) {
                if (leftlegs[i] instanceof THREE.Group) {
                    for (var j = 0; j < leftlegs[i].children.length; j++) {
                        if (j == 2 || j == leftlegs[i].children.length - 1) {
                            leftlegs[i].children[j].rotation.y = Math.PI / 2;
                        }
                        if (j == 0 || j == 1) {
                            leftlegs[i].children[j].rotation.y = -Math.PI / 2;
                        }

                        if (i == 0) {
                            if (j == 1 || j == leftlegs[i].children.length - 1) {
                                leftlegs[i].children[j].visible = true;
                            }
                            if (j == 0 || j == 2) {
                                leftlegs[i].children[j].visible = false;
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < leftbottoms.length; i++) {
                if (i > 0) {
                    var prevBtmLSize = new THREE.Box3()
                        .setFromObject(leftbottoms[i - 1].children[1])
                        .getSize(new THREE.Vector3());

                    if (leftverticalSingleCount > 3) {
                        if (leftverticalSingleCount % 2 == 0) {
                            leftbottoms[i].children[0].scale.setX(2 + prevBtmLSize.z * 3);

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(leftbottoms[i].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(leftbottoms[i - 1])
                                .getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3()
                                .setFromObject(leftbottoms[i - 1].children[1])
                                .getSize(new THREE.Vector3());

                            leftbottoms[i].children[1].position.setX(
                                leftbottoms[i].children[0].position.x
                            );
                            leftbottoms[i].children[1].position.setZ(
                                leftbottoms[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            leftbottoms[i].children[2].position.setX(
                                leftbottoms[i].children[0].position.x
                            );
                            leftbottoms[i].children[2].position.setZ(
                                leftbottoms[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            leftbottoms[i].position.setZ(
                                leftbottoms[i - 1].position.z -
                                currentBtmSize.z -
                                prevBtmLSize.z * 2
                            );

                            leftbottoms[i].position.setX(sofas[leftverticalIndex].position.x);
                            leftbottoms[i - 1].position.setX(
                                sofas[leftverticalIndex].position.x
                            );

                            var bkSize = new THREE.Box3()
                                .setFromObject(leftbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3()
                                .setFromObject(leftlegs[i].children[0])
                                .getSize(new THREE.Vector3());
                            leftlegs[i].position.setX(leftbottoms[i].position.x);
                            leftlegs[i].position.setZ(leftbottoms[i].position.z);
                            leftlegs[i].children[0].position.set(
                                btmSize.x / 2 - lSize.x,
                                0,
                                btmSize.z / 2
                            );
                            leftlegs[i].children[1].position.set(
                                btmSize.x / 2 - lSize.x,
                                0,
                                -btmSize.z / 2
                            );
                            leftlegs[i].children[2].position.set(
                                -btmSize.x / 2 - bkSize.x / 2,
                                0,
                                btmSize.z / 2 - lSize.z / 2
                            );
                            leftlegs[i].children[3].position.set(
                                -btmSize.x / 2 - bkSize.x / 2,
                                0,
                                -btmSize.z / 2 + lSize.z / 2
                            );
                        } else {
                            leftbottoms[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            leftbottoms[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(leftbottoms[i - 1].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3()
                                .setFromObject(leftbottoms[i - 1])
                                .getSize(new THREE.Vector3());

                            leftbottoms[i - 1].children[1].position.setX(
                                leftbottoms[i - 1].children[0].position.x
                            );
                            leftbottoms[i - 1].children[1].position.setZ(
                                leftbottoms[i - 1].children[0].position.z - prevBtmSize.z / 2
                            );

                            leftbottoms[i - 1].children[2].position.setX(
                                leftbottoms[i - 1].children[0].position.x
                            );
                            leftbottoms[i - 1].children[2].position.setZ(
                                leftbottoms[i - 1].children[0].position.z + prevBtmSize.z / 2
                            );

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(leftbottoms[i].children[0])
                                .getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {
                                leftbottoms[i - 1].position.setZ(
                                    leftbottoms[i - 2].position.z -
                                    prevBtmSize.z -
                                    prevBtmLSize.z * 2
                                );
                            }

                            leftbottoms[i].position.setZ(
                                leftbottoms[i - 1].position.z -
                                currentBtmSize.z / 2 -
                                prevBtmSize.z / 2 -
                                prevBtmLSize.z * 2
                            );

                            leftbottoms[i].children[1].position.setX(
                                leftbottoms[i].children[0].position.x
                            );
                            leftbottoms[i].children[1].position.setZ(
                                leftbottoms[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            leftbottoms[i].children[2].position.setX(
                                leftbottoms[i].children[0].position.x
                            );
                            leftbottoms[i].children[2].position.setZ(
                                leftbottoms[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            leftbottoms[i].position.setX(sofas[leftverticalIndex].position.x);
                            leftbottoms[i - 1].position.setX(
                                sofas[leftverticalIndex].position.x
                            );

                            var bkSize = new THREE.Box3()
                                .setFromObject(leftbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3()
                                .setFromObject(leftlegs[i].children[0])
                                .getSize(new THREE.Vector3());
                            leftlegs[i].position.setX(leftbottoms[i].position.x);
                            leftlegs[i].position.setZ(leftbottoms[i].position.z);
                            leftlegs[i].children[0].position.set(
                                btmSize.x / 2 - lSize.x,
                                0,
                                btmSize.z / 2
                            );
                            leftlegs[i].children[1].position.set(
                                btmSize.x / 2 - lSize.x,
                                0,
                                -btmSize.z / 2
                            );
                            leftlegs[i].children[2].position.set(
                                -btmSize.x / 2 - bkSize.x / 2,
                                0,
                                btmSize.z / 2 - lSize.z / 2
                            );
                            leftlegs[i].children[3].position.set(
                                -btmSize.x / 2 - bkSize.x / 2,
                                0,
                                -btmSize.z / 2 + lSize.z / 2
                            );

                            leftlegs[i - 1].position.setX(leftbottoms[i - 1].position.x);
                            leftlegs[i - 1].position.setZ(leftbottoms[i - 1].position.z);
                            leftlegs[i - 1].children[0].position.set(
                                btmSize.x / 2 - lSize.x,
                                0,
                                btmSize.z / 2
                            );
                            leftlegs[i - 1].children[1].position.set(
                                btmSize.x / 2 - lSize.x,
                                0,
                                -btmSize.z / 2
                            );
                            leftlegs[i - 1].children[2].position.set(
                                -btmSize.x / 2 - bkSize.x / 2,
                                0,
                                btmSize.z / 2 - lSize.z / 2
                            );
                            leftlegs[i - 1].children[3].position.set(
                                -btmSize.x / 2 - bkSize.x / 2,
                                0,
                                -btmSize.z / 2 + lSize.z / 2
                            );
                        }
                    }
                }
                if (i == 0) {
                    var btmSize = new THREE.Box3()
                        .setFromObject(leftbottoms[i].children[0])
                        .getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3()
                        .setFromObject(leftbottoms[i].children[1])
                        .getSize(new THREE.Vector3());

                    if (leftverticalSingleCount == 3) {
                        leftbottoms[i].children[0].scale.setX(3 + btmLSize.z * 2);
                        leftbottoms[i].position.setZ(
                            sofas[leftverticalIndex].position.z - sofaSize.z
                        );
                    } else if (leftverticalSingleCount == 2) {
                        leftbottoms[i].children[0].scale.setX(2 + btmLSize.z * 2);
                        leftbottoms[i].position.setZ(
                            sofas[leftverticalIndex].position.z - sofaSize.z / 2
                        );
                    } else if (leftverticalSingleCount == 1) {
                        leftbottoms[i].children[0].scale.setX(1 + btmLSize.z * 2);
                        leftbottoms[i].position.setZ(sofas[leftverticalIndex].position.z);
                    } else if (leftverticalSingleCount > 3) {
                        leftbottoms[i].children[0].scale.setX(2 + btmLSize.z * 2);
                        leftbottoms[i].position.setZ(
                            sofas[leftverticalIndex].position.z - sofaSize.z / 2
                        );
                    }

                    leftbottoms[i].children[1].position.setX(
                        leftbottoms[i].children[0].position.x
                    );
                    leftbottoms[i].children[1].position.setZ(
                        leftbottoms[i].children[0].position.z - btmSize.z / 2
                    );

                    leftbottoms[i].children[2].position.setX(
                        leftbottoms[i].children[0].position.x
                    );
                    leftbottoms[i].children[2].position.setZ(
                        leftbottoms[i].children[0].position.z + btmSize.z / 2
                    );

                    leftbottoms[i].position.setX(sofas[leftverticalIndex].position.x);

                    var bkSize = new THREE.Box3()
                        .setFromObject(leftbacks[i].children[0])
                        .getSize(new THREE.Vector3());
                    var lSize = new THREE.Box3()
                        .setFromObject(leftlegs[i].children[0])
                        .getSize(new THREE.Vector3());
                    leftlegs[i].position.setX(leftbottoms[i].position.x);
                    leftlegs[i].position.setZ(leftbottoms[i].position.z);
                    leftlegs[i].children[0].position.set(
                        btmSize.x / 2 - lSize.x,
                        0,
                        btmSize.z / 2
                    );
                    leftlegs[i].children[1].position.set(
                        btmSize.x / 2 - lSize.x,
                        0,
                        -btmSize.z / 2
                    );
                    leftlegs[i].children[2].position.set(
                        -btmSize.x / 2 - bkSize.x / 2,
                        0,
                        btmSize.z / 2 - lSize.z / 2
                    );
                    leftlegs[i].children[3].position.set(
                        -btmSize.x / 2 - bkSize.x / 2,
                        0,
                        -btmSize.z / 2 + lSize.z / 2
                    );
                }
            }

            //LeftBacks
            for (var i = 0; i < leftbacks.length; i++) {
                if (i > 0) {
                    var prevBtmLSize = new THREE.Box3()
                        .setFromObject(leftbacks[i - 1].children[1])
                        .getSize(new THREE.Vector3());

                    if (leftverticalSingleCount > 3) {
                        if (leftverticalSingleCount % 2 == 0) {
                            leftbacks[i].children[0].scale.setX(2 + prevBtmLSize.z * 3);

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(leftbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(leftbacks[i - 1])
                                .getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3()
                                .setFromObject(leftbacks[i - 1].children[1])
                                .getSize(new THREE.Vector3());

                            leftbacks[i].children[1].position.setX(
                                leftbacks[i].children[0].position.x
                            );
                            leftbacks[i].children[1].position.setZ(
                                leftbacks[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            leftbacks[i].children[2].position.setX(
                                leftbacks[i].children[0].position.x
                            );
                            leftbacks[i].children[2].position.setZ(
                                leftbacks[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            leftbacks[i].position.setZ(
                                leftbacks[i - 1].position.z -
                                currentBtmSize.z -
                                prevBtmLSize.z * 2
                            );

                            leftbacks[i].position.setX(
                                sofas[leftverticalIndex].position.x - sofaSize.z / 2
                            );
                            leftbacks[i - 1].position.setX(
                                sofas[leftverticalIndex].position.x - sofaSize.z / 2
                            );
                        } else {
                            leftbacks[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            leftbacks[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(leftbacks[i - 1].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3()
                                .setFromObject(leftbacks[i - 1])
                                .getSize(new THREE.Vector3());

                            leftbacks[i - 1].children[1].position.setX(
                                leftbacks[i - 1].children[0].position.x
                            );
                            leftbacks[i - 1].children[1].position.setZ(
                                leftbacks[i - 1].children[0].position.z - prevBtmSize.z / 2
                            );

                            leftbacks[i - 1].children[2].position.setX(
                                leftbacks[i - 1].children[0].position.x
                            );
                            leftbacks[i - 1].children[2].position.setZ(
                                leftbacks[i - 1].children[0].position.z + prevBtmSize.z / 2
                            );

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(leftbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {
                                leftbacks[i - 1].position.setZ(
                                    leftbacks[i - 2].position.z - prevBtmSize.z - prevBtmLSize.z * 2
                                );
                            }

                            leftbacks[i].position.setZ(
                                leftbacks[i - 1].position.z -
                                currentBtmSize.z / 2 -
                                prevBtmSize.z / 2 -
                                prevBtmLSize.z * 2
                            );

                            leftbacks[i].children[1].position.setX(
                                leftbacks[i].children[0].position.x
                            );
                            leftbacks[i].children[1].position.setZ(
                                leftbacks[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            leftbacks[i].children[2].position.setX(
                                leftbacks[i].children[0].position.x
                            );
                            leftbacks[i].children[2].position.setZ(
                                leftbacks[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            leftbacks[i].position.setX(
                                sofas[leftverticalIndex].position.x - sofaSize.z / 2
                            );
                            leftbacks[i - 1].position.setX(
                                sofas[leftverticalIndex].position.x - sofaSize.z / 2
                            );
                        }
                    }
                }
                if (i == 0) {
                    var btmSize = new THREE.Box3()
                        .setFromObject(leftbacks[i].children[0])
                        .getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3()
                        .setFromObject(leftbacks[i].children[1])
                        .getSize(new THREE.Vector3());
                    if (leftverticalSingleCount == 3) {
                        leftbacks[i].children[0].scale.setX(3 + btmLSize.z * 2);
                        leftbacks[i].position.setZ(
                            sofas[leftverticalIndex].position.z - sofaSize.z
                        );
                    } else if (leftverticalSingleCount == 2) {
                        leftbacks[i].children[0].scale.setX(2 + btmLSize.z * 2);
                        leftbacks[i].position.setZ(
                            sofas[leftverticalIndex].position.z - sofaSize.z / 2
                        );
                    } else if (leftverticalSingleCount == 1) {
                        leftbacks[i].children[0].scale.setX(1 + btmLSize.z * 2);
                        leftbacks[i].position.setZ(sofas[leftverticalIndex].position.z);
                    } else if (leftverticalSingleCount > 3) {
                        leftbacks[i].children[0].scale.setX(2 + btmLSize.z * 2);

                        leftbacks[i].position.setZ(
                            sofas[leftverticalIndex].position.z - sofaSize.z / 2
                        );
                    }

                    leftbacks[i].children[1].position.setX(
                        leftbacks[i].children[0].position.x
                    );
                    leftbacks[i].children[1].position.setZ(
                        leftbacks[i].children[0].position.z - btmSize.z / 2
                    );

                    leftbacks[i].children[2].position.setX(
                        leftbacks[i].children[0].position.x
                    );
                    leftbacks[i].children[2].position.setZ(
                        leftbacks[i].children[0].position.z + btmSize.z / 2
                    );

                    leftbacks[i].position.setX(
                        sofas[leftverticalIndex].position.x - sofaSize.z / 2
                    );
                }
            }
        }

    }
}

function addVerticalBottomRight() {
    var c = rightverticalSingleCount;

    if (c > 3) {
        if (c % 2 == 0) {
            lmax = 2;
        } else {
            lmax = 3;
        }
    } else {
        lmax = 3;
    }

    if (rightCount < lmax) {
        rightCount += 1;
    } else {
        lastBottomSofasRV = [];
        lastBackSofaRV = [];

        rightCount = 1;
    }

    // var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
    if (lastBottomSofasRV.length > 0) {
        // Bottom

        // var btmLSize = new THREE.Box3()
        //     .setFromObject(lastBottomSofasRV[1])
        //     .getSize(new THREE.Vector3());
        // var btmSize = new THREE.Box3()
        //     .setFromObject(lastBottomSofasRV[0])
        //     .getSize(new THREE.Vector3());

        // lastBottomSofasRV[0].scale.x = rightCount + btmLSize.z * 4;

        // //back

        // var bkLSize = new THREE.Box3()
        //     .setFromObject(lastBackSofaRV[1])
        //     .getSize(new THREE.Vector3());
        // var bkSize = new THREE.Box3()
        //     .setFromObject(lastBackSofaRV[0])
        //     .getSize(new THREE.Vector3());

        // lastBackSofaRV[0].scale.x = rightCount + bkLSize.z * 4;
    } else {
        //Bottom
        {
            var btm = sofa.bottom.clone();
            var btmL = sofa.bottomL.clone();
            var btmR = sofa.bottomR.clone();

            if (!lastBottomSofasRV.includes(btm)) {
                lastBottomSofasRV.push(btm);
            }

            if (!lastBottomSofasRV.includes(btmL)) {
                lastBottomSofasRV.push(btmL);
            }
            if (!lastBottomSofasRV.includes(btmR)) {
                lastBottomSofasRV.push(btmR);
            }

            var btmSize = new THREE.Box3()
                .setFromObject(lastBottomSofasRV[0])
                .getSize(new THREE.Vector3());
            lastBottomSofasRV[1].position.setX(lastBottomSofasRV[0].position.x);
            lastBottomSofasRV[1].position.setZ(
                lastBottomSofasRV[0].position.z + btmSize.z / 2
            );

            lastBottomSofasRV[2].position.setX(lastBottomSofasRV[0].position.x);
            lastBottomSofasRV[2].position.setZ(
                lastBottomSofasRV[0].position.z - btmSize.z / 2
            );

            const btm_group = new THREE.Group();
            btm_group.name = "RightBottoms";
            lastBottomSofasRV.forEach((e) => {
                e.rotation.y = Math.PI / 2;
                btm_group.add(e);
            });

            if (!rightbottoms.includes(btm_group)) {
                rightbottoms.push(btm_group);
            }
            rightbottoms.forEach((e) => {
                scene.add(e);
            });
        }

        //Back
        {
            var bk = sofa.singleback.clone();
            var bkL = sofa.singlebackL.clone();
            var bkR = sofa.singlebackR.clone();

            if (!lastBackSofaRV.includes(bk)) {
                lastBackSofaRV.push(bk);
            }

            if (!lastBackSofaRV.includes(bkL)) {
                lastBackSofaRV.push(bkL);
            }
            if (!lastBackSofaRV.includes(bkR)) {
                lastBackSofaRV.push(bkR);
            }

            var bkSize = new THREE.Box3()
                .setFromObject(lastBackSofaRV[0])
                .getSize(new THREE.Vector3());

            lastBackSofaRV[1].position.setX(lastBackSofaRV[0].position.x);
            lastBackSofaRV[1].position.setZ(
                lastBackSofaRV[0].position.z + bkSize.z / 2
            );

            lastBackSofaRV[2].position.setX(lastBackSofaRV[0].position.x);
            lastBackSofaRV[2].position.setZ(
                lastBackSofaRV[0].position.z - bkSize.z / 2
            );

            const bk_group = new THREE.Group();
            bk_group.name = "RightBacks";

            lastBackSofaRV.forEach((e) => {
                e.rotation.y = -Math.PI / 2;
                bk_group.add(e);
            });

            if (!rightbacks.includes(bk_group)) {
                rightbacks.push(bk_group);
            }
            rightbacks.forEach((e) => {
                scene.add(e);
            });
        }
        // Legs

        var leg_group = new THREE.Group();
        leg_group.name = "RightLegs";
        for (var i = 0; i < 4; i++) {
            leg_group.add(sofa.leg.clone());
        }
        if (!rightlegs.includes(leg_group)) {
            rightlegs.push(leg_group);
        }

        rightlegs.forEach((e) => {
            scene.add(e);
        });
    }

}

function updateVerticalBottomRight() {

    rightIndexs.forEach(function (e) {
        if (sofas.includes(sofas[e])) {
            if (sofas[e].name == sofa.single.name) {
                if (sofas[e].rotation.y < 0) {
                    if (rightIndexs.indexOf(e) == rightIndexs.length - 1) {
                        rightverticalIndex = e;
                    }

                }
            }
        }
    });
    if (rightbottoms.length > 0) {

        if (rightverticalIndex > 0) {


            var sofaSize = new THREE.Box3()
                .setFromObject(sofas[rightverticalIndex])
                .getSize(new THREE.Vector3());

            for (var i = 0; i < rightlegs.length; i++) {
                if (rightlegs[i] instanceof THREE.Group) {
                    for (var j = 0; j < rightlegs[i].children.length; j++) {
                        if (j == 2 || j == rightlegs[i].children.length - 1) {
                            rightlegs[i].children[j].rotation.y = -Math.PI / 2;
                        }
                        if (j == 0 || j == 1) {
                            rightlegs[i].children[j].rotation.y = Math.PI / 2;
                        }

                        if (i == 0) {
                            if (j == 1 || j == rightlegs[i].children.length - 1) {
                                rightlegs[i].children[j].visible = true;
                            }
                            if (j == 0 || j == 2) {
                                rightlegs[i].children[j].visible = false;
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < rightbottoms.length; i++) {
                if (i > 0) {
                    var prevBtmLSize = new THREE.Box3()
                        .setFromObject(rightbottoms[i - 1].children[1])
                        .getSize(new THREE.Vector3());

                    if (rightverticalSingleCount > 3) {
                        if (rightverticalSingleCount % 2 == 0) {
                            rightbottoms[i].children[0].scale.setX(2 + prevBtmLSize.z * 3);

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(rightbottoms[i].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(rightbottoms[i - 1])
                                .getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3()
                                .setFromObject(rightbottoms[i - 1].children[1])
                                .getSize(new THREE.Vector3());

                            rightbottoms[i].children[1].position.setX(
                                rightbottoms[i].children[0].position.x
                            );
                            rightbottoms[i].children[1].position.setZ(
                                rightbottoms[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            rightbottoms[i].children[2].position.setX(
                                rightbottoms[i].children[0].position.x
                            );
                            rightbottoms[i].children[2].position.setZ(
                                rightbottoms[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            rightbottoms[i].position.setZ(
                                rightbottoms[i - 1].position.z -
                                currentBtmSize.z -
                                prevBtmLSize.z * 2
                            );

                            rightbottoms[i].position.setX(sofas[rightverticalIndex].position.x);
                            rightbottoms[i - 1].position.setX(
                                sofas[rightverticalIndex].position.x
                            );

                            var bkSize = new THREE.Box3()
                                .setFromObject(rightbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3()
                                .setFromObject(rightlegs[i].children[0])
                                .getSize(new THREE.Vector3());
                            rightlegs[i].position.setX(rightbottoms[i].position.x);
                            rightlegs[i].position.setZ(rightbottoms[i].position.z);
                            rightlegs[i].children[0].position.set(
                                btmSize.x / 2 + lSize.x,
                                0,
                                btmSize.z / 2
                            );
                            rightlegs[i].children[1].position.set(
                                btmSize.x / 2 + lSize.x,
                                0,
                                -btmSize.z / 2
                            );
                            rightlegs[i].children[2].position.set(
                                -btmSize.x / 2 + bkSize.x / 2,
                                0,
                                btmSize.z / 2 - lSize.z / 2
                            );
                            rightlegs[i].children[3].position.set(
                                -btmSize.x / 2 + bkSize.x / 2,
                                0,
                                -btmSize.z / 2 + lSize.z / 2
                            );
                        } else {
                            rightbottoms[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            rightbottoms[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(rightbottoms[i - 1].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3()
                                .setFromObject(rightbottoms[i - 1])
                                .getSize(new THREE.Vector3());

                            rightbottoms[i - 1].children[1].position.setX(
                                rightbottoms[i - 1].children[0].position.x
                            );
                            rightbottoms[i - 1].children[1].position.setZ(
                                rightbottoms[i - 1].children[0].position.z - prevBtmSize.z / 2
                            );

                            rightbottoms[i - 1].children[2].position.setX(
                                rightbottoms[i - 1].children[0].position.x
                            );
                            rightbottoms[i - 1].children[2].position.setZ(
                                rightbottoms[i - 1].children[0].position.z + prevBtmSize.z / 2
                            );

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(rightbottoms[i].children[0])
                                .getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {
                                rightbottoms[i - 1].position.setZ(
                                    rightbottoms[i - 2].position.z -
                                    prevBtmSize.z -
                                    prevBtmLSize.z * 2
                                );
                            }

                            rightbottoms[i].position.setZ(
                                rightbottoms[i - 1].position.z -
                                currentBtmSize.z / 2 -
                                prevBtmSize.z / 2 -
                                prevBtmLSize.z * 2
                            );

                            rightbottoms[i].children[1].position.setX(
                                rightbottoms[i].children[0].position.x
                            );
                            rightbottoms[i].children[1].position.setZ(
                                rightbottoms[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            rightbottoms[i].children[2].position.setX(
                                rightbottoms[i].children[0].position.x
                            );
                            rightbottoms[i].children[2].position.setZ(
                                rightbottoms[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            rightbottoms[i].position.setX(sofas[rightverticalIndex].position.x);
                            rightbottoms[i - 1].position.setX(
                                sofas[rightverticalIndex].position.x
                            );

                            var bkSize = new THREE.Box3()
                                .setFromObject(rightbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3()
                                .setFromObject(rightlegs[i].children[0])
                                .getSize(new THREE.Vector3());
                            rightlegs[i].position.setX(rightbottoms[i].position.x);
                            rightlegs[i].position.setZ(rightbottoms[i].position.z);
                            rightlegs[i].children[0].position.set(
                                btmSize.x / 2 + lSize.x,
                                0,
                                btmSize.z / 2
                            );
                            rightlegs[i].children[1].position.set(
                                btmSize.x / 2 + lSize.x,
                                0,
                                -btmSize.z / 2
                            );
                            rightlegs[i].children[2].position.set(
                                -btmSize.x / 2 + bkSize.x / 2,
                                0,
                                btmSize.z / 2 - lSize.z / 2
                            );
                            rightlegs[i].children[3].position.set(
                                -btmSize.x / 2 + bkSize.x / 2,
                                0,
                                -btmSize.z / 2 + lSize.z / 2
                            );

                            rightlegs[i - 1].position.setX(rightbottoms[i - 1].position.x);
                            rightlegs[i - 1].position.setZ(rightbottoms[i - 1].position.z);
                            rightlegs[i - 1].children[0].position.set(
                                btmSize.x / 2 + lSize.x,
                                0,
                                btmSize.z / 2
                            );
                            rightlegs[i - 1].children[1].position.set(
                                btmSize.x / 2 + lSize.x,
                                0,
                                -btmSize.z / 2
                            );
                            rightlegs[i - 1].children[2].position.set(
                                -btmSize.x / 2 + bkSize.x / 2,
                                0,
                                btmSize.z / 2 - lSize.z / 2
                            );
                            rightlegs[i - 1].children[3].position.set(
                                -btmSize.x / 2 + bkSize.x / 2,
                                0,
                                -btmSize.z / 2 + lSize.z / 2
                            );
                        }
                    }
                }
                if (i == 0) {
                    var btmSize = new THREE.Box3()
                        .setFromObject(rightbottoms[i].children[0])
                        .getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3()
                        .setFromObject(rightbottoms[i].children[1])
                        .getSize(new THREE.Vector3());
                    if (rightverticalSingleCount == 3) {


                        rightbottoms[i].children[0].scale.setX(3 + btmLSize.z * 2);

                        rightbottoms[i].position.setZ(
                            sofas[rightverticalIndex].position.z - sofaSize.z
                        );
                    } else if (rightverticalSingleCount == 2) {
                        rightbottoms[i].children[0].scale.setX(2 + btmLSize.z * 2);

                        rightbottoms[i].position.setZ(
                            sofas[rightverticalIndex].position.z - sofaSize.z / 2
                        );
                    } else if (rightverticalSingleCount == 1) {
                        rightbottoms[i].children[0].scale.setX(1 + btmLSize.z * 2);

                        rightbottoms[i].position.setZ(sofas[rightverticalIndex].position.z);
                    } else if (rightverticalSingleCount > 3) {
                        rightbottoms[i].children[0].scale.setX(2 + btmLSize.z * 2);


                        rightbottoms[i].position.setZ(
                            sofas[rightverticalIndex].position.z - sofaSize.z / 2
                        );
                    }

                    rightbottoms[i].children[1].position.setX(

                        rightbottoms[i].children[0].position.x
                    );
                    rightbottoms[i].children[1].position.setZ(
                        rightbottoms[i].children[0].position.z - btmSize.z / 2
                    );

                    rightbottoms[i].children[2].position.setX(
                        rightbottoms[i].children[0].position.x
                    );
                    rightbottoms[i].children[2].position.setZ(
                        rightbottoms[i].children[0].position.z + btmSize.z / 2
                    );

                    rightbottoms[i].position.setX(sofas[rightverticalIndex].position.x);

                    var bkSize = new THREE.Box3()
                        .setFromObject(rightbacks[i].children[0])
                        .getSize(new THREE.Vector3());
                    var lSize = new THREE.Box3()
                        .setFromObject(rightlegs[i].children[0])
                        .getSize(new THREE.Vector3());
                    rightlegs[i].position.setX(rightbottoms[i].position.x);
                    rightlegs[i].position.setZ(rightbottoms[i].position.z);
                    rightlegs[i].children[0].position.set(
                        btmSize.x / 2 + lSize.x,
                        0,
                        btmSize.z / 2
                    );
                    rightlegs[i].children[1].position.set(
                        btmSize.x / 2 + lSize.x,
                        0,
                        -btmSize.z / 2
                    );
                    rightlegs[i].children[2].position.set(
                        -btmSize.x / 2 + bkSize.x / 2,
                        0,
                        btmSize.z / 2 - lSize.z / 2
                    );
                    rightlegs[i].children[3].position.set(
                        -btmSize.x / 2 + bkSize.x / 2,
                        0,
                        -btmSize.z / 2 + lSize.z / 2
                    );
                }
            }
            for (var i = 0; i < rightbacks.length; i++) {
                if (i > 0) {
                    var prevBtmLSize = new THREE.Box3()
                        .setFromObject(rightbacks[i - 1].children[1])
                        .getSize(new THREE.Vector3());

                    if (rightverticalSingleCount > 3) {
                        if (rightverticalSingleCount % 2 == 0) {
                            rightbacks[i].children[0].scale.setX(2 + prevBtmLSize.z * 3);

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(rightbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(rightbacks[i - 1])
                                .getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3()
                                .setFromObject(rightbacks[i - 1].children[1])
                                .getSize(new THREE.Vector3());

                            rightbacks[i].children[1].position.setX(
                                rightbacks[i].children[0].position.x
                            );
                            rightbacks[i].children[1].position.setZ(
                                rightbacks[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            rightbacks[i].children[2].position.setX(
                                rightbacks[i].children[0].position.x
                            );
                            rightbacks[i].children[2].position.setZ(
                                rightbacks[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            rightbacks[i].position.setZ(
                                rightbacks[i - 1].position.z -
                                currentBtmSize.z -
                                prevBtmLSize.z * 2
                            );

                            rightbacks[i].position.setX(
                                sofas[rightverticalIndex].position.x + sofaSize.z / 2
                            );
                            rightbacks[i - 1].position.setX(
                                sofas[rightverticalIndex].position.x + sofaSize.z / 2
                            );
                        } else {
                            rightbacks[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            rightbacks[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3()
                                .setFromObject(rightbacks[i - 1].children[0])
                                .getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3()
                                .setFromObject(rightbacks[i - 1])
                                .getSize(new THREE.Vector3());

                            rightbacks[i - 1].children[1].position.setX(
                                rightbacks[i - 1].children[0].position.x
                            );
                            rightbacks[i - 1].children[1].position.setZ(
                                rightbacks[i - 1].children[0].position.z + prevBtmSize.z / 2
                            );

                            rightbacks[i - 1].children[2].position.setX(
                                rightbacks[i - 1].children[0].position.x
                            );
                            rightbacks[i - 1].children[2].position.setZ(
                                rightbacks[i - 1].children[0].position.z - prevBtmSize.z / 2
                            );

                            var currentBtmSize = new THREE.Box3()
                                .setFromObject(rightbacks[i].children[0])
                                .getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {
                                rightbacks[i - 1].position.setZ(
                                    rightbacks[i - 2].position.z -
                                    prevBtmSize.z -
                                    prevBtmLSize.z * 2
                                );
                            }

                            rightbacks[i].position.setZ(
                                rightbacks[i - 1].position.z -
                                currentBtmSize.z / 2 -
                                prevBtmSize.z / 2 -
                                prevBtmLSize.z * 2
                            );

                            rightbacks[i].children[1].position.setX(
                                rightbacks[i].children[0].position.x
                            );
                            rightbacks[i].children[1].position.setZ(
                                rightbacks[i].children[0].position.z + currentBtmSize.z / 2
                            );

                            rightbacks[i].children[2].position.setX(
                                rightbacks[i].children[0].position.x
                            );
                            rightbacks[i].children[2].position.setZ(
                                rightbacks[i].children[0].position.z - currentBtmSize.z / 2
                            );

                            rightbacks[i].position.setX(
                                sofas[rightverticalIndex].position.x + sofaSize.z / 2
                            );
                            rightbacks[i - 1].position.setX(
                                sofas[rightverticalIndex].position.x + sofaSize.z / 2
                            );
                        }
                    }
                }
                if (i == 0) {
                    var btmSize = new THREE.Box3()
                        .setFromObject(rightbacks[i].children[0])
                        .getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3()
                        .setFromObject(rightbacks[i].children[1])
                        .getSize(new THREE.Vector3());
                    if (rightverticalSingleCount == 3) {
                        rightbacks[i].children[0].scale.setX(3 + btmLSize.z * 2);
                        rightbacks[i].position.setZ(
                            sofas[rightverticalIndex].position.z - sofaSize.z
                        );
                    } else if (rightverticalSingleCount == 2) {
                        rightbacks[i].children[0].scale.setX(2 + btmLSize.z * 2);
                        rightbacks[i].position.setZ(
                            sofas[rightverticalIndex].position.z - sofaSize.z / 2
                        );
                    } else if (rightverticalSingleCount == 1) {
                        rightbacks[i].children[0].scale.setX(1 + btmLSize.z * 2);
                        rightbacks[i].position.setZ(sofas[rightverticalIndex].position.z);
                    } else if (rightverticalSingleCount > 3) {
                        rightbacks[i].children[0].scale.setX(2 + btmLSize.z * 2);
                        rightbacks[i].children[0].scale.setX(2);
                        rightbacks[i].position.setZ(
                            sofas[rightverticalIndex].position.z - sofaSize.z / 2
                        );
                    }

                    rightbacks[i].children[1].position.setX(
                        rightbacks[i].children[0].position.x
                    );
                    rightbacks[i].children[1].position.setZ(
                        rightbacks[i].children[0].position.z + btmSize.z / 2
                    );

                    rightbacks[i].children[2].position.setX(
                        rightbacks[i].children[0].position.x
                    );
                    rightbacks[i].children[2].position.setZ(
                        rightbacks[i].children[0].position.z - btmSize.z / 2
                    );

                    rightbacks[i].position.setX(
                        sofas[rightverticalIndex].position.x + sofaSize.z / 2
                    );
                }
            }
        }
    }
}

function addArmrest() {
    if (sofa.armrestL && sofa.armrestR) {
        var sl = sofa.armrestL.clone();
        var sr = sofa.armrestR.clone();
        var legFL = sofa.leg.clone();
        var legRL = sofa.leg.clone();
        var legFR = sofa.leg.clone();
        var legRR = sofa.leg.clone();

        // var armrestSize = new THREE.Box3().setFromObject(sl).getSize(new THREE.Vector3());
        // var lSize =  new THREE.Box3().setFromObject(legFL).getSize(new THREE.Vector3());

        // legFL.position.set(sl.position.x+armrestSize.x/2,0,sl.position.z+armrestSize.z/3-lSize.z/2);
        // legRL.position.set(sl.position.x+armrestSize.x/2,0,sl.position.z-armrestSize.z/2+lSize.z/4);

        // legFR.position.set(sr.position.x-armrestSize.x/2,0,sr.position.z+armrestSize.z/3-lSize.z/2);
        // legRR.position.set(sr.position.x-armrestSize.x/2,0,sr.position.z-armrestSize.z/2+lSize.z/4);
        // sl.add(legFL);
        // sl.add(legRL);
        // sr.add(legFR);
        // sr.add(legRR);

        if (!armrests.includes(sl)) {
            armrests.push(sl);
        }
        if (!armrests.includes(sr)) {
            armrests.push(sr);
        }

        armrests.forEach((e) => {
            if (e instanceof THREE.Object3D) {
                scene.add(e);
                e.visible = false;
            }
        });

    }
}

function updateArmrests(index1, index2) {

    if (sofas.length > 0) {

        var a = new THREE.Box3()
            .setFromObject(sofa.single.children[0])
            .getSize(new THREE.Vector3());

        var b = new THREE.Box3()
            .setFromObject(sofa.single.children[0])
            .getSize(new THREE.Vector3());

        var armrestSizeL = new THREE.Box3()
            .setFromObject(sofa.armrestL)
            .getSize(new THREE.Vector3());
        var armrestSizeR = new THREE.Box3()
            .setFromObject(sofa.armrestR)
            .getSize(new THREE.Vector3());
        var bkSize = new THREE.Box3()
            .setFromObject(sofa.singleback.children[0])
            .getSize(new THREE.Vector3());
        if (armrests.length > 0) {
            if (sofas[index1] instanceof THREE.Object3D) {
                if (sofas[index1].rotation.y > 0) {
                    armrests[0].visible = true;

                    armrests[0].rotation.y = Math.PI / 2;

                    armrests[0].position.setZ(sofas[index1].position.z + a.x / 2);
                    armrests[0].position.setX(
                        sofas[index1].position.x + a.z / 2 - armrestSizeL.z / 2 + bkSize.z / 2
                    );
                } else {
                    // armrests[0].visible = true;
                    armrests[0].rotation.y = 0;

                    armrests[0].position.setX(sofas[index1].position.x - a.x / 2);
                    armrests[0].position.setZ(sofas[index1].position.z);
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
                    sofas[index2].position.x + b.z / 2 - armrestSizeR.z / 2 + bkSize.z / 2
                );
            } else {
                // armrests[1].visible = true;
                armrests[1].rotation.y = 0;

                armrests[1].position.setX(sofas[index2].position.x + b.x / 2);
                armrests[1].position.setZ(sofas[index2].position.z);
            }

            // sofas[index1].position.setY(armrests[0].position.y);
            // sofas[index2].position.setY(armrests[1].position.y)
        }
    }
}

function addChaise(index) {
    if (sofa.chaiseL && sofa.chaiseR) {
        if (index != null) {
            var sofaSize = new THREE.Box3()
                .setFromObject(sofas[index])
                .getSize(new THREE.Vector3());
            var armSize;
            //0 - Pillow
            //1 - Legs
            //2 - Seat
            //3 - Bottom
            //4 - Armrest
            //5 - Back
            for (var i = 0; i < sofa.chaiseL.children.length; i++) {
                if (sofa.chaiseL.children[i] instanceof THREE.Object3D) {
                    armSize = new THREE.Box3()
                        .setFromObject(sofa.chaiseL.children[i].children[4])
                        .getSize(new THREE.Vector3());
                }
            }
            if (isLeft) {
                var s = sofa.chaiseR.clone();

                scene.add(s);
                s.position.setX(sofas[index].position.x - sofaSize.x - armSize.x / 2);

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                armrests[0].visible = false;
                lasthSingleCount += 1;
            }
            if (isRight) {
                var s = sofa.chaiseL.clone();

                scene.add(s);
                s.position.setX(sofas[index].position.x + sofaSize.x + armSize.x / 2);
                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                armrests[1].visible = false;
                lasthSingleCount -= 1;
            }
        }
    }
}

function addCorner(index) {
    if (sofa.cornerL && sofa.cornerR) {
        if (index != null) {
            var sofaSize = new THREE.Box3()
                .setFromObject(sofas[index])
                .getSize(new THREE.Vector3());
            if (isLeft) {
                var s = sofa.cornerR.clone();

                scene.add(s);

                if (sofas[index].rotation.y > 0) {
                    s.rotation.y = Math.PI / 2;
                    s.position.setX(sofas[index].position.x);
                    s.position.setZ(sofas[index].position.z + sofaSize.z);
                } else {
                    s.position.setX(sofas[index].position.x - sofaSize.x);
                }

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                armrests[0].visible = false;
                lasthSingleCount += 1;
            }
            if (isRight) {
                var s = sofa.cornerL.clone();

                scene.add(s);
                s.position.setX(sofas[index].position.x + sofaSize.x);
                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                armrests[1].visible = false;
                lasthSingleCount -= 1;
            }
        }
    }
}

function addOttoman(index) {
    if (sofa.ottoman) {
        if (index != null) {
            var s = sofa.ottoman.clone();
            var sofaSize;
            if (
                sofas[index].name == sofa.chaiseL.name ||
                sofas[index].name == sofa.chaiseR.name
            ) {
                for (var i = 0; i < sofas[index].children.length; i++) {
                    sofaSize = new THREE.Box3()
                        .setFromObject(sofas[index].children[i].children[3])
                        .getSize(new THREE.Vector3());
                }
            } else if (sofas[index].name == sofa.ottoman.name) {
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index])
                    .getSize(new THREE.Vector3());
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
                s.position.setX(sofas[index].position.x);
                s.position.setZ(sofas[index].position.z + sofaSize.z);

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                lasthSingleCount += 1;
            }
            if (isRight) {
                scene.add(s);
                s.position.setX(sofas[index].position.x);
                s.position.setZ(sofas[index].position.z + sofaSize.z);

                if (!sofas.includes(s)) {
                    sofas.push(s);
                }
                lasthSingleCount += 1;
            }
        }
    }
}

function getLoading(value) {
    loading += value;
}

function loadAsync(url) {
    return new Promise((resolve) => {
        new THREE.GLTFLoader().load(url, resolve);
    });
}

function loadSofa() {
    let p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16;

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
    var axis = new THREE.AxesHelper(0.4);
    nullObject.add(axis);
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
                for (var i = 0; i < sofas[index1].children.length; i++) {
                    sofaSize = new THREE.Box3()
                        .setFromObject(sofas[index1].children[i].children[3])
                        .getSize(new THREE.Vector3());
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
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index1].children[0])
                    .getSize(new THREE.Vector3());

                obj1.position.x = sofas[index1].position.x - 0.1;
                obj1.position.z = sofas[index1].position.z + sofaSize.z + 0.25;

                null0.position.x = obj1.position.x;
                null0.position.z = obj1.position.z;

                obj3.position.x = obj1.position.x + 0.25;
                obj3.position.z = obj1.position.z;
            }
            //Ottoman
            else if (sofas[index1].name == sofa.ottoman.name) {
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index1].children[1])
                    .getSize(new THREE.Vector3());

                obj1.position.x = sofas[index1].position.x - 0.1;
                obj1.position.z = sofas[index1].position.z + sofaSize.z;

                null0.position.x = obj1.position.x;
                null0.position.z = obj1.position.z;

                obj3.position.x = obj1.position.x + 0.25;
                obj3.position.z = obj1.position.z;
            }
            //Left Single 
            else if (sofas[index1].rotation.y == 0) {
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index1].children[1])
                    .getSize(new THREE.Vector3());
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
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index2].children[0])
                    .getSize(new THREE.Vector3());

                obj2.position.x = sofas[index2].position.x + 0.1;
                obj2.position.z = sofas[index2].position.z + sofaSize.z + 0.25;
                null1.position.x = obj2.position.x;
                null1.position.z = obj2.position.z;
                obj4.position.x = obj2.position.x + 0.25;
                obj4.position.z = obj2.position.z;
            }
            //Ottoman
            else if (sofas[index2].name == sofa.ottoman.name) {
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index2].children[1])
                    .getSize(new THREE.Vector3());

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
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index2])
                    .getSize(new THREE.Vector3());

                for (var i = 0; i < sofas[index2].children.length; i++) {
                    sofaSize = new THREE.Box3()
                        .setFromObject(sofas[index2].children[i].children[3])
                        .getSize(new THREE.Vector3());
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
                sofaSize = new THREE.Box3()
                    .setFromObject(sofas[index2].children[1])
                    .getSize(new THREE.Vector3());

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
        var sofaSize = new THREE.Box3()
            .setFromObject(sofas[index])
            .getSize(new THREE.Vector3());
        var r0 = remove_btn_group.children[0];
        obj.position.x =
            sofas[index].position.x - sofaSize.x - obj.scale.x - armrestSize.x * 2;

        null_group.children[0].position.x = obj.position.x;
        r0.position.x = obj.position.x;
    }
    if (obj == remove_btn_group.children[0]) {
        var sofaSize = new THREE.Box3()
            .setFromObject(sofas[index])
            .getSize(new THREE.Vector3());

        var r0 = add_btn_group.children[0];
        obj.position.setX(
            sofas[index].position.x - sofaSize.x / 4 - obj.scale.x - armrestSize.x * 2
        );

        r0.position.x = obj.position.x;
        null_group.children[0].position.x = r0.position.x;
    }

    if (obj == add_btn_group.children[1]) {
        var sofaSize = new THREE.Box3()
            .setFromObject(sofas[index])
            .getSize(new THREE.Vector3());
        var r1 = remove_btn_group.children[1];
        obj.position.x =
            sofas[index].position.x + sofaSize.x + obj.scale.x + armrestSize.x * 2;
        null_group.children[1].position.x = obj.position.x;
        r1.position.x = obj.position.x;
    }
    if (obj == remove_btn_group.children[1]) {
        var sofaSize = new THREE.Box3()
            .setFromObject(sofas[index])
            .getSize(new THREE.Vector3());
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

function adjustHeight() {
    if (sofas.length > 0) {
        sofas.forEach((e) => {
            if (e instanceof THREE.Object3D) {
                if (e.children[0].name == "SingleSeat") {
                    var seatSize = new THREE.Box3()
                        .setFromObject(sofa.single.children[0])
                        .getSize(new THREE.Vector3());
                    e.children[0].position.setY(sHeight * ftTom - seatSize.y);
                }
                if (e.children[1].name == "pillow") {
                    var seatSize = new THREE.Box3()
                        .setFromObject(sofa.single.children[0])
                        .getSize(new THREE.Vector3());

                    e.children[1].position.setY(e.children[0].position.y + seatSize.y);
                }
                if (e.name == sofa.ottoman.name) {
                    var seatSize = new THREE.Box3()
                        .setFromObject(sofa.single.children[0])
                        .getSize(new THREE.Vector3());
                    var bottomSize = new THREE.Box3()
                        .setFromObject(sofa.bottom)
                        .getSize(new THREE.Vector3());
                    e.children[1].position.setY(sHeight * ftTom - seatSize.y);
                    e.children[2].scale.setY(
                        ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                    );
                }
                if (e.name == sofa.chaiseL.name) {
                    //0 - Pillow
                    //1 - Legs
                    //2 - Seat
                    //3 - Bottom
                    //4 - Armrest
                    //5 - Back
                    var backSize = new THREE.Box3()
                        .setFromObject(sofa.singleback)
                        .getSize(new THREE.Vector3());
                    var bottomSize = new THREE.Box3()
                        .setFromObject(sofa.bottom)
                        .getSize(new THREE.Vector3());
                    var armSize = new THREE.Box3()
                        .setFromObject(sofa.armrestL)
                        .getSize(new THREE.Vector3());
                    for (var i = 0; i < e.children.length; i++) {
                        // console.log(e.children[i])
                        var seatSize = new THREE.Box3()
                            .setFromObject(e.children[i].children[2])
                            .getSize(new THREE.Vector3());

                        e.children[i].children[2].position.setY(
                            sHeight * ftTom - seatSize.y
                        );

                        if (sHeight == 1.25) {
                            e.children[i].children[4].scale.setY(
                                (armSize.y - seatSize.y + 0.05) / armSize.y
                            );
                            e.children[i].children[5].scale.setY(
                                (backSize.y - seatSize.y + 0.05) / backSize.y
                            );
                        } else {
                            e.children[i].children[4].scale.setY(1);
                            e.children[i].children[5].scale.setY(1);
                        }
                        e.children[i].children[3].scale.setY(
                            ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                        );
                        e.children[i].children[0].position.setY(
                            e.children[i].children[2].position.y + seatSize.y
                        );
                    }
                } else if (e.name == sofa.chaiseR.name) {
                    //0 - Pillow
                    //1 - Legs
                    //2 - Seat
                    //3 - Bottom
                    //4 - Armrest
                    //5 - Back
                    var backSize = new THREE.Box3()
                        .setFromObject(sofa.singleback)
                        .getSize(new THREE.Vector3());
                    var bottomSize = new THREE.Box3()
                        .setFromObject(sofa.bottom)
                        .getSize(new THREE.Vector3());
                    var armSize = new THREE.Box3()
                        .setFromObject(sofa.armrestL)
                        .getSize(new THREE.Vector3());
                    for (var i = 0; i < e.children.length; i++) {
                        // console.log(e.children[i])
                        var seatSize = new THREE.Box3()
                            .setFromObject(e.children[i].children[2])
                            .getSize(new THREE.Vector3());

                        e.children[i].children[2].position.setY(
                            sHeight * ftTom - seatSize.y
                        );

                        if (sHeight == 1.25) {
                            e.children[i].children[4].scale.setY(
                                (armSize.y - seatSize.y + 0.05) / armSize.y
                            );
                            e.children[i].children[5].scale.setY(
                                (backSize.y - seatSize.y + 0.05) / backSize.y
                            );
                        } else {
                            e.children[i].children[4].scale.setY(1);
                            e.children[i].children[5].scale.setY(1);
                        }
                        e.children[i].children[3].scale.setY(
                            ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                        );
                        e.children[i].children[0].position.setY(
                            e.children[i].children[2].position.y + seatSize.y
                        );
                    }
                }
                if (e.name == sofa.cornerL.name) {
                    //0 - Pillow
                    //1 - Legs
                    //2 - SingleSeat
                    //3 - Bottom
                    //4 - Backs
                    var backSize = new THREE.Box3()
                        .setFromObject(sofa.singleback)
                        .getSize(new THREE.Vector3());
                    var bottomSize = new THREE.Box3()
                        .setFromObject(sofa.bottom)
                        .getSize(new THREE.Vector3());
                    for (var i = 0; i < e.children.length; i++) {
                        var seatSize = new THREE.Box3()
                            .setFromObject(e.children[i].children[2])
                            .getSize(new THREE.Vector3());

                        e.children[i].children[2].position.setY(
                            sHeight * ftTom - seatSize.y
                        );
                        if (sHeight == 1.25) {
                            e.children[i].children[4].scale.setY(
                                (backSize.y - seatSize.y + 0.05) / backSize.y
                            );
                        } else {
                            e.children[i].children[4].scale.setY(1);
                        }

                        e.children[i].children[3].scale.setY(
                            ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                        );
                        e.children[i].children[0].position.setY(
                            e.children[i].children[2].position.y + seatSize.y
                        );
                    }
                } else if (e.name == sofa.cornerR.name) {
                    //0 - Pillow
                    //1 - Legs
                    //2 - SingleSeat
                    //3 - Bottom
                    //4 - Backs
                    var backSize = new THREE.Box3()
                        .setFromObject(sofa.singleback)
                        .getSize(new THREE.Vector3());
                    var bottomSize = new THREE.Box3()
                        .setFromObject(sofa.bottom)
                        .getSize(new THREE.Vector3());
                    for (var i = 0; i < e.children.length; i++) {
                        var seatSize = new THREE.Box3()
                            .setFromObject(e.children[i].children[2])
                            .getSize(new THREE.Vector3());

                        e.children[i].children[2].position.setY(
                            sHeight * ftTom - seatSize.y
                        );
                        if (sHeight == 1.25) {
                            e.children[i].children[4].scale.setY(
                                (backSize.y - seatSize.y + 0.05) / backSize.y
                            );
                        } else {
                            e.children[i].children[4].scale.setY(1);
                        }

                        e.children[i].children[3].scale.setY(
                            ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                        );
                        e.children[i].children[0].position.setY(
                            e.children[i].children[2].position.y + seatSize.y
                        );
                    }
                }
            }
        });

        if (backs.length > 0) {
            backs.forEach((b) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var backSize = new THREE.Box3()
                    .setFromObject(sofa.singleback)
                    .getSize(new THREE.Vector3());

                if (b instanceof THREE.Object3D) {
                    if (sHeight == 1.25) {
                        b.scale.setY((backSize.y - seatSize.y + 0.05) / backSize.y);
                    } else {
                        b.scale.setY(1);
                    }
                }
            });
        }

        if (leftbacks.length > 0) {
            leftbacks.forEach((b) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var backSize = new THREE.Box3()
                    .setFromObject(sofa.singleback)
                    .getSize(new THREE.Vector3());
                if (b instanceof THREE.Object3D) {
                    if (sHeight == 1.25) {
                        b.scale.setY((backSize.y - seatSize.y + 0.05) / backSize.y);
                    } else {
                        b.scale.setY(1);
                    }
                }
            });
        }

        if (rightbacks.length > 0) {
            rightbacks.forEach((b) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var backSize = new THREE.Box3()
                    .setFromObject(sofa.singleback)
                    .getSize(new THREE.Vector3());
                if (b instanceof THREE.Object3D) {
                    if (sHeight == 1.25) {
                        b.scale.setY((backSize.y - seatSize.y + 0.05) / backSize.y);
                    } else {
                        b.scale.setY(1);
                    }
                }
            });
        }

        if (bottoms.length > 0) {
            bottoms.forEach((b) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var bottomSize = new THREE.Box3()
                    .setFromObject(sofa.bottom)
                    .getSize(new THREE.Vector3());
                if (b instanceof THREE.Object3D) {
                    b.scale.setY(
                        ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                    );

                    // b.children[0].scale.setY((seatSize.y+sHeight*ftTom) )
                }
            });
        }

        if (leftbottoms.length > 0) {
            leftbottoms.forEach((b) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var bottomSize = new THREE.Box3()
                    .setFromObject(sofa.bottom)
                    .getSize(new THREE.Vector3());
                if (b instanceof THREE.Object3D) {
                    b.scale.setY(
                        ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                    );
                }
            });
        }
        if (rightbottoms.length > 0) {
            rightbottoms.forEach((b) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var bottomSize = new THREE.Box3()
                    .setFromObject(sofa.bottom)
                    .getSize(new THREE.Vector3());
                if (b instanceof THREE.Object3D) {
                    b.scale.setY(
                        ((sHeight * ftTom - seatSize.y) / bottomSize.y).toFixed(2)
                    );
                }
            });
        }
        if (armrests.length > 0)
            armrests.forEach((a) => {
                var seatSize = new THREE.Box3()
                    .setFromObject(sofa.single.children[0])
                    .getSize(new THREE.Vector3());
                var armSize = new THREE.Box3()
                    .setFromObject(sofa.armrestL)
                    .getSize(new THREE.Vector3());
                if (a instanceof THREE.Object3D) {
                    if (sHeight == 1.25) {
                        a.scale.setY((armSize.y - seatSize.y + 0.05) / armSize.y);
                    } else {
                        a.scale.setY(1);
                    }
                }
            });
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
        }



    });





    // console.log(sofas.length, leftIndexs, rightIndexs, leftverticalIndex, rightverticalIndex)
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

            // leftIndexs.splice (leftIndexs[leftIndexs.length-1])
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

            // leftIndexs.splice (leftIndexs[leftIndexs.length-1])
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

    // const intersectsofa = raycaster.intersectObject(box_group, true);
    // if (intersectsofa.length > 0) {
    //     const res = intersectsofa.filter(function (res) {
    //         return res && res.object;
    //     })[0];

    //     if (res && res.object) {
    //         selectedSofa = res.object;

    //     }
    // } else {
    //     selectedSofa = null;
    // }
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

function createContextMenu(obj, index) {
    var div = document.createElement("div");
    div.id = "#contextMenu";
    var table = document.createElement("TABLE");

    // table.border = '1';
    table.className = "table table-hover bg-white";
    var tableBody = document.createElement("TBODY");
    table.appendChild(tableBody);



    var totalHorizontal = hSingleCount + currentCornerCount + currentChaiseCount;
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
                                updateHorizontalBottoms();

                            } else if (sofas[index].name == sofa.cornerR.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(leftIndexs[leftIndexs.length - 1])
                                updateHorizontalBottoms();
                                armrests[0].visible = true;
                            }


                        }
                        if (isRight) {
                            if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(rightIndexs[rightIndexs.length - 1])
                                updateHorizontalBottoms();

                            } else if (sofas[index].name == sofa.cornerL.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(rightIndexs[rightIndexs.length - 1])
                                updateHorizontalBottoms();
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
                                updateHorizontalBottoms();

                            } else if (sofas[index].name == sofa.chaiseR.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(leftIndexs[leftIndexs.length - 1])
                                updateHorizontalBottoms();
                                armrests[0].visible = true;
                            }


                        }
                        if (isRight) {
                            if (sofas[index].name == sofa.single.name && sofas[index].rotation.y == 0) {
                                removeSofas(index);
                                checkDistance();
                                addChaise(rightIndexs[rightIndexs.length - 1])
                                updateHorizontalBottoms();

                            } else if (sofas[index].name == sofa.chaiseL.name) {
                                removeSofas(index);
                                checkDistance();
                                addSingle(rightIndexs[rightIndexs.length - 1])
                                updateHorizontalBottoms();
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
                                updateHorizontalBottoms();

                            } else if (sofas[index].name == sofa.chaiseR.name) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(leftIndexs[leftIndexs.length - 1])
                                updateHorizontalBottoms();
                                armrests[0].visible = true;
                            }


                        }
                        if (isRight) {
                            if (sofas[index].name == sofa.cornerL.name) {
                                removeSofas(index);
                                checkDistance();
                                addChaise(rightIndexs[rightIndexs.length - 1])
                                updateHorizontalBottoms();

                            } else if (sofas[index].name == sofa.chaiseL.name) {
                                removeSofas(index);
                                checkDistance();
                                addCorner(rightIndexs[rightIndexs.length - 1])
                                updateHorizontalBottoms();
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
        if(sofas[index].name == sofa.single.name && sofas[index].rotation.y ==0){
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

function updateHorizontalBottomsOnRemoved() {


    bottoms.forEach((e) => {
        scene.remove(e);
    });
    backs.forEach((e) => {
        scene.remove(e);
    });
    legs.forEach((e) => {
        scene.remove(e);
    });

    bottoms = [];
    backs = [];
    legs = [];
    var maxCount = 1;
    if (hSingleCount <= 3) {
        maxCount = 1;
    } else if (hSingleCount > 3 && hSingleCount <= 5) {
        maxCount = 2;
    } else if (hSingleCount > 5 && hSingleCount < 8) {
        maxCount = 3;
    } else if (hSingleCount == 8) {
        maxCount = 4;
    }

    for (var i = 0; i < maxCount; i++) {
        lastBottomSofa = [];
        lastBackSofa = [];
        singleCount = 1;

        addHorizontalBottom();
    }
}

function removeSofas(index) {
    if (sofas[index] instanceof THREE.Object3D) {

        if (sofas[index].name == sofa.single.name) {
            if (sofas[index].rotation.y == 0) {
                if (hSingleCount > 1) {

                    if (index != 0) {

                        if (leftIndexs.includes(index)) {

                            scene.remove(sofas[index]);
                            sofas.splice(index, 1);

                            leftIndexs = [];
                            hSingleCount -= 1;

                        }
                        if (rightIndexs.includes(index)) {

                            scene.remove(sofas[index]);
                            sofas.splice(index, 1);
                            rightIndexs = [];

                            hSingleCount -= 1;

                        }

                        updateHorizontalBottomsOnRemoved();


                    }


                }

            } else if (sofas[index].rotation.y > 0) {
                if (leftverticalSingleCount > 0) {


                    if (leftIndexs.includes(index)) {

                        scene.remove(sofas[index]);
                        sofas.splice(index, 1);
                        leftverticalSingleCount -= 1;

                        leftIndexs = [];
                        leftbottoms.forEach((e) => {
                            scene.remove(e);
                        });
                        leftbacks.forEach((e) => {
                            scene.remove(e);
                        });
                        leftlegs.forEach((e) => {
                            scene.remove(e);
                        });

                        leftbottoms = [];
                        leftbacks = [];
                        leftlegs = [];
                        var maxCount = 1;
                        if (leftverticalSingleCount <= 3) {
                            maxCount = 1;
                        } else if (leftverticalSingleCount > 3 && leftverticalSingleCount <= 5) {
                            maxCount = 2;
                        } else if (leftverticalSingleCount > 5 && leftverticalSingleCount < 8) {
                            maxCount = 3;
                        } else if (leftverticalSingleCount == 8) {
                            maxCount = 4;
                        }
                        for (var i = 0; i < maxCount; i++) {
                            lastBottomSofasLV = [];
                            lastBackSofaLV = [];
                            leftCount = 0;
                            if (leftverticalSingleCount != 0) {
                                addVerticalBottomLeft();
                            }

                        }
                    }




                }

            } else if (sofas[index].rotation.y < 0) {
                if (rightverticalSingleCount > 0) {

                    if (rightIndexs.includes(index)) {

                        scene.remove(sofas[index]);
                        sofas.splice(index, 1);
                        rightverticalSingleCount -= 1;
                        rightIndexs = [];

                        rightbottoms.forEach((e) => {
                            scene.remove(e);
                        });
                        rightbacks.forEach((e) => {
                            scene.remove(e);
                        });
                        rightlegs.forEach((e) => {
                            scene.remove(e);
                        });

                        rightbottoms = [];
                        rightbacks = [];
                        rightlegs = [];
                        var maxCount = 1;
                        if (rightverticalSingleCount <= 3) {
                            maxCount = 1;
                        } else if (rightverticalSingleCount > 3 && rightverticalSingleCount <= 5) {
                            maxCount = 2;
                        } else if (rightverticalSingleCount > 5 && rightverticalSingleCount < 8) {
                            maxCount = 3;
                        } else if (rightverticalSingleCount == 8) {
                            maxCount = 4;
                        }
                        for (var i = 0; i < maxCount; i++) {
                            lastBottomSofasRV = [];
                            lastBackSofaRV = [];
                            rightCount = 0;
                            if (rightverticalSingleCount != 0) {
                                addVerticalBottomRight();
                            }

                        }
                    }




                }

            }
        } else if (sofas[index].name == sofa.cornerR.name) {
            if (leftIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                leftIndexs = []

            }
        } else if (sofas[index].name == sofa.cornerL.name) {
            if (rightIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                rightIndexs = [];
            }
        } else if (sofas[index].name == sofa.chaiseR.name) {
            if (leftIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                leftIndexs = []
            }
        } else if (sofas[index].name == sofa.chaiseL.name) {
            if (rightIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                rightIndexs = [];
            }
        } else if (sofas[index].name == sofa.ottoman.name) {
            if (leftIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                leftIndexs = []
            } else if (rightIndexs.includes(index)) {


                scene.remove(sofas[index]);
                sofas.splice(index, 1);
                rightIndexs = [];
            }
        }

    }

}
let scene, roomScene, camera, orthoCameraTop, orthoCameraLeft, dimensionScene, dimensionRenderer, renderer, directionalLight, ambientLight, controls;
let css2DRenderer, css2DRenderer2;

const viewer = document.getElementById("modelviewer");
const dimensionviewer = document.getElementById("dimensionViewer");
var stats;

const fwidth = viewer.offsetWidth || dimensionviewer.offsetWidth;
const fheight = viewer.offsetHeight || dimensionviewer.offsetHeight;
let dimensionCanvas;
var dimensionImage;

var floorCubeCamera, floorCubeMap, roomCubeCamera, roomCubeMap;

var groundReflector;
const selects = [];
const params = {
    enableSSR: true,
    autoRotate: true,
    otherMeshes: true,
    groundReflector: true,
};
let wWidth = 3,
    wHeight = 1.75,
    wDepth = 6




const thickness = 0.875;
const ftTom = 0.3048;

let selectedObject = null,
    selectedObjects = [];
let raycaster, pointer, mouse3D, group;
let exporter;

let composer, fxaaPass, outlinePass, ssrPass, planeOultinePass, doorOutlinePass;
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

let lightProbe;
var envMap;
let ssaoPass, saoPass;

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
const manager = new THREE.LoadingManager();
const gltfLoader = new THREE.GLTFLoader(manager);

var bedMatress, pillowL, pillowR;
var drawerLeft, isDrawerHandleCreated = false;

var bedTopsEdges = [],
    bedLegsEdges = [],
    bedDrawersEdges = [];
var whArrowL, whArrowR, wvArrowUp, wvArrowDown, wvvArrowUp, wvvArrowDown, wdArrowUp, wdArrowDown, wdArrowUp2, wdArrowDown2, wdArrowUp3, wdArrowDown3;
var widthLabel, heightLabel, depthLabel, depthLabel2, drawerLabel, drawerLabel2, drawerLabel3;

var boardType = 0,
    textureType = 0,
    woodcolors = 0,
    boardColor = 0,
    colorTypes = 0;
var boards, sideboard, drawerHandle, drawerBoard, drawerPanelL, drawerPanelR;
var sidePanelL, sidePanelR;
var bedLegL, bedLegR;
var istableLeft = false,
    istableRight = false;


var room;



var textures = {
    tint: {
        natural: "",
        traditionalcherry: "",
        americanwalnut: ""
    },

    wood: {
        wood_a: {
            albedo: null,
            normal: null,
            ao: null,
            height: null,
            roughness: null,
            natural: null,
            walnut: null,
            cherry: null
        },
        wood_b: {
            albedo: null,
            normal: null,
            ao: null,
            height: null,
            roughness: null,
            natural: null,
            walnut: null,
            cherry: null

        },
        wood_c: {
            albedo: null,
            normal: null,
            ao: null,
            height: null,
            roughness: null,
            natural: null,
            walnut: null,
            cherry: null

        }
    },
    colors: {
        black: "",
        offwhite: "",
        grey: "",
        darkbrown: "",
        lightbrown: ""
    },
    lacquer: {
        roughness: "",
        metalness: ""
    },
    lamniate: {
        roughness: "",
        metalness: ""
    },
    handle: {
        metallicgold: "",
        charcoal: "",
        silver: ""
    },
    fabric: {
        cotton: {
            albedo: "",
            normal: "",
            roughness: "",
            bump: "",
            ao: ""
        }

    }

}


getTextures();

async function getTextures() {
    fetch("colorinfo.json").then(response => response.json())
        .then(data => {
            textures.tint.americanwalnut = data.tint.americanwalnut;
            textures.tint.natural = data.tint.natural;
            textures.tint.traditionalcherry = data.tint.traditionalcherry;
            textures.colors.black = data.colors.black;
            textures.colors.darkbrown = data.colors.darkbrown;
            textures.colors.grey = data.colors.grey;
            textures.colors.lightbrown = data.colors.lightbrown;
            textures.colors.offwhite = data.colors.offwhite;

            textures.wood.wood_a.albedo = texLoader.load(data.online.wood.wood_a.albedo);
            textures.wood.wood_a.natural = texLoader.load(data.online.wood.wood_a.natural);
            textures.wood.wood_a.walnut = texLoader.load(data.online.wood.wood_a.walnut);
            textures.wood.wood_a.cherry = texLoader.load(data.online.wood.wood_a.cherry);
            textures.wood.wood_a.normal = texLoader.load(data.online.wood.wood_a.normal);
            textures.wood.wood_a.ao = texLoader.load(data.online.wood.wood_a.ao);
            textures.wood.wood_a.height = texLoader.load(data.online.wood.wood_a.height);
            textures.wood.wood_a.roughness = texLoader.load(data.online.wood.wood_a.roughness);

            textures.wood.wood_b.albedo = texLoader.load(data.online.wood.wood_b.albedo);
            textures.wood.wood_b.natural = texLoader.load(data.online.wood.wood_b.natural);
            textures.wood.wood_b.walnut = texLoader.load(data.online.wood.wood_b.walnut);
            textures.wood.wood_b.cherry = texLoader.load(data.online.wood.wood_b.cherry);
            textures.wood.wood_b.normal = texLoader.load(data.online.wood.wood_b.normal);
            textures.wood.wood_b.ao = texLoader.load(data.online.wood.wood_b.ao);
            textures.wood.wood_b.height = texLoader.load(data.online.wood.wood_b.height);
            textures.wood.wood_b.roughness = texLoader.load(data.online.wood.wood_b.roughness);

            textures.wood.wood_c.albedo = texLoader.load(data.online.wood.wood_c.albedo);
            textures.wood.wood_c.natural = texLoader.load(data.online.wood.wood_c.natural);
            textures.wood.wood_c.walnut = texLoader.load(data.online.wood.wood_c.walnut);
            textures.wood.wood_c.cherry = texLoader.load(data.online.wood.wood_c.cherry);
            textures.wood.wood_c.normal = texLoader.load(data.online.wood.wood_c.normal);
            textures.wood.wood_c.ao = texLoader.load(data.online.wood.wood_c.ao);
            textures.wood.wood_c.height = texLoader.load(data.online.wood.wood_c.height);
            textures.wood.wood_c.roughness = texLoader.load(data.online.wood.wood_c.roughness);
            textures.lacquer.metalness = data.lacquer.metalness;
            textures.lacquer.roughness = data.lacquer.roughness;
            textures.lamniate.metalness = data.lamniate.metalness;
            textures.lamniate.roughness = data.lamniate.roughness;

            textures.fabric.cotton.normal = texLoader.load(data.fabric.cotton.normal);
            textures.fabric.cotton.roughness = texLoader.load(data.fabric.cotton.roughness);
            textures.fabric.cotton.ao = texLoader.load(data.fabric.cotton.ao);
            textures.fabric.cotton.bump = texLoader.load(data.fabric.cotton.height);
        });
}



var sideColorType = 0;

init();

animate();

dimensionviewer.hidden = true;

function getInputs() {
    $("#depth").on("input", function () {
        wDepth = $(this).val();
        isDrawerHandleCreated = true;
        
        updateCubeMap();

    })


    $("input:radio[name='heightOptions']").click(function () {


        wHeight = $(this).val();
        isDrawerHandleCreated = true;
        updateCubeMap();

    });


    $("input:radio[name='widthOptions']").click(function () {

        wWidth = $(this).val();
        isDrawerHandleCreated = true;
        updateCubeMap();
        

    });

    $("#export").click(function () {
        Export();
    })

    $("#addDrawers").click(function () {


        if (!bedDrawerLeft.visible) {
            if (bedDrawerLeft.children[7]) bedDrawerLeft.remove(bedDrawerLeft.children[7]);
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
        updateCubeMap();
    })
    $("#selectBoard").change(function () {
        boardType = $(this).children("option:selected").val();

        
        updateCubeMap();
    });
    $("#selectTexture").click(function () {

        textureType = $(this).children("option:selected").val();
        updateBedMaterial();
        updateCubeMap();

    });
    $("input:radio[name='wood_colors']").click(function () {

        woodcolors = $(this).val();
        updateBedMaterial();
        updateCubeMap();

    });

    $("input:radio[name='colorTypes']").click(function () {

        colorTypes = $(this).val();
        setMaterialType();
        updateCubeMap();

    });

    $("input:radio[name='boardColors']").click(function () {

        boardColor = $(this).val();
        setMaterialType()
        
        updateCubeMap();
    });

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

        istableLeft = !istableLeft;

        if (istableLeft) {
            $(this).html("Remove Table Left");
            $(this).addClass("btn-outline-danger");
            $(this).removeClass("btn-outline-dark");
        } else {
            $(this).html("Add Table Left");
            $(this).addClass("btn-outline-dark");
            $(this).removeClass("btn-outline-danger");
        }
        updateCubeMap();
        // if (!bedTableLeft.visible) {
        //     $(this).html("Remove Table Left");
        //     $(this).addClass("btn-outline-danger");
        //     $(this).removeClass("btn-outline-dark");
        //     bedTableLeft.visible = true;
        // } else {
        //     $(this).html("Add Table Left");
        //     $(this).addClass("btn-outline-dark");
        //     $(this).removeClass("btn-outline-danger");
        //     bedTableLeft.visible = false;
        // }

    })

    $("#addSideTableRight").click(function () {
        istableRight = !istableRight;

        if (istableRight) {
            $(this).html("Remove Table Left");
            $(this).addClass("btn-outline-danger");
            $(this).removeClass("btn-outline-dark");
        } else {
            $(this).html("Add Table Left");
            $(this).addClass("btn-outline-dark");
            $(this).removeClass("btn-outline-danger");
        }
        updateCubeMap();
        // if (!bedTableRight.visible) {
        //     $(this).html("Remove Table Right");
        //     $(this).addClass("btn-outline-danger");
        //     $(this).removeClass("btn-outline-dark");
        //     bedTableRight.visible = true;
        // } else {
        //     $(this).html("Add Table Right");
        //     $(this).addClass("btn-outline-dark");
        //     $(this).removeClass("btn-outline-danger");
        //     bedTableRight.visible = false;
        // }

    })
    // $("#woodColor").toggle(function(){

    //     updateBedMaterial();
    // })
    // $("#boardColor").change(function(){

    //     updateBedMaterial();
    // })

    // $("#sideColor").change(function(){

    //     updateBedMaterial();
    // })

}

function init() {


    scene = new THREE.Scene();
    roomScene = new THREE.Scene();
    dimensionScene = new THREE.Scene();


    window.scene = scene;
    THREE.Cache.enabled = true;


    camera = new THREE.PerspectiveCamera(25, fwidth / fheight, 0.01, 100);

    camera.position.set(0, 5, 15);
    camera.aspect = fwidth / fheight;

    orthoCameraTop = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);

    // orthoCameraTop.rotation.z = 180*THREE.MathUtils.DEG2RAD;
    orthoCameraTop.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    orthoCameraTop.position.y = 2;

    orthoCameraLeft = new THREE.OrthographicCamera(fwidth / -2, fwidth / 2, fheight / 2, fheight / -2, .001, 1000);
    orthoCameraLeft.position.x = -1;
    orthoCameraLeft.rotation.y = -90 * THREE.MathUtils.DEG2RAD;


    // orthoCameraTop.zoom = 250;

    orthoCameraTop.layers.enable(1)
    orthoCameraTop.layers.enable(2)
    orthoCameraTop.layers.enable(4)

    orthoCameraLeft.layers.enable(1)
    orthoCameraLeft.layers.enable(2)
    orthoCameraLeft.layers.enable(3)
    orthoCameraLeft.layers.enable(4)
    orthoCameraLeft.layers.disable(0)


    orthoCameraTop.updateProjectionMatrix();
    dimensionScene.add(orthoCameraTop);
    dimensionScene.add(orthoCameraLeft);
    // camera.lookAt(wBottom.position);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    group = new THREE.Group();




    helpers();






    // createBedSideTable();
    getInputs();
    exporter = new THREE.GLTFExporter();
    clock = new THREE.Clock();


    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: true
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(fwidth, fheight);
    renderer.info.autoReset = false;
    renderer.setClearColor(0xFFFFFF, 1);




    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    renderer.compile(scene, camera);
    renderer.compile(roomScene, camera);

    floorCubeMap = new THREE.WebGLCubeRenderTarget(512, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });

    roomCubeMap = new THREE.WebGLCubeRenderTarget(512, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
    });

    roomCubeCamera = new THREE.CubeCamera(1, 1000, roomCubeMap);
    floorCubeCamera = new THREE.CubeCamera(1, 1000, floorCubeMap);



    create_lights();
    loadBoards();
    createReflector();
    post_process();
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


    viewer.appendChild(renderer.domElement);

    dimensionviewer.appendChild(css2DRenderer.domElement);
    dimensionviewer.appendChild(dimensionRenderer.domElement);

    // dimensionCanvas = document.querySelector('#dimensionviewer :nth-child(2)')



    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = true;

    controls.minDistance = 4;
    controls.maxDistance = 6.5;
    controls.panSpeed = 0;

    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.target.set(0, 0.5, -0.2);


    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.minAzimuthAngle = -Math.PI / 2.5;
    controls.maxAzimuthAngle = Math.PI / 4;
    controls.saveState();
    window.addEventListener('resize', onWindowResize, true);
    // document.addEventListener('pointermove', onPointerMove);
    // document.addEventListener('click', onClick);


    // stats = new Stats();
    // viewer.appendChild(stats.dom);
    controls.addEventListener('change', updateCubeMap);

}

function onWindowResize() {
    const canvas = renderer.domElement;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // if (canvas.width !== width || canvas.height !== height) {
    const pixelRatio = renderer.getPixelRatio();
    camera.aspect = fwidth / fheight;
    camera.updateProjectionMatrix();

    // renderer.setSize(fwidth, fheight);
    // composer.setSize(fwidth, fheight);
    css2DRenderer.setSize(fwidth, Math.floor(fheight / 2));

    dimensionRenderer.setSize(fwidth, fheight);

    orthoCameraTop.updateProjectionMatrix();
    orthoCameraLeft.updateProjectionMatrix();
    groundReflector.getRenderTarget().setSize(fwidth, fheight);
    groundReflector.resolution.set(fwidth, fheight);
    // }



    fxaaPass.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
    render();

}

function updateCubeMap() {
    try {
        floorCubeCamera.update(renderer, scene);
    } catch (err) {

    }

}

function animate() {
    requestAnimationFrame(animate);





    // stats.begin();
    render();
    // stats.end();
}

function update() {
    try {
        controls.update();
        updateBedTop();
        updateBedLegs();
        updateBedFloor();
        updateDrawers();
        updateRoom()
        createHorizontalArrow();
        createVerticalArrows();
        createDrawerArrows()
        createHeightArrows();



    } catch (err) {
        console.log(err)
    }
    // updateBedSideTable();
    if (bedMatress) {
        updateMatress();
    }

    if (pillowL) {
        updatePillow();
    }
    updateBoards();

    // updateWall();
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

function render() {

    update();

    dimensionRenderer.setViewport(left, Math.floor(fheight / 2), fwidth, Math.floor(fheight / 2));
    dimensionRenderer.setScissor(left, Math.floor(fheight / 2), fwidth, Math.floor(fheight / 2));
    dimensionRenderer.setScissorTest(true);


    // css2DRenderer.setSize(dimensionRenderer.domElement.width, Math.floor (dimensionRenderer.domElement.height/2));

    orthoCameraTop.left = fwidth / -2;
    orthoCameraTop.right = fwidth / 2;
    orthoCameraTop.top = fheight / 4;
    orthoCameraTop.bottom = fheight / -4;
    orthoCameraTop.zoom = 200 * (fwidth) / 1500;

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
    orthoCameraLeft.zoom = 200 * fwidth / 1500;
    orthoCameraLeft.updateProjectionMatrix();
    // dimensionRenderer.setClearColor(0xff0000)
    dimensionRenderer.render(dimensionScene, orthoCameraLeft);

    css2DRenderer.setSize(fwidth, fheight);
    css2DRenderer.render(dimensionScene, orthoCameraTop);

    floorCubeCamera.position.copy(camera.position);

    floorCubeCamera.position.y *= -1;



    composer.render();





}

function setLighting() {

    lightProbe = new THREE.LightProbe();
    scene.add(lightProbe);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();

    // envmap
    const genCubeUrls = function (prefix, postfix) {

        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];

    };

    const urls = genCubeUrls('hdri/studio/', '.png');

    envMap = new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {

        cubeTexture.encoding = THREE.sRGBEncoding;
        var map = pmremGenerator.fromCubemap(cubeTexture).texture;


        scene.background = map;


        // var blurred = pmremGenerator.fromScene(scene, 1).texture;
        scene.environment = map;
        floorCubeCamera.update(renderer, scene);



        roomCubeCamera.position.set(0, 1, wDepth * ftTom + 2 * ftTom / 12)


        roomCubeCamera.update(renderer, scene);

        lightProbe.copy(THREE.LightProbeGenerator.fromCubeRenderTarget(renderer, roomCubeMap));


        cubeTexture.dispose();
        pmremGenerator.dispose();
        // return map;

    });


    //    var env = new THREE.RGBELoader()
    //         .setDataType(THREE.UnsignedByteType)
    //         .setPath('./hdri/')
    //         .load('brown_photostudio_02_4k.hdr', function (texture) {
    //         texture.encoding  =  THREE.sRGBEncoding;
    //         var map = pmremGenerator.fromEquirectangular(texture).texture;
    //         scene.background = map;
    //         texture.mapping = THREE.EquirectangularReflectionMapping;
    //         lightProbe.copy( THREE.LightProbeGenerator.fromCubeTexture( texture ) );


    //         var blurred = pmremGenerator.fromScene(scene,0.0035).texture;

    //         scene.environment = blurred;
    //             texture.dispose();
    //             pmremGenerator.dispose();
    //             return blurred;
    //         })


}

function create_lights() {

    setLighting();
    scene.add(new THREE.AmbientLight(0xfcedd8, 1));

    const light = new THREE.DirectionalLight(0xfdfbd3, 5);

    if (room) {
        light.target = room;
    }
    light.position.set(11, 1, 4);
    // light.position.set(10, 8, 4);
    light.castShadow = true;
    light.shadow.radius = 0.4;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    // light.shadow.camera.near = 0.5; // default
    light.shadow.autoUpdate = true;
    // const d = 20;

    // light.shadow.camera.left = - d;
    // light.shadow.camera.right = d;
    // light.shadow.camera.top = d;
    // light.shadow.camera.bottom = - d;
    // scene.add(new THREE.CameraHelper(light.shadow.camera))
    // light.shadow.needsUpdate = true;


    scene.add(light);

    // var areaLight = new THREE.RectAreaLight(0xffe8c9, 2, 3, 3);
    // areaLight.rotation.x = -Math.PI / 2;
    // areaLight.position.set(0, 3, 2)
    // scene.add(areaLight);

    var bulbLight = new THREE.PointLight(0xfdfdfd, 2, 10, 1);
    bulbLight.position.set(2, 2, 2);
    bulbLight.castShadow = true;

    bulbLight.shadow.mapSize.width = 512;
    bulbLight.shadow.mapSize.height = 512;
    // bulbLight.shadow.camera.far = 10;
    bulbLight.shadow.radius = 0.4;
    scene.add(bulbLight)



    // var hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.2);
    // scene.add(hemiLight);

}

function createFloor() {
    // setTexture(textures.wood_C.albedo, 30, 30)
    // setTexture(textures.wood_C.normal, 30, 30)
    // setTexture(textures.wood_C.ao, 30, 30)
    // setTexture(textures.wood_C.roughness, 30, 30)
    var g = new THREE.PlaneGeometry(30, 30);
    var m = new THREE.MeshStandardMaterial({
        color: 0x404040,
        map: textures.wood_C.albedo,
        roughnessMap: textures.wood_C.roughness,
        roughness: 0.5,
        normalMap: textures.wood_C.normal,
        normalScale: new THREE.Vector2(2, 2),
        ao: textures.wood_C.ao,
        aoMapIntensity: 2,


    });

    floor = new THREE.Mesh(g, m);
    floor.material.map.rotation = Math.PI / 2;

    floor.material.map.needsUpdate = true;
    floor.name = "floor";
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;

    floor.rotateX(-90 * THREE.MathUtils.DEG2RAD);
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
    wall.rotateX(0 * THREE.MathUtils.DEG2RAD);
    scene.add(wall)


    wallLeft = new THREE.Mesh(g, m);
    wallLeft.name = "wallleft";

    wallLeft.receiveShadow = true;
    wallLeft.rotateY(-90 * THREE.MathUtils.DEG2RAD);
    scene.add(wallLeft)

    wallRight = new THREE.Mesh(g, m);
    wallRight.name = "wallleft";

    wallRight.receiveShadow = true;
    wallRight.rotateY(90 * THREE.MathUtils.DEG2RAD);
    scene.add(wallRight);
    wallLeft.position.set(0, 0, 0);
    wallRight.position.set(0, 0, 0);
}

function updateWall() {
    if (bedTops.length > 0 && wall) {
        try {

            if (boards != null) {
                var headboardSize = getChildfromObject(boards, "headboard", boardType).size;
            }
            var floorSize = new THREE.Box3().setFromObject(floor).getSize(new THREE.Vector3())
            wallLeft.position.setX(15 * ftTom / 2);
            wallRight.position.setX(-15 * ftTom / 2)

            wall.position.setZ(bedTops[0].position.z - headboardSize.z + bedTops[0].scale.z / 2)
            floor.position.setZ(wall.position.z + floorSize.z / 2);
        } catch (err) {

        }


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


    // composer.addPass( ssrPass );


    saoPass = new THREE.SAOPass(scene, camera, false, true);

    saoPass.params = {
        output: 0,
        saoBias: 0.15,
        saoIntensity: 0.1,
        saoScale: 8,
        saoKernelRadius: 80,
        saoMinResolution: 0,
        saoBlur: true,
        saoBlurRadius: 8,
        saoBlurStdDev: 4,
        saoBlurDepthCutoff: 0.1
    };


    // composer.addPass(saoPass);

    // ssaoPass = new THREE.SSAOPass(scene, camera, fwidth, fheight);
    // ssaoPass.kernalRadius = 16;
    // ssaoPass.kernelSize = 32;

    // ssaoPass.minDistance = 0.2;
    // ssaoPass.maxDistance = 0.3;

    // composer.addPass(ssaoPass);
    fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
    composer.addPass(fxaaPass);





    composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));



    // const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(fwidth, fheight), 1.5, 0.4, 0.85);
    // bloomPass.threshold = 1.552;
    // bloomPass.strength = 0.1;
    // bloomPass.radius = 0.85;
    // composer.addPass(bloomPass);

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


function createBedTop() {
    for (var i = 0; i < 4; i++) {

        bedTops.push(createBox("bedTop_" + i));
        bedTopsEdges.push(createEdges(bedTops[i]));

    }
    if (sideboard) {
        sidePanelL = sideboard.clone();
        sidePanelR = sideboard.clone();
        sidePanelL.castShadow = true;
        sidePanelL.receiveShadow = true;
        sidePanelR.castShadow = true;
        sidePanelR.receiveShadow = true;
        scene.add(sidePanelL)
        scene.add(sidePanelR)
    }


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

    for (var i = 0; i < bedLegsEdges.length; i++) {
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

    for (var i = 0; i < bedTopsEdges.length; i++) {
        bedTopsEdges[i].position.copy(bedTops[i].position);
        bedTopsEdges[i].scale.copy(bedTops[i].scale);
    }

    var sideboardSize = new THREE.Box3().setFromObject(bedTops[2]).getSize(new THREE.Vector3());

    sidePanelL.position.copy(bedTops[2].position);
    sidePanelR.position.copy(bedTops[3].position);
    sidePanelL.scale.copy(sideboardSize);
    sidePanelR.scale.copy(sideboardSize);
}

function createBedLegs() {
    for (var i = 0; i < 2; i++) {

        bedLegs.push(createBox("bedLegs_" + i));
        bedLegsEdges.push(createEdges(bedLegs[i]));
    }

    if (sideboard) {
        bedLegL = sideboard.clone();
        bedLegR = sideboard.clone();
        scene.add(bedLegL)
        scene.add(bedLegR)
    }

}


function updateBedLegs() {

    var fromFloor = wHeight * ftTom / 2 - 3 * ftTom / 12;
    var depth = ftTom;
    var height = wHeight * ftTom - 6 * ftTom / 12;
    var width = ftTom / 12;
    bedLegs.forEach(e => {
        e.position.setY(fromFloor);
        e.scale.set(width, height, depth);
        e.visible = false;
    });
    bedLegL.visible = bedDrawerLeft.visible;
    bedLegR.visible = bedDrawerLeft.visible;
    //0 Back Left
    //1 Back Right
    //2 Front Left
    //3 Front Right

    bedLegs[0].position.setX(bedTops[2].position.x);
    bedLegs[0].position.setZ(bedTops[0].position.z + bedTops[0].scale.z / 2 + bedLegs[0].scale.z / 2);
    bedLegs[1].position.setX(bedTops[3].position.x);
    bedLegs[1].position.setZ(bedTops[0].position.z + bedTops[0].scale.z / 2 + bedLegs[1].scale.z / 2);

    var bedLegSize = new THREE.Box3().setFromObject(bedLegs[0]).getSize(new THREE.Vector3());

    bedLegL.position.copy(bedLegs[0].position);
    bedLegR.position.copy(bedLegs[1].position);
    bedLegL.scale.copy(bedLegSize);
    bedLegR.scale.copy(bedLegSize);
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



function updateBedFloor() {

    var fromFloor = wHeight * ftTom - 1.5 * ftTom / 12;

    bedFloor.visible = false;
    bedFloor.position.setY(fromFloor);
    bedFloor.scale.set(wWidth * ftTom - ftTom / 12, 0.5 * ftTom / 12, wDepth * ftTom - ftTom / 12)

    sideboardFloor.position.copy(bedFloor.position);
    sideboardFloor.scale.copy(bedFloor.scale);
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

        // floor.visible = false;
        // wall.visible = false;
        // wallLeft.visible = false;
        // wallRight.visible = false;
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

                    // floor.visible = true;
                    // wall.visible = true;
                    // wallLeft.visible = true;
                    // wallRight.visible = true;

                }

            },
            // called when there is an error in the generation
            function (error) {

                console.log('An error happened');

            },

        );
    }


}

function loadAsync(url) {

    return new Promise((resolve) => {
        new THREE.GLTFLoader(manager).load(url, resolve);
    });

}

function loadBoards() {
    let model, model1, handle, interior;
    interior = loadAsync("models/room/Room.gltf").then((result) => {
        room = result.scene.children[0];
    });
    model1 = loadAsync("models/bed/sideboard.gltf").then((result) => {
        sideboard = result.scene.children[0];
    });
    model = loadAsync("models/bed/headboard_footboard.gltf").then((result) => {
        boards = result.scene.children[0];
    });

    handle = loadAsync("models/bed/drawerboard.gltf").then((result) => {
        drawerBoard = result.scene.children[0];
    });
    Promise.all([
        model, model1, handle, interior
    ]).then(() => {
        updateTextures()
        scene.add(room);
        updateRoomMaterial(room);
        roomCubeCamera.update(renderer, scene);



        scene.add(boards)

        setModel(boards)
        setModel(sideboard)
        setModel(drawerBoard)
        createBedTop();
        createDrawers();
        createBedLegs();
        updateBedMaterial();
        setMaterialType();
        bedFloor = createBox("bedFloor");
        sideboardFloor = sideboard.clone();
        scene.add(sideboardFloor);

        createMatress();





        // createFloor();
        // var g = new THREE.SphereGeometry(0.5,32,32);
        // var m = new THREE.MeshStandardMaterial({color:0xdedede,envMap:floorCubeMap.texture,envMapIntensity:1,roughness:0,metalness:1})
        // var sphere = new THREE.Mesh(g,m);
        // sphere.position.set(0,1,0)
        // scene.add(sphere)
        // createWall();
    })
}

function createReflectionBox() {

    var g = new THREE.SphereGeometry(0.5);
    var m = new THREE.MeshStandardMaterial({
        color: 0xffffff,

        roughness: 0,
        metalness: 1,
        envMap: floorCubeMap.texture,

    })
    m.needsUpdate = true;
    var b = new THREE.Mesh(g, m);
    scene.add(b)

    b.position.set(-1.5, 0.25, 0);

}

function createReflector() {
    const pixelRatio = renderer.getPixelRatio();
    var geometry = new THREE.PlaneGeometry(1, 1);
    groundReflector = new THREE.ReflectorForSSRPass(geometry, {
        clipBias: 0.0001,
        textureWidth: fwidth,
        textureHeight: fheight,
        color: 0x888888,
        useDepthTexture: true,
    });
    groundReflector.material.depthWrite = false;
    groundReflector.rotation.x = -Math.PI / 2;
    groundReflector.visible = false;
    groundReflector.position.set(0, 01, 0)
    scene.add(groundReflector);
}

function updateRoomMaterial(room) {
    if (room) {
        room.traverse(e => {
            if (e instanceof THREE.Mesh) {

                e.castShadow = true;
                e.receiveShadow = true;
                var mat = e.material;
                if (mat.name.includes("frontTile")) {
                    mat.color.set("#656565")
                    mat.envMap = floorCubeMap.texture
                    mat.normalScale = new THREE.Vector2(10, 10)
                    mat.envMapIntensity = 1;
                    mat.metalness = 0;
                    mat.roughness = 0.2;
                    mat.needsUpdate = true;

                }
                if (mat.name.includes("Door")) {
                    mat.color.set("#5d5d5d")
                    mat.bumpScale = 2;
                    mat.metalness = 0;
                    mat.roughness = 0.8;

                }
                if (mat.name.includes("Pablo Picasso-FemmeAssisePainting")) {
                    mat.aoMapIntensity = 0.3;
                    mat.normalScale = new THREE.Vector2(4, 4);
                    mat.roughness = 0.78;
                }
                if (mat.name.includes("window_glas")) {
                    mat.side = THREE.BackSide;
                    mat.metalness = 0;
                    mat.roughness = 0;

                }
                if (mat.name.includes("Door Handle")) {
                    mat.color.set("#6e6e6e")
                    mat.envMap = roomCubeMap.texture
                    mat.envMapIntensity = 1;
                    mat.metalness = 0.8;
                    mat.roughness = 0.2;
                    mat.needsUpdate = true;

                }
                if (mat.name.includes("underneath")) {
                    mat.color.set("#3f3f3f")
                    mat.map.swapS = THREE.MirroredRepeatWrapping;
                    mat.map.swapT = THREE.MirroredRepeatWrapping;
                    mat.map.needsUpdate = true;
                    mat.envMap = roomCubeCamera.texture
                    mat.envMapIntensity = 1;

                    mat.roughness = 0;
                    mat.needsUpdate = true;

                }
                if (mat.name.includes("floor")) {

                    mat.envMap = floorCubeMap.texture;
                    mat.envMapIntensity = 1;
                    mat.color.set("#4d4d4d")

                    setTexture(mat.map, 1.5, 1.5)


                    mat.roughness = 0;

                    mat.needsUpdate = true;


                }

                if (mat.name.includes("Pot")) {
                    mat.color.set("#4d4d4d")




                    mat.roughness = 0.35;
                    mat.needsUpdate = true;

                }

                if (mat.name.includes("Curtain")) {
                    // mat.color.set("#050505")
                    mat.color.set("#6a5430")
                    mat.transparent = true;
                    mat.opacity = 0.8;
                    mat.normalScale = new THREE.Vector2(3, 3)

                    mat.roughness = 0.7;
             

                }
                if (mat.name.includes("CurtainCover")) {
                    mat.color.set("#050505")

                    mat.transparent = false;
                 
                    mat.normalScale = new THREE.Vector2(3, 3)

                    mat.roughness = 0.7;
                    mat.needsUpdate = true;

                }
                if (mat.name.includes("potLeg")) {

                    mat.color.set("#505050")



                    mat.roughness = 0.7;
                    mat.needsUpdate = true;
                }
                if (mat.name.includes("PlantLeaf")) {

                    mat.color.set("#ffffff")


                    mat.side = THREE.FrontSide;
                    mat.roughness = 0.8;
                    mat.needsUpdate = true;

                }
                if (mat.name.includes("wall")) {

                    mat.color.set("#b3a58c")



                    mat.roughness = 0.9;
                    mat.needsUpdate = true;

                }

                if (e.name.includes("effect")) {
                    var map = texLoader.load("models/room/lampeffect.png");

                    e.position.y += 0.25;
                    e.material.color.set("#fddadf")

                    e.material.alphaMap = map;
                    e.material.emissiveMap = map;

                    e.material.emissiveIntensity = 2;
                    e.material.opacity = 1;
                    e.material.needsUpdate = true;


                }
                if (mat.name.includes("lamp")) {
                    mat.side = THREE.DoubleSide;
                    mat.color.set("#4d4d4d")

                    mat.metalness = 1;


                    mat.emissiveIntensity = 3;

                    mat.roughness = 0.8;


                }

                if (mat.name.includes("Carpet")) {

                    mat.color.set("#252525")

                    mat.aoMapIntensity = 0.5;
                    mat.normalScale = new THREE.Vector2(2, 2);
                    mat.roughness = 0.7;



                }

                if (e.name.includes("floor")) {
                    selects.push(e);
                }

            }
        })
    }
}

function updateRoom() {
    if (boards != null) {
        var headboardSize = getChildfromObject(boards, "headboard", boardType).size;
    }
    if (room) {
        if (room instanceof THREE.Object3D) {

            room.position.setZ(-wDepth / 2 * ftTom - headboardSize.z);
            // camera.position.setZ(camera.position.y/wDepth*ftTom)
        }

    }
}

function setTextureInteraction(row) {

    var select = document.getElementById("selectTexture");
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for (var i = 0; i < row; i++) {
        var option = document.createElement("option");
        option.value = i;
        if (i == 0) option.text = "Wood A";
        if (i == 1) option.text = "Wood B";
        if (i == 2) option.text = "Wood C";
        select.appendChild(option);
    }


}

function setTexture(texture = new THREE.Texture(), repeatX = 1, repeatY = 1) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = repeatX;
    texture.repeat.y = repeatY;
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;
    // texture.encoding = THREE.sRGBEncoding
}

function setMaterialType() {
    if (boardType == 0) {

        if (boards != null) {
            boards.traverse(e => {

                if (e instanceof THREE.Mesh) {
                    if (e.material.name.includes("hb_1")) {

                        e.material.envMap = roomCubeMap.texture;
                        e.material.envMapIntensity = 1;
                        if (colorTypes == 0) {
                            e.material.metalness = textures.lacquer.metalness;
                            e.material.roughness = textures.lacquer.roughness;

                        }
                        if (colorTypes == 1) {
                            e.material.metalness = textures.lamniate.metalness;
                            e.material.roughness = textures.lamniate.roughness;

                        }

                        if (boardColor == 0) {
                            e.material.color.set(textures.colors.offwhite);
                        } else if (boardColor == 1) {
                            e.material.color.set(textures.colors.grey);
                        } else if (boardColor == 2) {
                            e.material.color.set(textures.colors.lightbrown);
                        } else if (boardColor == 3) {
                            e.material.color.set(textures.colors.darkbrown);
                        } else if (boardColor == 4) {
                            e.material.color.set(textures.colors.black);
                        }
                    }
                }
            })
        }
    }

}

function updateBedMaterial() {


    if (boards != null) {
        boards.traverse(e => {

            if (e instanceof THREE.Mesh) {

                if (e.material.name.includes("table_wood") || e.material.name.includes("bed_wood")) {


                    if (textureType == 0) {

                        e.material.color.set("#4d4d4d")
                        if (woodcolors == 0) {
                            e.material.map = textures.wood.wood_a.natural
                        } else
                        if (woodcolors == 1) {
                            e.material.map = textures.wood.wood_a.cherry
                        } else
                        if (woodcolors == 2) {
                            e.material.map = textures.wood.wood_a.walnut
                        }

                        setTexture(e.material.map, 1.5, 2)
                        e.material.envMap = roomCubeMap.texture;
                        e.material.envMapIntensity = 1;


                        e.material.normalMap = textures.wood.wood_a.normal;

                        e.material.normalScale = new THREE.Vector2(0.25, 0.25)
                        e.material.aoMap = textures.wood.wood_a.ao;
                        e.material.aoMapIntensity = 2;
                        e.material.roughnessMap = textures.wood.wood_a.roughness;
                        e.material.roughness = 0.35;

                        e.material.needsUpdate = true;
                    }
                    if (textureType == 1) {


                        e.material.color.set("#4d4d4d")
                        if (woodcolors == 0) {
                            e.material.map = textures.wood.wood_b.natural
                        } else
                        if (woodcolors == 1) {
                            e.material.map = textures.wood.wood_b.cherry
                        } else
                        if (woodcolors == 2) {
                            e.material.map = textures.wood.wood_b.walnut
                        }
                        setTexture(e.material.map, 1.5, 2)
                        e.material.normalMap = textures.wood.wood_b.normal;
                        e.material.normalScale = new THREE.Vector2(0.25, 0.25)

                        e.material.aoMap = textures.wood.wood_b.ao;
                        e.material.aoMapIntensity = 2;
                        e.material.roughnessMap = textures.wood.wood_b.roughness;

                        e.material.roughness = 0.35;
                        e.material.needsUpdate = true;
                    }
                    if (textureType == 2) {


                        e.material.color.set("#4d4d4d")
                        if (woodcolors == 0) {
                            e.material.map = textures.wood.wood_c.natural
                        } else
                        if (woodcolors == 1) {
                            e.material.map = textures.wood.wood_c.cherry
                        } else
                        if (woodcolors == 2) {
                            e.material.map = textures.wood.wood_c.walnut
                        }
                        setTexture(e.material.map, 1.5, 2)
                        e.material.normalMap = textures.wood.wood_c.normal;
                        e.material.normalScale = new THREE.Vector2(0.25, 0.25)

                        e.material.aoMap = textures.wood.wood_c.ao;
                        e.material.aoMapIntensity = 2;
                        e.material.roughnessMap = textures.wood.wood_c.roughness;
                        e.material.roughness = 0.35;

                        e.material.needsUpdate = true;
                    }
                }



            }
        })
    }

    if (drawerBoard != null) {

        drawerBoard.traverse(e => {

            if (e instanceof THREE.Mesh) {

                e.material.metalness = 0;
                e.material.roughness = 0.45;
                if (textureType == 0) {

                    e.material.color.set("#4d4d4d")
                    if (woodcolors == 0) {
                        e.material.map = textures.wood.wood_a.natural
                    } else
                    if (woodcolors == 1) {
                        e.material.map = textures.wood.wood_a.cherry
                    } else
                    if (woodcolors == 2) {
                        e.material.map = textures.wood.wood_a.walnut
                    }

                    setTexture(e.material.map, 2.4, 2)
                    e.material.envMap = roomCubeMap.texture;
                    e.material.envMapIntensity = 1;


                    e.material.normalMap = textures.wood.wood_a.normal;

                    e.material.normalScale = new THREE.Vector2(0.25, 0.25)
                    e.material.aoMap = textures.wood.wood_a.ao;
                    e.material.aoMapIntensity = 2;
                    e.material.roughnessMap = textures.wood.wood_a.roughness;


                    e.material.needsUpdate = true;
                }
                if (textureType == 1) {


                    e.material.color.set("#4d4d4d")
                    if (woodcolors == 0) {
                        e.material.map = textures.wood.wood_b.natural
                    } else
                    if (woodcolors == 1) {
                        e.material.map = textures.wood.wood_b.cherry
                    } else
                    if (woodcolors == 2) {
                        e.material.map = textures.wood.wood_b.walnut
                    }
                    setTexture(e.material.map, 2.4, 2)
                    e.material.normalMap = textures.wood.wood_b.normal;
                    e.material.normalScale = new THREE.Vector2(0.25, 0.25)

                    e.material.aoMap = textures.wood.wood_b.ao;
                    e.material.aoMapIntensity = 2;
                    e.material.roughnessMap = textures.wood.wood_b.roughness;


                    e.material.needsUpdate = true;
                }
                if (textureType == 2) {


                    e.material.color.set("#4d4d4d")
                    if (woodcolors == 0) {
                        e.material.map = textures.wood.wood_c.natural
                    } else
                    if (woodcolors == 1) {
                        e.material.map = textures.wood.wood_c.cherry
                    } else
                    if (woodcolors == 2) {
                        e.material.map = textures.wood.wood_c.walnut
                    }
                    setTexture(e.material.map, 2.4, 2)
                    e.material.normalMap = textures.wood.wood_c.normal;
                    e.material.normalScale = new THREE.Vector2(0.25, 0.25)

                    e.material.aoMap = textures.wood.wood_c.ao;
                    e.material.aoMapIntensity = 2;
                    e.material.roughnessMap = textures.wood.wood_c.roughness;


                    e.material.needsUpdate = true;
                }
            }




        })
    }

    if (sideboard != null) {

        sideboard.traverse(e => {
            if (e instanceof THREE.Mesh) {




                if (textureType == 0) {
                    e.material.color.set("#4d4d4d")
                    if (woodcolors == 0) {
                        e.material.map = textures.wood.wood_a.natural
                    } else
                    if (woodcolors == 1) {
                        e.material.map = textures.wood.wood_a.cherry
                    } else
                    if (woodcolors == 2) {
                        e.material.map = textures.wood.wood_a.walnut
                    }


                    e.material.envMap = roomCubeMap.texture;
                    e.material.envMapIntensity = 1;


                    e.material.normalMap = textures.wood.wood_a.normal;
                    e.material.normalScale = new THREE.Vector2(0.25, 0.25)

                    e.material.aoMap = textures.wood.wood_a.ao;

                    e.material.roughnessMap = textures.wood.wood_a.roughness;
                    e.material.roughness = 0.5;

                    e.material.needsUpdate = true;
                }
                if (textureType == 1) {

                    e.material.color.set("#4d4d4d")
                    if (woodcolors == 0) {
                        e.material.map = textures.wood.wood_b.natural
                    } else
                    if (woodcolors == 1) {
                        e.material.map = textures.wood.wood_b.cherry
                    } else
                    if (woodcolors == 2) {
                        e.material.map = textures.wood.wood_b.walnut
                    }

                    e.material.normalMap = textures.wood.wood_b.normal;
                    e.material.normalScale = new THREE.Vector2(0.25, 0.25)
                    e.material.bump = null;
                    e.material.aoMap = textures.wood.wood_b.ao;

                    e.material.roughnessMap = textures.wood.wood_b.roughness;


                    e.material.needsUpdate = true;
                }
                if (textureType == 2) {

                    e.material.color.set("#4d4d4d")
                    if (woodcolors == 0) {
                        e.material.map = textures.wood.wood_c.natural
                    } else
                    if (woodcolors == 1) {
                        e.material.map = textures.wood.wood_c.cherry
                    } else
                    if (woodcolors == 2) {
                        e.material.map = textures.wood.wood_c.walnut
                    }

                    e.material.normalMap = textures.wood.wood_c.normal;
                    e.material.normalScale = new THREE.Vector2(0.25, 0.25)
                    e.material.bump = null;
                    e.material.aoMap = textures.wood.wood_c.ao;

                    e.material.roughnessMap = textures.wood.wood_c.roughness;


                    e.material.needsUpdate = true;
                }
            }





        })
    }

}

function updateTextures() {
    setTexture(textures.wood.wood_a.albedo, 1, 1);
    setTexture(textures.wood.wood_a.walnut, 1, 1);
    setTexture(textures.wood.wood_a.cherry, 1, 1);
    setTexture(textures.wood.wood_a.natural, 1, 1);

    setTexture(textures.wood.wood_a.height, 1, 1);
    setTexture(textures.wood.wood_a.ao, 1, 1);
    setTexture(textures.wood.wood_a.normal, 1, 1);
    setTexture(textures.wood.wood_a.roughness, 1, 1);

    setTexture(textures.wood.wood_b.albedo, 1, 1);
    setTexture(textures.wood.wood_b.walnut, 1, 1);
    setTexture(textures.wood.wood_b.cherry, 1, 1);
    setTexture(textures.wood.wood_b.natural, 1, 1);
    setTexture(textures.wood.wood_b.height, 1, 1);
    setTexture(textures.wood.wood_b.normal, 1, 1);
    setTexture(textures.wood.wood_b.ao, 1, 1);
    setTexture(textures.wood.wood_b.roughness, 1, 1);

    setTexture(textures.wood.wood_c.walnut, 1, 1);
    setTexture(textures.wood.wood_c.cherry, 1, 1);
    setTexture(textures.wood.wood_c.natural, 1, 1);
    setTexture(textures.wood.wood_c.albedo, 1, 1);
    setTexture(textures.wood.wood_c.height, 1, 1);
    setTexture(textures.wood.wood_c.normal, 1, 1);
    setTexture(textures.wood.wood_c.ao, 1, 1);
    setTexture(textures.wood.wood_c.roughness, 1, 1);
    // setTexture(textures.tufted.normal, 1, 1);
    // setTexture(textures.tufted.roughness, 1, 1);
    // setTexture(textures.tufted.ao, 1, 1);
    // setTexture(textures.tufted.bump, 1, 1);
    // setTexture(textures.cotton.bump, 1, 1);
}

function setModel(objA) {


    setTextureInteraction(3)

    objA.traverse(function (e) {
        if (e instanceof THREE.Mesh) {

            e.castShadow = true;
            e.receiveShadow = true;
            if (e.material.name.includes("drawer")) {
                e.material.flatShading = false;

                e.material.color.set(0x3d3d3d);
                e.material.roughness = 0.4
            }

            if (e.material.name.includes("hb3_table")) {
                e.material.color.set(0x101010);
                e.material.roughness = 0.3
            }

            if (e.material.name.includes("handle")) {
                e.material.envMap = roomCubeMap.texture
                e.material.envMapIntensity = 0.3;
                e.material.color.set(0xdedede)
                e.material.roughness = 0.25;
                e.material.metalness = 1;
            }

            if (e.material.name.includes("hb5_door")) {
                e.material.map = texLoader.load("models/bed/wood_A.jpg")
                e.material.roughnessMap = texLoader.load("models/bed/teak_1_roughness.jpg")
                e.material.color.set(0x8f6b57);
                e.material.roughness = 0.3;
                e.material.bumpMap = texLoader.load("models/bed/gridH.jpg");
                e.material.normalMap = texLoader.load("models/bed/gridH.jpg");
                e.material.normalScale = new THREE.Vector2(2, 2)

            }
            if (e.material.name.includes("hb3_wood")) {
                e.material.map = null;


                e.material.roughness = 0.3
                e.material.color.set(0xdedede);
            }
            if (e.material.name.includes("hb3_metal")) {
                e.material.envMap = roomCubeMap.texture
                e.material.envMapIntensity = 0.3;
                e.material.color.set(0x212121);
                e.material.roughness = 0.1;
                e.material.metalness = 1;


            }
            // if (e.material.name.includes("hb3_fabric")) {
            //     var normal = texLoader.load("models/bed/tufted_normal.jpg");
            //     var ao = texLoader.load("models/bed/tufted_ao.jpg");
            //     var cotton = texLoader.load("models/bed/cotton.jpg");
            //     var disp = texLoader.load("models/bed/tufted_disp.jpg");
            //     var height = texLoader.load("models/bed/tufted_height.jpg");
            //     var roughness = texLoader.load("models/bed/tufted_roughness.jpg");

            //     setTexture(normal);
            //     setTexture(ao);
            //     setTexture(cotton);
            //     setTexture(disp);
            //     setTexture(height);
            //     setTexture(roughness);


            //     e.material.color.set(0x6e6e6e);
            //     e.material.displacementMap = disp;
            //     e.material.displacementScale = 0;
            //     e.material.bumpMap = cotton;
            //     e.material.roughnessMap = roughness;
            //     e.material.aoMap = ao;
            //     e.material.normalMap = normal;

            //     e.material.bumpScale = 1;
            //     e.material.normalScale = new THREE.Vector2(2, 2);

            //     e.material.roughness = 1;
            //     e.material.metalness = 0;


            // }



            selects.push(e);

        }
    });
    updateBedMaterial();


}

function getChildfromObject(obj, name, type) {
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

function chooseBoardDesign(type) {
    for (let i in boards.children) {

        boards.children[i].visible = i == type ? true : false;
    }
}

function updateSideBoard() {
    var sideboardSize = new THREE.Box3().setFromObject(bedTops[2]).getSize(new THREE.Vector3());

    sideboardL.position.copy(bedTops[2].position);
    sideboardR.position.copy(bedTops[3].position);
    sideboardL.scale.copy(sideboardSize);
    sideboardR.scale.copy(sideboardSize);
}

function updateBoards() {


    if (boards != null) {
        chooseBoardDesign(boardType);

        var headboard = getChildfromObject(boards, "headboard", boardType).object;
        var footboard = getChildfromObject(boards, "footboard", boardType).object;
        var tableLeft = getChildfromObject(boards, "tableleft", boardType).object;
        var tableRight = getChildfromObject(boards, "tableright", boardType).object;

        if (bedTops.length > 0) {
            bedTops[0].visible = false;
            bedTops[1].visible = false;
            bedTops[2].visible = false;
            bedTops[3].visible = false;


            headboard.position.setZ(bedTops[0].position.z + bedTops[0].scale.z / 2)
            headboard.position.setY(bedTops[0].position.y - bedTops[0].scale.y / 2)
            footboard.position.setZ(bedTops[1].position.z - bedTops[1].scale.z / 2)
            footboard.position.setY(bedTops[1].position.y - bedTops[1].scale.y / 2)

            var bedTopSize = new THREE.Box3().setFromObject(bedTops[0]).getSize(new THREE.Vector3());
            var tableSize = new THREE.Box3().setFromObject(tableLeft).getSize(new THREE.Vector3());
            tableLeft.position.setX(bedTops[0].position.x - bedTopSize.x / 2 - tableSize.x)
            tableLeft.position.setZ(bedTops[0].position.z - bedTops[0].scale.z)
            tableRight.position.setX(bedTops[0].position.x + bedTopSize.x / 2 + tableSize.x)
            tableRight.position.setZ(bedTops[0].position.z - bedTops[0].scale.z)
        }



        headboard.traverse(e => {

            if (e.name.includes("low")) {
                if (wHeight == 1.25) {

                    e.visible = true;
                } else {
                    e.visible = false

                }
                if (e instanceof THREE.Object3D) {
                    e.traverse(i => {

                        if (i instanceof THREE.Object3D) {
                            if (i.name.startsWith("board_a")) {

                                if (wWidth == 3) {

                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                            if (i.name.includes("board_b")) {
                                if (wWidth == 4) {
                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                            if (i.name.includes("board_c")) {
                                if (wWidth == 5) {
                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                            if (i.name.includes("board_d")) {
                                if (wWidth == 6) {
                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                        }

                    });
                }

            } else if (e.name.includes("normal")) {
                if (wHeight == 1.75) {
                    e.visible = true
                } else {
                    e.visible = false

                }
                e.traverse(i => {
                    if (i instanceof THREE.Object3D) {
                        if (i.name.startsWith("board_a")) {

                            if (wWidth == 3) {

                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                        if (i.name.includes("board_b")) {
                            if (wWidth == 4) {
                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                        if (i.name.includes("board_c")) {
                            if (wWidth == 5) {
                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                        if (i.name.includes("board_d")) {
                            if (wWidth == 6) {
                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                    }
                });
            }
        })

        footboard.traverse(e => {

            if (e.name.includes("low")) {
                if (wHeight == 1.25) {

                    e.visible = true;
                } else {
                    e.visible = false

                }
                if (e instanceof THREE.Object3D) {
                    e.traverse(i => {

                        if (i instanceof THREE.Object3D) {
                            if (i.name.startsWith("board_a")) {

                                if (wWidth == 3) {

                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                            if (i.name.includes("board_b")) {
                                if (wWidth == 4) {
                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                            if (i.name.includes("board_c")) {
                                if (wWidth == 5) {
                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                            if (i.name.includes("board_d")) {
                                if (wWidth == 6) {
                                    i.visible = true;
                                } else {
                                    i.visible = false
                                }
                            }
                        }

                    });
                }

            } else if (e.name.includes("normal")) {
                if (wHeight == 1.75) {
                    e.visible = true
                } else {
                    e.visible = false

                }
                e.traverse(i => {
                    if (i instanceof THREE.Object3D) {
                        if (i.name.startsWith("board_a")) {

                            if (wWidth == 3) {

                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                        if (i.name.includes("board_b")) {
                            if (wWidth == 4) {
                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                        if (i.name.includes("board_c")) {
                            if (wWidth == 5) {
                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                        if (i.name.includes("board_d")) {
                            if (wWidth == 6) {
                                i.visible = true;
                            } else {
                                i.visible = false
                            }
                        }
                    }
                });
            }
        })
        tableLeft.traverse(e => {

            if (e.name.includes("low")) {
                if (wHeight == 1.25 && istableLeft) {

                    e.visible = true;
                } else {
                    e.visible = false

                }
            } else if (e.name.includes("normal")) {
                if (wHeight == 1.75 && istableLeft) {

                    e.visible = true;
                } else {
                    e.visible = false

                }
            }
        })

        tableRight.traverse(e => {
            if (e.name.includes("low")) {
                if (wHeight == 1.25 && istableRight) {

                    e.visible = true;
                } else {
                    e.visible = false

                }
            } else if (e.name.includes("normal")) {
                if (wHeight == 1.75 && istableRight) {

                    e.visible = true;
                } else {
                    e.visible = false

                }
            }
        })

    }


}

function createMatress() {
    importMatress();

}

function setMatress(matress) {
    matress.scale.set(wWidth * ftTom, 10 * ftTom / 12, wDepth * ftTom);
    matress.position.setY(bedFloor.position.y + bedFloor.scale.y)

    // var mat = matress.children[0].children[0];

    if (matress) {
        matress.traverse(e => {

            if (e instanceof THREE.Mesh) {
                e.castShadow = true;
                e.receiveShadow = true;
                var mat = e.material;

                if (mat.name.includes("blanket")) {
                    mat.shading = THREE.SmoothShading;

                    setTexture(textures.fabric.cotton.normal, 0.1, 0.1)
                    setTexture(textures.fabric.cotton.roughness, 2, 2)
                    setTexture(textures.fabric.cotton.height, 2, 2)
                    mat.color.set("#bcbcbc")
                    mat.roughnessMap = null;
                    mat.normalMap = null;
                    mat.bumpMap = null;

                    mat.roughness = 1;
                }
                if (mat.name.includes("matress")) {
                    mat.color.set("#a0a0a0")
                    mat.roughness = 1;
                }
            }
        })
    }
    // var texAO = texLoader.load('./models/matress/ao.png');



    // mat.material.normalScale = new THREE.Vector2(0.5,0.5)
    // mat.material.normalMap = null;
    // mat.material = new THREE.MeshStandardMaterial({color:0xcdcdcd,metalness:0, flatShading:"false"});
    // mat.material = new THREE.MeshStandardMaterial({color:0xf0f0f0,metalness:0, map:matAlbedo, normalMap:matNormal, aoMap:matAO, flatShading:"false", bum});

    this.bedMatress = matress;
    bedMatress.visible = true;

}

function updateMatress() {

    bedMatress.scale.set(wWidth * ftTom, 8 * ftTom / 12, wDepth * ftTom - ftTom / 12);
    bedMatress.position.setY(bedFloor.position.y + bedFloor.scale.y / 2)

}

function importMatress() {
    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        $("#loadingText").html("Please Wait...");
        // controls.enabled = false;
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        $("#progressText").html((itemsLoaded / itemsTotal * 100).toFixed() + '%')
        $("#progressbar").css("width", (itemsLoaded / itemsTotal * 100).toFixed() + "%");

    };
    manager.onLoad = function () {
        $("#loadingScreen").addClass("d-none")
        // controls.enabled = true;
    };


    gltfLoader.load(
        './models/matress/matress.gltf',
        function (gltf) {
            scene.add(gltf.scene)
            setMatress(gltf.scene);
        }
    )
    createPillow();

}

function createPillow() {
    importPilow();
}

function setPillow(pillow) {
    var texNormal = texLoader.load("./models/pillow/p_normal.png");
    var texAO = texLoader.load("./models/pillow/p_ao.png");
    var texRoughness = texLoader.load("./models/pillow/p_roughness.png");


    pillow.children[0].material = new THREE.MeshStandardMaterial({
        color: 0x3d3d3d,
        normalMap: texNormal,
        normalScale: new THREE.Vector2(2, 2),
        aoMap: texAO,
        aoMapIntensity: 2,
        roughness: 1,
        roughnessMap: texRoughness
    });
    pillow.children[0].material.needsUpdate = true;

    pillow.traverse(e => {
        if (e instanceof THREE.Mesh) {
            e.castShadow = true;
            e.receiveShadow = true;
        }
    })
    pillowL = pillow;
    pillowL.visible = true;


    pillowR = pillow.clone();

    scene.add(pillowR);

}

function updatePillow() {
    if (bedMatress.visible) {

        var scaleFactor = 1.95;
        pillowL.scale.set(scaleFactor, scaleFactor, scaleFactor)
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
        pillowL.rotation.x = 60 * THREE.MathUtils.DEG2RAD;
        pillowL.position.setZ(bedMatress.position.z - bedMatress.scale.z / 2 + 0.1)
        pillowL.position.setY(bedMatress.position.y + bedMatress.scale.y + pillowL.scale.y * ftTom / 12);
        pillowR.rotation.x = 60 * THREE.MathUtils.DEG2RAD;
        pillowR.position.setZ(bedMatress.position.z - bedMatress.scale.z / 2 + +0.1)
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

    bedTableRight.position.set(bedTops[0].position.x + bedTops[0].scale.x / 2 + bedTableRight.children[3].scale.x / 2 + bedTableRight.children[1].scale.x, 0, bedTops[0].position.z)
    bedTableLeft.position.set(bedTops[0].position.x - bedTops[0].scale.x / 2 - bedTableLeft.children[3].scale.x / 2 - bedTableLeft.children[2].scale.x, 0, bedTops[0].position.z)
}

function createDrawers() {
    bedDrawerLeft.name = "DrawerLeft";
    bedDrawerRight.name = "DrawerRight";


    for (var i = 0; i < 5; i++) {

        bedDrawerLeft.add(createBox("drawerLeft_parts" + i));

        bedDrawerRight.add(createBox("drawerRight_parts" + i));


    }

    bedDrawerLeft.traverse(e => {
        e.visible = false;
    })
    bedDrawerRight.traverse(e => {
        e.visible = false;
    })
    // bedDrawerLeft.traverse(e=>{
    //     if(e instanceof THREE.Mesh){
    //         e.material.color.set(0x000000);
    //         e.material.map = textures.wood.wood_a.albedo.clone();
    //         e.material.map.rotation = Math.PI/2;
    //         e.material.map.repeat = new THREE.Vector2(0.15,0.25);
    //         e.material.map.needsUpdate = true
    //         e.material.needsUpdate = true;
    //     }

    // })
    drawerBoardsLeft = new THREE.Group();
    drawerBoardsRight = new THREE.Group();
    for (var i = 0; i < 4; i++) {
        drawerBoardsLeft.add(sideboard.children[0].clone());
    }
    for (var i = 0; i < 4; i++) {
        drawerBoardsRight.add(sideboard.children[0].clone());
    }
    for (var i = 0; i < bedDrawerLeft.children.length; i++) {
        bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[i]));
        bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[i]));
    }
    if (drawerBoard) {
        drawerPanelL = drawerBoard.clone();
        drawerPanelR = drawerBoard.clone();


        scene.add(drawerPanelL)
        scene.add(drawerPanelR)
    }
    // for (var i = 0; i < 1; i++) {
    //     if(drawerBoard){
    //         bedDrawerLeft.add(drawerBoard.clone())
    //         bedDrawerRight.add(drawerBoard.clone())
    //     }
    // }    
    //     // bedDrawerLeft.add(new THREE.Mesh(new THREE.CylinderGeometry(2 * ftTom / 12, 2 * ftTom / 12, 4 * ftTom / 12, 24, 1), bedDrawerLeft.children[0].material));
    //     // bedDrawerRight.add(new THREE.Mesh(new THREE.CylinderGeometry(2 * ftTom / 12, 2 * ftTom / 12, 4 * ftTom / 12, 24, 1), bedDrawerRight.children[0].material));




    // bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[5].clone()))
    // bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[6].clone()))

    // bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[5].clone()))
    // bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[6].clone()))

    dimensionScene.add(bedDrawerLeftEdge);
    dimensionScene.add(bedDrawerRightEdge);

    scene.add(bedDrawerLeft);
    scene.add(bedDrawerRight);
    scene.add(drawerBoardsLeft);
    scene.add(drawerBoardsRight);
    bedDrawerLeft.visible = false;
    bedDrawerRight.visible = false;
    bedDrawerLeftEdge.visible = false;
    bedDrawerRightEdge.visible = false;





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


        bedDrawerLeft.children[0].scale.set(wWidth * ftTom, ftTom / 12, wDepth * ftTom - bedTops[1].scale.z - ftTom - ftTom / 6 - 0.5 * ftTom / 12); // bottom
        bedDrawerLeft.children[1].scale.set(ftTom / 12, height, bedDrawerLeft.children[0].scale.z + ftTom / 6); // left
        bedDrawerLeft.children[2].scale.set(ftTom / 12, height, bedDrawerLeft.children[1].scale.z); // right
        bedDrawerLeft.children[3].scale.set(bedDrawerLeft.children[0].scale.x, height, ftTom / 12); // front
        bedDrawerLeft.children[4].scale.set(bedDrawerLeft.children[3].scale.x, height, ftTom / 12); // back


        // bedDrawerLeft.children[5].position.setX(bedDrawerLeft.children[1].position.x)
        // bedDrawerLeft.children[5].position.setZ(bedDrawerLeft.children[1].position.z - bedDrawerLeft.children[1].scale.z / 4)
        // bedDrawerLeft.children[5].position.setY(bedDrawerLeft.children[1].position.y + bedDrawerLeft.children[1].scale.y / 2)
        // bedDrawerLeft.children[5].rotation.y = (90 * THREE.MathUtils.DEG2RAD)


        // bedDrawerLeft.children[6].position.setX(bedDrawerLeft.children[1].position.x)
        // bedDrawerLeft.children[6].position.setZ(bedDrawerLeft.children[1].position.z + bedDrawerLeft.children[1].scale.z / 4)
        // bedDrawerLeft.children[6].position.setY(bedDrawerLeft.children[1].position.y + bedDrawerLeft.children[1].scale.y / 2)
        // bedDrawerLeft.children[6].rotation.y = (90 * THREE.MathUtils.DEG2RAD)

        bedDrawerRight.children[0].scale.set(wWidth * ftTom - ftTom / 12, ftTom / 12, wDepth * ftTom - bedTops[1].scale.z - ftTom - ftTom / 6 - 0.5 * ftTom / 12); // bottom
        bedDrawerRight.children[1].scale.set(ftTom / 12, height, bedDrawerRight.children[0].scale.z + ftTom / 6); // left
        bedDrawerRight.children[2].scale.set(ftTom / 12, height, bedDrawerRight.children[1].scale.z); // right
        bedDrawerRight.children[3].scale.set(bedDrawerRight.children[0].scale.x, height, ftTom / 12); // front
        bedDrawerRight.children[4].scale.set(bedDrawerRight.children[0].scale.x, height, ftTom / 12); // back


        // bedDrawerRight.children[5].position.setX(bedDrawerLeft.children[2].position.x)
        // bedDrawerRight.children[5].position.setZ(bedDrawerLeft.children[2].position.z - bedDrawerLeft.children[2].scale.z / 4)
        // bedDrawerRight.children[5].position.setY(bedDrawerLeft.children[2].position.y + bedDrawerLeft.children[2].scale.y / 2)
        // bedDrawerRight.children[5].rotation.y = (90 * THREE.MathUtils.DEG2RAD)


        // bedDrawerRight.children[6].position.setX(bedDrawerLeft.children[2].position.x)
        // bedDrawerRight.children[6].position.setZ(bedDrawerLeft.children[2].position.z + bedDrawerLeft.children[2].scale.z / 4)
        // bedDrawerRight.children[6].position.setY(bedDrawerLeft.children[2].position.y + bedDrawerLeft.children[2].scale.y / 2)
        // bedDrawerRight.children[6].rotation.y = (90 * THREE.MathUtils.DEG2RAD)


        if (wWidth == 3) {

            bedDrawerRight.visible = false;

            bedDrawerLeft.children[0].scale.setX(wWidth * ftTom - ftTom / 12);


            bedDrawerRight.children[0].scale.setX(wWidth * ftTom - ftTom / 12);


            bedDrawerLeft.position.setX(0);
            bedDrawerRight.position.setX(0);
        } else {
            bedDrawerRight.visible = bedDrawerLeft.visible;


            bedDrawerLeft.children[0].scale.setX(wWidth * ftTom / 2 - ftTom / 6 + ftTom / 24);


            bedDrawerRight.children[0].scale.setX(wWidth * ftTom / 2 - ftTom / 6 + ftTom / 24);

            bedDrawerLeft.position.setX(-wWidth * ftTom / 4 - ftTom / 48);
            bedDrawerRight.position.setX(wWidth * ftTom / 4 + ftTom / 48);

        }
        bedDrawerLeft.children[3].scale.setX(bedDrawerLeft.children[0].scale.x);
        bedDrawerLeft.children[4].scale.setX(bedDrawerLeft.children[3].scale.x);

        bedDrawerRight.children[3].scale.setX(bedDrawerRight.children[0].scale.x);
        bedDrawerRight.children[4].scale.setX(bedDrawerRight.children[3].scale.x);

        bedDrawerLeftEdge.visible = bedDrawerLeft.visible;
        bedDrawerRightEdge.visible = bedDrawerRight.visible;

        bedDrawerLeft.children[0].position.setY(-wHeight * ftTom / 2 + bedTops[2].scale.y / 2 + ftTom / 24); // bottom
        bedDrawerLeft.children[0].position.setZ(bedTops[1].position.z - bedDrawerLeft.children[0].scale.z / 2 - bedDrawerLeft.children[4].scale.z - bedTops[1].scale.z / 2 - 0.5 * ftTom / 24); // bottom

        bedDrawerLeft.children[1].position.setX(-bedDrawerLeft.children[0].scale.x / 2 - bedDrawerLeft.children[1].scale.x / 2); // left
        bedDrawerLeft.children[1].position.setZ(bedDrawerLeft.children[0].position.z); // left

        bedDrawerLeft.children[2].position.setX(bedDrawerLeft.children[0].scale.x / 2 + bedDrawerLeft.children[2].scale.x / 2); // right
        bedDrawerLeft.children[2].position.setZ(bedDrawerLeft.children[0].position.z); // right

        bedDrawerLeft.children[3].position.setZ(bedDrawerLeft.children[0].position.z + bedDrawerLeft.children[0].scale.z / 2 + bedDrawerLeft.children[3].scale.z / 2); // front
        bedDrawerLeft.children[4].position.setZ(bedDrawerLeft.children[0].position.z - bedDrawerLeft.children[0].scale.z / 2 - bedDrawerLeft.children[4].scale.z / 2); // back

        drawerPanelL.position.setX(bedDrawerLeft.position.x + bedDrawerLeft.children[1].position.x);
        drawerPanelL.position.setZ(bedDrawerLeft.position.z + bedDrawerLeft.children[1].position.z);

        drawerPanelL.rotation.y = Math.PI / 2;
        bedDrawerRight.children[0].position.setY(-wHeight * ftTom / 2 + bedTops[2].scale.y / 2 + ftTom / 24); // bottom
        bedDrawerRight.children[0].position.setZ(bedTops[1].position.z - bedDrawerRight.children[0].scale.z / 2 - bedDrawerRight.children[4].scale.z - bedTops[1].scale.z / 2 - 0.5 * ftTom / 24); // bottom

        bedDrawerRight.children[1].position.setX(-bedDrawerRight.children[0].scale.x / 2 - bedDrawerRight.children[1].scale.x / 2); // left
        bedDrawerRight.children[1].position.setZ(bedDrawerRight.children[0].position.z); // left

        bedDrawerRight.children[2].position.setX(bedDrawerRight.children[0].scale.x / 2 + bedDrawerRight.children[2].scale.x / 2); // right
        bedDrawerRight.children[2].position.setZ(bedDrawerRight.children[0].position.z); // right

        bedDrawerRight.children[3].position.setZ(bedDrawerRight.children[0].position.z + bedDrawerRight.children[0].scale.z / 2 + bedDrawerRight.children[3].scale.z / 2); // front
        bedDrawerRight.children[4].position.setZ(bedDrawerRight.children[0].position.z - bedDrawerRight.children[0].scale.z / 2 - bedDrawerRight.children[4].scale.z / 2); // back

        if (drawerBoardsLeft.children.length > 0) {
            drawerBoardsLeft.children[0].scale.copy(bedDrawerLeft.children[0].scale);
            drawerBoardsLeft.children[1].scale.copy(bedDrawerLeft.children[2].scale);
            drawerBoardsLeft.children[2].scale.copy(bedDrawerLeft.children[3].scale);
            drawerBoardsLeft.children[3].scale.copy(bedDrawerLeft.children[4].scale);
            drawerBoardsLeft.children[0].position.copy(bedDrawerLeft.children[0].position);
            drawerBoardsLeft.children[1].position.copy(bedDrawerLeft.children[2].position);
            drawerBoardsLeft.children[2].position.copy(bedDrawerLeft.children[3].position);
            drawerBoardsLeft.children[3].position.copy(bedDrawerLeft.children[4].position);
        }
        drawerBoardsLeft.position.copy(bedDrawerLeft.position)

        if (drawerBoardsRight.children.length > 0) {
            drawerBoardsRight.children[0].scale.copy(bedDrawerRight.children[0].scale);
            drawerBoardsRight.children[1].scale.copy(bedDrawerRight.children[1].scale);
            drawerBoardsRight.children[2].scale.copy(bedDrawerRight.children[3].scale);
            drawerBoardsRight.children[3].scale.copy(bedDrawerRight.children[4].scale);
            drawerBoardsRight.children[0].position.copy(bedDrawerRight.children[0].position);
            drawerBoardsRight.children[1].position.copy(bedDrawerRight.children[1].position);
            drawerBoardsRight.children[2].position.copy(bedDrawerRight.children[3].position);
            drawerBoardsRight.children[3].position.copy(bedDrawerRight.children[4].position);
        }
        drawerBoardsRight.position.copy(bedDrawerRight.position)


        drawerPanelR.position.setX(bedDrawerRight.position.x + bedDrawerRight.children[2].position.x);
        drawerPanelR.position.setZ(bedDrawerRight.position.z + bedDrawerRight.children[2].position.z);

        drawerPanelR.rotation.y = Math.PI / 2;

        drawerBoardsLeft.visible = bedDrawerLeft.visible;
        drawerBoardsRight.visible = bedDrawerRight.visible;
        drawerPanelL.visible = bedDrawerLeft.visible;
        drawerPanelR.visible = bedDrawerRight.visible;

        drawerPanelL.traverse(e => {
            if (e instanceof THREE.Mesh) {
                e.matrixAutoUpdate = true;
            }
            if (e.name.startsWith("low")) {
                var drawerPanelLSize = new THREE.Box3().setFromObject(e).getSize(new THREE.Vector3());
                e.position.setY(drawerPanelLSize.y / 2)
                if (wHeight == "1.25") {
                    e.visible = true;
                } else {
                    e.visible = false;
                }

                for (let i in e.children) {
                    var obj = e.children[i];
                    if (wDepth == 6) {
                        obj.name.includes("drawerPanela") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.25) {
                        obj.name.includes("drawerPanelb") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.5) {
                        obj.name.includes("drawerPanelc") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.75) {
                        obj.name.includes("drawerPaneld") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 7) {
                        obj.name.includes("drawerPanele") ? obj.visible = true : obj.visible = false;
                    }
                }


            } else if (e.name.startsWith("normal")) {
                var drawerPanelLSize = new THREE.Box3().setFromObject(e).getSize(new THREE.Vector3());
                e.position.setY(drawerPanelLSize.y / 2)
                if (wHeight == "1.75") {
                    e.visible = true;
                } else {
                    e.visible = false;
                }

                for (let i in e.children) {
                    var obj = e.children[i];
                    if (wDepth == 6) {
                        obj.name.includes("drawerPanela") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.25) {
                        obj.name.includes("drawerPanelb") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.5) {
                        obj.name.includes("drawerPanelc") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.75) {
                        obj.name.includes("drawerPaneld") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 7) {
                        obj.name.includes("drawerPanele") ? obj.visible = true : obj.visible = false;
                    }
                }

            }
        })
        drawerPanelR.traverse(e => {

            if (e.name.startsWith("low")) {
                var drawerPanelLSize = new THREE.Box3().setFromObject(e).getSize(new THREE.Vector3());
                e.position.setY(drawerPanelLSize.y / 2)
                if (wHeight == "1.25") {
                    e.visible = true;
                } else {
                    e.visible = false;
                }

                for (let i in e.children) {
                    var obj = e.children[i];
                    if (wDepth == 6) {
                        obj.name.includes("drawerPanela") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.25) {
                        obj.name.includes("drawerPanelb") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.5) {
                        obj.name.includes("drawerPanelc") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.75) {
                        obj.name.includes("drawerPaneld") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 7) {
                        obj.name.includes("drawerPanele") ? obj.visible = true : obj.visible = false;
                    }
                }


            } else if (e.name.startsWith("normal")) {
                var drawerPanelLSize = new THREE.Box3().setFromObject(e).getSize(new THREE.Vector3());
                e.position.setY(drawerPanelLSize.y / 2)
                if (wHeight == "1.75") {
                    e.visible = true;
                } else {
                    e.visible = false;
                }

                for (let i in e.children) {
                    var obj = e.children[i];
                    if (wDepth == 6) {
                        obj.name.includes("drawerPanela") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.25) {
                        obj.name.includes("drawerPanelb") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.5) {
                        obj.name.includes("drawerPanelc") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 6.75) {
                        obj.name.includes("drawerPaneld") ? obj.visible = true : obj.visible = false;
                    } else if (wDepth == 7) {
                        obj.name.includes("drawerPanele") ? obj.visible = true : obj.visible = false;
                    }
                }

            }
        })


        // bedDrawerLeft.children[5].visible = false;
        // bedDrawerLeft.children[6].visible = false;


        // bedDrawerRight.children[5].visible = false;
        // bedDrawerRight.children[6].visible = false;


        // if( !bedDrawerLeft.children[7] &&  isDrawerHandleCreated ){


        //     bedDrawerLeft.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerLeft.children[1]).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[5])), bedDrawerLeft.children[1].material));
        //     bedDrawerRight.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerRight.children[2]).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[5])), bedDrawerRight.children[2].material));

        //     // bedDrawerLeftEdge.add(bedDrawerLeft.children[7].clone());
        //     // bedDrawerRightEdge.add(bedDrawerRight.children[7].clone());

        //     isDrawerHandleCreated = false;
        // }



        // if( isDrawerHandleCreated){
        //     if (bedDrawerLeft.children[7] ) {
        //         bedDrawerLeft.remove(bedDrawerLeft.children[7])

        //     }
        //     if(bedDrawerLeftEdge.children[7]){
        //         bedDrawerLeftEdge.remove(bedDrawerLeftEdge.children[7]);
        //     }
        //     if (bedDrawerRight.children[7]  ) {

        //         bedDrawerRight.remove(bedDrawerRight.children[7])

        //     }

        //     if(bedDrawerRightEdge.children[7]){
        //         bedDrawerRightEdge.remove(bedDrawerRightEdge.children[7]);
        //     }

        //     if(!bedDrawerLeft.children[7] ){
        //         bedDrawerLeft.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerLeft.children[1]).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerLeft.children[5])), bedDrawerLeft.children[1].material));

        //     }

        //     if(!bedDrawerLeftEdge.children[7]){
        //         bedDrawerLeftEdge.add(createEdges(bedDrawerLeft.children[7].clone()));

        //     }
        //     if(!bedDrawerRight.children[7]){
        //         bedDrawerRight.add( new THREE.CSG.toMesh(THREE.CSG.fromMesh(bedDrawerRight.children[2]).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[6])).subtract(THREE.CSG.fromMesh(bedDrawerRight.children[5])), bedDrawerRight.children[2].material));

        //     }


        //     if(!bedDrawerRightEdge.children[7]){
        //         bedDrawerRightEdge.add(createEdges(bedDrawerRight.children[7].clone()));
        //     }

        // }

        // if(!isDrawerHandleCreated){
        //     if (bedDrawerLeft.children[7] ) {
        //         bedDrawerLeft.remove(bedDrawerLeft.children[7])

        //     }
        //     if(bedDrawerLeftEdge.children[7]){
        //         bedDrawerLeftEdge.remove(bedDrawerLeftEdge.children[7]);
        //     }
        //     if (bedDrawerRight.children[7]) {

        //         bedDrawerRight.remove(bedDrawerRight.children[7])

        //     }
        //     if(bedDrawerRightEdge.children[7]){
        //         bedDrawerRightEdge.remove(bedDrawerRightEdge.children[7]);
        //     }
        //     isDrawerHandleCreated = true;
        // }


        for (var i = 0; i < bedDrawerLeftEdge.children.length; i++) {
            bedDrawerLeftEdge.children[i].position.copy(bedDrawerLeft.children[i].position);
            bedDrawerLeftEdge.children[i].scale.copy(bedDrawerLeft.children[i].scale);
            bedDrawerLeftEdge.children[i].rotation.copy(bedDrawerLeft.children[i].rotation);

            bedDrawerLeftEdge.children[i].visible = bedDrawerLeft.children[i].visible;
        }


        for (var i = 0; i < bedDrawerRightEdge.children.length; i++) {

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



function swaprender() {
    isMeasured = !isMeasured;





}

function createEdges(object) {
    let edges = new THREE.EdgesGeometry(object.geometry.clone());

    var subject = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x000000
    }));

    subject.layers.set(1)
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

    if (bedTops.length > 0) {


        var from = new THREE.Vector3(bedTops[1].position.x, bedTops[1].position.y - 0.3, bedTops[1].position.z + bedTops[1].scale.z + 0.1);
        var to = new THREE.Vector3(-bedTops[1].scale.x / 2, bedTops[1].position.y - 0.3, bedTops[1].position.z + bedTops[1].scale.z + 0.1);
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();
        var wValue;


        if (whArrowL == null) {
            whArrowL = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            whArrowR = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

            dimensionScene.add(whArrowL);
            dimensionScene.add(whArrowR);



            wValue = document.createElement('div');
            wValue.innerHTML = (wWidth) + " ft";

            wValue.style.fontSize = "15px";


            widthLabel = new THREE.CSS2DObject(wValue);

            dimensionScene.add(widthLabel);



        } else {
            whArrowL.setDirection(direction.normalize());
            whArrowL.setLength(length, 0.05, 0.05);
            whArrowL.position.copy(from.clone());

            whArrowR.setDirection(direction.negate().normalize());
            whArrowR.setLength(length, 0.05, 0.05);
            whArrowR.position.copy(from.clone());

            widthLabel.element.innerHTML = (wWidth) + " ft(" + wWidth * 12 + " in)";

            widthLabel.position.setZ(whArrowL.position.z / 2 - 0.65)


            // widthLabel.scale.set(0.15, 0.15, 0.15)
        }

    }


}


function createVerticalArrows() {

    if (bedTops.length > 0) {

        var from = new THREE.Vector3(bedTops[3].position.x + 0.1, bedTops[2].position.y - 0.5, bedTops[2].position.z);
        var to = new THREE.Vector3(bedTops[3].position.x + 0.1, bedTops[2].position.y - 0.5, -bedTops[2].scale.z / 2 - bedTops[0].scale.z);
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();

        var wValue;


        if (wvArrowUp == null) {

            wvArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            wvArrowDown = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);



            wvArrowUp.traverse(function (n) {
                n.layers.set(2);
            })
            wvArrowDown.traverse(function (n) {
                n.layers.set(2);
            })


            dimensionScene.add(wvArrowUp);
            dimensionScene.add(wvArrowDown);





            wValue = document.createElement('div');
            wValue.innerHTML = (wDepth) + " ft";
            wValue.style.top = "0px";
            wValue.style.fontSize = "15px";


            wValue2 = document.createElement('div');
            wValue2.innerHTML = (wDepth) + " ft";
            wValue2.style.top = "0px";
            wValue2.style.fontSize = "15px";

            depthLabel = new THREE.CSS2DObject(wValue);
            depthLabel2 = new THREE.CSS2DObject(wValue2);

            wvArrowUp.add(depthLabel);
            dimensionScene.add(depthLabel2);



        } else {
            wvArrowUp.setDirection(direction.normalize());
            wvArrowUp.setLength(length, 0.05, 0.05);
            wvArrowUp.position.copy(from.clone());

            wvArrowDown.setDirection(direction.negate().normalize());
            wvArrowDown.setLength(length, 0.05, 0.05);
            wvArrowDown.position.copy(from.clone());



            depthLabel.element.innerHTML = (wDepth) + " ft(" + wDepth * 12 + " in)";
            depthLabel2.element.innerHTML = (wDepth) + " ft(" + wDepth * 12 + " in)";

            depthLabel.position.set(0.25, 0.6, 0)
            depthLabel2.position.set(0, 0, ((fwidth / fheight) / 1.85) - wvArrowUp.position.y / 2)
            // widthLabel.scale.set(0.15, 0.15, 0.15)
        }

    }


}




function createDrawerArrows() {

    if (bedTops.length > 0) {

        var from = new THREE.Vector3(bedDrawerLeft.position.x, bedDrawerLeft.position.y, bedDrawerLeft.position.z - 0.1);
        var to = new THREE.Vector3(bedDrawerLeft.position.x, bedDrawerLeft.position.y, bedDrawerLeft.children[4].position.z + bedDrawerLeft.children[4].scale.z / 2);
        var direction = to.clone().sub(from);
        var length = direction.manhattanLength();


        var from2 = new THREE.Vector3(bedDrawerLeft.position.x, bedDrawerLeft.position.y, bedDrawerLeft.position.z + 0.4);
        var to2 = new THREE.Vector3(bedDrawerLeft.position.x, bedDrawerLeft.position.y, bedDrawerLeft.children[3].position.z - bedDrawerLeft.children[3].scale.z / 2);
        var direction2 = to2.clone().sub(from2);
        var length2 = direction2.manhattanLength();


        var from3 = new THREE.Vector3(bedDrawerRight.position.x, bedDrawerRight.position.y, bedDrawerRight.position.z - 0.1);
        var to3 = new THREE.Vector3(bedDrawerRight.position.x, bedDrawerRight.position.y, bedDrawerRight.children[4].position.z + bedDrawerRight.children[4].scale.z / 2);
        var direction3 = to3.clone().sub(from3);
        var length3 = direction3.manhattanLength();



        var from4 = new THREE.Vector3(bedDrawerRight.position.x, bedDrawerRight.position.y, bedDrawerRight.position.z + 0.4);
        var to4 = new THREE.Vector3(bedDrawerRight.position.x, bedDrawerRight.position.y, bedDrawerRight.children[3].position.z - bedDrawerRight.children[3].scale.z / 2);
        var direction4 = to4.clone().sub(from4);
        var length4 = direction4.manhattanLength();

        var from5 = new THREE.Vector3(bedTops[0].position.x, bedDrawerRight.position.y, (bedTops[0].position.z + bedTops[0].scale.z / 2) + ftTom / 2);
        var to5 = new THREE.Vector3(bedTops[0].position.x, bedDrawerRight.position.y, bedTops[0].position.z + bedTops[0].scale.z / 2);
        var direction5 = to5.clone().sub(from5);
        var length5 = direction5.manhattanLength();

        var wValue;



        if (wdArrowUp == null && wdArrowUp2 == null) {

            wdArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            wdArrowDown = new THREE.ArrowHelper(direction2.normalize(), from2, length2, 0x000000, 0.05, 0.05);

            wdArrowUp2 = new THREE.ArrowHelper(direction3.normalize(), from3, length3, 0x000000, 0.05, 0.05);
            wdArrowDown2 = new THREE.ArrowHelper(direction4.normalize(), from4, length4, 0x000000, 0.05, 0.05);

            wdArrowUp3 = new THREE.ArrowHelper(direction5.normalize(), from5, length5, 0x000000, 0.05, 0.05);
            wdArrowDown3 = new THREE.ArrowHelper(direction5.normalize(), from5, length5, 0x000000, 0.05, 0.05);

            wdArrowUp.traverse(function (n) {
                n.layers.set(4);
            })
            wdArrowDown.traverse(function (n) {
                n.layers.set(4);
            })

            wdArrowUp3.traverse(function (n) {
                n.layers.set(4);
            })
            wdArrowDown3.traverse(function (n) {
                n.layers.set(4);
            })
            dimensionScene.add(wdArrowUp);
            dimensionScene.add(wdArrowDown);

            dimensionScene.add(wdArrowUp2);
            dimensionScene.add(wdArrowDown2);


            dimensionScene.add(wdArrowUp3);
            dimensionScene.add(wdArrowDown3);

            wValue = document.createElement('div');

            wValue.style.top = "0px";



            wValue2 = document.createElement('div');

            wValue2.style.top = "0px";
            wValue2.style.fontSize = "15px";

            wValue3 = document.createElement('div');

            wValue3.style.top = "0px";
            wValue3.style.fontSize = "15px";

            wValue4 = document.createElement('div');

            wValue4.style.top = "0px";
            wValue4.style.fontSize = "15px";

            wValue5 = document.createElement('div');

            wValue5.style.top = "0px";
            wValue5.style.fontSize = "15px";

            drawerLabel = new THREE.CSS2DObject(wValue);
            drawerLabel2 = new THREE.CSS2DObject(wValue2);
            drawerLabel3 = new THREE.CSS2DObject(wValue3);
            drawerLabel4 = new THREE.CSS2DObject(wValue4);
            drawerLabel5 = new THREE.CSS2DObject(wValue5);

            wdArrowUp.add(drawerLabel);
            wdArrowUp2.add(drawerLabel3);
            wdArrowUp3.add(drawerLabel4);

            dimensionScene.add(drawerLabel2);
            dimensionScene.add(drawerLabel5);


        } else {
            wdArrowUp.setDirection(direction.normalize());
            wdArrowUp.setLength(length, 0.05, 0.05);
            wdArrowUp.position.copy(from.clone());

            wdArrowDown.setDirection(direction2.normalize());
            wdArrowDown.setLength(length2, 0.05, 0.05);
            wdArrowDown.position.copy(from2.clone());

            wdArrowUp2.setDirection(direction3.normalize());
            wdArrowUp2.setLength(length3, 0.05, 0.05);
            wdArrowUp2.position.copy(from3.clone());

            wdArrowDown2.setDirection(direction4.normalize());
            wdArrowDown2.setLength(length4, 0.05, 0.05);
            wdArrowDown2.position.copy(from4.clone());

            wdArrowUp3.setDirection(direction5.normalize());
            wdArrowUp3.setLength(length5, 0.05, 0.05);
            wdArrowUp3.position.copy(from5.clone());

            wdArrowDown3.setDirection(direction5.negate().normalize());
            wdArrowDown3.setLength(length5, 0.05, 0.05);
            wdArrowDown3.position.copy(from5.clone());

            var dist = bedDrawerLeft.children[3].position.manhattanDistanceTo(bedDrawerLeft.children[4].position) - bedDrawerLeft.children[3].scale.z;
            dist = dist / ftTom;
            dist = dist.toFixed(2);

            var dist2 = dist * 12;
            dist2 = dist2.toFixed(2)
            drawerLabel.element.style.fontSize = 12 * fwidth / 1000 + "px";
            drawerLabel2.element.style.fontSize = 12 * fwidth / 1000 + "px";
            drawerLabel3.element.style.fontSize = 12 * fwidth / 1000 + "px";
            drawerLabel4.element.style.fontSize = 12 * fwidth / 1000 + "px";
            drawerLabel5.element.style.fontSize = 12 * fwidth / 1000 + "px";

            drawerLabel.element.innerHTML = dist + " ft <br>(" + dist2 + " in)";
            drawerLabel2.element.innerHTML = dist + " ft <br>(" + dist2 + " in)";
            drawerLabel3.element.innerHTML = dist + " ft <br>(" + dist2 + " in)";
            drawerLabel4.element.innerHTML = 0.9 + " ft (" + 11 + " in)";
            drawerLabel5.element.innerHTML = 0.9 + " ft <br>(" + 11 + " in)";

            drawerLabel.element.style.textAlign = drawerLabel5.element.style.textAlign = drawerLabel4.element.style.textAlign = drawerLabel3.element.style.textAlign = drawerLabel2.element.style.textAlign = "center"
            drawerLabel.position.set(0, (fwidth / 1000) * 0.45, 0)
            drawerLabel2.position.set(0.1, 0, 0.8 - wdArrowUp.position.y * (fwidth / 1000))
            drawerLabel3.position.set(0, (fwidth / 1000) * 0.45, 0)

            drawerLabel4.position.set(0.025, (fwidth / 1000) * wdArrowUp3.position.z / 2 + 0.725, 0)

            drawerLabel5.position.set(wdArrowUp3.position.z, 0, ((fwidth / fheight) / 2) - wdArrowUp3.position.y / 2)

            wdArrowUp.visible = wdArrowDown.visible = drawerLabel.visible = drawerLabel2.visible = bedDrawerLeft.visible;
            wdArrowUp2.visible = wdArrowDown2.visible = drawerLabel3.visible = bedDrawerRight.visible;
            wdArrowUp3.visible = wdArrowDown3.visible = drawerLabel4.visible = drawerLabel5.visible = bedDrawerLeft.visible;
            // widthLabel.scale.set(0.15, 0.15, 0.15)
        }

    }


}


function createHeightArrows() {

    if (bedTops.length > 0) {

        var from = new THREE.Vector3(-bedLegs[0].position.x / 2, wHeight * ftTom / 2, bedLegs[0].position.z - 0.35);
        var to = new THREE.Vector3(-bedLegs[0].position.x / 2, wHeight * ftTom, bedLegs[0].position.z - 0.35);
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();

        var wValue;


        if (wvvArrowUp == null) {

            wvvArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            wvvArrowDown = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);



            wvvArrowUp.traverse(function (n) {
                n.layers.set(3);
            })
            wvvArrowDown.traverse(function (n) {
                n.layers.set(3);
            })


            dimensionScene.add(wvvArrowUp);
            dimensionScene.add(wvvArrowDown);





            wValue = document.createElement('div');
            wValue.innerHTML = (wHeight) + " ft";
            wValue.style.top = "50%";
            wValue.style.fontSize = "15px";




            heightLabel = new THREE.CSS2DObject(wValue);

            dimensionScene.add(heightLabel);




        } else {
            wvvArrowUp.setDirection(direction.normalize());
            wvvArrowUp.setLength(length, 0.05, 0.05);
            wvvArrowUp.position.copy(from.clone());

            wvvArrowDown.setDirection(direction.negate().normalize());
            wvvArrowDown.setLength(length, 0.05, 0.05);
            wvvArrowDown.position.copy(from.clone());



            heightLabel.element.innerHTML = (wHeight) + " ft(" + wHeight * 12 + " in)";

            heightLabel.position.set(wvvArrowUp.position.z - 0.3, 0, -((fwidth / fheight) / 2) - wvvArrowUp.position.y / 2)

        }

    }


}
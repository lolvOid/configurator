

let scene, camera, orthoCamera, dimensionScene, dimensionRenderer, renderer, directionalLight, ambientLight, controls;
let css2DRenderer;

const viewer = document.getElementById("modelviewer");
const dimensionviewer = document.getElementById("dimensionViewer");
const arviewer = document.getElementById("arviewer");

const fwidth = viewer.offsetWidth || dimensionviewer.offsetWidth;
const fheight = viewer.offsetHeight || dimensionviewer.offsetHeight;
let dimensionCanvas;
var dimensionImage;



let wWidth = 2.5,
    wHeight = 6,
    wDepth = 1.5,
    segment_id = [],
    columns, customColumns = 2,
    wLoft = 3;
const thickness = 0.875;
const ftTom = 0.3048;
let isLoft = false;
let wBottom, wTop, wLeft, wRight, wBack, wpLoftTop, wpLoftLeft, wpLoftRight, wpLoftBottom, wpLoftBack, wBottomLayer, wTopLayer, wLeftLayer, wRightLayer,
    wLeftLayerTop, wLeftLayerBottom, wRightLayerTop, wRightLayerBottom;
let segments, offset = 0;

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
var body = document.body;
let plane;
let selectedPlane;
let hangerRod;

let top_shelves = [],
    bot_shelves = [];

let internalPart;
let locker, ID_S, ID_L, ED, m_splitter;
let cp = document.getElementById("copyto");
let fp = document.getElementById("flipDoor");
let clone_int_small, cloned_int_S_group;
var row_num = 0,
    isCreatedBotRow = true,
    isExtCreated = true;;

let max_width = 0;
var sp1, sp2, sp3, spLocker;

let ext_drawer = [],
    int_drawer_small = [],
    int_drawer_large = [],
    m_locker = [],
    splitters = [],
    m_splitters = [];
let swappedDoors = [];
var selectedColumn = 0;
var interactivePlanes = [],
    selectedPlanes = [],
    interactivePlane_group, column_id = [];
var plane_index = 0;
let _lockers = [],
    _locker_group, _locker_splitters = [],
    _locker_splitter_group,
    _smallIntDrawers = [],
    _smallIntDrawers_group, _smallIntDrawers_splitters = [],
    _smallIntDrawers_splitters_group,
    _largeIntDrawers = [],
    _largeIntDrawers_group, _largeIntDrawers_splitters = [],
    _largeIntDrawers_splitters_group,
    _extDrawers = [],
    _extDrawers_group, _extDrawers_splitters = [],
    _extDrawers_splitters_group,
    _hangers = [],
    _hanger_group,
    _top_shelves = [],
    _top_shelves_parent = [],
    _bot_shelves = [],
    _bot_shelf_parent = [],
    _m_splitters = [],
    _m_splitters_group,
    _columns = [],
    _columns_group, _hDoors_parent = [],
    _hDoors_parent_group,
    _sDoors_parent = [],
    _sDoors_parent_group;

let _cLeftArrow_parent = [],
    _cRightArrow_parent = [];
let _flippableDoor = [];
var defaultRotation = new THREE.Quaternion();
let _isDoorRight = [],
    _isDoorLeft = []
var rowCount = 0;
var isSplitterCreated = false;
var removed_index, removed_id = [],
    removed_plane = [];
var clock;
var delta = 0;
let _hDoors = [];

let _lineColumns = [],
    _lineColumns_group;

let _columnsLoft = [],
    _columnsLoft_group = [],
    _loftDoors_parent = [],
    _loftDoors_parent_group;
let deleteSprites = [],
    flipVerticalSprite = [],
    flipVertical_group = new THREE.Group(),
    deleteSprites_group = new THREE.Group();
let onNormalDeleteSprite = new THREE.TextureLoader().load("./assets/icons8-minus-100.png");
let onHoverDeleteSprite = new THREE.TextureLoader().load("./assets/icons8-black-minus-100.png");
let onNormalFlipSprite = new THREE.TextureLoader().load("./assets/flipLeft.png");
let onHoverFlipSprite = new THREE.TextureLoader().load("./assets/flipOnHover.png")
var isDoorOpened = true,
    isLoftOpened = false;
var texLoader = new THREE.TextureLoader();
let wood_albedo;
let wood_normal;
let wood_roughness;

let selectedSprite, selectedMirror;

let _intDrawers = [],
    _intDrawers_group, _intDrawers_parent = [];
let _splitterMaterial, _railMaterial, _wardrobeMaterial, _lockerMaterial, _shelfMaterial, _hangerMaterial, _doorMaterial, _columnsMaterial, _extDrawerMaterial, _intSmallMaterial, _intLargeMaterial, _flipMirrorMaterials, _mirrorMaterials;
var renderOptionsValue = 0;
var pmremGenerator;
let isHingedDoor = true;
let ssaoPass;

let _doorRails_parent = [],
    _doorRails_parent_group = [],
    _doorRailParent,
    _doorsVisible = true;

var thicknessInmeter = 0.022225;

let isSlideRight = false,
    isSlideLeft = false;

let selectedDoor, isMirrorAdded = false;
let wall, wallRight, wallLeft, floor;
let _columns_bottom = [],
    _columns_bottom_group;
let shadowPlane;


let _columnsEdges = [],
    _columnsEdges_group;
let _splitterEdges = [],
    _splitterEdges_group = new THREE.Group();
let _loftEdges = [],
    _loftEdges_group;
let edgeBottom, edgeTop, edgeLeft, edgeRight, edgeBack, edgeLoftBottom, edgeLoftTop, edgeLoftBack, edgeLoftRight, edgeLoftLeft;
let edgeBottomLayer, edgeTopLayer, edgeRightLayer, edgeLeftLayer, edgeLeftLayerTop, edgeLeftLayerBottom, edgeRightLayerBottom, edgeRightLayerTop;
var totalPrice = 0;
var wvArrowUp, wvArrowDown, wlArrowUp, wlArrowDown, whArrowL, whArrowR, wdArrowL, wdArrowR;
var hValue, heightLabel, hLoftValue, loftLabel, widthLabel, wValue, depthLabel, depthLabelValue;

var isMeasured = false;

var depthSideMesh, depthSideMeshLoft;

var _cLeftArrow_group = new THREE.Group();
var _cRightArrow_group = new THREE.Group();
var _cLabels = [],
    _cLabel_group = new THREE.Group();

var _cUpperArrowUps_parent = [],
    _cUpperArrowDowns_parent = [],
    _cLowerArrowUps_parent = [],
    _cLowerArrowDowns_parent = [];
var _cUpperLabels = [],
    _cUpperLabels_group = new THREE.Group();
var _cLowerLabels = [],
    _cLowerLabels_group = new THREE.Group();
var _cUpperArrowUp_group = new THREE.Group();
var _cUpperArrowDown_group = new THREE.Group();
var _cLowerArrowUp_group = new THREE.Group();
var _cLowerArrowDown_group = new THREE.Group();


let reticle;
let gl = null;
let hitTestSource;
let hitTestSourceRequested = false;

let isAR;

var font;
init();

animate();

getInputs();
addHorizontalParts();
dimensionviewer.hidden = true;

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

    _columnsLoft_group = new THREE.Group();
    _columns_bottom_group = new THREE.Group();
    _locker_group = new THREE.Group();
    _locker_splitter_group = new THREE.Group();
    _largeIntDrawers_group = new THREE.Group();
    _smallIntDrawers_group = new THREE.Group();
    _extDrawers_group = new THREE.Group();
    _smallIntDrawers_splitters_group = new THREE.Group();
    _largeIntDrawers_splitters_group = new THREE.Group();
    _extDrawers_splitters_group = new THREE.Group();
    _hanger_group = new THREE.Group();
    _m_splitters_group = new THREE.Group();
    _hDoors_parent_group = new THREE.Group();
    _columns_group = new THREE.Group();
    interactivePlane_group = new THREE.Group();
    _loftDoors_parent_group = new THREE.Group();
    _doorRailParent = new THREE.Group();
    exporter = new THREE.GLTFExporter();
    _sDoors_parent_group = new THREE.Group();
    _intDrawers_group = new THREE.Group();
    _columnsEdges_group = new THREE.Group();

    create_lights();
    createFloor();
    createWall();
    helpers();
    createWardrobe();

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
    controls.target.set(0, 1.6, 0);


    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;
    window.addEventListener('resize', onWindowResize, true);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('click', onClick);

    controls.saveState();



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

    $("input:radio[name='columnsOptions']").change(function () {
        if ($(this).is(":checked")) {
           set_columns_number($(this).val());
            isCreated = true;

        }

    })


    featuresControl()

    updateWardrobe();

    addLoft(isLoft);
    if (isLoft) {
        orthoCamera.position.setY(1.55);

    } else {
        orthoCamera.position.setY(1);
    }

    orthoCamera.zoom = 225;
    orthoCamera.updateProjectionMatrix();


    updateWall();
    updateColumnsDoor();
    topShelfOnSelected(plane_index);
    botShelfFilter();

    updateBotShelves(plane_index);

 

    for (var i = 0; i < customColumns; i++) {
        updateHingedDoorUpSize(i)

        updateLoftDoorUpSize(i)
    }


    updateDoorRailUp();

    for (var i = 0; i < customColumns / 2; i++) {

        updateSlideDoorsUp(i);
    }
    for (var i = 0; i < _columnsLoft.length; i++) {
        updateLoftColumns(i);
    }
    columnsCombination();
    setflipDoor();
    updateHingedDoorOnColumnCombined();

    delta = clock.getDelta();
    doorAction();
    slideDoorAction();
    loftDoorAction();

    paintWardrobe()
    setPrice();
    // renderer.render(scene, camera);
    if (interactivePlanes.length > 0) {
        document.getElementById('column_id').innerHTML = plane_index + 1;

    } else {
        document.getElementById('column_id').innerHTML = "None";
    }



    renderOption()

    doorVisiblity(_hDoors_parent_group, _doorsVisible);
    doorVisiblity(_sDoors_parent_group, _doorsVisible);
    // doorVisiblity(_doorRailParent,_doorsVisible);

    dimensionRenderer.render(dimensionScene, orthoCamera);
    css2DRenderer.render(dimensionScene, orthoCamera);
    // css2DRenderer.render(scene,camera);


    // document.getElementById('capturedImage').src = dimensionRenderer.domElement.toDataURL();
    // document.getElementById('capturedImage').src = css2DRenderer.domElement.toDataURL();
    composer.render();

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

function getInputs() {
    chooseColumns_number();
    
    $("#swapRender").click(function(){
        swaprender();
    })

    $("#downloadImage").click(function(){
        downloadImage();
    })
    $("#actionDoor").hide();
    $("#actionDoorVisibilty").hide();
    $("#actionSlideDoorLeft").hide();
    $("#actionSlideDoorRight").hide();
    $("#sizeOptions").show();
    $("#columnDoorOptions").hide();
    $("#editInterior").hide();
    // $("#editDimensions").hide();


    $("#slideDoor").prop("disabled", true);
    $("#chooseColumns").hide();

    $("#width").on("input", function () {
        wWidth = $("#width").val();

        if (wWidth > 3) {
            $("#hingedDoor").prop("checked", false);
            $("#chooseColumns").hide();

            $("#slideDoor").prop("checked", false);
            $("#slideDoor").prop("disabled", false);
        } else {
            $("#slideDoor").prop("checked", false);
            $("#slideDoor").prop("disabled", true);
        }
        chooseColumns_number();


        reset();

    })

    $("input:radio[name='heightOptions']").click(function () {

        reset();
        wHeight = $(this).val();

    });

    $("input:radio[name='depthOptions']").click(function () {

        reset();
        wDepth = $(this).val();

    });



    $("input:radio[name='doorOptions']").change(function () {
        if ($(this).is(":checked")) {
            $("#actionDoorVisibilty").html('<i class="fa fa-eye-slash"></i> Hide Doors');
            if ($(this).val() == 0) {
                $("#chooseColumns").show();
                isHingedDoor = true;
                isCreated = true;
                isDoorOpened = false;
                _doorsVisible = true;
                chooseColumns_number();
                createColumns_Doors(isHingedDoor);
                $("#actionDoor").show();
                $("#actionSlideDoorLeft").hide();
                $("#actionSlideDoorRight").hide();
            } else {

                $("#chooseColumns").hide();
                isHingedDoor = false;
                isCreated = true;
                _doorsVisible = true;
                chooseColumns_number();
                createColumns_Doors(isHingedDoor);
                $("#actionDoor").hide();
                $("#actionSlideDoorLeft").show();
                $("#actionSlideDoorRight").show();
            }
        }
    });

    $("#actionDoorVisibility").html(('<i class="fa fa-eye-slash"></i> Hide Doors'));
    $("#actionDoorVisibility").click(function () {
        if (!_doorsVisible) {

            _doorsVisible = true;
        } else {

            _doorsVisible = false;
        }


    })
    $("#loftOptionsPanel").hide();

    $("#addloft").change(function () {


        if ($(this).is(":checked")) {

            $("#loftOptionsPanel").show();
            $("#loftLabel").html("Remove Loft");

            isLoft = true;

        } else {

            isLoft = false;

            $("#loftLabel").html("Add Loft");
            $("#loftOptionsPanel").hide();
        }
    });

    $('input:radio[name="loftOptions"]').change(function () {
        wLoft = $(this).val();

    });

    $("#actionSlideDoorLeft").html('<i class="m-lg-1  fa fa-door-open"></i>Open Left ');
    $("#actionSlideDoorRight").html('<i class="m-lg-1  fa fa-door-open"></i>Open Right ')

    $("#actionSlideDoorLeft").click(function () {


        if (!isSlideLeft) {


            $(this).html('<i class="m-lg-1  fa fa-door-closed"></i>Close Left ');
            isSlideLeft = true;
            isSlideRight = false;

            $("#actionSlideDoorRight").html('<i class="m-lg-1  fa fa-door-open"></i>Open Right ');
        } else {

            $(this).html('<i class="m-lg-1  fa fa-door-open"></i>Open Left ');


            isSlideLeft = false;

        }


    })


    $("#actionSlideDoorRight").click(function () {


        if (!isSlideRight) {

            $(this).html('<i class="m-lg-1  fa fa-door-closed"></i>Close Right ');
            isSlideRight = true;
            isSlideLeft = false;

            $("#actionSlideDoorLeft").html('<i class="m-lg-1  fa fa-door-open"></i>Open Left ');
        } else {

            $(this).html('<i class="m-lg-1  fa fa-door-open"></i>Open Right ');
            isSlideRight = false;

        }


    })

    $("#actionDoor").html('<i class="m-lg-1  fa fa-door-open"></i>Open Door ');
    $("#actionDoor").click(function () {


        if (!isDoorOpened) {


            $(this).html('<i class="m-lg-1  fa fa-door-closed"></i>Close Door ');
            isDoorOpened = true;
        } else {

            $(this).html('<i class="m-lg-1  fa fa-door-open"></i>Open Door ');
            isDoorOpened = false;

        }


    })


    $("#doneDimensions").click(function () {
        $("#sizeOptions").hide();
        $("#columnDoorOptions").show();
        // $("editInteriors").show();

        // interactivePlane_group.visible = true;
        // deleteSprites_group.visible = false;
        // flipVertical_group.visible = false;

    })

    $("#doneColumns").click(function () {
        if (_columns.length > 0) {
            $("#editInterior").show();
            $("#columnDoorOptions").hide();

            interactivePlane_group.visible = true;
            deleteSprites_group.visible = false;
            flipVertical_group.visible = false;
            _doorsVisible = false;
        } else {
            alert("Add Doors and Columns");
        }

    })


    $("#backToDoors").click(function () {
        $("#columnDoorOptions").show();
        $("#editInterior").hide();
        $("#chooseColumns").hide();
        interactivePlane_group.visible = false;
        deleteSprites_group.visible = true;
        flipVertical_group.visible = true;

        if ($("input:radio[name='doorOptions']").is(":checked")) {
            $("input:radio[name='doorOptions']").prop("checked", false);
        }
        reset();
    })


    $("#backToDimensions").click(function () {
        $("#sizeOptions").show();
        $("#columnDoorOptions").hide();
        $("#chooseColumns").hide();
        if ($("input:radio[name='doorOptions']").is(":checked")) {
            $("input:radio[name='doorOptions']").prop("checked", false);
        }
        isHingedDoor = true;
        reset();
    })
    $("#export").click(function () {
        Export();
    })
    $("#flipDoor").change(function () {
        _flipDoor($(this).children("option:selected").val());
    })

    $("#addMirror").click(function () {
        if (!isMirrorAdded) {

            $(this).html("Done");
            isMirrorAdded = true;
        } else {
            $(this).html("Add Mirror On Door");
            isMirrorAdded = false;
        }


    })
}

function featuresControl() {
    // if (_columns.length > 0) {
    //     $("#editInterior").show();
    // } else {
    //     $("#editInterior").hide();
    // }
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

function createColumns(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var mesh = new THREE.Mesh(g, _columnsMaterial);

    mesh.name = "w_columns_" + index;



    _columns[index] = mesh;
    _columns_group.name = "w_columns";
    _columns_group.add(_columns[index]);


    // scene.add(_lockers[index]);

    scene.add(_columns_group);

}

function createColumnsBottom(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.Mesh(g, _columnsMaterial);
    m.name = "w_columns_bottom" + index;
    _columns_bottom[index] = m;
    _columns_bottom_group.name = "w_columns_bottoms";
    _columns_bottom_group.add(_columns_bottom[index]);
    scene.add(_columns_bottom_group);
}


function removeColumns(index) {

    if (index) {
        _columns.forEach(e => {
            if (_columns[index] instanceof THREE.Mesh && _columns[index] == e) {
                if (_columns_group instanceof THREE.Group) {
                    _columns_group.remove(e);
                }
            }
        })
        _columns[index] = null;
    } else {
        if (_columns) {
            _columns.forEach(e => {
                if (e instanceof THREE.Mesh) {
                    if (_columns_group instanceof THREE.Group) {
                        _columns_group.remove(e);
                        scene.remove(_columns_group);
                    }
                }
            })
            _columns = [];
            removed = [];
            removed_id = [];
            removed_index = null;
            adjacentParts = [];
        }
    }


}

function removeColumnsBottom(index) {
    if (index) {
        _columns_bottom.forEach(e => {
            if (_columns_bottom[index] instanceof THREE.Mesh && _columns_bottom[index] == e) {
                if (_columns_bottom_group instanceof THREE.Group) {
                    _columns_bottom_group.remove(e);
                }
            }
        })
        _columns_bottom[index] = null;
    } else {
        if (_columns_bottom) {
            _columns_bottom.forEach(e => {
                if (e instanceof THREE.Mesh) {
                    if (_columns_bottom_group instanceof THREE.Group) {
                        _columns_bottom_group.remove(e);
                        scene.remove(_columns_bottom_group);
                    }
                }
            })
            _columns_bottom = [];

        }
    }
}

function updateColumnsBottom(i) {

    offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;

    _columns_bottom_group.position.set(_columns_group.position.x, _columns_group.position.y, _columns_group.position.z);



    if (_columns_bottom[i]) {

        _columns_bottom[i].scale.set((thickness / 12) * ftTom, _extDrawers[0].scale.y + _extDrawers_splitters[0].scale.y, ftTom * 1.35 / 12);
        _columns_bottom[i].position.set(i * offset, (_columns_bottom[i].scale.y / 2) + (wBottom.position.y) + wBottom.scale.y / 2, _columns_bottom[i].scale.z / 2 + _columns[i].position.z + _columns[i].scale.z / 2);

    }

}

function updateColumns() {

    offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;

    for (var i = 0; i < customColumns - 1; i++) {
        if (!_columns[i]) {
            createColumns(i);
            createColumnsEdgeGeometry(i);

            if (!isHingedDoor) {
                var subtract = ftTom * 1.35 / 12

                _columns[i].scale.set((thickness / 12) * ftTom, wTop.position.y - wTop.scale.y - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom - subtract);
                _columns[i].position.set(i * offset, (_columns[i].scale.y / 2) + (wBottom.position.y) + wBottom.scale.y / 2, ((thickness / 24) * ftTom) - subtract / 2);



            } else {

                _columns[i].scale.set((thickness / 12) * ftTom, wTop.position.y - wTop.scale.y - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                _columns[i].position.set(i * offset, (_columns[i].scale.y / 2) + (wBottom.position.y) + wBottom.scale.y / 2, ((thickness / 24) * ftTom));



            }

            updateColumnsEdgeGeometry(i);
        } else {
            if (_columns[i] instanceof THREE.Mesh) {

                if (!isHingedDoor) {
                    var subtract = ftTom * 1.35 / 12


                    _columns[i].scale.set((thickness / 12) * ftTom, wTop.position.y - wTop.scale.y - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom - subtract);
                    _columns[i].position.set(i * offset, (_columns[i].scale.y / 2) + (wBottom.position.y) + wBottom.scale.y / 2, ((thickness / 24) * ftTom) - subtract / 2);
                } else {
                    _columns[i].scale.set((thickness / 12) * ftTom, wTop.position.y - wTop.scale.y - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                    _columns[i].position.set(i * offset, (_columns[i].scale.y / 2) + (wBottom.position.y) + wBottom.scale.y / 2, ((thickness / 24) * ftTom));
                }


            }
            updateColumnsEdgeGeometry(i);
        }

    }
  

    _columns_group.position.set(offset + wLeft.position.x, _columns_group.position.y, _columns_group.position.z);
    _columnsEdges_group.position.copy(_columns_group.position);

    for (var i = 0; i < customColumns - 1; i++) {

        if (!deleteSprites[i]) {

            createColumnSprite(i);
            updateColumnSprite(i);

        } else {
            if (deleteSprites[i] instanceof THREE.Sprite) {
                updateColumnSprite(i);

            }
        }

    }

    if (!isHingedDoor) {
        createSlideDoors();


    } else {
        for (var i = 0; i < customColumns; i++) {
            if (!_hDoors_parent[i]) {
                createHingedDoor(i);
                updateHingedDoor(i);
                createFlipDoorSprite(i);
                updateFlipDoorSprite(i)

            } else {

                updateHingedDoor(i);
                updateFlipDoorSprite(i)
            }

        }
    }




    for (var i = 0; i < customColumns; i++) {

        if (!_m_splitters[i]) {

            createHorizontalSplitter(i);
            createSplitterEdges(i);

            updateHorizontalSplitter(i);

            updateSplitterEdges(i);
        } else {
            updateHorizontalSplitter(i);
            updateSplitterEdges(i);

        }
      


    }
  
    for (var i = 0; i < customColumns; i++) {

        createColumnsArrows(i);
        createUpperArrows(i);
        createLowerArrows(i);
   
        updateColumnsArrow(i)
        updateUpperArrows(i);
        updateLowerArrows(i);
        


    
    }

    generateInteractivePlanes(customColumns);
}

function createLoftColumns(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var mesh = new THREE.Mesh(g, _columnsMaterial);
    mesh.name = "w_loft_column_" + index;


    _columnsLoft[index] = mesh;
    _columnsLoft_group.name = "w_loft_columns";
    _columnsLoft_group.add(_columnsLoft[index]);

    // scene.add(_lockers[index]);
    scene.add(_columnsLoft_group);
    return _columnsLoft[index];

}

function updateLoftColumns(index) {
    offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;
    if (_columnsLoft[index] != null) {
        _columnsLoft[index].scale.set((thickness / 12) * ftTom, wLoft * ftTom - wpLoftBottom.scale.y - wpLoftTop.scale.y, (3 / 12) * ftTom);
        _columnsLoft[index].position.set(index * offset, (wpLoftBack.scale.y / 2) + wpLoftBottom.position.y - wpLoftBottom.scale.y / 2, -wpLoftBack.position.z - wpLoftBack.scale.z / 2 - (thickness / 12) * ftTom);
        if (index % 2 == 0) {
            _columnsLoft[index].visible = false;
        }
    }
    _columnsLoft_group.position.set(offset + wpLoftLeft.position.x, _columnsLoft_group.position.y, _columnsLoft_group.position.z);
}



function createLoftDoors(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);


    var door = new THREE.Mesh(g, _doorMaterial);
    door.name = "loft_door_" + index;
    var _lDoors_group = new THREE.Group();
    _lDoors_group.add(door);
    _lDoors_group.name = "loft_door_pivot_" + index;
    _loftDoors_parent[index] = _lDoors_group;
    _loftDoors_parent_group.name = "loft_doors";
    _loftDoors_parent_group.add(_loftDoors_parent[index]);
    scene.add(_loftDoors_parent_group);
}

function updateLoftDoorUpSize(index) {
    if (_loftDoors_parent[index]) {
        var posY = (wpLoftBack.scale.y / 2) + wpLoftBottom.position.y - wpLoftBottom.scale.y / 2;
        var scaleY = wLoft * ftTom - wpLoftBottom.scale.y - wpLoftTop.scale.y;

        if (_loftDoors_parent[index] instanceof THREE.Group) {

            _loftDoors_parent_group.position.set(offset + wpLoftLeft.position.x, _loftDoors_parent_group.position.y, _loftDoors_parent_group.position.z);
            if (index % 2 == 0) {

                for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                    if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                        _loftDoors_parent[index].children[j].scale.setY(scaleY);

                        _loftDoors_parent[index].children[j].position.setY(posY);

                    }

                }


            } else {
                for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                    if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                        _loftDoors_parent[index].children[j].scale.setY(scaleY, (thickness / 12) * ftTom);

                        _loftDoors_parent[index].children[j].position.setY(posY);

                    }

                }

            }
        }
    }
}

function updateLoftDoors(index) {

    if (_loftDoors_parent[index]) {
        offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;
        var posY = (wpLoftBack.scale.y / 2) + wpLoftBottom.position.y - wpLoftBottom.scale.y / 2;
        var scaleY = wLoft * ftTom - wpLoftBottom.scale.y - wpLoftTop.scale.y;

        if (_loftDoors_parent[index] instanceof THREE.Group) {

            _loftDoors_parent_group.position.set(offset + wpLoftLeft.position.x, _loftDoors_parent_group.position.y, _loftDoors_parent_group.position.z);
            if (index % 2 == 0) {


                if (index != customColumns - 1) {
                    if (index == 0) {

                        for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                            if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                                _loftDoors_parent[index].children[j].scale.set(offset - (thickness / 24) * ftTom, scaleY, (thickness / 12) * ftTom);

                                _loftDoors_parent[index].children[j].position.set(_loftDoors_parent[index].children[j].scale.x / 2, posY, -(thickness / 24) * ftTom);

                            }

                        }
                        _loftDoors_parent[index].position.set(_columnsLoft[index].position.x - offset + (thickness / 24) * ftTom, _loftDoors_parent[index].position.y, _loftDoors_parent[index].position.z + wpLoftLeft.scale.z / 2);

                    } else {
                        for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                            if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                                _loftDoors_parent[index].children[j].scale.set(offset, scaleY, (thickness / 12) * ftTom);

                                _loftDoors_parent[index].children[j].position.set(_loftDoors_parent[index].children[j].scale.x / 2, posY, -(thickness / 24) * ftTom);

                            }

                        }
                        _loftDoors_parent[index].position.set(_columnsLoft[index].position.x - offset, _loftDoors_parent[index].position.y, _loftDoors_parent[index].position.z + wpLoftLeft.scale.z / 2);
                    }
                } else {
                    for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                        if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                            _loftDoors_parent[index].children[j].scale.set(offset - (thickness / 24) * ftTom, scaleY, (thickness / 12) * ftTom);

                            _loftDoors_parent[index].children[j].position.set(_loftDoors_parent[index].children[j].scale.x / 2, posY, -(thickness / 24) * ftTom);

                        }

                    }
                    _loftDoors_parent[index].position.set(_columnsLoft[index - 1].position.x, _loftDoors_parent[index].position.y, _loftDoors_parent[index].position.z + wpLoftLeft.scale.z / 2);

                }
                _loftDoors_parent[index].rotation.set(0, 0 * THREE.Math.DEG2RAD, 0);
            } else {

                if (index != customColumns - 1) {
                    for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                        if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                            _loftDoors_parent[index].children[j].scale.set(offset, scaleY, (thickness / 12) * ftTom);

                            _loftDoors_parent[index].children[j].position.set(_loftDoors_parent[index].children[j].scale.x / 2, posY, (thickness / 24) * ftTom);
                            _loftDoors_parent[index].children[j].material.color.set("#34deeb");
                        }

                    }
                    _loftDoors_parent[index].position.set(_columnsLoft[index - 1].position.x + offset, _loftDoors_parent[index].position.y, _loftDoors_parent[index].position.z + wpLoftLeft.scale.z / 2);
                } else {
                    for (var j = 0; j < _loftDoors_parent[index].children.length; j++) {

                        if (_loftDoors_parent[index].children[j] instanceof THREE.Mesh) {
                            _loftDoors_parent[index].children[j].scale.set(offset - (thickness / 24) * ftTom, scaleY, (thickness / 12) * ftTom);

                            _loftDoors_parent[index].children[j].position.set(_loftDoors_parent[index].children[j].scale.x / 2, posY, (thickness / 24) * ftTom);
                            _loftDoors_parent[index].children[j].material.color.set("#34deeb");
                        }

                    }
                    _loftDoors_parent[index].position.set(_columnsLoft[index - 1].position.x + offset - (thickness / 24) * ftTom, _loftDoors_parent[index].position.y, _loftDoors_parent[index].position.z + wpLoftLeft.scale.z / 2);
                }

                _loftDoors_parent[index].rotation.set(0, -180 * THREE.Math.DEG2RAD, 0);
            }


        }

    }


}

function removeLoftColumns(index) {

    if (index) {
        _columnsLoft.forEach(e => {
            if (_columnsLoft[index] instanceof THREE.Mesh && _columnsLoft[index] == e) {
                if (_columnsLoft_group instanceof THREE.Group) {
                    _columnsLoft_group.remove(e);
                }
            }
        })
        _columnsLoft[index] = null;
    } else {
        if (_columnsLoft) {
            _columnsLoft.forEach(e => {
                if (e instanceof THREE.Mesh) {
                    if (_columnsLoft_group instanceof THREE.Group) {
                        _columnsLoft_group.remove(e);
                        scene.remove(_columnsLoft_group);
                    }
                }
            })
            _columnsLoft = [];

        }
    }
}

function removeLoftDoors(index) {
    if (index) {



        if (_loftDoors_parent[index] instanceof THREE.Group) {
            _loftDoors_parent_group.remove(_loftDoors_parent[index]);

        }
        _loftDoors_parent[index] = null;


    } else {

        _loftDoors_parent.forEach(e => {
            if (e instanceof THREE.Group) {

                _loftDoors_parent_group.remove(e);

            }

        })

        _loftDoors_parent = [];


    }
}

function generateLoftColumns() {
    if (_columnsLoft.length == 0) {

        for (var i = 0; i < customColumns - 1; i++) {
            createLoftColumns(i);
            updateLoftColumns(i)

            // updateLoftDoorUpSize(i)
        }
        for (var i = 0; i < customColumns; i++) {
            createLoftDoors(i);
            updateLoftDoors(i);
        }
    } else {

        updateLoftColumns(i)
        updateLoftDoors(i);
    }

}


function updateHorizontalSplitter(index) {
    var subtract = ftTom * 1.35 / 12;

    var fromTop = wTop.position.y - wTop.scale.y - (3 * ftTom);
    if (!_m_splitters[index]) {
        if (!isHingedDoor) {

            _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, _columns[0].scale.z);
            _m_splitters[index].position.set(index * offset, fromTop, _columns[0].position.z - subtract / 2);

        } else {
            _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
            _m_splitters[index].position.set(index * offset, fromTop, wLeft.position.z / 2);

        }

    } else {
        if (_m_splitters[index] instanceof THREE.Mesh) {
            if (!isHingedDoor) {
                _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, _columns[0].scale.z);
                _m_splitters[index].position.set(index * offset, fromTop, _columns[0].position.z);
            } else {
                _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
                _m_splitters[index].position.set(index * offset, fromTop, wLeft.position.z / 2);
            }

        }
    }
    _m_splitters_group.position.set(offset / 2 + wLeft.position.x, _m_splitters_group.position.y, _m_splitters_group.position.z);
}

function generateInteractivePlanes(index) {

    for (var i = 0; i < index; i++) {
        if (!interactivePlanes[i]) {
            createInteractivePlane(i);
            updateInteractivePlane(i);
        } else {
            if (interactivePlanes[i] instanceof THREE.Mesh) {
                updateInteractivePlane(i);
            }
        }

    }

}

function addHorizontalParts() {
    $("#addID").click(function () {
        if (!_intDrawers_parent[plane_index]) {
            createInternalDrawers(plane_index, 3);
            updateInternalDrawers(plane_index);
        } else {
            return;
        }
    })

    $("#addED").click(function () {

        if (!_extDrawers[plane_index]) {
            for (var i = 0; i < customColumns; i++) {
                createExternalDrawer(i);
                updateExternalDrawer(i);
                updateInternalDrawerLarge(i);
            }
            if (!isHingedDoor) {

                for (var i = 0; i < _columns.length; i++) {
                    if (!removed.includes(_columns[i])) {
                        createColumnsBottom(i);
                        updateColumnsBottom(i);
                    }
                }
            } else {
                return;
            }


        } else {


            return;
        }


        if ((_bot_shelf_parent[plane_index])) {
            if (onHeightChanged(index) == 0) {
                removeBotShelves(index);
            } else {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index)
            }
        }

    })

    $("#addIDL").click(function () {
        if (!_largeIntDrawers[plane_index]) {
            createInternalDrawerLarge(plane_index);
            updateInternalDrawerLarge(plane_index);

        } else {
            return;
        }

        if ((_bot_shelf_parent[plane_index])) {
            if (onHeightChanged(index) == 0) {
                removeBotShelves(index);
            } else {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index)
            }
        }

    })

    $("#addIDS").click(function () {
        if (!_smallIntDrawers[plane_index]) {
            createInternalDrawerSmall(plane_index);
            updateInternalDrawerSmall(plane_index);
            updateLocker(plane_index);
        } else {
            return;
        }
        if ((_bot_shelf_parent[plane_index])) {
            if (onHeightChanged(index) == 0) {
                removeBotShelves(index);
            } else {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index)
            }
        }


    })

    $("#addLocker").click(function () {

        if (!_lockers[plane_index]) {
            createLocker(plane_index);
            updateLocker(plane_index);
            updateInternalDrawerSmall(plane_index);
        } else {

            return;
        }
        if ((_bot_shelf_parent[plane_index])) {
            if (onHeightChanged(index) == 0) {
                removeBotShelves(index);
            } else {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index)
            }
        }


    })

    $("#addBottomShelf").click(function () {


        // createBotShelves(0,plane_index);
        // updateBotShelves(plane_index)


        if (onHeightChanged(plane_index) > 0) {
            if (!_bot_shelf_parent[plane_index]) {
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index)


            } else {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index);


            }
        } else {
            removeBotShelves(plane_index)
        }


    })

    $("#hangerOrShelf").change(function () {
        if ($(this).val() == 1) {
            if (!_hangers[plane_index]) {
                createHanger(plane_index);
                updateHanger(plane_index);

            } else {
                if (_hangers[plane_index] instanceof THREE.Mesh) {
                    updateHanger(plane_index);

                }
            }



        } else if ($(this).val() == 2) {
            if (!_top_shelves_parent[plane_index]) {
                createTopShelves(2, plane_index);
                updateTopShelves(plane_index);

            } else {
                if (_top_shelves_parent[plane_index] instanceof THREE.Group) {
                    updateTopShelves(plane_index);

                }
            }


        };


    })



    $("#actionloftDoor").append('<i class="fa fa-door-open"></i>Open Door ');
    $("#actionloftDoor").click(function () {


        if (!isLoftOpened) {

            $(this).empty();
            $(this).append('<i class="fa fa-door-closed"></i>Close Door ');
            isLoftOpened = true;
        } else {
            $(this).empty();
            $(this).append('<i class="fa fa-door-open"></i>Open Door ');
            isLoftOpened = false;

        }


    })

    $("#copyto").change(function () {
        pasetToColumn($(this).children("option:selected").val());

    })
    $("#removeAll").click(function () {
        removeAllInterior();
    })


}

function topShelfOnSelected(index) {

    var topOpt = $("#hangerOrShelf");
    if (_hangers[index]) {
        topOpt.prop("selectedIndex", 1);
    } else if (_top_shelves_parent[index]) {
        topOpt.prop("selectedIndex", 2);
    } else {
        topOpt.prop("selectedIndex", 0);
    }
}

function botShelfFilter() {
    if (onHeightChanged(plane_index) > 0) {
        $("#addBottomShelf").removeClass("disabled");
    } else {
        $("#addBottomShelf").addClass("disabled");
    }



    if (wHeight < 6.5) {
        if (_intDrawers_parent.length > 0) {
            row = 0;
            $("#addED").addClass("disabled");



        } else {
            if (_largeIntDrawers.length > 0) {

                $("#addED").addClass("disabled");

            } else {
                $("#addED").removeClass("disabled");
            }

        }


        if (_intDrawers_parent[plane_index]) {
            row = 0;
            $("#addIDL").addClass("disabled");
            $("#addLocker").addClass("disabled");
            $("#addIDS").addClass("disabled");

        } else {
            if (_smallIntDrawers[plane_index]) {

                $("#addLocker").addClass("disabled");
            } else {
                $("#addLocker").removeClass("disabled");
            }

            if (_lockers[plane_index]) {
                $("#addIDS").addClass("disabled");

            } else {
                $("#addIDS").removeClass("disabled");
            }


            if (_extDrawers.length > 0) {
                $("#addID").addClass("disabled");
                $("#addIDL").addClass("disabled");

            } else {
                $("#addID").removeClass("disabled");
                $("#addIDL").removeClass("disabled");
            }

            if (_smallIntDrawers[plane_index] && _bot_shelf_parent[plane_index]) {

                $("#addIDL").addClass("disabled");
                $("#addIDS").addClass("disabled");
                $("#addED").addClass("disabled");
                $("#addLocker").addClass("disabled");
            } else if (_lockers[plane_index] && _bot_shelf_parent[plane_index]) {

                $("#addIDS").addClass("disabled");
                $("#addED").addClass("disabled");
                $("#addLocker").addClass("disabled");
                $("#addIDL").addClass("disabled");
            } else if (_smallIntDrawers[plane_index] && !_bot_shelf_parent[plane_index]) {
                if (_largeIntDrawers[plane_index]) {
                    $("#addIDS").addClass("disabled");

                }


            }
        }

    } else if (wHeight == 6.5) {

        if (_intDrawers_parent.length > 0) {

            $("#addED").addClass("disabled");



        }
        if (_intDrawers_parent[plane_index]) {
            row = 0;
            $("#addIDL").addClass("disabled");
            $("#addLocker").addClass("disabled");
            $("#addIDS").addClass("disabled");


        } else {
            $("#addIDL").removeClass("disabled");
            $("#addLocker").removeClass("disabled");
            $("#addIDS").removeClass("disabled");
        }
        if (_extDrawers[plane_index] || _smallIntDrawers[plane_index] || _largeIntDrawers[plane_index] || _lockers[plane_index]) {
            $("#addID").addClass("disabled");
        } else {
            $("#addID").removeClass("disabled");
        }
        if (_extDrawers.length > 0) {
            if (_largeIntDrawers[plane_index]) {
                $("#addIDS").addClass("disabled");
                $("#addLocker").addClass("disabled");
                $("#addID").addClass("disabled");
            }
        } else {
            if (_lockers[plane_index] && !_smallIntDrawers[plane_index]) {
                $("#addIDS").removeClass("disabled");
                $("#addLocker").removeClass("disabled");
                $("#addIDL").removeClass("disabled");
                $("#addED").addClass("disabled");

            }
        }
    } else if (wHeight > 6.5) {

        if (_intDrawers_parent.length > 0) {

            $("#addED").addClass("disabled");



        }
        if (_intDrawers_parent[plane_index]) {
            row = 0;
            $("#addIDL").addClass("disabled");
            $("#addLocker").addClass("disabled");
            $("#addIDS").addClass("disabled");


        } else {
            $("#addIDL").removeClass("disabled");
            $("#addLocker").removeClass("disabled");
            $("#addIDS").removeClass("disabled");
        }
        if (_extDrawers[plane_index] || _smallIntDrawers[plane_index] || _largeIntDrawers[plane_index] || _lockers[plane_index]) {
            $("#addID").addClass("disabled");
        } else {
            $("#addID").removeClass("disabled");
        }
        $("#addBottomShelf").removeClass("disabled");

        if (_lockers[plane_index] && !_smallIntDrawers[plane_index]) {

            if (_largeIntDrawers[plane_index] && _extDrawers[plane_index]) {

                $("#addIDS").addClass("disabled");
            } else {
                $("#addIDL").removeClass("disabled");
                $("#addLocker").removeClass("disabled");
                $("#addED").removeClass("disabled");
            }
        } else if (!_lockers[plane_index] && _smallIntDrawers[plane_index]) {
            $("#addIDS").removeClass("disabled");
            $("#addLocker").addClass("disabled");
            $("#addIDL").removeClass("disabled");
            $("#addED").removeClass("disabled");
        } else if (_lockers[plane_index] && _smallIntDrawers[plane_index]) {
            $("#addIDL").addClass("disabled");
            $("#addED").addClass("disabled");
            $("#addIDS").removeClass("disabled");
            $("#addLocker").removeClass("disabled");
        } else {
            $("#addIDL").removeClass("disabled");
            $("#addED").removeClass("disabled");
            $("#addIDS").removeClass("disabled");
            $("#addLocker").removeClass("disabled");
        }

    }
}


function addLoft(visible) {

    wpLoftTop.visible = visible;
    wpLoftBottom.visible = visible;
    wpLoftLeft.visible = visible;
    wpLoftRight.visible = visible;
    wpLoftBack.visible = visible;


    if (visible && !isCreated) {
        generateLoftColumns();

    } else {
        removeLoftDoors();
        removeLoftColumns();
    }

}

function createWardrobe() {

    initMaterial();
    // , map:wood_albedo,normalMap:wood_normal,roughnessMap:wood_roughness,normalScale:new THREE.Vector2(1,1),roughness:1

    var g = new THREE.BoxGeometry(1, 1, 1);

    wBottom = new THREE.Mesh(g, _wardrobeMaterial);
    wBottom.name = "wardrobe_bottom";
    wBottom.position.set(0, 0, 0);

    wBottom.layers.set(0);




    wBottomLayer = new THREE.Mesh(g, _wardrobeMaterial);
    wBottomLayer.name = "wardrobe_bottom_layer";
    wBottomLayer.position.set(0, 0, 0);
    wBottomLayer.layers.set(0);

    wBack = new THREE.Mesh(g, _wardrobeMaterial);
    wBack.name = "wardrobe_back";
    wBack.position.set(0, 0, 0);
    wBottom.layers.set(0);

    wLeft = new THREE.Mesh(g, _wardrobeMaterial);
    wLeft.name = "wardrobe_left";
    wLeft.position.set(0, 0, 0);
    wLeft.layers.set(0);

    wLeftLayer = new THREE.Mesh(g, _wardrobeMaterial);
    wLeftLayer.name = "wardrobe_left_layer";
    wLeftLayer.position.set(0, 0, 0);
    wLeftLayer.layers.set(0);


    wLeftLayerTop = new THREE.Mesh(g, _wardrobeMaterial);
    wLeftLayerTop.name = "wardrobe_left_layerTop";
    wLeftLayerTop.position.set(0, 0, 0);
    wLeftLayerTop.layers.set(0);

    wLeftLayerBottom = new THREE.Mesh(g, _wardrobeMaterial);
    wLeftLayerBottom.name = "wardrobe_left_layerBottom";
    wLeftLayerBottom.position.set(0, 0, 0);
    wLeftLayerBottom.layers.set(0);


    wRight = new THREE.Mesh(g, _wardrobeMaterial);
    wRight.name = "wardrobe_right";
    wRight.position.set(0, 0, 0);
    wRight.layers.set(0);

    wRightLayer = new THREE.Mesh(g, _wardrobeMaterial);
    wRightLayer.name = "wardrobe_right_layer";
    wRightLayer.position.set(0, 0, 0);
    wRightLayer.layers.set(0);


    wRightLayerBottom = new THREE.Mesh(g, _wardrobeMaterial);
    wRightLayerBottom.name = "wardrobe_right_layerBottom";
    wRightLayerBottom.position.set(0, 0, 0);
    wRightLayerBottom.layers.set(0);

    wRightLayerTop = new THREE.Mesh(g, _wardrobeMaterial);
    wRightLayerTop.name = "wardrobe_right_layerTop";
    wRightLayerTop.position.set(0, 0, 0);
    wRightLayerTop.layers.set(0);

    wTop = new THREE.Mesh(g, _wardrobeMaterial);
    wTop.name = "wardrobe_top";
    wTop.position.set(0, 0, 0);
    wTop.layers.set(0);

    wTopLayer = new THREE.Mesh(g, _wardrobeMaterial);
    wTopLayer.name = "wardrobe_top_layer";
    wTopLayer.position.set(0, 0, 0);
    wTopLayer.layers.set(0);

    wpLoftTop = new THREE.Mesh(g, _wardrobeMaterial);
    wpLoftTop.name = "wardrobe_loft_top";
    wpLoftTop.position.set(0, 0, 0);
    wpLoftTop.visible = false;
    wpLoftTop.layers.set(1);

    wpLoftLeft = new THREE.Mesh(g, _wardrobeMaterial);
    wpLoftLeft.name = "wardrobe_loft_left";
    wpLoftLeft.position.set(0, 0, 0);
    wpLoftLeft.visible = false;
    wpLoftLeft.layers.set(1);

    wpLoftRight = new THREE.Mesh(g, _wardrobeMaterial);
    wpLoftRight.name = "wardrobe_loft_right";
    wpLoftRight.position.set(0, 0, 0);
    wpLoftRight.visible = false;
    wpLoftRight.layers.set(1);

    wpLoftBottom = new THREE.Mesh(g, _wardrobeMaterial)
    wpLoftBottom.name = "wardrobe_loft_bottom";
    wpLoftBottom.position.set(0, 0, 0);
    wpLoftBottom.visible = false;
    wpLoftBottom.layers.set(1);

    wpLoftBack = new THREE.Mesh(g, _wardrobeMaterial);
    wpLoftBack.name = "wardrobe_loft_back";
    wpLoftBack.position.set(0, 0, 0);
    wpLoftBack.visible = false;
    wpLoftBack.layers.set(1);


    scene.add(wBottom);
    scene.add(wBack);
    scene.add(wLeft);
    scene.add(wRight);
    scene.add(wTop);
    scene.add(wBottomLayer);
    scene.add(wTopLayer);
    scene.add(wLeftLayer);
    scene.add(wRightLayer);
    scene.add(wLeftLayerTop);
    scene.add(wLeftLayerBottom);
    scene.add(wRightLayerTop);
    scene.add(wRightLayerBottom);
    scene.add(wpLoftBottom);
    scene.add(wpLoftBack);
    scene.add(wpLoftLeft);
    scene.add(wpLoftRight);
    scene.add(wpLoftTop);

    edgeBottom = createWardrobeEdges(wBottom);
    edgeBack = createWardrobeEdges(wBack);
    edgeLeft = createWardrobeEdges(wLeft);
    edgeRight = createWardrobeEdges(wRight);
    edgeTop = createWardrobeEdges(wTop);
    edgeTopLayer = createWardrobeEdges(wTopLayer);
    edgeBottomLayer = createWardrobeEdges(wBottomLayer);

    edgeLeftLayer = createWardrobeEdges(wLeftLayer);
    edgeLeftLayerTop = createWardrobeEdges(wLeftLayerTop);
    edgeLeftLayerBottom = createWardrobeEdges(wLeftLayerBottom);


    edgeRightLayer = createWardrobeEdges(wRightLayer);
    edgeRightLayerTop = createWardrobeEdges(wRightLayerTop);
    edgeRightLayerBottom = createWardrobeEdges(wRightLayerBottom);


    edgeLoftBottom = createWardrobeEdges(wpLoftBottom);
    edgeLoftBack = createWardrobeEdges(wpLoftBack);
    edgeLoftLeft = createWardrobeEdges(wpLoftLeft);
    edgeLoftRight = createWardrobeEdges(wpLoftRight);
    edgeLoftTop = createWardrobeEdges(wpLoftTop);


    depthSideMesh = createWardrobeEdgesDepth(wLeft);
    depthSideMeshLoft = createWardrobeEdgesDepth(wpLoftLeft);


}


function updateWardrobe() {


    if (wBottom) {

        if (isHingedDoor) {
            wBottom.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
            wBottom.position.set(0, (2.5 / 12) * ftTom + (thickness / 24) * ftTom, ((thickness / 24) * ftTom));
            wBottomLayer.visible = false;

        } else {
            wBottomLayer.visible = true;
            wBottom.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom) - 1.35 / 12 * ftTom);
            wBottom.position.set(0, (2.5 / 12) * ftTom + (thickness / 24) * ftTom, ((thickness / 24) * ftTom) - 1.35 / 24 * ftTom);
        }

        updateWardrobeEdges(edgeBottom, wBottom)




    }

    if (wBottomLayer) {
        if (_extDrawers.length > 0) {
            wBottomLayer.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
            wBottomLayer.position.set(0, (2.5 / 12) * ftTom + (thickness / 24) * ftTom, ((thickness / 24) * ftTom));
        } else {
            wBottomLayer.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 24) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
            wBottomLayer.position.set(0, (2.5 / 12) * ftTom + (thickness / 48) * ftTom, ((thickness / 24) * ftTom));
        }

        updateWardrobeEdges(edgeBottomLayer, wBottomLayer)
    }
    if (wBack) {
        wBack.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, wHeight * ftTom - (2.5 / 12 * ftTom), (thickness / 12) * ftTom);
        if (isHingedDoor) {
            wBack.position.set(0, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, -wBottom.scale.z / 2);
        } else {
            wBack.position.set(0, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, -wBottom.scale.z / 2 - 1.35 / 24 * ftTom);
        }

        updateWardrobeEdges(edgeBack, wBack)
    }

    if (wTopLayer) {
        wTopLayer.scale.set((wWidth * ftTom) - (2 * thickness / 12) * ftTom, (thickness / 24) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wTopLayer.position.set(0, wBottom.position.y + wBack.scale.y + (thickness / 48) * ftTom - wBottom.scale.y, 0);
        updateWardrobeEdges(edgeTopLayer, wTopLayer)
    }


    if (wTop) {
        if (isHingedDoor) {
            wTopLayer.visible = false;
            wTop.scale.set((wWidth * ftTom) - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
            wTop.position.set(0, wBottom.position.y + wBack.scale.y - wBottom.scale.y, 0);
        } else {
            wTopLayer.visible = true;
            wTop.scale.set((wWidth * ftTom) - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom - 1.35 / 12 * ftTom);
            wTop.position.set(0, wBottom.position.y + wBack.scale.y - wBottom.scale.y, -1.35 / 24 * ftTom);
        }
        updateWardrobeEdges(edgeTop, wTop)

        // ((wBack.scale.y)-wTop.scale.y/2+wBottom.position.y+wBottom.scale.y/2-(thickness/12)*ftTom)
    }
    if (wLeftLayer) {
        wLeftLayer.scale.set((thickness / 24) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
        wLeftLayer.position.set(-(((thickness / 12) * ftTom) - wLeftLayer.scale.x / 2 + (wBack.scale.x / 2)), wLeftLayer.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        updateWardrobeEdges(edgeLeftLayer, wLeftLayer)
    }

    if (wLeftLayerBottom) {
        if (_extDrawers.length > 0) {
            wLeftLayerBottom.scale.set((thickness / 24) * ftTom, 2 * (thickness / 12) * ftTom + 2.5 / 12 * ftTom + ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
            wLeftLayerBottom.position.set(-(((thickness / 48) * ftTom) + (wBack.scale.x / 2)), wLeftLayerBottom.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        } else {
            wLeftLayerBottom.scale.set((thickness / 24) * ftTom, (thickness / 24) * ftTom + 2.5 / 12 * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
            wLeftLayerBottom.position.set(-(((thickness / 48) * ftTom) + (wBack.scale.x / 2)), wLeftLayerBottom.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        }
        updateWardrobeEdges(edgeLeftLayerBottom, wLeftLayerBottom)

    }


    if (wLeftLayerTop) {
        wLeftLayerTop.scale.set((thickness / 24) * ftTom, (thickness / 24) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
        wLeftLayerTop.position.set(-(((thickness / 48) * ftTom) + (wBack.scale.x / 2)), (wTopLayer.position.y), 0);
        updateWardrobeEdges(edgeLeftLayerTop, wLeftLayerTop)
    }
    if (wLeft) {
        if (isHingedDoor) {
            wLeftLayer.visible = false;
            wLeftLayerBottom.visible = false;
            wLeftLayerTop.visible = false;
            wLeft.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
            wLeft.position.set(-(((thickness / 24) * ftTom) + (wBack.scale.x / 2)), wLeft.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        } else {
            wLeftLayer.visible = true;
            wLeftLayerBottom.visible = true;
            wLeftLayerTop.visible = true;
            wLeft.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom - 1.35 / 12 * ftTom);
            wLeft.position.set(-(((thickness / 24) * ftTom) + (wBack.scale.x / 2)), wLeft.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, -1.35 / 24 * ftTom);
        }

        updateWardrobeEdges(edgeLeft, wLeft)
    }

    if (wRightLayer) {
        wRightLayer.scale.set((thickness / 24) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
        wRightLayer.position.set((((thickness / 12) * ftTom) + (wBack.scale.x / 2)) - wRightLayer.scale.x / 2, wRightLayer.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        updateWardrobeEdges(edgeRightLayer, wRightLayer)
    }


    if (wRightLayerTop) {
        wRightLayerTop.scale.set((thickness / 24) * ftTom, (thickness / 24) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
        wRightLayerTop.position.set((((thickness / 48) * ftTom) + (wBack.scale.x / 2)), (wTopLayer.position.y), 0);
        updateWardrobeEdges(edgeRightLayerTop, wRightLayerTop)
    }
    if (wRightLayerBottom) {
        if (_extDrawers.length > 0) {
            wRightLayerBottom.scale.set((thickness / 24) * ftTom, 2 * (thickness / 12) * ftTom + 2.5 / 12 * ftTom + ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
            wRightLayerBottom.position.set((((thickness / 48) * ftTom) + (wBack.scale.x / 2)), wRightLayerBottom.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        } else {
            wRightLayerBottom.scale.set((thickness / 24) * ftTom, (thickness / 24) * ftTom + 2.5 / 12 * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
            wRightLayerBottom.position.set((((thickness / 48) * ftTom) + (wBack.scale.x / 2)), wRightLayerBottom.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        }

        updateWardrobeEdges(edgeRightLayerBottom, wRightLayerBottom)
    }
    if (wRight) {
        if (isHingedDoor) {
            wRightLayer.visible = false;
            wRightLayerBottom.visible = false;
            wRightLayerTop.visible = false;
            wRight.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
            wRight.position.set((((thickness / 24) * ftTom) + (wBack.scale.x / 2)), wRight.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, 0);
        } else {
            wRightLayer.visible = true;
            wRightLayerBottom.visible = true;
            wRightLayerTop.visible = true;
            wRight.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom - 1.35 / 12 * ftTom);
            wRight.position.set((((thickness / 24) * ftTom) + (wBack.scale.x / 2)), wRight.scale.y / 2 + (wBottom.position.y) - (2.5 / 12 * ftTom) - wBottom.scale.y / 2, -1.35 / 24 * ftTom);
        }

        updateWardrobeEdges(edgeRight, wRight)
    }
    // if (wRight) {
    //     wRight.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
    //     wRight.position.set((((thickness / 24) * ftTom) + (wBack.scale.x / 2)), wRight.scale.y/2 + (wBottom.position.y)  - (2.5 / 12 * ftTom) - wBottom.scale.y/2, 0);
    // }


    if (wpLoftBottom) {
        if (!isHingedDoor) {
            wpLoftBottom.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * (thickness / 12) * ftTom));
            wpLoftBottom.position.set(wTop.position.x, wTop.position.y + wpLoftBottom.scale.y, wTopLayer.position.z);
        } else {
            wpLoftBottom.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * (thickness / 12) * ftTom));
            wpLoftBottom.position.set(wTop.position.x, wTop.position.y + wpLoftBottom.scale.y, wTopLayer.position.z);
        }
        updateWardrobeEdges(edgeLoftBottom, wpLoftBottom)
    }

    if (wpLoftBack) {
        wpLoftBack.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, wLoft * ftTom, (thickness / 12) * ftTom);
        wpLoftBack.position.set(0, wpLoftBottom.position.y + wpLoftBack.scale.y / 2 - wpLoftBottom.scale.y / 2, -wpLoftBottom.scale.z / 2 + (thickness / 24) * ftTom);

        updateWardrobeEdges(edgeLoftBack, wpLoftBack)
    }
    if (wpLoftLeft) {
        wpLoftLeft.scale.set(thickness / 12 * ftTom, wLoft * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wpLoftLeft.position.set(-(thickness / 24 * ftTom + wpLoftBottom.scale.x / 2), wpLoftBottom.position.y + wpLoftLeft.scale.y / 2 - wpLoftBottom.scale.y / 2, 0);
        updateWardrobeEdges(edgeLoftLeft, wpLoftLeft)
    }


    if (wpLoftRight) {
        wpLoftRight.scale.set(thickness / 12 * ftTom, wLoft * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wpLoftRight.position.set((thickness / 24 * ftTom + wpLoftBottom.scale.x / 2), wpLoftBottom.position.y + wpLoftRight.scale.y / 2 - wpLoftBottom.scale.y / 2, 0);
        updateWardrobeEdges(edgeLoftRight, wpLoftRight)
    }
    if (wpLoftTop) {

        wpLoftTop.scale.set(wWidth * ftTom - (2 * thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
        wpLoftTop.position.set(0, wpLoftBack.scale.y + wpLoftBottom.position.y - (thickness / 12) * ftTom, ((thickness / 24) * ftTom));
        updateWardrobeEdges(edgeLoftTop, wpLoftTop)
    }
    createVerticalArrow();
    createHorizontalArrow();
    createDepthArrow();
    if (depthSideMesh) {
        depthSideMesh.scale.copy(wLeftLayer.scale)
        depthSideMesh.position.set(wRight.position.x + depthSideMesh.scale.z / 2 + 0.1, wLeft.position.y, wLeft.position.z - wLeft.scale.z / 2);
        depthSideMesh.rotation.y = 90 * THREE.Math.DEG2RAD;
    }
    if (depthSideMeshLoft) {
        depthSideMeshLoft.scale.copy(wpLoftLeft.scale)
        depthSideMeshLoft.position.set(wpLoftRight.position.x + depthSideMesh.scale.z / 2 + 0.1, wpLoftLeft.position.y, wpLoftLeft.position.z - wpLoftLeft.scale.z / 2);
        depthSideMeshLoft.rotation.y = 90 * THREE.Math.DEG2RAD;

        depthSideMeshLoft.visible = isLoft;
    }
}

function createHorizontalSplitter(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var _splitter = new THREE.Mesh(g, _splitterMaterial);
    _splitter.name = "w_h_splitter_" + index;

    _m_splitters[index] = _splitter;
    _m_splitters_group.name = "w_h_splitters";
    _m_splitters_group.add(_m_splitters[index]);
    scene.add(_m_splitters_group);
}

function removeHorizontalSplitter(index) {

    if (index != null) {
        _m_splitters.forEach(e => {
            if (_m_splitters[index] instanceof THREE.Mesh && _m_splitters[index] == e) {
                if (_m_splitters_group instanceof THREE.Group) {
                    _m_splitters_group.remove(e);
                }
            }
        })
        _m_splitters[index] = null;
    } else {

        _m_splitters.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_m_splitters_group instanceof THREE.Group) {
                    _m_splitters_group.remove(e);
                    scene.remove(_m_splitters_group);
                }
            }
        })
        _m_splitters = [];

    }
}

function createExternalDrawer(index) {

    var g = new THREE.BoxGeometry(1, 1, 1);


    var _ext = new THREE.Mesh(g, _extDrawerMaterial);
    _ext.name = "_ext_d_large_" + index;

    // spLocker = new Splitter();
    // spLocker.create();

    _extDrawers[index] = _ext;
    _extDrawers_group.name = "w_ext_d_large";
    _extDrawers_group.add(_extDrawers[index]);

    // scene.add(_lockers[index]);
    scene.add(_extDrawers_group);
    createExternalDrawerSplitters(index);

}

function createExternalDrawerSplitters(index) {

    var g = new THREE.BoxGeometry(1, 1, 1);

    var _splitter = new THREE.Mesh(g, _splitterMaterial);
    _splitter.name = "w_ext_d_splitter_" + index;

    _extDrawers_splitters[index] = _splitter;
    _extDrawers_splitters_group.name = "w_ext_d_splitters";
    _extDrawers_splitters_group.add(_extDrawers_splitters[index]);

    scene.add(_extDrawers_splitters_group);

}

function updateExternalDrawer(index) {

    if (_extDrawers[index] instanceof THREE.Mesh) {
        _extDrawers[index].scale.set(offset - (thickness / 12) * ftTom, 1 * ftTom, wDepth * ftTom + (thickness / 12) * ftTom)


        _extDrawers[index].position.set(index * offset, wBottom.position.y + _extDrawers[index].scale.y / 2 + (thickness / 24) * ftTom, wDepth * ftTom - _extDrawers[index].scale.z + 2 * wBack.scale.z - thickness / 24 * ftTom);


        _extDrawers_group.position.set(offset / 2 + wLeft.position.x, _extDrawers_group.position.y, _extDrawers_group.position.z);
    }



    if (_extDrawers_splitters[index] instanceof THREE.Mesh) {
        _extDrawers_splitters[index].scale.set(offset - thickness / 12 * ftTom, _m_splitters[index].scale.y, wDepth * ftTom + (thickness / 12) * ftTom);
        _extDrawers_splitters[index].position.set(_extDrawers[index].position.x, _extDrawers[index].position.y + _extDrawers[index].scale.y / 2 + (thickness / 24 * ftTom), _extDrawers[index].position.z);
        _extDrawers_splitters_group.position.set(offset / 2 + wLeft.position.x, _extDrawers_splitters_group.position.y, _extDrawers_splitters_group.position.z);
    }

}

function removeExternalDrawer(index) {

    if (index != null) {
        _extDrawers.forEach(e => {
            if (_extDrawers[index] instanceof THREE.Mesh && _extDrawers[index] == e) {
                if (_extDrawers_group instanceof THREE.Group) {
                    _extDrawers_group.remove(e);
                }
            }
        })
        _extDrawers[index] = null;

        _extDrawers_splitters.forEach(e => {
            if (_extDrawers_splitters[index] instanceof THREE.Mesh && _extDrawers_splitters[index] == e) {
                if (_extDrawers_splitters_group instanceof THREE.Group) {
                    _extDrawers_splitters_group.remove(e);
                }
            }
        })
        _extDrawers_splitters_group[index] = null;
    } else {

        _extDrawers.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_extDrawers_group instanceof THREE.Group) {
                    _extDrawers_group.remove(e);
                    scene.remove(_extDrawers_group);
                }
            }
        })
        _extDrawers = [];

        _extDrawers_splitters.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_extDrawers_splitters_group instanceof THREE.Group) {
                    _extDrawers_splitters_group.remove(e);
                    scene.remove(_extDrawers_splitters_group);
                }
            }
        })
        _extDrawers_splitters = [];

    }

}

function createInternalDrawerLarge(index) {

    var g = new THREE.BoxGeometry(1, 1, 1);

    var _large_int = new THREE.Mesh(g, _intLargeMaterial);
    _large_int.name = "_int_d_large_" + index;

    // spLocker = new Splitter();
    // spLocker.create();

    _largeIntDrawers[index] = _large_int;
    _largeIntDrawers_group.name = "w_int_d_large";
    _largeIntDrawers_group.add(_largeIntDrawers[index]);

    // scene.add(_lockers[index]);
    scene.add(_largeIntDrawers_group);
    createInternalDrawerLargeSplitters(index);

}

function createInternalDrawerLargeSplitters(index) {

    var g = new THREE.BoxGeometry(1, 1, 1);

    var _splitter = new THREE.Mesh(g, _splitterMaterial);
    _splitter.name = "w_int_d_splitter_" + index;

    // spLocker = new Splitter();
    // spLocker.create();

    _largeIntDrawers_splitters[index] = _splitter;
    _largeIntDrawers_splitters_group.name = "w_int_d_splitters";
    _largeIntDrawers_splitters_group.add(_largeIntDrawers_splitters[index]);
    // scene.add(_lockers[index]);
    scene.add(_largeIntDrawers_splitters_group);

}


function updateInternalDrawerLarge(index) {



    if (_largeIntDrawers[index] instanceof THREE.Mesh) {
        _largeIntDrawers[index].scale.set(_m_splitters[index].scale.x, (10 / 12) * ftTom, _m_splitters[index].scale.z);

        if (!_extDrawers[index]) {

            _largeIntDrawers[index].position.set(index * offset, wBottom.position.y + _largeIntDrawers[index].scale.y / 2 + thickness / 24 * ftTom, _m_splitters[index].position.z);
        } else {

            _largeIntDrawers[index].position.set(index * offset, _extDrawers_splitters[index].position.y + _largeIntDrawers[index].scale.y / 2 + (thickness / 24) * ftTom, _m_splitters[index].position.z);
        }
        _largeIntDrawers_group.position.set(offset / 2 + wLeft.position.x, _largeIntDrawers_group.position.y, _largeIntDrawers_group.position.z);
    }



    if (_largeIntDrawers[index] instanceof THREE.Mesh) {
        _largeIntDrawers_splitters[index].scale.set(_m_splitters[index].scale.x, _m_splitters[index].scale.y, _m_splitters[index].scale.z);
        _largeIntDrawers_splitters[index].position.set(_largeIntDrawers[index].position.x, _largeIntDrawers[index].position.y + _largeIntDrawers[index].scale.y / 2 + (thickness / 24 * ftTom), _m_splitters[index].position.z);
        _largeIntDrawers_splitters_group.position.set(offset / 2 + wLeft.position.x, _largeIntDrawers_splitters_group.position.y, _largeIntDrawers_splitters_group.position.z);
    }

}

function removeInternalDrawerLarge(index) {

    if (index) {
        _largeIntDrawers.forEach(e => {
            if (_largeIntDrawers[index] instanceof THREE.Mesh && _largeIntDrawers[index] == e) {
                if (_largeIntDrawers_group instanceof THREE.Group) {
                    _largeIntDrawers_group.remove(e);
                }
            }
        })
        _largeIntDrawers[index] = null;

        _largeIntDrawers_splitters.forEach(e => {
            if (_largeIntDrawers_splitters[index] instanceof THREE.Mesh && _largeIntDrawers_splitters[index] == e) {
                if (_largeIntDrawers_splitters_group instanceof THREE.Group) {
                    _largeIntDrawers_splitters_group.remove(e);
                }
            }
        })
        _largeIntDrawers_splitters_group[index] = null;
    } else {

        _largeIntDrawers.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_largeIntDrawers_group instanceof THREE.Group) {
                    _largeIntDrawers_group.remove(e);
                    scene.remove(_largeIntDrawers_group);
                }
            }
        })
        _largeIntDrawers = [];

        _largeIntDrawers_splitters.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_largeIntDrawers_splitters_group instanceof THREE.Group) {
                    _largeIntDrawers_splitters_group.remove(e);
                    scene.remove(_largeIntDrawers_splitters_group);
                }
            }
        })
        _largeIntDrawers_splitters = [];

    }

}

function createLocker(index) {

    var g = new THREE.BoxGeometry(1, 1, 1);

    var _locker = new THREE.Mesh(g, _lockerMaterial);
    _locker.name = "_locker_" + index;

    _lockers[index] = _locker;
    _locker_group.name = "w_lockers";
    _locker_group.add(_lockers[index]);
    scene.add(_locker_group);
    createLockerSplitter(index);
}

function createLockerSplitter(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);

    var _splitter = new THREE.Mesh(g, _splitterMaterial);
    _splitter.name = "_locker_splitter_" + index;

    _locker_splitters[index] = _splitter;
    _locker_splitter_group.name = "w_locker_splitters";
    _locker_splitter_group.add(_locker_splitters[index]);
    scene.add(_locker_splitter_group);
}


function updateLocker(index) {


    if (_lockers[index] instanceof THREE.Mesh) {
        _lockers[index].scale.set(_m_splitters[index].scale.x, (7.125 / 12) * ftTom, _m_splitters[index].scale.z)
        _lockers[index].position.set(index * offset, _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - _lockers[index].scale.y / 2, _m_splitters[index].position.z);

    }

    _locker_group.position.set(offset / 2 + wLeft.position.x, _locker_group.position.y, _locker_group.position.z);



    if (_locker_splitters[index] instanceof THREE.Mesh) {
        _locker_splitters[index].scale.set(_m_splitters[index].scale.x, _m_splitters[index].scale.y, _m_splitters[index].scale.z);
        _locker_splitters[index].position.set(_lockers[index].position.x, _lockers[index].position.y - _lockers[index].scale.y / 2 - (thickness / 24 * ftTom), _lockers[index].position.z);

    }

    _locker_splitter_group.position.set(offset / 2 + wLeft.position.x, _locker_splitter_group.position.y, _locker_splitter_group.position.z);
}

function removeLocker(index) {

    if (index) {
        _lockers.forEach(e => {
            if (_lockers[index] instanceof THREE.Mesh && _lockers[index] == e) {
                if (_locker_group instanceof THREE.Group) {
                    _locker_group.remove(e);
                }
            }
        })
        _lockers[index] = null;

        _locker_splitters.forEach(e => {
            if (_locker_splitters[index] instanceof THREE.Mesh && _locker_splitters[index] == e) {
                if (_locker_splitter_group instanceof THREE.Group) {
                    _locker_splitter_group.remove(e);
                }
            }
        })
        _locker_splitter_group[index] = null;
    } else {

        _lockers.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_locker_group instanceof THREE.Group) {
                    _locker_group.remove(e);
                    scene.remove(_locker_group);
                }
            }
        })
        _lockers = [];

        _locker_splitters.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_locker_splitter_group instanceof THREE.Group) {
                    _locker_splitter_group.remove(e);
                    scene.remove(_locker_splitter_group);
                }
            }
        })
        _locker_splitters = [];

    }

}

function createInternalDrawerSmall(index) {

    var g = new THREE.BoxGeometry(1, 1, 1);

    var _small_int = new THREE.Mesh(g, _intSmallMaterial);
    _small_int.name = "_int_d_small_" + index;

    // spLocker = new Splitter();
    // spLocker.create();

    _smallIntDrawers[index] = _small_int;
    _smallIntDrawers_group.name = "w_int_d_small";
    _smallIntDrawers_group.add(_smallIntDrawers[index]);

    // scene.add(_lockers[index]);
    scene.add(_smallIntDrawers_group);
}

function updateInternalDrawerSmall(index) {


    if (_smallIntDrawers[index] instanceof THREE.Mesh) {
        _smallIntDrawers[index].scale.set(_m_splitters[index].scale.x, (8 / 12) * ftTom, _m_splitters[index].scale.z)
        _smallIntDrawers_group.position.set(offset / 2 + wLeft.position.x, _smallIntDrawers_group.position.y, _smallIntDrawers_group.position.z);
        if (!_lockers[index]) {

            _smallIntDrawers[index].position.set(index * offset, _m_splitters[index].position.y - _smallIntDrawers[index].scale.y / 2 - (thickness / 24) * ftTom, _m_splitters[index].position.z);
        } else {

            _smallIntDrawers[index].position.set(index * offset, _lockers[index].position.y - _smallIntDrawers[index].scale.y - (thickness / 24) * ftTom, _m_splitters[index].position.z);
        }
    }

}

function removeInternalDrawerSmall(index) {

    if (index) {
        _smallIntDrawers.forEach(e => {
            if (_smallIntDrawers[index] instanceof THREE.Mesh && _smallIntDrawers[index] == e) {
                if (_smallIntDrawers_group instanceof THREE.Group) {
                    _smallIntDrawers_group.remove(e);
                }
            }
        })
        _smallIntDrawers[index] = null;

        _smallIntDrawers_splitters.forEach(e => {
            if (_smallIntDrawers_group[index] instanceof THREE.Mesh && _smallIntDrawers_group[index] == e) {
                if (_smallIntDrawers_splitters_group instanceof THREE.Group) {
                    _smallIntDrawers_splitters_group.remove(e);
                }
            }
        })
        _smallIntDrawers_splitters[index] = null;
    } else {

        _smallIntDrawers.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_smallIntDrawers_group instanceof THREE.Group) {
                    _smallIntDrawers_group.remove(e);
                    scene.remove(_smallIntDrawers_group);
                }
            }
        })
        _smallIntDrawers = [];

        _smallIntDrawers_splitters.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_smallIntDrawers_splitters_group instanceof THREE.Group) {
                    _smallIntDrawers_splitters_group.remove(e);
                    scene.remove(_smallIntDrawers_splitters_group);
                }
            }
        })
        _smallIntDrawers_splitters = [];

    }

}

function createHanger(index) {
    var g = new THREE.CylinderGeometry((1 / 12) * ftTom, (1 / 12) * ftTom, 1, 32, 1);

    _hangers[index] = new THREE.Mesh(g, _hangerMaterial);
    _hangers[index].name = "w_hanger";

    _hangers[index].rotateZ(90 * THREE.Math.DEG2RAD);
    _hanger_group.add(_hangers[index]);
    _hanger_group.name = "w_hangers";
    scene.add(_hanger_group);
    removeTopShelves(index);
}

function updateHanger(index) {


    if (_hangers[index] instanceof THREE.Mesh) {

        _hangers[index].scale.set(1, offset - (thickness / 12) * ftTom, 1);
        _hangers[index].position.set(index * offset, wTop.position.y - (1.5 / 12) * ftTom - wTop.scale.y, wLeft.position.z / 2);
        _hanger_group.position.set(offset / 2 + wLeft.position.x, _hanger_group.position.y, _hanger_group.position.z);
    }

}



function removeHanger(index) {

    if (index) {
        if (_hangers[index] instanceof THREE.Mesh) {
            if (_hanger_group instanceof THREE.Group) {
                _hanger_group.remove(_hangers[index]);
            }
        }
        _hangers[index] = null;
    } else {
        _hangers.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (_hanger_group instanceof THREE.Group) {
                    _hanger_group.remove(e);
                }
            }
        })

        _hangers = [];
    }




}

function createTopShelves(row, index) {
    var g = new THREE.BoxGeometry(1, 1, 1);

    var _top_shelves_group = new THREE.Group();

    for (var i = 0; i < row; i++) {
        _top_shelves[i] = new THREE.Mesh(g, _shelfMaterial);
        _top_shelves[i].name = "top_shelf_" + i;

        _top_shelves_group.add(_top_shelves[i]);
    }

    _top_shelves_group.name = "top_shelves_" + index;
    _top_shelves_parent[index] = _top_shelves_group;

    scene.add(_top_shelves_parent[index]);

    removeHanger(index);

}


function updateTopShelves(index) {


    var vertical_offset = (wTop.position.y - wTop.scale.y - _m_splitters[index].position.y + thickness / 24 * ftTom) / 3;


    if (_top_shelves_parent[index] instanceof THREE.Group) {

        for (var j = 0; j < _top_shelves_parent[index].children.length; j++) {

            if (_top_shelves_parent[index].children[j] instanceof THREE.Mesh) {
                _top_shelves_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);

                _top_shelves_parent[index].children[j].position.set(index * offset, (j * vertical_offset), wLeft.position.z / 2);

            }

        }
        _top_shelves_parent[index].position.set(offset / 2 + wLeft.position.x, wTop.position.y - (2 * ftTom) - wTop.scale.y, _top_shelves_parent[index].position.z);
    }
}

function removeTopShelves(index) {


    if (!index) {
        _top_shelves_parent.forEach(e => {
            if (e instanceof THREE.Group) {
                scene.remove(e);
            }
        })
        _top_shelves_parent = [];
    } else {
        _top_shelves_parent.forEach(e => {
            if (e instanceof THREE.Group && index == _top_shelves_parent.indexOf(e)) {
                scene.remove(e);
            }
        })
        _top_shelves_parent[index] = null;
    }
}

function createBotShelves(row, index) {
    var g = new THREE.BoxGeometry(1, 1, 1);

    let _bot_group = new THREE.Group();


    for (var j = 0; j < row; j++) {
        _bot_shelves[j] = new THREE.Mesh(g, _shelfMaterial);
        _bot_shelves[j].name = "bot_shelf_" + j;
        _bot_shelves[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
        _bot_group.add(_bot_shelves[j]);

    }
    _bot_group.name = "bot_shelves_" + index;
    _bot_shelf_parent[index] = _bot_group;


    scene.add(_bot_shelf_parent[index]);

}

function removeBotShelves(index) {

    if (!index) {
        _bot_shelf_parent.forEach(e => {
            if (e instanceof THREE.Group) {
                scene.remove(e);
            }
        })
        _bot_shelf_parent = [];
    } else {
        _bot_shelf_parent.forEach(e => {
            if (e instanceof THREE.Group && index == _bot_shelf_parent.indexOf(e)) {
                scene.remove(e);
            }
        })
        _bot_shelf_parent[index] = null;
    }

}

function updateBotShelves(index) {

    var vertical_offset = -1;
    var pos = 0;
    var dist;




    if (_bot_shelf_parent[index] instanceof THREE.Group) {


        //No Locker
        if (!_lockers[index]) {
            if (_bot_shelf_parent[index]) {


                // No Other Parts
                if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {

                    if (wHeight > 6) {

                        dist = (_m_splitters[index].position.y - wBottom.position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1);
                        pos = _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset + (thickness / 24) * ftTom;
                    }
                }
                //ID_L
                if (_largeIntDrawers[index] && !_smallIntDrawers[index] && !_extDrawers[index]) {
                    if (_bot_shelf_parent[index].children.length > 1) {
                        dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 12) * ftTom;
                        pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset - thickness / 12 * ftTom);
                    } else {
                        dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 24) * ftTom;
                        pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    }
                }
                //ID_S
                else if (_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {
                    if (_bot_shelf_parent[index].children.length > 1) {
                        dist = (_smallIntDrawers[index].position.y - wBottom.position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 12) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset + thickness / 12 * ftTom);
                    } else {
                        dist = (_smallIntDrawers[index].position.y - wBottom.position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 24) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (2 * thickness / 12) * ftTom;
                    }

                }
                //ID_S and ED
                else if (_smallIntDrawers[index] && !_largeIntDrawers[index] && _extDrawers[index]) {
                    dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_extDrawers[index].scale.y / 2 + _extDrawers[index].position.y);
                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (_bot_shelf_parent[index].children.length * thickness / 12) * ftTom;
                    pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                }
                //ID_L and ID_S
                else if (_smallIntDrawers[index] && _largeIntDrawers[index] && !_extDrawers[index]) {
                    dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (_bot_shelf_parent[index].children.length * thickness / 12) * ftTom;
                    pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                }
                //ID_L and ID_S and ED
                else if (_smallIntDrawers[index] && _largeIntDrawers[index] && _extDrawers[index]) {
                    dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (_bot_shelf_parent[index].children.length * thickness / 12) * ftTom;
                    pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                }
                //ED
                else if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && _extDrawers[index]) {
                    dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_extDrawers[index].scale.y / 2 + _extDrawers[index].position.y);

                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;

                }
                //ED and ID_L
                else if (!_smallIntDrawers[index] && _largeIntDrawers[index] && _extDrawers[index]) {
                    dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length + 1)) * ftTom;

                }
            }
        }
        // Locker
        else {
            if (_bot_shelf_parent[index]) {
                //Nothing
                if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {

                    if (_bot_shelf_parent[index].children.length > 1) {
                        dist = (_lockers[index].position.y - wBottom.position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 12) * ftTom;
                        pos = (_lockers[index].position.y - _lockers[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset + thickness / 12 * ftTom);
                    } else {
                        dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        pos = (_lockers[index].position.y - _lockers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    }
                }

                //ID_S
                else if (!_largeIntDrawers[index] && !_extDrawers[index] && _smallIntDrawers[index]) {
                    if (_bot_shelf_parent[index].children.length > 1) {


                        dist = (_smallIntDrawers[index].position.y + _smallIntDrawers[index].scale.y / 2) + (wBottom.scale.y / 2 - wBottom.position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (((_bot_shelf_parent[index].children.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom);
                    } else {
                        dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    }

                }
                //ED
                else if (!_largeIntDrawers[index] && _extDrawers[index]) {
                    dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (_extDrawers[index].scale.y / 2 + _extDrawers[index].position.y);

                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    pos = (_lockers[index].position.y - _lockers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;

                }
                //ID_L
                else if (_largeIntDrawers[index] && !_smallIntDrawers[index]) {
                    dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                    vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    pos = (_lockers[index].position.y - _lockers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;

                }
                //ID_L
                else if (_largeIntDrawers[index] && _smallIntDrawers[index]) {
                    if (_bot_shelf_parent[index].children.length < 2) {
                        dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    }
                }

            }
        }


        // if (!_lockers[index] && !_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {


        //     if (wHeight > 6) {

        //         if (_m_splitters[index]) {
        //             dist = (_m_splitters[index].position.y - wBottom.position.y);
        //             vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1);
        //             pos = _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset + (thickness / 24) * ftTom;
        //         }

        //     }
        // }


        if (_bot_shelf_parent[index] instanceof THREE.Group) {
            for (var j = 0; j < _bot_shelf_parent[index].children.length; j++) {
                if (_bot_shelf_parent[index].children[j] instanceof THREE.Mesh) {
                    _bot_shelf_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
                    _bot_shelf_parent[index].children[j].position.set(index * offset, (j * vertical_offset), wLeft.position.z / 2 + (thickness / 24) * ftTom);
                }

            }
        }
        _bot_shelf_parent[index].position.set(offset / 2 + wLeft.position.x, pos, _bot_shelf_parent[index].position.z);

    }



}

function updateBotShelvesScale(index, vertical_offset, ) {

}

function createInteractivePlane(index) {

    var g = new THREE.PlaneGeometry(1, 1);
    var m = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
    });
    m.name = "im_plane";
    var _plane = new THREE.Mesh(g, m);
    _plane.name = "interactive_" + index;
    _plane.scale.set(offset, 1 * ftTom, wDepth * ftTom);
    interactivePlanes[index] = _plane;
    interactivePlane_group.add(interactivePlanes[index]);
    interactivePlane_group.name = "i_planes";

    scene.add(interactivePlane_group);

}


function updateInteractivePlane(index) {

    if (interactivePlanes[index] instanceof(THREE.Mesh)) {
        interactivePlanes[index].scale.set(offset - thickness / 12 * ftTom, wHeight * ftTom - (2.5 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y);
        interactivePlanes[index].position.set(index * offset, wBack.position.y, wBottom.scale.z / 2);
    }
    interactivePlane_group.position.set(offset / 2 + wLeft.position.x, interactivePlane_group.position.y, interactivePlane_group.position.z);
    column_id.push(index);

}

function removeInteractivePlane(index) {


    if (index) {

        if (interactivePlanes[index] instanceof THREE.Mesh) {

            interactivePlane_group.remove(interactivePlanes[index]);

        }

        interactivePlanes[index] = null;
    } else {
        interactivePlanes.forEach(e => {
            if (e instanceof THREE.Mesh) {
                if (interactivePlane_group instanceof THREE.Group) {
                    interactivePlane_group.remove(e);
                }
            }
        })

        interactivePlanes = [];
    }




}

function helpers() {
    // const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    // gridHelper.position.y = 0;
    // gridHelper.position.x = 0;

    // scene.add(gridHelper);

    // const axesHelper = new THREE.AxesHelper(1);
    // scene.add(axesHelper);




}



function onClick() {
    //setflipDoor_Select()

    if (selectedObject) {
        if (deleteSprites_group.visible) {
            for (var i = 0; i < columns; i++) {

                if (_columns[i] == selectedObject) {

                    if (_columns[i - 1]) {

                        adjacentParts.push(_columns[i - 1]);
                        deleteSprites_group.remove(deleteSprites[i - 1])
                    }
                    if (_columns[i + 1]) {
                        deleteSprites_group.remove(deleteSprites[i + 1])
                        adjacentParts.push(_columns[i + 1]);
                    }

                    removed_index = i;
                    removed_id.push(i);


                    updateColumnsArrow(i)
                    updateUpperArrows(i);
                    updateLowerArrows(i);

                    deleteSprites_group.remove(deleteSprites[i])
                    _columns_group.remove(_columns[i]);
                    _columnsEdges_group.remove(_columnsEdges[i]);

                    removed.push(_columns[i]);
                }
              

                   
                    
            
            
                
                
            
            }
        }

        
   
        selectedObject = null;




    }

    if (selectedPlane) {
        if (!isMirrorAdded) {
            if (interactivePlane_group.visible) {
                for (var i = 0; i < interactivePlanes.length; i++) {
                    if (interactivePlanes[i] == selectedPlane) {

                        addSelectedObject(selectedPlane);
                        planeOultinePass.visibleEdgeColor.set("#ff7300")
                        planeOultinePass.edgeStrength = 10;
                        planeOultinePass.edgeGlow = 0;
                        planeOultinePass.selectedObjects = selectedObjects;

                        plane_index = i;
                    }
                }

            } else {
                planeOultinePass.selectedObjects = [];
            }
            selectedPlane = null;
        } else {
            planeOultinePass.selectedObjects = [];
            selectedPlane = null;
        }

    }
    if (selectedMirror) {
        if (flipVerticalSprite.includes(selectedMirror)) {
            var flipIndex = flipVerticalSprite.indexOf(selectedMirror);
            _flipDoor(flipIndex);
        }

    }
    if (selectedDoor) {
        if (isMirrorAdded) {

            _hDoors_parent.forEach(e => {
                if (e instanceof THREE.Group) {
                    e.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            if (child == selectedDoor) {
                                if (_isDoorRight.includes(e)) {
                                    child.material = _mirrorMaterials;
                                    child.material.needsUpdate = true;
                                } else if (_isDoorLeft.includes(e)) {
                                    child.material = _flipMirrorMaterials;
                                    child.material.needsUpdate = true;
                                } else {
                                    if (_hDoors_parent.indexOf(e) % 2 != 0) {

                                        child.material = _mirrorMaterials;
                                        child.material.needsUpdate = true;
                                    } else if (_hDoors_parent.indexOf(e) % 2 == 0) {

                                        child.material = _flipMirrorMaterials;
                                        child.material.needsUpdate = true;

                                    }
                                }
                            }

                            // swappedDoors.forEach(s => {

                            //     for (let i = 0; i < s.length; s++) {
                            //         if (s[i] instanceof THREE.Group || s[i + 1] instanceof THREE.Group) {
                            //             s[i].traverse(function (child) {
                            //                 if (child == selectedDoor) {
                            //                     selectedDoor.material = _mirrorMaterials;
                            //                     selectedDoor.material.needsUpdate = true;
                            //                 } else {
                            //                     selectedDoor.material = _flipMirrorMaterials;
                            //                     selectedDoor.material.needsUpdate = true;
                            //                 }
                            //             })

                            //             s[i + 1].traverse(function (child) {
                            //                 if (child == selectedDoor) {
                            //                     selectedDoor.material = _flipMirrorMaterials;
                            //                     selectedDoor.material.needsUpdate = true;
                            //                 } else {
                            //                     selectedDoor.material = _mirrorMaterials;
                            //                     selectedDoor.material.needsUpdate = true;
                            //                 }
                            //             })
                            //         }
                            //     }


                            // })

                        }

                    })
                }

            })


        } else {

        }
    }
    // plane_index = interactivePlanes.findIndex(e => e === selectedObject);

}

function onPointerMove(event) {

    if (selectedSprite instanceof THREE.Sprite) {
        if (deleteSprites_group.visible) {
            selectedSprite.material.map = onNormalDeleteSprite;
            deleteSprites.forEach(e => {
                if (e == selectedSprite) {
                    _columns.forEach(c => {
                        if (_columns.indexOf(c) == deleteSprites.indexOf(e)) {
                            selectedObject = c;
                            adjacentParts.forEach(e => {
                                if (e == selectedObject) {
                                    selectedSprite = null;
                                }
                            });
                        }
                    })
                }
            });
        } else {
            selectedObject = null;

        }
    }

    if (selectedDoor) {
        if (isMirrorAdded) {
            addSelectedObject(selectedDoor);
            doorOutlinePass.visibleEdgeColor.set("#fcbe03")
            doorOutlinePass.edgeStrength = 10;
            doorOutlinePass.edgeGlow = 0;
            doorOutlinePass.selectedObjects = selectedObjects;

        } else {
            doorOutlinePass.selectedObjects = []
            selectedDoor = null;
        }
    }
    if (selectedMirror) {
        selectedMirror.material.map = onNormalFlipSprite;
        selectedMirror = null;
    }

    if (selectedPlane) {
        if (!isMirrorAdded) {
            outlinePass.visibleEdgeColor.set("#fcbe03")
            outlinePass.edgeStrength = 10;
            outlinePass.edgeGlow = 0;
            outlinePass.selectedObjects = selectedObjects;
            selectedPlane = null
        } else {
            outlinePass.selectedObjects = [];
        }

    } else {

        outlinePass.selectedObjects = [];
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


    // const intersects = raycaster.intersectObject(_columns_group, true);
    const removeIcons = raycaster.intersectObject(deleteSprites_group, true);
    const mirrorIcons = raycaster.intersectObject(flipVertical_group, true);
    const p = raycaster.intersectObject(interactivePlane_group, true);
    const doors = raycaster.intersectObject(_hDoors_parent_group, true);
    if (doors.length > 0) {

        const res = doors.filter(function (res) {

            return res && res.object;

        })[0];


        if (res && res.object) {

            selectedDoor = res.object;

        }
    }

    if (mirrorIcons.length > 0) {

        const res = mirrorIcons.filter(function (res) {

            return res && res.object;

        })[0];


        if (res && res.object) {

            selectedMirror = res.object;
            selectedMirror.material.map = onHoverFlipSprite;
        }
    }
    if (removeIcons.length > 0) {

        const res = removeIcons.filter(function (res) {

            return res && res.object;

        })[0];


        if (res && res.object) {

            selectedSprite = res.object;
            selectedSprite.material.map = onHoverDeleteSprite;
        }
    } else {
        selectedObject = null;
    }


    if (p.length > 0) {

        const res = p.filter(function (res) {

            return res && res.object;

        })[0];

        getColumnToCopy();
        if (res && res.object) {

            selectedPlane = res.object;
            addSelectedObject(selectedPlane);



        }

    }

    // if (intersects.length > 0) {

    //     const res = intersects.filter(function (res) {

    //         return res && res.object;

    //     })[0];


    //     if (res && res.object) {

    //         selectedObject = res.object;    
    //         addSelectedObject(selectedObject);

    //         adjacentParts.forEach(e => {
    //             if (e == selectedObject) {

    //                 selectedObject = null;
    //                 outlinePass.visibleEdgeColor.set("#ff0000");


    //             } else {

    //                 outlinePass.selectedObjects = [];
    //             }

    //         });
    //         outlinePass.selectedObjects = selectedObjects;


    //     }

    // } else {
    //     outlinePass.visibleEdgeColor.set("#00ffff");
    //     // selectedObject = null;
    // }

}

function addSelectedObject(object) {

    selectedObjects = [];
    selectedObjects.push(object);

}

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
    interactivePlane_group.visible = false;
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

                saveArrayBuffer(gltf, 'wardrobe.glb');

            } else {

                const output = JSON.stringify(gltf, null, 2);
                // console.log(output);
                saveString(output, 'wardrobe.gltf');
                interactivePlane_group.visible = true;
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



function getColumnToCopy() {

    while (cp.firstChild) {
        cp.removeChild(cp.firstChild);
    }
    for (var i = 0; i <= customColumns; i++) {

        var op = document.createElement("option");

        if (i != 0) {
            op.setAttribute("value", i);

            op.innerHTML = i;
            cp.appendChild(op);
        } else {

            op.innerHTML = "Select Column";
            cp.appendChild(op);
        }

    }
}

function pasetToColumn(index) {
    if (index > -1) {


        if (_hangers[plane_index]) {
            createHanger(index);
            updateHanger(index);
        }

        if (_top_shelves_parent[plane_index]) {
            createTopShelves(2, index);
            updateTopShelves(index);
        }

        if (_bot_shelf_parent[plane_index]) {
            createBotShelves(onHeightChanged(index), index);
            updateBotShelves(index);
        }
        if (_lockers[plane_index]) {
            createLocker(index);
            updateLocker(index);
            updateInternalDrawerSmall(index);
            updateBotShelves(index);
        }

        if (_smallIntDrawers[plane_index]) {
            createInternalDrawerSmall(index);
            updateInternalDrawerSmall(index);
            updateBotShelves(index);

        }
        if (_largeIntDrawers[plane_index]) {
            createInternalDrawerLarge(index);
            updateInternalDrawerLarge(index);
            updateBotShelves(index);
        }

    }

}

function chooseColumns_number() {

    if (wWidth > 2.5 && wWidth < 3.5) {
        substitubale = 0;
    } else if (wWidth > 3 && wWidth < 5) {
        substitubale = 1;
    } else if (wWidth > 3.5 && wWidth < 6.5) {
        substitubale = 2;
    } else if (wWidth > 6 && wWidth < 8) {
        substitubale = 3;
    } else if (wWidth > 7 && wWidth <= 9) {
        substitubale = 4;
    } else if (wWidth > 9 && wWidth < 11) {
        substitubale = 5;
    } else if (wWidth > 10 && wWidth <= 12) {
        substitubale = 6;
    }
    //Set Columns
    if (!isHingedDoor) {
        if (wWidth >= 3.5 && wWidth <= 6) {
            columns = 4;
        } else if (wWidth >= 6.5 && wWidth <= 9.5) {
            columns = 8;
        } else if (wWidth >= 10 && wWidth <= 12) {
            columns = 12
        } else {
            columns = 2;
        }
        customColumns = columns;

    } else {
        if (wWidth == 9.5) {
            columns = 10;
        } else {
            columns = Math.floor(wWidth);
        }

        customColumns = columns;
        while (columns_group.firstChild) {
            columns_group.removeChild(columns_group.firstChild);
        }



        for (var i = columns - 1; i > substitubale; i--) {
            var columns_div = document.createElement("div");
            columns_div.className = "form-check form-check-inline";

            var columns_radio = document.createElement("input");
            columns_radio.type = "radio";
            columns_radio.value = (i + 1);
            columns_radio.id = "columns_" + (i + 1);
            // columns_radio.setAttribute("onclick", "set_columns_number(" + (i + 1) + ")");
            columns_radio.className = "form-check-input columns-change  btn-check";
            columns_radio.name = "columnsOptions";

            var columns_label = document.createElement("label");
            columns_label.htmlFor = "columns_" + (i + 1);
            columns_label.className = "form-check-label btn btn-outline-secondary m-1";
            columns_label.innerHTML = i + 1;

            columns_div.appendChild(columns_radio);
            columns_div.appendChild(columns_label);
            columns_group.appendChild(columns_div);

        }
    }



    // columns_div.firstElementChild.setAttribute("checked", "true");


}


function set_columns_number(value) {

    customColumns = value;

}

function reset_adjacents_removed_columns() {

    removed = []
    adjacentParts = [];

}

function onHeightChanged(plane_index) {
    var row = 0;


    if (wHeight == 6) {
        if (!_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && _lockers[plane_index] && !_extDrawers[plane_index]) {
            row = 1;

        } else if (!_largeIntDrawers[plane_index] && _smallIntDrawers[plane_index] && !_lockers[plane_index] && !_extDrawers[plane_index]) {
            row = 1;
        } else {
            row = 0;
        }
    } else if (wHeight == 6.5) {

        if (_extDrawers[plane_index]) {
            if (_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && !_lockers[plane_index]) {
                row = 0;
            } else {
                row = 1;
            }


        } else if (!_extDrawers[plane_index]) {
            if (!_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && !_lockers[plane_index]) {
                row = 2;

            } else if (_largeIntDrawers[plane_index] && _smallIntDrawers[plane_index] && _lockers[plane_index]) {
                row = 0;

            } else {
                row = 1;
            }


        }

    } else if (wHeight == 7) {
        if (!_lockers[plane_index]) {
            if (!_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && !_extDrawers[plane_index]) {
                row = 3;
            } else if (_smallIntDrawers[plane_index] && !_largeIntDrawers[plane_index]) {
                if (!_extDrawers[plane_index]) {
                    row = 2;
                } else if (_extDrawers[plane_index]) {
                    row = 1;
                } else {
                    row = 0;
                }

            } else if (_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index]) {
                if (!_extDrawers[plane_index]) {
                    row = 2;
                } else if (_extDrawers[plane_index]) {
                    row = 1;
                }
            } else if (_smallIntDrawers[plane_index] && _largeIntDrawers[plane_index]) {
                if (!_extDrawers[plane_index]) {
                    row = 1;
                } else if (_extDrawers[plane_index]) {
                    row = 0;
                } else {
                    row = 0;
                }
            }

        } else {
            if (!_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && !_extDrawers[plane_index]) {
                row = 2;
            } else if (!_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && _extDrawers[plane_index]) {
                row = 1;
            } else if (_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && !_extDrawers[plane_index]) {
                row = 1;
            } else if (_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index] && _extDrawers[plane_index]) {
                row = 0;
            } else if (!_largeIntDrawers[plane_index] && _smallIntDrawers[plane_index] && !_extDrawers[plane_index]) {
                row = 1;
            } else if (!_largeIntDrawers[plane_index] && _smallIntDrawers[plane_index] && _extDrawers[plane_index]) {
                row = 0;
            } else {
                row = 0;
            }

        }
    } else(
        removeBotShelves(plane_index)
    )

    return row;

}

function columnsCombination() {
    if (removed.length > 0) {
        removed.forEach(e => {

            if (e == _columns[removed_index]) {
                removed_id.forEach(i => {



                    // _columns[i].position.x + offset / 2
                    var sizeToChange = offset * 2 - thickness / 12 * ftTom;
                    var posToChange;

                    posToChange = _columns[i].position.x + offset / 2;




                    //Interactive Plane
                    if (interactivePlanes[i]) {
                        var a = interactivePlanes[i];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        removeInteractivePlane(i + 1);

                    } else if (interactivePlanes[i + 1]) {
                        var a = interactivePlanes[i + 1];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        removeInteractivePlane(i);
                    }

                    //Large Internal Drawers
                    if (_largeIntDrawers[i]) {
                        var a = _largeIntDrawers[i];
                        var b = _largeIntDrawers_splitters[i];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        b.scale.setX(sizeToChange);
                        b.position.setX(a.position.x);

                    }

                    //Hangers
                    if (_hangers[i]) {
                        var a = _hangers[i];
                        a.scale.setY(sizeToChange);
                        a.position.setX(posToChange);
                        // removeHanger(i + 1);
                    }
                    // else if (_hangers[i + 1]) {
                    //     var a = _hangers[i + 1];
                    //     a.scale.setY(sizeToChange);
                    //     a.position.setX(posToChange);
                    //     removeHanger(i);
                    // }
                    //Top Shelves
                    if (_top_shelves_parent[i]) {
                        var a = _top_shelves_parent[i];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }

                        })
                        // removeTopShelves(i + 1);

                    }

                    if (_intDrawers_parent[i]) {
                        var a = _intDrawers_parent[i];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }
                        })
                    }
                    //  else if (_top_shelves_parent[i + 1]) {
                    //     var a = _top_shelves_parent[i + 1];
                    //     a.traverse(function (e) {
                    //         if (e instanceof THREE.Mesh) {
                    //             e.scale.setX(sizeToChange);
                    //             e.position.setX(posToChange);
                    //         }

                    //     })
                    //     removeTopShelves(i);
                    // }

                    //Bottom Shelves
                    if (_bot_shelf_parent[i]) {
                        var a = _bot_shelf_parent[i];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }

                        })
                        // removeBotShelves(i + 1);

                    }
                    // else if (_bot_shelf_parent[i + 1]) {
                    //     var a = _bot_shelf_parent[i + 1];
                    //     a.traverse(function (e) {
                    //         if (e instanceof THREE.Mesh) {
                    //             e.scale.setX(sizeToChange);
                    //             e.position.setX(posToChange);
                    //         }

                    //     })
                    //     removeBotShelves(i);
                    // }


                    //Horizontal Splitter
                    if (_m_splitters[i]) {
                        var a = _m_splitters[i];
                        
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        var b = _splitterEdges[i];
                        b.scale.copy(a.scale);
                        b.position.copy(a.position);
                        // removeHorizontalSplitter(i+1);
                        _splitterEdges[i+1].visible = false;
                        _m_splitters[i + 1].visible = false;
                       
                    } else if (_m_splitters[i + 1]) {
                        var a = _m_splitters[i];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);

                        var b = _splitterEdges[i];
                        b.scale.copy(a.scale);
                        b.position.copy(a.position);
                        
                        _splitterEdges[i+1].visible = false;
                        _m_splitters[i + 1].visible = false;
                        // removeHorizontalSplitter(i+1);
                    }

                    //External Drawers
                    if (_extDrawers[i]) {
                        var a = _extDrawers[i];
                        var b = _extDrawers_splitters[i];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        b.scale.setX(sizeToChange);
                        b.position.setX(posToChange);
                        removeExternalDrawer(i + 1);
                    } else if (_extDrawers[i + 1]) {
                        var a = _extDrawers[i + 1];
                        var b = _extDrawers_splitters[i + 1];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        b.scale.setX(sizeToChange);
                        b.position.setX(posToChange);
                        removeExternalDrawer(i);
                    }


                    if (_smallIntDrawers[i]) {
                        if (_lockers[i]) {

                            if (_smallIntDrawers[i + 1]) {
                                updateInternalDrawerSmall(i + 1);

                                var b = _smallIntDrawers[i + 1];
                                b.scale.setX(offset - thickness / 12 * ftTom);
                                var a = _smallIntDrawers[i];
                                a.scale.setX(sizeToChange);
                                a.position.setX(posToChange);
                                var c = _lockers[i];
                                var d = _locker_splitters[i];
                                c.scale.setX(offset - thickness / 12 * ftTom);
                                d.scale.setX(offset - thickness / 12 * ftTom);

                                // createMeshInbetweenLockerSmallDrawer(c,b);
                            } else {
                                createInternalDrawerSmall(i + 1);
                                updateInternalDrawerSmall(i + 1);

                                var b = _smallIntDrawers[i + 1];
                                b.scale.setX(offset - thickness / 12 * ftTom);
                                var c = _lockers[i];
                                var d = _locker_splitters[i];

                                c.scale.setX(offset - thickness / 12 * ftTom);
                                d.scale.setX(offset - thickness / 12 * ftTom);
                            }


                        } else if (_lockers[i + 1]) {

                            var a = _smallIntDrawers[i];
                            a.scale.setX(sizeToChange);
                            a.position.setX(posToChange);
                            removeLocker(i + 1);

                        } else {
                            var a = _smallIntDrawers[i];
                            a.scale.setX(sizeToChange);
                            a.position.setX(posToChange);
                            removeInternalDrawerSmall(i + 1);
                        }
                    } else if (_smallIntDrawers[i + 1]) {

                        if (_lockers[i + 1]) {

                            if (_smallIntDrawers[i + 1]) {

                                updateInternalDrawerSmall(i + 1)

                                var b = _smallIntDrawers[i + 1];
                                removeLocker(i + 1);
                                b.scale.setX(offset - thickness / 12 * ftTom);
                            }
                        } else {
                            var b = _smallIntDrawers[i + 1];
                            updateInternalDrawerSmall(i + 1)
                            b.scale.setX(offset - thickness / 12 * ftTom);
                        }

                        if (_lockers[i]) {
                            var b = _smallIntDrawers[i + 1];
                            b.scale.setX(offset - thickness / 12 * ftTom);
                            var a = _lockers[i];
                            var c = _locker_splitters[i]
                            a.scale.setX(offset - thickness / 12 * ftTom);
                            c.scale.setX(offset - thickness / 12 * ftTom);
                        } else {
                            createLocker(i);
                            updateLocker(i);
                            var a = _lockers[i];
                            var b = _locker_splitters[i]
                            a.scale.setX(offset - thickness / 12 * ftTom);
                            b.scale.setX(offset - thickness / 12 * ftTom);
                        }
                    } else {

                        if (_lockers[i]) {
                            createInternalDrawerSmall(i + 1);
                            updateInternalDrawerSmall(i + 1);
                            var b = _smallIntDrawers[i + 1];
                            b.scale.setX(offset - thickness / 12 * ftTom);

                            var c = _lockers[i];
                            var d = _locker_splitters[i];
                            c.scale.setX(offset - thickness / 6 * ftTom);
                            d.scale.setX(offset - thickness / 12 * ftTom);
                            //  createMeshInbetweenLockerSmallDrawer(c,b);
                        } else if (_lockers[i + 1]) {
                            removeLocker(i + 1);
                            createLocker(i);
                            updateLocker(i);
                            createInternalDrawerSmall(i + 1);
                            updateInternalDrawerSmall(i + 1);
                            var b = _smallIntDrawers[i + 1];
                            b.scale.setX(offset - thickness / 12 * ftTom);

                            var c = _lockers[i];
                            var d = _locker_splitters[i];
                            c.scale.setX(offset - thickness / 12 * ftTom);
                            d.scale.setX(offset - thickness / 12 * ftTom);
                        }
                    }


                })
            } else {
                // console.log("Not " + _columns[removed_index].name);
                // var sizeToChange = offset * 2 - thickness / 12 * ftTom;
                // var posToChange = _columns[removed_index + 1].position.x + offset / 2;
                // if (_largeIntDrawers[removed_index]) {
                //     var a = _largeIntDrawers[removed_index];
                //     var b = _largeIntDrawers_splitters[removed_index];
                //     a.scale.setX(sizeToChange);
                //     a.position.setX(posToChange);
                //     b.scale.setX(sizeToChange);
                //     b.position.setX(a.position.x);
                //     removeInternalDrawerLarge(removed_index + 1);
                // } else if (_largeIntDrawers[removed_index + 1]) {
                //     var a = _largeIntDrawers[removed_index + 1];

                //     var b = _largeIntDrawers_splitters[removed_index + 1];
                //     a.scale.setX(sizeToChange);
                //     a.position.setX(posToChange);
                //     b.scale.setX(sizeToChange);
                //     b.position.setX(a.position.x);

                //     removeInternalDrawerLarge(removed_index);
                // }

            }
        })

    }


}

function removeAllInterior() {
    removeLocker();
    removeInternalDrawerLarge();
    removeInternalDrawerSmall();
    removeExternalDrawer();
    removeTopShelves();
    removeBotShelves();
    removeHanger();
    removeInternalDrawers();
    // removeDoor();
    // removeSlideDoors();
    reset_adjacents_removed_columns();

}




function createHingedDoor(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);


    var door = new THREE.Mesh(g, _doorMaterial);
    door.name = "hinged_door_" + index;
    var _hDoors_group = new THREE.Group();
    _hDoors_group.add(door);
    _hDoors_group.name = "hinged_door_pivot_" + index;
    _hDoors_parent[index] = _hDoors_group;
    _hDoors_parent_group.name = "hinged_doors";
    _hDoors_parent_group.add(_hDoors_parent[index]);




    scene.add(_hDoors_parent_group);
}

function updateHingedDoorUpSize(index) {

    if (_hDoors_parent[index] instanceof THREE.Group) {
        var posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
        var scaleY = wTop.position.y - wTop.scale.y / 2 - wBottom.position.y - wBottom.scale.y / 2;
        if (_extDrawers_splitters.length > 0) {
            posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2 + ftTom / 2 + thickness / 24 * ftTom;
            scaleY = wTop.position.y - wTop.scale.y / 2 - wBottom.position.y - wBottom.scale.y / 2 - ftTom - thickness / 12 * ftTom;
        } else {
            posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
            scaleY = wTop.position.y - wTop.scale.y / 2 - wBottom.position.y - wBottom.scale.y / 2;
        }

        _hDoors_parent_group.position.set(offset + wLeft.position.x, _hDoors_parent_group.position.y, _hDoors_parent_group.position.z);
        if (index % 2 == 0) {

            for (var j = 0; j < _hDoors_parent[index].children.length; j++) {

                if (_hDoors_parent[index].children[j] instanceof THREE.Mesh) {
                    _hDoors_parent[index].children[j].scale.setY(scaleY);

                    _hDoors_parent[index].children[j].position.setY(posY);

                }

            }


        } else {
            for (var j = 0; j < _hDoors_parent[index].children.length; j++) {

                if (_hDoors_parent[index].children[j] instanceof THREE.Mesh) {
                    _hDoors_parent[index].children[j].scale.setY(scaleY, (thickness / 12) * ftTom);

                    _hDoors_parent[index].children[j].position.setY(posY);

                }

            }

        }
    }
}

function updateHingedDoor(index) {
    var posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
    var scaleY = wTop.position.y - wTop.scale.y / 2 - wBottom.position.y - wBottom.scale.y / 2;
    // _columns_group.position.x + _columns[index - 1].position.x + thickness / 24 * ftTom
    if (_hDoors_parent[index] instanceof THREE.Group) {

        _hDoors_parent_group.position.set(offset + wLeft.position.x, _hDoors_parent_group.position.y, _hDoors_parent_group.position.z);
        if (index % 2 == 0) {

            for (var j = 0; j < _hDoors_parent[index].children.length; j++) {

                if (_hDoors_parent[index].children[j] instanceof THREE.Mesh) {
                    _hDoors_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, scaleY, (thickness / 12) * ftTom);

                    _hDoors_parent[index].children[j].position.set(_hDoors_parent[index].children[j].scale.x / 2, posY, -(thickness / 24) * ftTom);

                }

            }
            if (index != customColumns - 1) {
                _hDoors_parent[index].position.set(_columns[index].position.x - offset + thickness / 24 * ftTom, _hDoors_parent[index].position.y, _hDoors_parent[index].position.z + wLeft.scale.z / 2);
                _hDoors_parent[index].rotation.set(0, -80 * THREE.Math.DEG2RAD, 0);
            } else {
                _hDoors_parent[index].position.set(_columns[index - 1].position.x + thickness / 24 * ftTom, _hDoors_parent[index].position.y, _hDoors_parent[index].position.z + wLeft.scale.z / 2);
                _hDoors_parent[index].rotation.set(0, -80 * THREE.Math.DEG2RAD, 0);
            }

        } else {
            for (var j = 0; j < _hDoors_parent[index].children.length; j++) {

                if (_hDoors_parent[index].children[j] instanceof THREE.Mesh) {
                    _hDoors_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, scaleY, (thickness / 12) * ftTom);

                    _hDoors_parent[index].children[j].position.set(_hDoors_parent[index].children[j].scale.x / 2, posY, (thickness / 24) * ftTom);
                    _hDoors_parent[index].children[j].material.color.set("#34deeb");
                }

            }
            _hDoors_parent[index].position.set(_columns[index - 1].position.x + offset - thickness / 24 * ftTom, _hDoors_parent[index].position.y, _hDoors_parent[index].position.z + wLeft.scale.z / 2);
            _hDoors_parent[index].rotation.set(0, -100 * THREE.Math.DEG2RAD, 0);
        }


    }


}

function updateHingedDoorOnColumnCombined() {




    if (_hDoors_parent[removed_index + 1] || _hDoors_parent[removed_index]) {
        _columns.forEach(e => {

            if (removed_index == 0) {

                for (var i = 0; i < removed_id.length; i++) {

                    for (var j = 0; j < _hDoors_parent[removed_id[i]].children.length; j++) {

                        _hDoors_parent[removed_id[i]].children[j].scale.setX(offset - thickness / 24 * ftTom);

                        _hDoors_parent[removed_id[i]].children[j].position.setX(_hDoors_parent[removed_id[i]].children[j].scale.x / 2);


                    }

                    for (var j = 0; j < _hDoors_parent[removed_id[i] + 1].children.length; j++) {

                        _hDoors_parent[removed_id[i] + 1].children[j].scale.setX(offset - thickness / 24 * ftTom);

                        _hDoors_parent[removed_id[i] + 1].children[j].position.setX(_hDoors_parent[removed_id[i] + 1].children[j].scale.x / 2);

                    }

                }
            } else {
                adjacentParts.forEach(a => {

                    if (e == a) {

                        for (var i = 0; i < removed_id.length; i++) {
                            if (removed_id[i] % 2 != 0) {

                                // if(_isDoorRight.includes(_hDoors_parent[removed_id[i]-1])){
                                //     _hDoors_parent[removed_id[i]-1].rotation.set(0, -80 * THREE.Math.DEG2RAD, 0)
                                // }

                                _hDoors_parent[removed_id[i]].position.setX(_columns[removed_id[i]].position.x + offset - thickness / 24 * ftTom);
                                _hDoors_parent[removed_id[i] + 1].position.setX(_columns[removed_id[i]].position.x - offset + thickness / 24 * ftTom);
                                if (!swappedDoors.includes(_hDoors_parent[removed_id[i]]) && !swappedDoors.includes(_hDoors_parent[removed_id[i] + 1])) {
                                    swappedDoors[i] = [_hDoors_parent[removed_id[i]], _hDoors_parent[removed_id[i] + 1]];
                                }



                                for (var j = 0; j < _hDoors_parent[removed_id[i]].children.length; j++) {

                                    _hDoors_parent[removed_id[i]].children[j].scale.setX(offset - thickness / 24 * ftTom);

                                    _hDoors_parent[removed_id[i]].children[j].position.setX(_hDoors_parent[removed_id[i]].children[j].scale.x / 2);
                                    _hDoors_parent[removed_id[i]].children[j].position.setZ((thickness / 24) * ftTom);


                                }

                                for (var j = 0; j < _hDoors_parent[removed_id[i] + 1].children.length; j++) {

                                    _hDoors_parent[removed_id[i] + 1].children[j].scale.setX(offset - thickness / 24 * ftTom);

                                    _hDoors_parent[removed_id[i] + 1].children[j].position.setX(_hDoors_parent[removed_id[i] + 1].children[j].scale.x / 2);
                                    _hDoors_parent[removed_id[i] + 1].children[j].position.setZ(-(thickness / 24) * ftTom);

                                }
                            }
                        }

                    } else {

                        for (var i = 0; i < removed_id.length; i++) {

                            for (var j = 0; j < _hDoors_parent[removed_id[i]].children.length; j++) {

                                _hDoors_parent[removed_id[i]].children[j].scale.setX(offset - thickness / 24 * ftTom);

                                _hDoors_parent[removed_id[i]].children[j].position.setX(_hDoors_parent[removed_id[i]].children[j].scale.x / 2);


                            }
                            if (_hDoors_parent[removed_id[i] + 1]) {
                                for (var j = 0; j < _hDoors_parent[removed_id[i] + 1].children.length; j++) {

                                    _hDoors_parent[removed_id[i] + 1].children[j].scale.setX(offset - thickness / 24 * ftTom);

                                    _hDoors_parent[removed_id[i] + 1].children[j].position.setX(_hDoors_parent[removed_id[i] + 1].children[j].scale.x / 2);

                                }
                            }


                        }

                    }

                })
            }

        })


    }



}

function setflipDoor() {


    for (var i = 0; i < _hDoors_parent.length; i++) {

        if (_hDoors_parent[i] instanceof THREE.Group) {
            if (i % 2 == 0) {
                if (i == _hDoors_parent.length - 1) {

                    if (_hDoors_parent.length % 2 != 0) {
                        // console.log(_hDoors_parent[i].name + " and " + _hDoors_parent[i-1].name+"= " ,((_hDoors_parent[i].position.x - _hDoors_parent[i - 1].position.x) / 2).toFixed(2),", offset = ", offset.toFixed(2) )
                        if (((_hDoors_parent[i].position.x - _hDoors_parent[i - 1].position.x) / 2).toFixed(2) > 0) {

                            if (_hDoors_parent[i] instanceof THREE.Group) {
                                if (!_flippableDoor.includes(_hDoors_parent[i])) {
                                    _flippableDoor.push(_hDoors_parent[i]);
                                }

                                _hDoors_parent[i].traverse(function (e) {
                                    if (e instanceof THREE.Group) {
                                        e.traverse(function (child) {
                                            if (child instanceof THREE.Mesh) {
                                                // child.material.color.set("#ff0000");
                                            }
                                        })
                                    }
                                })
                            }
                        } else {
                            if (_hDoors_parent[i] instanceof THREE.Group) {

                                if (_flippableDoor.includes(_hDoors_parent[i])) {
                                    _flippableDoor.splice(_flippableDoor.indexOf(_hDoors_parent[i]), 1);
                                }

                                _hDoors_parent[i].traverse(function (e) {
                                    if (e instanceof THREE.Group) {

                                        e.traverse(function (child) {

                                            if (child instanceof THREE.Mesh) {

                                                // child.material.color.set("#fafa22");
                                            }
                                        })
                                    }
                                })
                            }
                        }


                    }
                } else {
                    if (_hDoors_parent[i + 2]) {

                        if (((_hDoors_parent[i + 2].position.x - _hDoors_parent[i].position.x) / 2).toFixed(2) < offset.toFixed(2)) {


                            if (_hDoors_parent[i] instanceof THREE.Group) {
                                if (!_flippableDoor.includes(_hDoors_parent[i])) {
                                    _flippableDoor.push(_hDoors_parent[i]);
                                }

                                _hDoors_parent[i].traverse(function (e) {
                                    if (e instanceof THREE.Group) {
                                        e.traverse(function (child) {

                                            if (child instanceof THREE.Mesh) {
                                                if (i == _hDoors_parent.length - 1) {
                                                    // child.material.color.set("#fafa22");
                                                } else {
                                                    // child.material.color.set("#49eb34");
                                                }

                                            }
                                        })
                                    }
                                })
                            }


                        } else {

                            if (_hDoors_parent[i] instanceof THREE.Group) {
                                if (_flippableDoor.includes(_hDoors_parent[i])) {
                                    _flippableDoor.splice(_flippableDoor.indexOf(_hDoors_parent[i]), 1);
                                }
                                _hDoors_parent[i].traverse(function (e) {
                                    if (e instanceof THREE.Group) {

                                        e.traverse(function (child) {

                                            if (child instanceof THREE.Mesh) {

                                                // child.material.color.set("#fafa22");
                                            }
                                        })
                                    }
                                })
                            }
                        }

                    }
                }
            }

            //if Doors are odd numbers
            else {
                if (_hDoors_parent[i + 2]) {
                    if (((_hDoors_parent[i + 2].position.x - _hDoors_parent[i].position.x) / 2).toFixed(2) < offset.toFixed(2)) {
                        if (_hDoors_parent[i + 2] instanceof THREE.Group) {

                            if (!_flippableDoor.includes(_hDoors_parent[i + 2])) {
                                _flippableDoor.push(_hDoors_parent[i + 2]);
                            }
                            _hDoors_parent[i + 2].traverse(function (e) {
                                if (e instanceof THREE.Group) {

                                    e.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {

                                            //  child.material.color.set("#49eb34");
                                        }
                                    })
                                }
                            })
                        }
                    } else {
                        if (((_hDoors_parent[i + 2].position.x - _hDoors_parent[i].position.x) / 2).toFixed(2) < offset.toFixed(2)) {
                            if (_hDoors_parent[i] instanceof THREE.Group) {

                                if (!_flippableDoor.includes(_hDoors_parent[i])) {
                                    _flippableDoor.push(_hDoors_parent[i]);
                                }
                                _hDoors_parent[i].traverse(function (e) {
                                    if (e instanceof THREE.Group) {

                                        e.traverse(function (child) {

                                            if (child instanceof THREE.Mesh) {

                                                //  child.material.color.set("#49eb34");
                                            }
                                        })
                                    }
                                })

                            }
                        } else {
                            if (_hDoors_parent[i + 2] instanceof THREE.Group) {

                                if (_flippableDoor.includes(_hDoors_parent[i + 2])) {
                                    _flippableDoor.splice(_flippableDoor.indexOf(_hDoors_parent[i + 2]), 1);
                                }
                                _hDoors_parent[i + 2].traverse(function (e) {

                                    if (e instanceof THREE.Group) {

                                        e.traverse(function (child) {
                                            if (child instanceof THREE.Mesh) {

                                                // child.material.color.set("#34deeb");
                                            }
                                        })
                                    }
                                })

                            }
                        }
                    }
                }
            }



        }
        if (_flippableDoor.includes(_hDoors_parent[i])) {

            flipVerticalSprite[_hDoors_parent.indexOf(_hDoors_parent[i])].visible = true;
        } else {
            flipVerticalSprite[_hDoors_parent.indexOf(_hDoors_parent[i])].visible = false;
        }
    }



}

function setflipDoor_Select() {
    while (fp.firstChild) {
        fp.removeChild(fp.firstChild);
    }

    if (_flippableDoor.length > 0) {

        for (var i = 0; i <= _flippableDoor.length; i++) {


            var op = document.createElement("option");


            if (i != 0) {
                op.setAttribute("value", _hDoors_parent.indexOf(_flippableDoor[i - 1]));

                op.innerHTML = "Hinged Door " + (_hDoors_parent.indexOf(_flippableDoor[i - 1]) + 1);

                fp.appendChild(op);
            } else {

                op.innerHTML = "Select Door To Flip";
                fp.appendChild(op);
            }





        }
    }


}

function _flipDoor(index) {

    _flippableDoor.forEach(f => {
        _hDoors_parent.forEach(e => {
            if (e == f) {
                if (e instanceof THREE.Group) {
                    if (e == _hDoors_parent[index]) {


                        if (index % 2 == 0) {

                            if (!_isDoorRight.includes(_hDoors_parent[index])) {

                                if (index == _hDoors_parent.length - 1) {
                                    e.position.setX(_columns[index - 1].position.x + offset - thickness / 24 * ftTom);


                                    e.rotation.set(0, -100 * THREE.Math.DEG2RAD, 0);
                                    e.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {

                                            child.position.setZ((thickness / 24) * ftTom);

                                        }


                                    })
                                } else {
                                    e.position.setX(_columns[index].position.x - thickness / 24 * ftTom);
                                    e.rotation.set(0, -100 * THREE.Math.DEG2RAD, 0);
                                    e.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {

                                            child.position.setZ((thickness / 24) * ftTom);

                                        }
                                    })
                                }

                                _isDoorRight.push(_hDoors_parent[index]);

                            } else {
                                if (index == _hDoors_parent.length - 1) {
                                    e.position.setX(_columns[index - 1].position.x + thickness / 24 * ftTom);


                                    e.rotation.set(0, -80 * THREE.Math.DEG2RAD, 0);
                                    e.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {

                                            child.position.setZ(-(thickness / 24) * ftTom);

                                        }


                                    })
                                } else {
                                    e.position.setX(_columns[index].position.x - offset + thickness / 24 * ftTom);
                                    e.rotation.set(0, -80 * THREE.Math.DEG2RAD, 0);
                                    e.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {

                                            child.position.setZ(-(thickness / 24) * ftTom);

                                        }
                                    })
                                }
                                _isDoorRight.splice(_hDoors_parent[index], 1);
                            }



                        } else {

                            if (!_isDoorLeft.includes(_hDoors_parent[index])) {
                                e.position.setX(_columns[index - 1].position.x + thickness / 24 * ftTom);
                                e.rotation.set(0, -80 * THREE.Math.DEG2RAD, 0);
                                e.traverse(function (child) {
                                    if (child instanceof THREE.Mesh) {

                                        child.position.setZ(-(thickness / 24) * ftTom);

                                    }
                                })
                                _isDoorLeft.push(_hDoors_parent[index]);
                            } else {
                                e.position.setX(_columns[index - 1].position.x + offset - thickness / 24 * ftTom);
                                e.rotation.set(0, -100 * THREE.Math.DEG2RAD, 0);
                                e.traverse(function (child) {
                                    if (child instanceof THREE.Mesh) {

                                        child.position.setZ((thickness / 24) * ftTom);

                                    }
                                })
                                _isDoorLeft.splice(_hDoors_parent[index], 1);
                            }

                        }
                    }
                }
            }
        })
    })
    // _hDoors_parent[index].children[j].scale.setX(offset - thickness / 24 * ftTom);

    // _hDoors_parent[removed_id[i]].children[j].position.setX(_hDoors_parent[removed_id[i]].children[j].scale.x / 2);


}


function createFlipDoorSprite(index) {

    var material = new THREE.SpriteMaterial({
        map: onNormalFlipSprite,
        transparent: true,
        opacity: 0.5
    });
    var sprite = new THREE.Sprite(material);
    sprite.name = "flipDoor_" + index;
    sprite.receiveShadow = false;
    sprite.castShadow = false;
    flipVerticalSprite[index] = sprite;
    flipVerticalSprite[index].scale.set(0.15, 0.15);
    flipVertical_group.add(flipVerticalSprite[index]);
    scene.add(flipVertical_group);

}

function updateFlipDoorSprite(index) {


    flipVerticalSprite[index].scale.set(0.15, 0.15);
    flipVerticalSprite[index].position.set(index * offset, wTop.position.y + 0.2, _hDoors_parent[index].position.z + 0.025);

    flipVertical_group.position.set(offset / 2 + wLeft.position.x, flipVertical_group.position.y, flipVertical_group.position.z);
    flipVerticalSprite[index].visible = false;

}

function removeFlipDoorSprite(index) {

    if (index) {
        flipVertical_group.forEach(e => {
            if (flipVerticalSprite[index] instanceof THREE.Sprite && flipVerticalSprite[index] == e) {
                if (flipVertical_group instanceof THREE.Group) {
                    flipVertical_group.remove(e);
                }
            }
        })
        flipVertical_group[index] = null;
    } else {

        flipVerticalSprite.forEach(e => {
            if (e instanceof THREE.Sprite) {
                if (flipVertical_group instanceof THREE.Group) {
                    flipVertical_group.remove(e);

                }
            }
        })
        flipVerticalSprite = [];

    }
}

function removeDoor(index) {

    if (index) {



        if (_hDoors_parent[index] instanceof THREE.Group) {
            _hDoors_parent_group.remove(_hDoors_parent[index]);

        }



    } else {

        _hDoors_parent.forEach(e => {
            if (e instanceof THREE.Group) {

                _hDoors_parent_group.remove(e);

            }

        })

        _hDoors_parent = [];


    }
    _flippableDoor = [];
    _isDoorLeft = [];
    _isDoorRight = [];
    $("#addHingedDoor").removeClass("btn-outline-danger");
    $("#addHingedDoor").addClass("btn-outline-dark");
    $("#addHingedDoor").html("Add Door");
    removeFlipDoorSprite(index);
}

function loftDoorAction(index) {
    if (_loftDoors_parent) {

        if (isLoftOpened) {


            for (var i = 0; i < customColumns; i++) {


                if (_loftDoors_parent[i] instanceof THREE.Group) {


                    if (i % 2 == 0) {

                        if (_loftDoors_parent[i].rotation.y > -80 * THREE.Math.DEG2RAD) {
                            _loftDoors_parent[i].rotation.y = -80 * THREE.Math.DEG2RAD;
                        }

                    } else {



                        if (_loftDoors_parent[i].rotation.y < -100 * THREE.Math.DEG2RAD) {
                            _loftDoors_parent[i].rotation.y = -100 * THREE.Math.DEG2RAD;
                        }



                    }
                }

            }

        } else {

            for (var i = 0; i < customColumns; i++) {


                if (_loftDoors_parent[i] instanceof THREE.Group) {

                    if (i % 2 == 0) {

                        if (_loftDoors_parent[i].rotation.y < 0 * THREE.Math.DEG2RAD) {
                            _loftDoors_parent[i].rotation.y = 0 * THREE.Math.DEG2RAD;
                        }



                    } else {

                        if (_loftDoors_parent[i].rotation.y > -180 * THREE.Math.DEG2RAD) {
                            _loftDoors_parent[i].rotation.y = -180 * THREE.Math.DEG2RAD;
                        }

                    }
                }

            }
        }
    }
}

function doorAction(index) {
    if (_hDoors_parent) {

        if (isDoorOpened) {


            for (var i = 0; i < customColumns; i++) {


                if (_hDoors_parent[i] instanceof THREE.Group) {


                    if (i % 2 == 0) {
                        if (_isDoorRight.includes(_hDoors_parent[i])) {
                            if (_hDoors_parent[i].rotation.y < -100 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = -100 * THREE.Math.DEG2RAD;
                            }
                        } else {
                            if (_hDoors_parent[i].rotation.y > -80 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = -80 * THREE.Math.DEG2RAD;
                            }
                        }

                    } else {

                        if (_isDoorLeft.includes(_hDoors_parent[i])) {

                            if (_hDoors_parent[i].rotation.y > -80 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = -80 * THREE.Math.DEG2RAD;
                            }
                        } else {
                            if (_hDoors_parent[i].rotation.y < -100 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = -100 * THREE.Math.DEG2RAD;
                            }
                        }


                    }
                }

            }

        } else {

            for (var i = 0; i < customColumns; i++) {


                if (_hDoors_parent[i] instanceof THREE.Group) {

                    if (i % 2 == 0) {
                        if (_isDoorRight.includes(_hDoors_parent[i])) {
                            if (_hDoors_parent[i].rotation.y > -180 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = -180 * THREE.Math.DEG2RAD;
                            }
                        } else {
                            if (_hDoors_parent[i].rotation.y < 0 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = 0 * THREE.Math.DEG2RAD;
                            }
                        }


                    } else {
                        if (_isDoorLeft.includes(_hDoors_parent[i])) {
                            if (_hDoors_parent[i].rotation.y < 0 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = 0 * THREE.Math.DEG2RAD;
                            }
                        } else {
                            if (_hDoors_parent[i].rotation.y > -180 * THREE.Math.DEG2RAD) {
                                _hDoors_parent[i].rotation.y = -180 * THREE.Math.DEG2RAD;
                            }
                        }
                        // if (_hDoors_parent[i].rotation.y <=0) {
                        //     _hDoors_parent[i].rotateY(delta * -100 * THREE.MathUtils.DEG2RAD);


                        // }
                    }
                }

            }
        }
    }

}


function paintWardrobe() {
    scene.traverse(function (child) {
        if (child instanceof(THREE.Mesh)) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })

    // var x = wWidth * ftTom;
    // var y = wHeight * ftTom;
    // wood_albedo.repeat.set(x, y);
    // wood_roughness.repeat.set(x, y);
    // wood_normal.repeat.set(x, y);


    // _lockers.forEach(e => {
    //     e.material.color.set("#dadada");
    // })
    // _locker_splitters.forEach(e => {
    //     e.material.color.set("#0d0d0d");
    // })


}

function createColumnSprite(index) {
    var tex = new THREE.TextureLoader().load("./assets/icons8-minus-100" + ".png");
    var material = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.5,
    });
    var sprite = new THREE.Sprite(material);
    sprite.name = "removeColumns" + index;
    sprite.receiveShadow = false;
    sprite.castShadow = false;
    deleteSprites[index] = sprite;
    deleteSprites[index].scale.set(0.15, 0.15);
    deleteSprites_group.add(deleteSprites[index]);
    scene.add(deleteSprites_group);

}

function updateColumnSprite(index) {
    if (_columns.length > 0) {
        if (deleteSprites.includes(deleteSprites[index])) {
            deleteSprites[index].scale.set(0.15, 0.15);
            deleteSprites[index].position.set(index * offset, 0);

            deleteSprites_group.position.set(offset + wLeft.position.x, wBottom.position.y + _columns[0].scale.y / 2, wDepth * ftTom + offset);
            if (!isHingedDoor) {
                if (index % 2 != 0) {
                    deleteSprites[index].visible = false;
                } else {
                    deleteSprites[index].visible = true;
                }

            } else {
                deleteSprites[index].visible = true;
            }
        }
    }




}


function removeColumnsSprite(index) {

    if (index) {
        deleteSprites.forEach(e => {
            if (deleteSprites[index] instanceof THREE.Sprite && deleteSprites[index] == e) {
                if (deleteSprites_group instanceof THREE.Group) {
                    deleteSprites_group.remove(e);
                }
            }
        })
        deleteSprites[index] = null;
    } else {

        deleteSprites.forEach(e => {
            if (e instanceof THREE.Sprite) {
                if (deleteSprites_group instanceof THREE.Group) {
                    deleteSprites_group.remove(e);

                }
            }
        })
        deleteSprites = [];

    }
}

renderOptionInput();

function renderOptionInput() {
    $("input:radio[name = 'renderOptions']").change(function () {

        renderOptionsValue = $(this).val();
    })
}

function initMaterial() {
    // wood_albedo = texLoader.load("./textures/Wood_ZebranoVeneer_512_albedo.jpg");
    // wood_normal = texLoader.load("./textures/Wood_ZebranoVeneer_512_normal.jpg");
    // wood_roughness = texLoader.load("./textures/Wood_ZebranoVeneer_512_roughness.jpg");
    // wood_albedo.wrapS = THREE.RepeatWrapping;
    // wood_albedo.wrapT = THREE.RepeatWrapping;
    // wood_normal.wrapS = THREE.RepeatWrapping;
    // wood_normal.wrapT = THREE.RepeatWrapping;
    // wood_roughness.wrapS = THREE.RepeatWrapping;
    // wood_roughness.wrapT = THREE.RepeatWrapping;

    var hdr = new THREE.RGBELoader()
        .setPath('./hdri/')
        .load('photo_studio_loft_hall_1k.hdr', function (texture) {

            var envMap = pmremGenerator.fromEquirectangular(texture).texture;
            texture.mapping = THREE.EquirectangularReflectionMapping;

            // scene.background = new THREE.Color(0xefefef);
            // scene.environment = envMap;


            texture.dispose();
            pmremGenerator.dispose();
            return envMap;
        })

    _wardrobeMaterial = new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.8,
        name: "wm_wardrobe",

    });
    _railMaterial = new THREE.MeshStandardMaterial({
        name: "wm_door_rail",
        color: 0xfdfdfd,
        roughness: 0.2,
        metalness: 0.8,
        envMap: hdr,
        map: new THREE.TextureLoader().load("./Textures/metal.jpg")
    });
    _splitterMaterial = new THREE.MeshStandardMaterial({
        color: 0x22ffaa,
        roughness: 0.8,
        name: "wm_splitter"
    });
    _lockerMaterial = new THREE.MeshStandardMaterial({
        color: 0xddffdd,
        roughness: 0.8,
        name: "wm_locker",
        map: new THREE.TextureLoader().load("./Textures/whiteGrad2.jpg")
    });
    _doorMaterial = new THREE.MeshStandardMaterial({
        color: 0xfafa22,
        roughness: 0.7,
        name: "wm_door",
        transparent: false,
        opacity: 1,
        map: new THREE.TextureLoader().load("./Textures/whiteGrad.jpg"),
    });
    _hangerMaterial = new THREE.MeshStandardMaterial({
        color: 0xbfbfbf,
        name: "wm_hanger",
        roughness: 0.5,
        metalness: 0.8,
        envMap: hdr
    });
    _shelfMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaaaee,
        roughness: 0.8,
        name: "wm_shelf"
    });
    _columnsMaterial = new THREE.MeshStandardMaterial({
        color: 0xff55dd,
        roughness: 0.8,
        name: "wm_column",
        map: new THREE.TextureLoader().load("./Textures/whiteGrad4.jpg"),
    });
    _extDrawerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7f50,
        roughness: 0.8,
        name: "wm_extDrawer",
        map: new THREE.TextureLoader().load("./Textures/whiteGrad3.jpg"),
    });
    _intSmallMaterial = new THREE.MeshStandardMaterial({
        color: 0xadaffa,
        roughness: 0.8,
        name: "wm_intSmallDrawer",
        map: new THREE.TextureLoader().load("./Textures/whiteGrad.jpg"),

    });
    _intLargeMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa7f50,
        roughness: 0.8,
        name: "wm_intLargeDrawer",
        map: new THREE.TextureLoader().load("./Textures/whiteGrad4.jpg"),
    });

    _mirrorMaterials = [new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.7,
        name: "wm_door_0",
        transparent: true,
        opacity: 1
    }), new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.7,
        name: "wm_door_1",
        transparent: true,
        opacity: 1
    }), new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.7,
        name: "wm_door_2",
        transparent: true,
        opacity: 1
    }), new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.7,
        name: "wm_door_3",
        transparent: true,
        opacity: 1
    }), new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.7,
        name: "wm_door_4",
        transparent: true,
        opacity: 1
    }), new THREE.MeshStandardMaterial({
        name: "wm_door_mirror",

        roughness: 0,
        metalness: 0.5,
        envMap: hdr

    }), ]
    _flipMirrorMaterials = [new THREE.MeshStandardMaterial({
            color: 0xdfdfdf,
            roughness: 0.7,
            name: "wm_door_0",
            transparent: true,
            opacity: 1
        }), new THREE.MeshStandardMaterial({
            color: 0xdfdfdf,
            roughness: 0.7,
            name: "wm_door_1",
            transparent: true,
            opacity: 1
        }), new THREE.MeshStandardMaterial({
            color: 0xdfdfdf,
            roughness: 0.7,
            name: "wm_door_2",
            transparent: true,
            opacity: 1
        }), new THREE.MeshStandardMaterial({
            color: 0xdfdfdf,
            roughness: 0.7,
            name: "wm_door_3",
            transparent: true,
            opacity: 1
        }),
        new THREE.MeshStandardMaterial({
            name: "wm_door_mirror",

            roughness: 0,
            metalness: 0.5,
            envMap: hdr

        }), new THREE.MeshStandardMaterial({
            color: 0xdfdfdf,
            roughness: 0.7,
            name: "wm_door_4",
            transparent: true,
            opacity: 1
        }),
    ]
}

function renderOption() {
    var defaultColor = "#d4d4d4";
    var defaultColor2 = "#d9d9d9";
    var defaultColor3 = "#d9d9d9";
    var debug_extDrawerColor = "#ff7f50";
    var debug_intSmallColor = "#adaffa";
    var debug_intLargeColor = "#aa7f50";
    var debug_splitterColor = "#22ffaa";
    var debug_topShelfColor = "#faaaee";
    var debug_botShelfColor = "#faaaee";
    var debug_columns_color = "#ff55dd";
    var debug_locker_color = "#ddffdd";
    var debug_door_color = "#fafa22"
    
    if (renderOptionsValue == 0) {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.wireframe = false;

            }
        })

        _hDoors_parent.forEach(e => {
            if (e instanceof THREE.Group) {
                e.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        // child.material.color.set(defaultColor)
                    }
                })
            }
        })
        _wardrobeMaterial.color.set(defaultColor);
        _extDrawerMaterial.color.set(defaultColor);
        _splitterMaterial.color.set(defaultColor);
        _doorMaterial.color.set(defaultColor);
        _intLargeMaterial.color.set(defaultColor);
        _intSmallMaterial.color.set(defaultColor3);
        _lockerMaterial.color.set(defaultColor);
        _columnsMaterial.color.set(defaultColor2);
        _shelfMaterial.color.set(defaultColor);

        // ssaoPass.output = THREE.SSAOPass.OUTPUT.Default;
    } else if (renderOptionsValue == 1) {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.material.wireframe = false;
            }
        })

        _wardrobeMaterial.color.set(defaultColor);
        _extDrawerMaterial.color.set(debug_extDrawerColor);
        _splitterMaterial.color.set(debug_splitterColor);
        //_doorMaterial.color.set(debug_door_color);
        _intLargeMaterial.color.set(debug_intLargeColor);
        _intSmallMaterial.color.set(debug_intSmallColor);
        _lockerMaterial.color.set(debug_locker_color);
        _columnsMaterial.color.set(debug_columns_color);
        _shelfMaterial.color.set(debug_botShelfColor);
        ssaoPass.output = THREE.SSAOPass.OUTPUT.Beauty;
    } 
    
    // else if (renderOptionsValue == 2) {
    //     var mat = new THREE.LineBasicMaterial({
    //         color: 0xffffff,
    //         linewidth: 2
    //     });

    //     scene.traverse(function (child) {
    //         if (child instanceof THREE.Mesh) {

    //             if (child.visible) {





    //                 // child.castShadow = false;
    //                 // child.receiveShadow = false;
    //                 // child.visible = true;
    //                 // child.material.wireframe = true;
    //                 // child.material.wireframeLinejoin = "round";
    //                 // child.material.wireframeLinecap = "square";
    //             }



    //         }
    //     })
    // }



}



function removeSingleInterior(index) {
    if (!_largeIntDrawers[index] instanceof THREE.Mesh) {

    }
}

function createShadowCatcher() {
    var geometry = new THREE.PlaneGeometry(100, 5);
    var material = new THREE.ShadowMaterial();
    material.opacity = 0.05;

    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = -90 * THREE.Math.DEG2RAD;
    scene.add(mesh);
}

function updateColumnsDoor() {
    if (isCreated) {
        removeDoor();
        removeSlideDoors();
        removeFlipDoorSprite();
        removeColumnsEdges();
        removeSplitterEdges();
        removeColumnsArrow();
        removeUpperArrows();
        removeLowerArrows();
        removeColumns();

        removeColumnsBottom();
        removeColumnsSprite();
        removeHorizontalSplitter();
        removeInteractivePlane();

        if (isLoft) {

            removeLoftDoors();
            removeLoftColumns()


        }


        updateColumns();
        updateColumnSprite();
        deleteSprites_group.visible = true;
        flipVertical_group.visible = true;
        isCreated = false;
    }
}

function createColumns_Doors(bool) {

    updateColumns();
    deleteSprites_group.visible = true;

    flipVertical_group.visible = true;
    updateInteractivePlane();
    interactivePlane_group.visible = false;



}


function createDoorRailMesh(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);

    var _rBottom = new THREE.Mesh(g, _railMaterial);
    var _rLeft = new THREE.Mesh(g, _railMaterial);
    var _rRight = new THREE.Mesh(g, _railMaterial);
    var _rMiddle = new THREE.Mesh(g, _railMaterial)
    var _rail = new THREE.Group();
    _rBottom.name = "_rBottom";
    _rLeft.name = "_rLeft";
    _rRight.name = "_rRight";
    _rMiddle.name = "_rMiddle";



    _rBottom.scale.set(ftTom * 1.35 / 12, ftTom * 0.05 / 12, 1);
    _rLeft.scale.set(ftTom * 0.03125 / 12, ftTom * 0.875 / 24 - _rBottom.scale.y, 1);
    _rRight.scale.set(ftTom * 0.03125 / 12, ftTom * 0.875 / 24 - _rBottom.scale.y, 1);
    _rMiddle.scale.set(ftTom * 0.03125 / 12, ftTom * 0.875 / 24 - _rBottom.scale.y, 1);


    _rMiddle.position.setX(_rBottom.position.x / 2);
    _rLeft.position.setX(_rBottom.scale.x / 2 - _rLeft.scale.x / 2);
    _rRight.position.setX(-_rBottom.scale.x / 2 + _rRight.scale.x / 2);

    _rLeft.position.setY(_rBottom.position.y + _rMiddle.scale.y / 2 + _rBottom.scale.y / 2);
    _rRight.position.setY(_rBottom.position.y + _rMiddle.scale.y / 2 + _rBottom.scale.y / 2);
    _rMiddle.position.setY(_rBottom.position.y + _rMiddle.scale.y / 2 + _rBottom.scale.y / 2);

    _rail.add(_rBottom);
    _rail.add(_rLeft);
    _rail.add(_rRight);
    _rail.add(_rMiddle);
    _rail.name = "_rail_" + index;
    _rail.position.setY(-_rBottom.scale.y / 2)
    // console.log((_rLeft.position.x-_rLeft.scale.x/2-_rMiddle.position.x-_rMiddle.scale.x/2 )/ftTom * 12)
    return _rail;

}


function createDoorRail(index) {

    var _doorRails_group = new THREE.Group();

    for (var i = 0; i < 4; i++) {
        _doorRails_parent[i] = createDoorRailMesh(i);
        _doorRails_group.add(_doorRails_parent[i]);

    }

    _doorRails_group.name = "slide_rail_" + index;


    _doorRails_parent_group.push(_doorRails_group);
    _doorRailParent.name = "slide_rails";
    _doorRailParent.add(_doorRails_parent_group[index]);
    scene.add(_doorRailParent);


    _doorRailParent.position.set(offset + wLeft.position.x, _doorRailParent.position.y, _doorRailParent.position.z)

}

function updateDoorRailUp() {
    var posZ = wBottom.position.z + wBottom.scale.z / 2 + 1.35 / 24 * ftTom;
    var scaleZ = wTopLayer.position.y - wTopLayer.scale.y / 2 - wBottomLayer.position.y + wBottomLayer.scale.y / 2 - thickness / 24 * ftTom;
    var posY = wBottomLayer.scale.y / 2 + wBottomLayer.position.y + ftTom * 0.05 / 24;
    var posY_LR = wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y;

    if (_extDrawers.length > 0) {

        scaleZ = wTopLayer.position.y - wTopLayer.scale.y / 2 - wBottomLayer.position.y + wBottomLayer.scale.y / 2 - thickness / 24 * ftTom - ftTom - thickness / 12 * ftTom - thickness / 24 * ftTom;
        posY_LR = wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y + ftTom / 2 + thickness / 12 * ftTom - thickness / 48 * ftTom

        posY = wBottomLayer.scale.y / 2 + wBottomLayer.position.y + ftTom * 0.05 / 24 + ftTom + thickness / 24 * ftTom + thickness / 24 * ftTom;

    } else {
        posY = wBottomLayer.scale.y / 2 + wBottomLayer.position.y + ftTom * 0.05 / 24;
        scaleZ = wTopLayer.position.y - wTopLayer.scale.y / 2 - wBottomLayer.position.y + wBottomLayer.scale.y / 2 - thickness / 24 * ftTom;

        posY_LR = wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y;

    }
    // position + ftTom / 2 + thickness / 24 * ftTom;
    // scale - ftTom - thickness / 12 * ftTom;
    if (_doorRailParent instanceof THREE.Group) {

        for (var i = 0; i < _doorRailParent.children.length; i++) {

            if (_doorRails_parent_group[i] instanceof THREE.Group) {

                if (i == 0) {
                    _doorRails_parent_group[i].position.set(_columns[1].position.x, _doorRailParent.position.y, _doorRailParent.position.z)
                } else if (i == 1) {
                    _doorRails_parent_group[i].position.set(_columns[5].position.x, _doorRailParent.position.y, _doorRailParent.position.z)
                } else {
                    _doorRails_parent_group[i].position.set(_columns[9].position.x, _doorRailParent.position.y, _doorRailParent.position.z)
                }



                for (var j = 0; j < _doorRails_parent_group[i].children.length; j++) {
                    if (_doorRails_parent_group[i].children[j] instanceof THREE.Group) {


                        var rail = _doorRails_parent_group[i].children[j];
                        if (j == 0) {



                            rail.position.set(0, wTopLayer.position.y - wTopLayer.scale.y / 2 - ftTom * 0.05 / 24, posZ);


                        }
                        //Bottom
                        else if (j == _doorRails_parent_group[i].children.length - 1) {

                            rail.scale.setZ((_columns[0].position.x - _columns[2].position.x) - 2 * offset + thickness / 12 * ftTom)
                            rail.position.set(0, posY, posZ);


                        }
                        //Left
                        else if (j == 1) {

                            rail.scale.setZ(scaleZ)


                            rail.position.setY(posY_LR);





                        }
                        //Right
                        else {

                            rail.scale.setZ(scaleZ)

                            rail.position.setY(posY_LR);




                        }


                    }

                }
            }

        }
    }
}

function updateDoorRail() {

    var posZ = wBottom.position.z + wBottom.scale.z / 2 + 1.35 / 24 * ftTom;

    if (_doorRailParent instanceof THREE.Group) {

        for (var i = 0; i < _doorRailParent.children.length; i++) {

            if (_doorRails_parent_group[i] instanceof THREE.Group) {

                if (i == 0) {
                    _doorRails_parent_group[i].position.set(_columns[1].position.x, _doorRailParent.position.y, _doorRailParent.position.z)
                } else if (i == 1) {
                    _doorRails_parent_group[i].position.set(_columns[5].position.x, _doorRailParent.position.y, _doorRailParent.position.z)
                } else {
                    _doorRails_parent_group[i].position.set(_columns[9].position.x, _doorRailParent.position.y, _doorRailParent.position.z)
                }



                for (var j = 0; j < _doorRails_parent_group[i].children.length; j++) {
                    if (_doorRails_parent_group[i].children[j] instanceof THREE.Group) {


                        var rail = _doorRails_parent_group[i].children[j];
                        if (j == 0) {

                            rail.name = "rail_top"
                            rail.scale.setZ((_columns[0].position.x - _columns[2].position.x) - 2 * offset + thickness / 12 * ftTom)
                            rail.position.set(0, wTopLayer.position.y - wTopLayer.scale.y / 2 - ftTom * 0.05 / 24, posZ);
                            rail.rotation.x = (180 * THREE.Math.DEG2RAD);
                            rail.rotation.y = (90 * THREE.Math.DEG2RAD)
                            // rail.rotateX(180 * THREE.Math.DEG2RAD);
                            // rail.rotateY(90 * THREE.Math.DEG2RAD);
                        } else if (j == _doorRails_parent_group[i].children.length - 1) {
                            rail.name = "rail_bottom"
                            rail.scale.setZ((_columns[0].position.x - _columns[2].position.x) - 2 * offset + thickness / 12 * ftTom)
                            rail.position.set(0, wBottomLayer.scale.y / 2 + wBottomLayer.position.y + ftTom * 0.05 / 24, posZ);

                            rail.rotation.y = (90 * THREE.Math.DEG2RAD)
                        } else if (j == 1) {
                            rail.name = "rail_left"
                            rail.scale.setZ(wTopLayer.position.y - wTopLayer.scale.y / 2 - wBottomLayer.position.y + wBottomLayer.scale.y / 2 - thickness / 24 * ftTom)
                            if (i != 0) {
                                if (i < 2) {
                                    rail.position.set(_doorRails_parent_group[i].position.x - _columns[5].position.x - 2 * offset + ftTom * 0.05 / 24, wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y, posZ);
                                } else {
                                    rail.position.set(_doorRails_parent_group[i].position.x - _columns[7].position.x - 4 * offset + ftTom * 0.05 / 24, wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y, posZ);
                                }

                            } else {
                                rail.position.set(_doorRails_parent_group[i].position.x - 3 * offset + ftTom * 0.05 / 24, wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y, posZ);
                            }

                            rail.rotation.x = (90 * THREE.Math.DEG2RAD)
                            rail.rotation.z = (-90 * THREE.Math.DEG2RAD)
                        } else {
                            rail.name = "rail_right"
                            rail.scale.setZ(wTopLayer.position.y - wTopLayer.scale.y / 2 - wBottomLayer.position.y + wBottomLayer.scale.y / 2 - thickness / 24 * ftTom)
                            if (i != 0) {
                                if (i < 2) {
                                    rail.position.set(_doorRails_parent_group[i].position.x - _columns[5].position.x + 2 * offset - ftTom * 0.05 / 24, wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y, posZ);
                                } else {
                                    rail.position.set(_doorRails_parent_group[i].position.x - _columns[7].position.x - ftTom * 0.05 / 24, wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y, posZ);
                                }

                            } else {
                                rail.position.set(_doorRails_parent_group[i].position.x + offset - ftTom * 0.05 / 24, wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y, posZ);
                            }

                            rail.rotation.x = (90 * THREE.Math.DEG2RAD)
                            rail.rotation.z = (90 * THREE.Math.DEG2RAD)
                        }


                    }

                }
            }
            // for(var j =0; j<_doorRails_parent.length;j++){

            // }
        }
    }


}

function createSlideDoors() {
    for (var i = 0; i < customColumns / 4; i++) {
        createDoorRail(i);

    }
    for (var i = 0; i < customColumns / 2; i++) {
        createSlideDoor(i);
        updateSlideDoor(i);
        updateSlideDoorsUp(i);
    }
    updateDoorRail();
}


function createSlideDoor(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);


    var door = new THREE.Mesh(g, _doorMaterial);
    door.name = "slide_door_" + index;
    var _sDoor_group = new THREE.Group();
    _sDoor_group.add(door);
    _sDoor_group.name = "slide_door_pivot_" + index;
    _sDoors_parent[index] = _sDoor_group;
    _sDoors_parent_group.name = "slide_doors";
    _sDoors_parent_group.add(_sDoors_parent[index]);
    scene.add(_sDoors_parent_group);
}

function updateSlideDoorsUp(index) {
    // scaleZ = wTopLayer.position.y - wTopLayer.scale.y / 2 - wBottomLayer.position.y + wBottomLayer.scale.y / 2 - thickness / 24 * ftTom - ftTom - thickness / 12 * ftTom - thickness / 24 * ftTom ;
    // posY_LR = wBack.scale.y / 2 - wBottom.scale.y / 2 + wBottom.position.y  + ftTom / 2 + thickness / 12 * ftTom - thickness / 48 * ftTom
    var posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
    var scaleY = wTop.position.y - wBottom.position.y - 2 * ftTom * 0.05 / 12;

    if (_extDrawers.length > 0) {
        posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2 + ftTom / 2 + thickness / 12 * ftTom - thickness / 48 * ftTom;
        scaleY = wTop.position.y - wBottom.position.y - 2 * ftTom * 0.05 / 12 - ftTom - thickness / 12 * ftTom - thickness / 24 * ftTom;
    } else {
        posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
        scaleY = wTop.position.y - wBottom.position.y - 2 * ftTom * 0.05 / 12;
    }
    // _columns_group.position.x + _columns[index - 1].position.x + thickness / 24 * ftTom

    if (_sDoors_parent[index] instanceof THREE.Group) {

        _sDoors_parent_group.position.set(offset + wLeft.position.x, _sDoors_parent_group.position.y, _sDoors_parent_group.position.z);
        for (var j = 0; j < _sDoors_parent[index].children.length; j++) {

            if (_sDoors_parent[index].children[j] instanceof THREE.Mesh) {
                _sDoors_parent[index].children[j].scale.setY(scaleY);

                _sDoors_parent[index].children[j].position.setY(posY);

            }

        }


    }
}

function updateSlideDoor(index) {
    var posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
    var scaleY = wTop.position.y - wBottom.position.y - 2 * ftTom * 0.05 / 12;
    // _columns_group.position.x + _columns[index - 1].position.x + thickness / 24 * ftTom
    if (_sDoors_parent[index] instanceof THREE.Group) {

        _sDoors_parent_group.position.set(offset + wLeft.position.x, _sDoors_parent_group.position.y, _sDoors_parent_group.position.z);
        for (var j = 0; j < _sDoors_parent[index].children.length; j++) {

            if (_sDoors_parent[index].children[j] instanceof THREE.Mesh) {
                _sDoors_parent[index].children[j].scale.set(offset * 2 + (0.5 * ftTom / 12), scaleY, 0.625 / 12 * ftTom);

                _sDoors_parent[index].children[j].position.set(_sDoors_parent[index].children[j].scale.x / 2, posY, _sDoors_parent[index].position.z);

            }

        }
        if (index % 2 == 0) {

            if (index == 0) {
                _sDoors_parent[index].position.set(_columns[0].position.x - offset + thickness / 48 * ftTom, _sDoors_parent[index].position.y, wBottom.position.z + wBottomLayer.scale.z / 2 + 0.625 / 24 * ftTom + 0.03125 / 24 * ftTom);
            }
            if (index == 2) {
                _sDoors_parent[index].position.set(_columns[5].position.x - 2 * offset + thickness / 48 * ftTom, _sDoors_parent[index].position.y, wBottom.position.z + wBottomLayer.scale.z / 2 + 0.625 / 24 * ftTom + 0.03125 / 24 * ftTom);
            }
            if (index == 4) {
                _sDoors_parent[index].position.set(_columns[9].position.x - 2 * offset + thickness / 48 * ftTom, _sDoors_parent[index].position.y, wBottom.position.z + wBottomLayer.scale.z / 2 + 0.625 / 24 * ftTom + 0.03125 / 24 * ftTom);
            }

        } else {
            if (index == 1) {
                _sDoors_parent[index].position.set(_columns[0].position.x + offset - thickness / 48 * ftTom - (0.5 * ftTom / 12), _sDoors_parent[index].position.y, wBottom.position.z + wBottomLayer.scale.z / 2 - 0.625 / 24 * ftTom - 0.03125 / 24 * ftTom);
            }
            if (index == 3) {
                _sDoors_parent[index].position.set(_columns[5].position.x + offset / 24 - thickness / 48 * ftTom - (1 * ftTom / 12), _sDoors_parent[index].position.y, wBottom.position.z + wBottomLayer.scale.z / 2 - 0.625 / 24 * ftTom - 0.03125 / 24 * ftTom);
            }
            if (index == 5) {
                _sDoors_parent[index].position.set(_columns[9].position.x + offset / 24 - thickness / 48 * ftTom - (1 * ftTom / 12), _sDoors_parent[index].position.y, wBottom.position.z + wBottomLayer.scale.z / 2 - 0.625 / 24 * ftTom - 0.03125 / 24 * ftTom);
            }


        }


    }
}


function removeSlideDoors(index) {

    _doorRails_parent_group.forEach(e => {
        _doorRailParent.remove(e);
    })


    if (index) {



        if (_sDoors_parent[index] instanceof THREE.Group) {
            _sDoors_parent_group.remove(_sDoors_parent[index]);

        }



    } else {

        _sDoors_parent.forEach(e => {
            if (e instanceof THREE.Group) {

                _sDoors_parent_group.remove(e);

            }

        })

        _sDoors_parent = [];


    }
}

function slideDoorAction() {
    if (_columns.length > 0 && _sDoors_parent.length > 0) {

        var originalPos, originalPos2, originalPos4, originalPos1, originalPos3, originalPos5;
        for (var i = 0; i < _columns.length; i++) {
            if (_columns[i]) {
                if (i == 0) {
                    originalPos = _columns[i].position.x - offset + thickness / 48 * ftTom;
                    originalPos1 = _columns[i].position.x + offset - thickness / 48 * ftTom - (0.5 * ftTom / 12);
                } else if (i == 5) {
                    originalPos2 = _columns[i].position.x - 2 * offset + thickness / 48 * ftTom;
                    originalPos3 = _columns[i].position.x + offset / 24 - thickness / 48 * ftTom - (1 * ftTom / 12);
                } else if (i == 9) {
                    originalPos4 = _columns[i].position.x - 2 * offset + thickness / 48 * ftTom;
                    originalPos5 = _columns[i].position.x + offset / 24 - thickness / 48 * ftTom - (1 * ftTom / 12);
                }






            }
        }

        if (isSlideLeft) {
            for (var i = 0; i < _sDoors_parent.length; i++) {
                if (_sDoors_parent[i] instanceof THREE.Group) {
                    if (i % 2 == 0) {

                        if (i == 0) {
                            _sDoors_parent[i].position.setX(originalPos * (-1 + 2 * thickness / 12 * ftTom + (0.5 * ftTom / 48)));
                        } else if (i == 2) {

                            _sDoors_parent[i].position.setX(originalPos2 + (2 * offset - thickness / 12 * ftTom));
                        } else if (i == 4) {
                            _sDoors_parent[i].position.setX(originalPos4 + (2 * offset - thickness / 12 * ftTom));
                        }

                    } else {
                        if (i == 1) {
                            _sDoors_parent[i].position.setX(originalPos1);
                        } else if (i == 3) {
                            _sDoors_parent[i].position.setX(originalPos3);
                        } else if (i == 5) {
                            _sDoors_parent[i].position.setX(originalPos5);
                        }


                    }
                }
            }
        } else {

            for (var i = 0; i < _sDoors_parent.length; i++) {
                if (_sDoors_parent[i] instanceof THREE.Group) {
                    if (i % 2 == 0) {

                        if (i == 0) {
                            _sDoors_parent[i].position.setX(originalPos);
                        } else if (i == 2) {
                            _sDoors_parent[i].position.setX(originalPos2);
                        } else if (i == 4) {
                            _sDoors_parent[i].position.setX(originalPos4);
                        }

                    }
                }
            }

        }
        if (isSlideRight) {
            for (var i = 0; i < _sDoors_parent.length; i++) {
                if (_sDoors_parent[i] instanceof THREE.Group) {
                    if (i % 2 == 0) {

                        if (i == 0) {
                            _sDoors_parent[i].position.setX(originalPos);
                        } else if (i == 2) {

                            _sDoors_parent[i].position.setX(originalPos2);
                        } else if (i == 4) {
                            _sDoors_parent[i].position.setX(originalPos4);
                        }

                    } else {
                        if (i == 1) {
                            _sDoors_parent[i].position.setX(originalPos1 * (-1 - 2 * thickness / 12 * ftTom + (0.5 * ftTom / 24)));
                        } else if (i == 3) {
                            _sDoors_parent[i].position.setX(originalPos3 - (2 * offset - thickness / 12 * ftTom));
                        } else if (i == 5) {
                            _sDoors_parent[i].position.setX(originalPos5 - (2 * offset - thickness / 12 * ftTom));
                        }


                    }
                }
            }

        } else {
            for (var i = 0; i < _sDoors_parent.length; i++) {
                if (_sDoors_parent[i] instanceof THREE.Group) {
                    if (i % 2 != 0) {
                        if (i == 1) {
                            _sDoors_parent[i].position.setX(originalPos1);
                        } else if (i == 3) {
                            _sDoors_parent[i].position.setX(originalPos3);
                        } else if (i == 5) {
                            _sDoors_parent[i].position.setX(originalPos5);
                        }


                    }
                }
            }
        }

    }



}

function reset() {
    removeDoor();
    removeSlideDoors();
    removeFlipDoorSprite();
    removeColumns();
    removeColumnsEdges();
    removeSplitterEdges();
    removeColumnsArrow();
    removeUpperArrows();
    removeLowerArrows();
    removeColumnsBottom();
    removeColumnsSprite();
    removeHorizontalSplitter();
    removeInteractivePlane();

    if (isLoft) {

        removeLoftDoors();
        removeLoftColumns()


    }



    $("#actionSlideDoorLeft").hide();
    $("#actionSlideDoorRight").hide();
    $("#actionDoorVisiblity").hide();
    $("#actionDoorVisibilty").html('<i class="fa fa-eye-slash"></i> Hide Doors');
    $("#actionSlideDoorLeft").html('<i class="m-lg-1  fa fa-door-open"></i>Open Left ');
    $("#actionSlideDoorRight").html('<i class="m-lg-1  fa fa-door-open"></i>Open Right ');

    $("#actionDoor").hide();
    $("#actionDoor").html('<i class="m-lg-1  fa fa-door-open"></i>Open Door ');
    isDoorOpened = false;
    isSlideRight = false;
    isSlideLeft = false;
    removeAllInterior();
}


function doorVisiblity(object, visibility) {
    if (object instanceof THREE.Group) {
        object.visible = visibility;
        if (!visibility) {
            $("#actionDoorVisibility").html(('<i class="fa fa-eye"></i> Unhide Doors'));
            $("#actionSlideDoorRight").addClass("disabled");
            $("#actionSlideDoorLeft").addClass("disabled");
            $("#actionDoor").addClass("disabled");
        } else {
            $("#actionDoorVisibility").html(('<i class="fa fa-eye-slash"></i> Hide Doors'));
            $("#actionSlideDoorRight").removeClass("disabled");
            $("#actionSlideDoorLeft").removeClass("disabled");
            $("#actionDoor").removeClass("disabled");
        }
    }
}



function setPrice() {

    var initialPrice = 10; //1.25 sqft price onlyWardrobe
    // var widthMeasure = offset - thickness/12 * ftTom;

    var slideDoorPrice = 30 * _sDoors_parent_group.children.length; //One Pair+rail
    var hingedDoorPrice = 20 * _hDoors_parent_group.children.length; //One Door

    var lockerPrice = 15 * _locker_group.children.length;


    var smallDrawersDoubleSize = _smallIntDrawers.filter(e => e instanceof THREE.Mesh && e.scale.x > offset);
    var smallDrawerDoublePrice = 70 * smallDrawersDoubleSize.length;
    var smallDrawersSingleSize = _smallIntDrawers.filter(e => e instanceof THREE.Mesh && e.scale.x <= offset);
    var smallDrawerPrice = 35 * smallDrawersSingleSize.length;


    var largeDrawersDoubleSize = _largeIntDrawers.filter(e => e instanceof THREE.Mesh && e.scale.x > offset);
    var largeDrawerDoublePrice = 80 * largeDrawersDoubleSize.length;
    var largeDrawersSingleSize = _largeIntDrawers.filter(e => e instanceof THREE.Mesh && e.scale.x <= offset);
    var largeDrawerPrice = 40 * largeDrawersSingleSize.length;


    var externalDrawerDoubleSize = _extDrawers.filter(e => e instanceof THREE.Mesh && e.scale.x > offset)
    var externalDrawerDoublePrice = 70 * externalDrawerDoubleSize.length;
    var externalDrawerSingleSize = _extDrawers.filter(e => e instanceof THREE.Mesh && e.scale.x <= offset);
    var externalDrawerPrice = 35 * externalDrawerSingleSize.length;

    var hangerDoubleSize = _hangers.filter(e => e instanceof THREE.Mesh && e.scale.y > offset);
    var hangerDoublePrice = 10 * hangerDoubleSize.length;
    var hangerSingleSize = _hangers.filter(e => e instanceof THREE.Mesh && e.scale.y <= offset);
    var hangerPrice = 5 * hangerSingleSize.length;



    var splitterDoubleSize = _m_splitters.filter(e => e instanceof THREE.Mesh && e.scale.x > offset)
    var splitterDoublePrice = 10 * splitterDoubleSize.length;
    var splitterSingleSize = _m_splitters.filter(e => e instanceof THREE.Mesh && e.scale.x <= offset);
    var splitterPrice = 5 * splitterSingleSize.length;

    // console.log((12*offset/ftTom)-thickness/2)
    var intDrawer = _intDrawers_parent.filter(e => e instanceof THREE.Group);
    var dCount = 0;
    var dDoubleCount = 0;
    

    intDrawer.forEach(function (e) {

        if (e.children[0].scale.x > offset) {
            dDoubleCount += e.children.length;
        } else {
            dCount += e.children.length;
        }

    })
    var intDrawerPrice = 35 * dCount;
    var intDrawerDoublePrice = 70 * dDoubleCount;


    var ts = _top_shelves_parent.filter(e => e instanceof THREE.Group);
    var tsCount = 0;
    var tsDoubleCount = 0;

    ts.forEach(function (e) {

        if (e.children[0].scale.x > offset) {
            tsDoubleCount += e.children.length;
        } else {
            tsCount += e.children.length;
        }

    })
    var topShelfPrice = 2 * tsCount;
    var topShelfDoublePrice = 4 * tsDoubleCount;

    var bs = _bot_shelf_parent.filter(e => e != null);
    var bsCount = 0;
    var bsDoubleCount = 0;
    bs.forEach(function (e) {

        if (e.children[0].scale.x > offset) {
            bsDoubleCount += e.children.length;
        } else {
            bsCount += e.children.length;
        }

    })


    var botShelfPrice = 2 * bsCount;
    var botShelfDoublePrice = 4 * bsDoubleCount;



    var columnsPrice = 8 * (_columns.length - removed.length);

    var totalInteriorCost = smallDrawerDoublePrice + smallDrawerPrice + largeDrawerPrice + largeDrawerDoublePrice + externalDrawerDoublePrice + externalDrawerPrice + lockerPrice + hangerPrice + hangerDoublePrice +
        topShelfPrice + topShelfDoublePrice + botShelfPrice + botShelfDoublePrice + intDrawerDoublePrice + intDrawerPrice;
    totalPrice = (calculateWardrobeVolume() * initialPrice) + splitterPrice + splitterDoublePrice + slideDoorPrice + hingedDoorPrice + totalInteriorCost + columnsPrice;


    // totalPrice = Math.ceil(totalPrice);


    $(".price").html("$ " + totalPrice);

}



function calculateWardrobeVolume(object) {
    let volume;
    if (isLoft) {
        volume = (wWidth * ((Math.abs(wHeight) + Math.abs(wLoft))) * wDepth) * ftTom;
    } else {
        volume = (wWidth * wHeight * wDepth) * ftTom;
    }


    return volume.toFixed(1);
}

function createMeshInbetweenLockerSmallDrawer(locker, drawer) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var mesh = new THREE.Mesh(g, _columnsMaterial);
    mesh.name = "inbetweenLS";
    mesh.position.setX((locker.position.x));
    mesh.position.setY(drawer.position.y);
    mesh.position.setZ(drawer.position.z);
    mesh.scale.copy(_columns[0].scale);
    mesh.scale.setY(drawer.scale.y);
    // mesh.scale.setZ(_columns[0].s)
    scene.add(mesh);

}

function createInternalDrawers(index, row) {
    var g = new THREE.BoxGeometry(1, 1, 1);

    let _drawers_group = new THREE.Group();

    if (_m_splitters.length > 0) {
        for (var j = 0; j < row; j++) {
            _intDrawers[j] = new THREE.Mesh(g, _intSmallMaterial);
            _intDrawers[j].name = "_drawer_" + j;
            _intDrawers[j].scale.set(_m_splitters[index].scale.x, 1, _m_splitters[index].scale.z);
            _drawers_group.add(_intDrawers[j]);

        }
    }

    _drawers_group.name = "_drawers_" + index;
    _intDrawers_parent[index] = _drawers_group;


    scene.add(_intDrawers_parent[index]);

}

function updateInternalDrawers(index) {



    var pos = (wBottom.position.y + wBottom.scale.y / 2);




    if (_intDrawers_parent[index] instanceof THREE.Group) {

        var vertical_offset = ((_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (wBottom.position.y + wBottom.scale.y / 2)) / _intDrawers_parent[index].children.length;


        for (var j = 0; j < _intDrawers_parent[index].children.length; j++) {
            if (_intDrawers_parent[index].children[j] instanceof THREE.Mesh) {
                _intDrawers_parent[index].children[j].scale.set(_m_splitters[index].scale.x, vertical_offset, _m_splitters[index].scale.z);
                _intDrawers_parent[index].children[j].position.set(index * offset, j * _intDrawers_parent[index].children[j].scale.y,
                    _m_splitters[index].position.z);
            }

        }



    }
    _intDrawers_parent[index].position.set(offset / 2 + wLeft.position.x, pos + vertical_offset / 2, _intDrawers_parent[index].position.z);
}



function removeInternalDrawers(index) {

    if (!index) {
        _intDrawers_parent.forEach(e => {
            if (e instanceof THREE.Group) {
                scene.remove(e);
            }
        })
        _intDrawers_parent = [];
    } else {
        _intDrawers_parent.forEach(e => {
            if (e instanceof THREE.Group && index == _intDrawers_parent.indexOf(e)) {
                scene.remove(e);
            }
        })
        _intDrawers_parent[index] = null;
    }

}

function createColumnsArrows(index) {
    var from = new THREE.Vector3(0, 0, 0);
    var to = new THREE.Vector3(0, 0, 0);



    var direction = to.clone().sub(from);
    var length = direction.manhattanLength();



    var ArrowL = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
    var ArrowR = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

    if (!_cLeftArrow_parent.includes(ArrowL)) {
        _cLeftArrow_parent.push(ArrowL);
    }
    if (!_cRightArrow_parent.includes(ArrowR)) {
        _cRightArrow_parent.push(ArrowR);
    }


    _cLeftArrow_group.add(_cLeftArrow_parent[index]);
    _cRightArrow_group.add(_cRightArrow_parent[index]);

    dimensionScene.add(_cLeftArrow_group);
    dimensionScene.add(_cRightArrow_group);


    var cLabelValue = document.createElement('div');
    cLabelValue.className = "columnLabel";
    cLabelValue.innerHTML = "";
    cLabelValue.style.fontSize = "13px";


    var cLabel = new THREE.CSS2DObject(cLabelValue);

    if (!_cLabels.includes(cLabel)) {
        _cLabels.push(cLabel);
    }

    _cLeftArrow_parent[index].add(_cLabels[index]);
}

function updateColumnsArrow(index) {
    var from;
    var to;
    _cLeftArrow_group.position.copy(_columns_group.position.clone());
    _cRightArrow_group.position.copy(_columns_group.position.clone());

    if (index == 0) {
        from = new THREE.Vector3(_columns[0].position.x - offset / 2, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        to = new THREE.Vector3(_columns[0].position.x - offset + thickness / 24 * ftTom, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
    } else {
        if (index == customColumns - 1) {
            from = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
            to = new THREE.Vector3(_columns[index - 1].position.x + thickness / 24 * ftTom, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        } else {
            from = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
            to = new THREE.Vector3(_columns[index - 1].position.x + thickness / 24 * ftTom, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        }
    }


    var direction = to.clone().sub(from);
    var length = direction.manhattanLength();

    var lengthOffset = 12 * ((_columns_group.position.x - _columns[0].scale.x / 2) - (wLeft.position.x + wLeft.scale.x / 2)) / ftTom;
    _cLabels[index].element.innerHTML = (lengthOffset).toFixed(4) + " in";
    _cLabels[index].position.set(0.065, 0, 0);

    if(_cLeftArrow_parent[index] instanceof THREE.ArrowHelper){
        _cLeftArrow_parent[index].setDirection(direction.normalize());
        _cLeftArrow_parent[index].setLength(length, 0.05, 0.05);
        _cLeftArrow_parent[index].position.copy(from.clone());
    }
    if(_cRightArrow_parent[index] instanceof THREE.ArrowHelper){
        _cRightArrow_parent[index].setDirection(direction.negate().normalize());
        _cRightArrow_parent[index].setLength(length, 0.05, 0.05);
        _cRightArrow_parent[index].position.copy(from.clone());
    }

    if(index == removed_index){
        removeColumnsArrow(index+1);
        if(_cLeftArrow_parent[index] instanceof THREE.ArrowHelper && _cUpperLabels[index] instanceof THREE.CSS2DObject){
            
            
                from = new THREE.Vector3(_columns[removed_index].position.x, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
                to = new THREE.Vector3(_columns[removed_index].position.x - offset + thickness / 24 * ftTom, edgeBottom.position.y - 0.2, edgeLeft.position.z - edgeLeft.scale.z / 2);
            
        
        
            var direction = to.clone().sub(from);
            var length = direction.manhattanLength();

            _cLeftArrow_parent[index].setDirection(direction.normalize());
            _cLeftArrow_parent[index].setLength(length, 0.05, 0.05);
            _cLeftArrow_parent[index].position.copy(from.clone());
            _cRightArrow_parent[index].setDirection(direction.negate().normalize());
            _cRightArrow_parent[index].setLength(length, 0.05, 0.05);
            _cRightArrow_parent[index].position.copy(from.clone());

            
            _cLabels[index].element.innerHTML = 2*(lengthOffset+thickness/2).toFixed(4) + " in";
            
        }
       
    }




   
    // _cLabels[index].scale.set(0.125, 0.125, 0.125);
}

function removeColumnsArrow(index) {
    if (index) {
        if(_cLabels.includes(_cLabels[index])){
            _cLeftArrow_parent[index].remove(_cLabels[index]);
            _cLabels[index] = null;
        }
        if (_cLeftArrow_parent.includes(_cLeftArrow_parent[index])) {
            _cLeftArrow_group.remove(_cLeftArrow_parent[index]);
            _cLeftArrow_parent[index] = null;

        }
        if (_cRightArrow_parent.includes(_cRightArrow_parent[index])) {
            _cRightArrow_group.remove(_cRightArrow_parent[index]);
            _cRightArrow_parent[index] = null;

        }


    } else {

        
        _cLeftArrow_parent.forEach(e => {
            if(e instanceof THREE.ArrowHelper){
                _cLabels.forEach(a => {
                    if(a instanceof THREE.CSS2DObject){
                        e.remove(a);
                    }
                    
                })
            
                _cLeftArrow_group.remove(e);
            }
        })
        dimensionScene.remove(_cLeftArrow_group)
        _cLeftArrow_parent = [];
        _cLabels = [];
        
        _cRightArrow_parent.forEach(e => {
            if(e instanceof THREE.ArrowHelper){
                _cRightArrow_group.remove(e);
            }
            
        })
        dimensionScene.remove(_cRightArrow_group)
        _cRightArrow_parent = [];




    }
}

function createUpperArrows(index) {
    var from = new THREE.Vector3(0, 0, 0);
    var to = new THREE.Vector3(0, 0, 0);



    var direction = to.clone().sub(from);
    var length = direction.manhattanLength();



    var ArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
    var ArrowDown = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

    if (!_cUpperArrowUps_parent.includes(ArrowUp)) {
        _cUpperArrowUps_parent.push(ArrowUp);
    }
    if (!_cUpperArrowDowns_parent.includes(ArrowDown)) {
        _cUpperArrowDowns_parent.push(ArrowDown);
    }


    _cUpperArrowUp_group.add(_cUpperArrowUps_parent[index]);
    _cUpperArrowDown_group.add(_cUpperArrowDowns_parent[index]);

    dimensionScene.add(_cUpperArrowUp_group);
    dimensionScene.add(_cUpperArrowDown_group);


    var cLabelValue = document.createElement('div');
    cLabelValue.className = "columnsUpperLabel";
    cLabelValue.innerHTML = "10";
    cLabelValue.style.margin = 0;
    cLabelValue.style.top = 0;
    cLabelValue.style.textAlign = "center";
    cLabelValue.style.fontSize = "15px";


    var cLabel = new THREE.CSS2DObject(cLabelValue);

    if (!_cUpperLabels.includes(cLabel)) {
        _cUpperLabels.push(cLabel);
    }
    // _cUpperLabels_group.add(_cUpperLabels[index])
    _cUpperArrowUps_parent[index].add(_cUpperLabels[index]);
}

function updateUpperArrows(index) {
    var from, fromDown;
    var to, toDown;

    var midpoint = (wTop.position.y - _m_splitters[index].position.y / 2 + 0.05);
    var midpointdown = (wTop.position.y - _m_splitters[index].position.y / 2 - 0.05);
    if (index == 0) {
        from = new THREE.Vector3(_columns[0].position.x - offset / 2, midpoint, edgeLeft.position.z - edgeLeft.scale.z / 2);
        to = new THREE.Vector3(_columns[0].position.x - offset / 2, wTop.position.y - wTop.scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);

        fromDown = new THREE.Vector3(_columns[0].position.x - offset / 2, midpointdown, edgeLeft.position.z - edgeLeft.scale.z / 2);
        toDown = new THREE.Vector3(_columns[0].position.x - offset / 2, _m_splitters[index].position.y + _m_splitters[index].scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);
    } else {
        if (index == customColumns - 1) {
            from = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpoint, edgeLeft.position.z - edgeLeft.scale.z / 2);
            to = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, wTop.position.y - wTop.scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);

            fromDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpointdown, edgeLeft.position.z - edgeLeft.scale.z / 2);
            toDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, _m_splitters[index].position.y + _m_splitters[index].scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        } else {
            from = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpoint, edgeLeft.position.z - edgeLeft.scale.z / 2);
            to = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, wTop.position.y - wTop.scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);

            fromDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpointdown, edgeLeft.position.z - edgeLeft.scale.z / 2);
            toDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, _m_splitters[index].position.y + _m_splitters[index].scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        }
    }


    var direction = to.clone().sub(from);
    var directionDown = toDown.clone().sub(fromDown);
    var length = direction.manhattanLength();
    var lengthDown = directionDown.manhattanLength();

    var lengthToSplitter = wTop.position.y - _m_splitters[index].position.y - wTop.scale.y;
    _cUpperLabels[index].element.innerHTML = (12 * lengthToSplitter / ftTom).toFixed(1) + " in";
    _cUpperLabels[index].position.set(0, -0.05, 0);

    if(_cUpperArrowUps_parent[index] instanceof THREE.ArrowHelper){
        _cUpperArrowUps_parent[index].setDirection(direction.normalize());
        _cUpperArrowUps_parent[index].setLength(length, 0.05, 0.05);
        _cUpperArrowUps_parent[index].position.copy(from.clone());
    }
    
    if(_cUpperArrowDowns_parent[index] instanceof THREE.ArrowHelper){
        _cUpperArrowDowns_parent[index].setDirection(directionDown.normalize());
        _cUpperArrowDowns_parent[index].setLength(lengthDown, 0.05, 0.05);
        _cUpperArrowDowns_parent[index].position.copy(fromDown.clone());
    }

    if(index == removed_index){
        removeUpperArrows(index+1);
        if(_cUpperArrowDowns_parent[index] instanceof THREE.ArrowHelper && _cUpperLabels[index] instanceof THREE.CSS2DObject){
            
            _cUpperArrowUps_parent[index].position.setX(_columns[removed_index].position.x);
            _cUpperArrowDowns_parent[index].position.setX(_columns[removed_index].position.x);
        }
       
    }
   


   
    // _cUpperLabels[index].scale.set(0.135, 0.135, 0.135);
    _cUpperArrowUp_group.position.copy(_columns_group.position.clone());
    _cUpperArrowDown_group.position.copy(_columns_group.position.clone());


}

function removeUpperArrows(index) {
    if (index) {

            
        if(_cUpperLabels.includes(_cUpperLabels[index])){
            _cUpperArrowUps_parent[index].remove(_cUpperLabels[index]);
            _cUpperLabels[index] = null;
        }
        if (_cUpperArrowUps_parent.includes(_cUpperArrowUps_parent[index])) {
            _cUpperArrowUp_group.remove(_cUpperArrowUps_parent[index]);
            _cUpperArrowUps_parent[index] = null;

        }
        if (_cUpperArrowDowns_parent.includes(_cUpperArrowDowns_parent[index])) {
            _cUpperArrowDown_group.remove(_cUpperArrowDowns_parent[index]);
            _cUpperArrowDowns_parent[index] = null;

        }

    } else {


       

        _cUpperArrowUps_parent.forEach(e => {
            
            if(e instanceof THREE.ArrowHelper){
                _cUpperLabels.forEach(a => {
                    if(a instanceof THREE.CSS2DObject){
                        e.remove(a);
                    }
                    
                })
                _cUpperArrowUp_group.remove(e);    
            }
            
        })
        dimensionScene.remove(_cUpperArrowUp_group);
        _cUpperLabels = [];

        _cUpperArrowUps_parent = [];


        _cUpperArrowDowns_parent.forEach(e => {
            if(e instanceof THREE.ArrowHelper){
                _cUpperArrowDown_group.remove(e);
            }
            
        })
        dimensionScene.remove(_cUpperArrowDown_group);
        _cUpperArrowDowns_parent = [];

        // _cUpperLabels.forEach(e => {
        //     if (e!=null) {
        //         _cUpperLabels_group.remove(e);
        //     }

        // })
        // _cUpperLabels = [];


    }
}


function createLowerArrows(index) {
    var from = new THREE.Vector3(0, 0, 0);
    var to = new THREE.Vector3(0, 0, 0);



    var direction = to.clone().sub(from);
    var length = direction.manhattanLength();



    var ArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
    var ArrowDown = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

    if (!_cLowerArrowUps_parent.includes(ArrowUp)) {
        _cLowerArrowUps_parent.push(ArrowUp);
    }
    if (!_cLowerArrowDowns_parent.includes(ArrowDown)) {
        _cLowerArrowDowns_parent.push(ArrowDown);
    }


    _cLowerArrowUp_group.add(_cLowerArrowUps_parent[index]);
    _cLowerArrowDown_group.add(_cLowerArrowDowns_parent[index]);

    dimensionScene.add(_cLowerArrowUp_group);
    dimensionScene.add(_cLowerArrowDown_group);


    var cLabelValue = document.createElement('div');
    cLabelValue.className = "columnsLowerLabel";
    cLabelValue.style.fontSize = "15px";


    var cLabel = new THREE.CSS2DObject(cLabelValue);

    if (!_cLowerLabels.includes(cLabel)) {
        _cLowerLabels.push(cLabel);
    }

    _cLowerArrowUps_parent[index].add(_cLowerLabels[index]);
}

function updateLowerArrows(index) {
    var from, fromDown;
    var to, toDown;
    _cLowerArrowDown_group.position.copy(_columns_group.position.clone());
    _cLowerArrowUp_group.position.copy(_columns_group.position.clone());
    
    var midpoint = (_m_splitters[index].position.y / 2 - wBottom.position.y + 0.05);
    var midpointdown = (_m_splitters[index].position.y / 2 - wBottom.position.y - 0.05);
    if (index == 0) {
        from = new THREE.Vector3(_columns[0].position.x - offset / 2, midpoint, edgeLeft.position.z - edgeLeft.scale.z / 2);
        to = new THREE.Vector3(_columns[0].position.x - offset / 2, _m_splitters[index].position.y - _m_splitters[index].scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);

        fromDown = new THREE.Vector3(_columns[0].position.x - offset / 2, midpointdown, edgeLeft.position.z - edgeLeft.scale.z / 2);
        toDown = new THREE.Vector3(_columns[0].position.x - offset / 2, wBottom.position.y + wBottom.scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);
    } else {
        if (index == customColumns - 1) {
            from = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpoint, edgeLeft.position.z - edgeLeft.scale.z / 2);
            to = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, _m_splitters[index].position.y - _m_splitters[index].scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);

            fromDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpointdown, edgeLeft.position.z - edgeLeft.scale.z / 2);
            toDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, wBottom.position.y + wBottom.scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        } else {
            from = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpoint, edgeLeft.position.z - edgeLeft.scale.z / 2);
            to = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, _m_splitters[index].position.y - _m_splitters[index].scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);

            fromDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, midpointdown, edgeLeft.position.z - edgeLeft.scale.z / 2);
            toDown = new THREE.Vector3(_columns[index - 1].position.x + offset / 2, wBottom.position.y + wBottom.scale.y / 2, edgeLeft.position.z - edgeLeft.scale.z / 2);
        }
    }


    var direction = to.clone().sub(from);
    var directionDown = toDown.clone().sub(fromDown);
    var length = direction.manhattanLength();
    var lengthDown = directionDown.manhattanLength();

    var lengthToSplitter = _m_splitters[index].position.y - _m_splitters[index].scale.y - wBottom.position.y;
    _cLowerLabels[index].element.innerHTML = (12 * lengthToSplitter / ftTom).toFixed(3) + " in";
    _cLowerLabels[index].position.set(0, -0.05, 0);

    if (_cLowerArrowUps_parent[index] instanceof THREE.ArrowHelper) {
        _cLowerArrowUps_parent[index].setDirection(direction.normalize());
        _cLowerArrowUps_parent[index].setLength(length, 0.05, 0.05);
        _cLowerArrowUps_parent[index].position.copy(from.clone());
    }

    if (_cLowerArrowDowns_parent[index] instanceof THREE.ArrowHelper) {
        _cLowerArrowDowns_parent[index].setDirection(directionDown.normalize());
        _cLowerArrowDowns_parent[index].setLength(lengthDown, 0.05, 0.05);
        _cLowerArrowDowns_parent[index].position.copy(fromDown.clone());
    }

    if(index == removed_index){
        removeLowerArrows(index+1);
        if(_cLowerArrowDowns_parent[index] instanceof THREE.ArrowHelper && _cLowerLabels[index] instanceof THREE.CSS2DObject){
            // _cLowerLabels[index].position.setX()
            
            _cLowerArrowUps_parent[index].position.setX(_columns[removed_index].position.x);
            _cLowerArrowDowns_parent[index].position.setX(_columns[removed_index].position.x);
        }
       
    }

    // _cLowerLabels[index].scale.set(0.135, 0.135, 0.135);

}

function removeLowerArrows(index) {
    if (index) {
            
        if(_cLowerLabels.includes(_cLowerLabels[index])){
            _cLowerArrowUps_parent[index].remove(_cLowerLabels[index]);
            _cLowerLabels[index] = null;
        }
        if (_cLowerArrowUps_parent.includes(_cLowerArrowUps_parent[index])) {
            _cLowerArrowUp_group.remove(_cLowerArrowUps_parent[index]);
            _cLowerArrowUps_parent[index] = null;

        }
        if (_cLowerArrowDowns_parent.includes(_cLowerArrowDowns_parent[index])) {
            _cLowerArrowDown_group.remove(_cLowerArrowDowns_parent[index]);
            _cLowerArrowDowns_parent[index] = null;

        }


    } else {
   
        
        _cLowerArrowUps_parent.forEach(e => {
            if(e instanceof THREE.ArrowHelper){
                _cLowerLabels.forEach(a => {        
                    if(a instanceof THREE.CSS2DObject){
                    e.remove(a);
                    }
                })
                _cLowerArrowUp_group.remove(e);
            }
            
            
        })
        dimensionScene.remove(_cLowerArrowUp_group);
        _cLowerArrowUps_parent = [];
        _cLowerLabels = [];


        _cLowerArrowDowns_parent.forEach(e => {
            if(e instanceof THREE.ArrowHelper){
                _cLowerArrowDown_group.remove(e);
            }
            
        })
        dimensionScene.remove(_cLowerArrowDown_group);

        _cLowerArrowDowns_parent = [];




    }
}

function createSplitterEdges(index) {
    var g = new THREE.EdgesGeometry(_columns[0].geometry.clone());
    var m = new THREE.LineBasicMaterial({
        color: 0x000000,
        name: "_m_splitters_edge" + index
    });
    var mesh = new THREE.LineSegments(g, m);


    mesh.name = "w_splitters_edge_" + index;



    _splitterEdges[index] = mesh;
    _splitterEdges_group.name = "w_splitters_edges";
    _splitterEdges_group.add(_splitterEdges[index]);




    dimensionScene.add(_splitterEdges_group);

}

function updateSplitterEdges(index) {

    _splitterEdges[index].scale.copy(_m_splitters[index].scale);
    _splitterEdges[index].position.copy(_m_splitters[index].position);
    _splitterEdges_group.position.copy(_m_splitters_group.position)
}

function removeSplitterEdges(index) {

    if (index) {
        _splitterEdges.forEach(e => {
            if (_splitterEdges[index] instanceof THREE.Mesh && _splitterEdges[index] == e) {
                if (_splitterEdges_group instanceof THREE.Group) {
                    _splitterEdges_group.remove(e);

                }
            }
        })
        _splitterEdges[index] = null;
    } else {

        _splitterEdges.forEach(e => {


            if (_splitterEdges_group instanceof THREE.Group) {
                _splitterEdges_group.remove(e);

            }




        })

        dimensionScene.remove(_splitterEdges_group);
        _splitterEdges = [];


    }
}


function createColumnsEdgeGeometry(index) {

    var g = new THREE.EdgesGeometry(_columns[0].geometry.clone());
    var m = new THREE.LineBasicMaterial({
        color: 0x000000,
        name: "_m_columns_line" + index
    });
    var mesh = new THREE.LineSegments(g, m);


    mesh.name = "w_columns_line_" + index;



    _columnsEdges[index] = mesh;
    _columnsEdges_group.name = "w_columns_lines";
    _columnsEdges_group.add(_columnsEdges[index]);




    dimensionScene.add(_columnsEdges_group);


}

function updateColumnsEdgeGeometry(index) {



    _columnsEdges[index].scale.copy(_columns[index].scale);
    _columnsEdges[index].position.copy(_columns[index].position);

}

function removeColumnsEdges(index) {


    if (index) {
        _columnsEdges.forEach(e => {
            if (_columnsEdges[index] instanceof THREE.Mesh && _columns[index] == e) {
                if (_columnsEdges_group instanceof THREE.Group) {
                    _columnsEdges_group.remove(e);

                }
            }
        })
        _columnsEdges[index] = null;
    } else {

        _columnsEdges.forEach(e => {


            if (_columnsEdges_group instanceof THREE.Group) {
                _columnsEdges_group.remove(e);

            }




        })

        dimensionScene.remove(_columnsEdges_group);
        _columnsEdges = [];


    }


}

function createWardrobeEdges(object) {
    let edges = new THREE.EdgesGeometry(object.geometry.clone());

    var subject = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x000000
    }));
    // if(subject instanceof THREE.Mesh){
    //     subject.scale.set(object.scale.x,object.scale.y,object.scale.z);
    //     subject.position.set(object.position.x,object.position.y,object.position.z);
    // }

    dimensionScene.add(subject);
    return subject;
}

function createWardrobeEdgesDepth(object) {
    var texture = new THREE.TextureLoader().load("./Textures/diagonal.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.setX(1);
    texture.repeat.setY(1);
    let edges = new THREE.EdgesGeometry(object.geometry.clone());

    var subject = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({



        color: 0x000000,


    }));
    // if(subject instanceof THREE.Mesh){
    //     subject.scale.set(object.scale.x,object.scale.y,object.scale.z);
    //     subject.position.set(object.position.x,object.position.y,object.position.z);
    // }

    dimensionScene.add(subject);
    return subject;
}

function updateWardrobeEdges(subject, object) {

    if (subject != null) {
        subject.scale.copy(object.scale);
        subject.position.copy(object.position);
        subject.visible = object.visible;
    }


}

function removeWardrobeEdges(subject) {
    scene.traverse(function (child) {
        if (child == subject) {
            scene.remove(subject);
        }
    })
}



function createVerticalArrow() {

    if (edgeLeft) {


        // if(isLoft){
        //     from = new THREE.Vector3( edgeLeft.position.x - 0.1,( edgeLeft.scale.y + edgeLoftLeft.scale.y )/2 ,  edgeLeft.position.z - edgeLeft.scale.z/2 );
        //     to = new THREE.Vector3( edgeLeft.position.x - 0.1, edgeLoftTop.position.y + thickness/24*ftTom, edgeLeft.position.z- edgeLeft.scale.z/2 );
        // }else{

        // }
        var from = new THREE.Vector3(edgeLeft.position.x - 0.1, edgeLeft.position.y, edgeLeft.position.z - edgeLeft.scale.z / 2);
        var to = new THREE.Vector3(edgeLeft.position.x - 0.1, edgeTop.position.y + thickness / 24 * ftTom, edgeLeft.position.z - edgeLeft.scale.z / 2);
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();

        if (wvArrowUp == null) {

            wvArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            wvArrowDown = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);


            dimensionScene.add(wvArrowUp);
            dimensionScene.add(wvArrowDown);

            hValue = document.createElement('div');
            hValue.innerHTML = (wHeight) + " ft (" + wHeight * 12 + " in)";
            hValue.style.fontSize = "20px";




            heightLabel = new THREE.CSS2DObject(hValue);

            wvArrowUp.add(heightLabel);


        } else {

            wvArrowUp.setDirection(direction.normalize());
            wvArrowUp.setLength(length, 0.05, 0.05);
            wvArrowUp.position.copy(from.clone());

            wvArrowDown.setDirection(direction.negate().normalize());
            wvArrowDown.setLength(length, 0.05, 0.05);
            wvArrowDown.position.copy(from.clone());

            hValue.innerHTML = (wHeight) + " ft (" + wHeight * 12 + " in)";
            heightLabel.position.set(-0.3, 0, 0);
            // heightLabel.scale.set(0.15, 0.15, 0.15)

            // wHeightText.position.set(0,0.5,0.4);
        }




        if (isLoft) {
            var from = new THREE.Vector3(edgeLoftLeft.position.x - 0.1, edgeLoftLeft.position.y, edgeLeft.position.z - edgeLeft.scale.z / 2);
            var to = new THREE.Vector3(edgeLoftLeft.position.x - 0.1, edgeLoftTop.position.y + thickness / 24 * ftTom, edgeLeft.position.z - edgeLeft.scale.z / 2);
            var direction = to.clone().sub(from);

            var length = direction.manhattanLength();
            if (wlArrowUp == null) {
                wlArrowUp = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
                wlArrowDown = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

                dimensionScene.add(wlArrowUp);
                dimensionScene.add(wlArrowDown);

                wlArrowUp.visible = true;
                wlArrowDown.visible = true;

                hLoftValue = document.createElement('div');
                hLoftValue.innerHTML = (wLoft) + " ft";

                hLoftValue.style.fontSize = "20px";




                loftLabel = new THREE.CSS2DObject(hLoftValue);

                wlArrowUp.add(loftLabel);
            } else {
                wlArrowUp.setDirection(direction.normalize());
                wlArrowUp.setLength(length, 0.05, 0.05);
                wlArrowUp.position.copy(from.clone());

                wlArrowDown.setDirection(direction.negate().normalize());
                wlArrowDown.setLength(length, 0.05, 0.05);
                wlArrowDown.position.copy(from.clone());
                wlArrowUp.visible = true;
                wlArrowDown.visible = true;


                loftLabel.visible = true;

                hLoftValue.innerHTML = (wLoft) + " ft (" + wLoft * 12 + " in)";
                loftLabel.position.set(-0.3, 0, 0);
                // loftLabel.scale.set(0.15, 0.15, 0.15)
            }
        } else {
            if (wlArrowUp) {
                wlArrowUp.visible = false;
                wlArrowDown.visible = false;
                loftLabel.visible = false;
            }
        }

    }


}

function createDepthArrow() {
    if (depthSideMesh) {

        var from = new THREE.Vector3(depthSideMesh.position.x, edgeBottom.position.y - 0.3, edgeLeft.position.z - edgeLeft.scale.z / 2);
        var to = new THREE.Vector3(depthSideMesh.position.x - depthSideMesh.scale.z / 2, edgeBottom.position.y - 0.3, edgeLeft.position.z - edgeLeft.scale.z / 2);
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();

        if (wdArrowL == null) {
            wdArrowL = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            wdArrowR = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            dimensionScene.add(wdArrowL);
            dimensionScene.add(wdArrowR);


            depthLabelValue = document.createElement('div');
            depthLabelValue.innerHTML = (wDepth) + " ft";

            depthLabelValue.style.fontSize = "20px";


            depthLabel = new THREE.CSS2DObject(depthLabelValue);

            wdArrowL.add(depthLabel);
        } else {
            wdArrowL.setDirection(direction.normalize());
            wdArrowL.setLength(length, 0.05, 0.05);
            wdArrowL.position.copy(from.clone());


            wdArrowR.setDirection(direction.negate().normalize());
            wdArrowR.setLength(length, 0.05, 0.05);
            wdArrowR.position.copy(from.clone());


            depthLabelValue.innerHTML = (wDepth) + " ft(" + wDepth * 12 + " in)";
            depthLabel.position.set(-0.1, 0, 0);
            // depthLabel.scale.set(0.15, 0.15, 0.15)
        }
    }
}

function createHorizontalArrow() {

    if (edgeLeft) {

        var from = new THREE.Vector3(edgeBottom.position.x, edgeBottom.position.y - 0.3, edgeLeft.position.z - edgeLeft.scale.z / 2);
        var to = new THREE.Vector3(edgeLeft.position.x - thickness / 12 * ftTom, edgeBottom.position.y - 0.3, edgeLeft.position.z - edgeLeft.scale.z / 2);
        var direction = to.clone().sub(from);

        var length = direction.manhattanLength();




        if (whArrowL == null) {
            whArrowL = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);
            whArrowR = new THREE.ArrowHelper(direction.normalize(), from, length, 0x000000, 0.05, 0.05);

            dimensionScene.add(whArrowL);
            dimensionScene.add(whArrowR);

            wValue = document.createElement('div');
            wValue.innerHTML = (wWidth) + " ft";

            wValue.style.fontSize = "20px";


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
            widthLabel.position.set(-0.1, 0, 0);
            // widthLabel.scale.set(0.15, 0.15, 0.15)
        }

    }


}

function swaprender() {
    isMeasured = !isMeasured;

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
        a.setAttribute('download', 'wardrobe_dimension.png')
        a.setAttribute('href', image)
        a.click()
        canvas.remove()
        $(".textOver").addClass("d-none");
    });

}
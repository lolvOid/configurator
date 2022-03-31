let scene, camera, renderer, directionalLight, ambientLight, controls;


const viewer = document.getElementById("modelviewer");
const fwidth = viewer.offsetWidth;
const fheight = viewer.offsetHeight;

let wWidth = 2.5,
    wHeight = 6,
    wDepth = 1.5,
    segment_id = [],
    columns, customColumns = 2,
    wLoft = 3;
const thickness = 0.875;
const ftTom = 0.3048;
let isLoft = false;
let wBottom, wTop, wLeft, wRight, wBack, wpLoftTop, wpLoftLeft, wpLoftRight, wpLoftBottom, wpLoftBack;
let segments, offset = 0,

    part = [],
    setColumns = false;

let selectedObject = null,
    selectedObjects = [];
let raycaster, pointer, mouse3D, group;
let exporter;

let composer, effectFXAA, outlinePass, planeOultinePass;


let bBox;
let isCreated = false;
var removed = [];
var adjacentParts = [];
var substitubale = 0;
var columns_group = document.getElementById("columns-group");

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
    _hDoors_parent_group;

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
_hDoors = [];

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
var isDoorOpened = false,
    isLoftOpened = false;
var texLoader = new THREE.TextureLoader();
let wood_albedo;
let wood_normal;
let wood_roughness;

let selectedSprite, selectedMirror;

let _splitterMaterial, _railMaterial, _wardrobeMaterial, _lockerMaterial, _shelfMaterial, _hangerMaterial, _doorMaterial, _columnsMaterial, _extDrawerMaterial, _intSmallMaterial, _intLargeMaterial;
var renderOptionsValue = 0;
var pmremGenerator;
let isHingedDoor = true;
let ssaoPass;

let _doorRails_parent = [],
    _doorRails_parent_group = [],
    _doorRailParent;
init();

animate();

getInputs();
addHorizontalParts();

function init() {

    scene = new THREE.Scene();
    window.scene = scene;
    THREE.Cache.enabled = true;
    camera = new THREE.PerspectiveCamera(25, fwidth / fheight, 0.01, 100);

    camera.position.set(0, 0.5, 15);
    camera.aspect = fwidth / fheight;
    camera.layers.enable(0);
    camera.layers.enable(1);
    camera.layers.enable(2);
    // camera.lookAt(wBottom.position);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    group = new THREE.Group();

    _columnsLoft_group = new THREE.Group();
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

    create_lights();
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
    viewer.appendChild(renderer.domElement);
    post_process();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = true;

    controls.minDistance = 8;
    controls.maxDistance = 9;
    controls.panSpeed = 0;

    controls.enableDamping = true;
    controls.dampingFactor = 0;
    controls.target.set(0, 1.35, 0);



    window.addEventListener('resize', onWindowResize, true);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('click', onClick);


}

function onWindowResize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {

        camera.aspect = fwidth / fheight;
        camera.updateProjectionMatrix();

        renderer.setSize(fwidth, fheight);
        composer.setSize(fwidth, fheight);
        effectFXAA.material.uniforms['resolution'].value.x = 1 / (fwidth * renderer.getPixelRatio());
        effectFXAA.material.uniforms['resolution'].value.y = 1 / (fheight * renderer.getPixelRatio());
    }

}

function animate() {
    requestAnimationFrame(animate);

    controls.update();


    render();

}

function render() {

    $("input:radio[name='columnsOptions']").change(function () {
        if ($(this).is(":checked")) {
            isCreated = true;

        }

    })


    updateWardrobe();
    addLoft(isLoft);
    updateColumnsDoor();
    topShelfOnSelected(plane_index);
    botShelfFilter();
    updateBotShelves(plane_index);
    for (var i = 0; i < customColumns; i++) {
        updateHingedDoorUpSize(i)

        updateLoftDoorUpSize(i)
    }
    for (var i = 0; i < _columnsLoft.length; i++) {
        updateLoftColumns(i);
    }
    columnsCombination();
    setflipDoor();
    updateHingedDoorOnColumnCombined();

    delta = clock.getDelta();
    doorAction();
    loftDoorAction();

    paintWardrobe()
    // renderer.render(scene, camera);
    if (interactivePlanes.length > 0) {
        document.getElementById('column_id').innerHTML = plane_index + 1;

    } else {
        document.getElementById('column_id').innerHTML = "None";
    }
    document.getElementById('capturedImage').src = renderer.domElement.toDataURL();
    renderOption()


    composer.render();


}

function getInputs() {
    chooseColumns_number();

    $("#actionDoor").hide();


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
        removeDoor();
        removeSlideDoors();
        removeFlipDoorSprite();
        removeColumns();
        removeColumnsSprite();
        removeHorizontalSplitter();
        removeInteractivePlane();

        if (isLoft) {

            removeLoftDoors();
            removeLoftColumns()


        }


        $("#actionDoor").hide();
        $("#actionDoor").empty();
        $("#actionDoor").append('<i class="m-lg-1  fa fa-door-open"></i>Open Door ');
        isDoorOpened = false;

    })

    $("input:radio[name='heightOptions']").click(function () {

        removeColumns();
        removeColumnsSprite();
        removeHorizontalSplitter();
        wHeight = $(this).val();

    });

    $("input:radio[name='depthOptions']").click(function () {

        removeColumns();
        removeColumnsSprite();
        removeHorizontalSplitter();
        wDepth = $(this).val();

    });



    $("input:radio[name='doorOptions']").change(function () {
        if ($(this).is(":checked")) {

            if ($(this).val() == 0) {
                $("#chooseColumns").show();
                isHingedDoor = true;
                isCreated = true;
                chooseColumns_number();
                createColumns_Doors(isHingedDoor);
                $("#actionDoor").show();
            } else {

                $("#chooseColumns").hide();
                isHingedDoor = false;
                isCreated = true;
                chooseColumns_number();
                createColumns_Doors(isHingedDoor);

            }
        }
    });



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




    $("#actionDoor").append('<i class="m-lg-1  fa fa-door-open"></i>Open Door ');
    $("#actionDoor").click(function () {


        if (!isDoorOpened) {

            $(this).empty();
            $(this).append('<i class="m-lg-1  fa fa-door-closed"></i>Close Door ');
            isDoorOpened = true;
        } else {
            $(this).empty();
            $(this).append('<i class="m-lg-1  fa fa-door-open"></i>Open Door ');
            isDoorOpened = false;

        }


    })

    // $("#editDimensions").click(function () {
    //     $(this).hide();

    //     $("#doneDimensions").show();
    //     $("#editInterior").hide();
    //     $("#sizeOptions").show();
    //     removeColumns();
    //     removeColumnsSprite();
    //     removeHorizontalSplitter();
    //     removeInteractivePlane();
    //     removeAllInterior();


    //     $("#addloft").prop("checked", false);
    //     $("#loftLabel").html("Add Loft");
    //     $("#loftOptionsPanel").hide();
    //     isLoft = false;
    //     removeLoftDoors();
    //     removeLoftColumns();

    // })
    $("#doneDimensions").click(function () {



        interactivePlane_group.visible = true;
        deleteSprites_group.visible = false;
        flipVertical_group.visible = false;

    })

    $("#export").click(function () {
        Export();
    })
    $("#flipDoor").change(function () {
        _flipDoor($(this).children("option:selected").val());
    })
}


function create_lights() {

    directionalLight = new THREE.DirectionalLight(0xfff3db, 0.7);
    directionalLight.position.set(0.5, 1, 8);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 1024; // default
    directionalLight.shadow.mapSize.height = 1024; // default

    scene.add(directionalLight);

    var directionalLight1 = new THREE.DirectionalLight(0xbfe4ff, 0.5);
    directionalLight1.position.set(-2, 5, 2);

    directionalLight1.castShadow = false;

    directionalLight1.shadow.mapSize.width = 512; // default
    directionalLight1.shadow.mapSize.height = 512;
    scene.add(directionalLight1);


    var directionalLight2 = new THREE.DirectionalLight(0xdedede, 0.4);
    directionalLight2.position.set(0, 3, -3);
    directionalLight2.castShadow = false;

    directionalLight2.shadow.mapSize.width = 512; // default
    directionalLight2.shadow.mapSize.height = 512;
    scene.add(directionalLight2);

    var hemiLight = new THREE.HemisphereLight(0xfff2e3, 0xd1ebff, 0.65);
    scene.add(hemiLight);
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
    return _columns[index];

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
            adjacentParts = [];
        }
    }
}

function updateColumns() {

    offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;
    for (var i = 0; i < customColumns - 1; i++) {
        if (!_columns[i]) {
            createColumns(i);
            if(!isHingedDoor){
                var subtract = ftTom * 1.35 / 12

                if(i!=3 && i!=7){
                    console.log("pl")
                    _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom - subtract);
                    _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, ((thickness / 24) * ftTom) - subtract/2);
                }else{
                    _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                    _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, ((thickness / 24) * ftTom));
                }
                
               
            }else{
                _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, ((thickness / 24) * ftTom));
            }

        } else {
            if (_columns[i] instanceof THREE.Mesh) {

                if(!isHingedDoor){

                    if(i!=3 || i!=7){
                        _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom - subtract);
                        _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, ((thickness / 24) * ftTom) - subtract/2);
                    }else{
                        _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                        _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, ((thickness / 24) * ftTom));
                    }
                }else{
                _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, ((thickness / 24) * ftTom));
                }
            }
        }
    }
    _columns_group.position.set(offset + wLeft.position.x, _columns_group.position.y, _columns_group.position.z);

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
            updateHorizontalSplitter(i);


        } else {
            updateHorizontalSplitter(i);

        }



    }
    _m_splitters_group.position.set(offset / 2 + wLeft.position.x, _m_splitters_group.position.y, _m_splitters_group.position.z);


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

    if (!_m_splitters[index]) {



        if(!isHingedDoor){
            _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom );
            _m_splitters[index].position.set(index * offset, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, wLeft.position.z / 2 );
    
        }else{
            _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
            _m_splitters[index].position.set(index * offset, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, wLeft.position.z / 2 );
    
        }
       
    } else {
        if (_m_splitters[index] instanceof THREE.Mesh) {
            if(!isHingedDoor){
                _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom - subtract/2);
                _m_splitters[index].position.set(index * offset, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, wLeft.position.z / 2 );
            }else{
                _m_splitters[index].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
                _m_splitters[index].position.set(index * offset, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, wLeft.position.z / 2);
            }
           
        }
    }
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


    $("#addED").click(function () {

        if (!_extDrawers[plane_index]) {
            for (var i = 0; i < customColumns; i++) {
                createExternalDrawer(i);
                updateExternalDrawer(i);
                updateInternalDrawerLarge(i);
            }


        } else {


            return;
        }

        if (onHeightChanged(plane_index) > 0) {
            if (_bot_shelf_parent[plane_index] instanceof THREE.Mesh) {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index);
                _bot_shelf_parent[plane_index].visible = false;
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

        if (onHeightChanged(plane_index) > 0) {
            if (_bot_shelf_parent[plane_index] instanceof THREE.Mesh) {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index);
                _bot_shelf_parent[plane_index].visible = false;
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
        if (onHeightChanged(plane_index) > 0) {
            if (_bot_shelf_parent[plane_index] instanceof THREE.Mesh) {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index);
                _bot_shelf_parent[plane_index].visible = false;
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


    })

    $("#addBottomShelf").click(function () {


        if (onHeightChanged(plane_index) > 0) {
            if (!(_bot_shelf_parent[plane_index] instanceof THREE.Mesh)) {
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index)

                _bot_shelf_parent[plane_index].visible = true;
            } else {
                removeBotShelves(plane_index);
                createBotShelves(onHeightChanged(plane_index), plane_index);
                updateBotShelves(plane_index);
                _bot_shelf_parent[plane_index].visible = true;

            }
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



    if (wHeight < 6.5) {
        $("#addBottomShelf").addClass("disabled");
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
        if (_largeIntDrawers[plane_index]) {
            $("#addED").addClass("disabled");
        } else {
            $("#addED").removeClass("disabled");
        }
        if (_extDrawers.length > 0) {
            $("#addIDL").addClass("disabled");
        } else {
            $("#addIDL").removeClass("disabled");
        }
    } else if (wHeight == 6.5) {
        $("#addBottomShelf").removeClass("disabled");

        if (_extDrawers.length > 0) {
            $("#addIDL").addClass("disabled");
        } else {
            $("#addIDL").removeClass("disabled");
        }
        if (_largeIntDrawers.length > 0) {
            $("#addED").addClass("disabled");
        } else {
            $("#addED").removeClass("disabled");
        }
    } else if (wHeight > 6.5) {
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

    wBack = new THREE.Mesh(g, _wardrobeMaterial);
    wBack.name = "wardrobe_back";
    wBack.position.set(0, 0, 0);
    wBottom.layers.set(0);

    wLeft = new THREE.Mesh(g, _wardrobeMaterial);
    wLeft.name = "wardrobe_left";
    wLeft.position.set(0, 0, 0);
    wLeft.layers.set(0);

    wRight = new THREE.Mesh(g, _wardrobeMaterial);
    wRight.name = "wardrobe_right";
    wRight.position.set(0, 0, 0);
    wRight.layers.set(0);

    wTop = new THREE.Mesh(g, _wardrobeMaterial);
    wTop.name = "wardrobe_top";
    wTop.position.set(0, 0, 0);
    wTop.layers.set(0);

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

    scene.add(wpLoftBottom);
    scene.add(wpLoftBack);
    scene.add(wpLoftLeft);
    scene.add(wpLoftRight);
    scene.add(wpLoftTop);

}

function updateWardrobe() {
    if (wBottom) {
        wBottom.scale.set(wWidth * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
        wBottom.position.set(0, (2 / 12) * ftTom + (thickness / 24) * ftTom, ((thickness / 24) * ftTom));

    }
    if (wBack) {
        wBack.scale.set(wWidth * ftTom, wHeight * ftTom - (2 / 12 * ftTom), (thickness / 12) * ftTom);
        wBack.position.set(0, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, -wBottom.scale.z / 2);

    }

    if (wTop) {
        wTop.scale.set((wWidth * ftTom), (thickness / 12) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wTop.position.set(0, ((wBack.scale.y) + wBottom.position.y) - thickness / 14 * ftTom, 0);

        // ((wBack.scale.y)-wTop.scale.y/2+wBottom.position.y+wBottom.scale.y/2-(thickness/12)*ftTom)
    }


    if (wLeft) {
        wLeft.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
        wLeft.position.set(-(((thickness / 24) * ftTom) + (wBack.scale.x / 2)), (wBack.scale.y / 2) + (wBottom.position.y) - wBottom.scale.y - thickness / 24 * ftTom, 0);

    }
    if (wRight) {
        wRight.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (2 * thickness / 12) * ftTom + wDepth * ftTom);
        wRight.position.set((((thickness / 24) * ftTom) + (wBack.scale.x / 2)), (wBack.scale.y / 2) + (wBottom.position.y) - wBottom.scale.y - thickness / 24 * ftTom, 0);
    }


    if (wpLoftBottom) {
        wpLoftBottom.scale.set(wWidth * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * (thickness / 12) * ftTom));
        wpLoftBottom.position.set(wTop.position.x, wTop.position.y + wpLoftBottom.scale.y, wTop.position.z);
    }

    if (wpLoftBack) {
        wpLoftBack.scale.set(wWidth * ftTom + (wpLoftLeft.scale.x + wpLoftRight.scale.x), wLoft * ftTom, (thickness / 12) * ftTom);
        wpLoftBack.position.set(0, wpLoftBottom.position.y + wpLoftBack.scale.y / 2 - wpLoftBottom.scale.y / 2, -wpLoftBottom.scale.z / 2 + (thickness / 24) * ftTom);
    }
    if (wpLoftLeft) {
        wpLoftLeft.scale.set(thickness / 12 * ftTom, wLoft * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wpLoftLeft.position.set(-(thickness / 24 * ftTom + wpLoftBottom.scale.x / 2), wpLoftBottom.position.y + wpLoftLeft.scale.y / 2 - wpLoftBottom.scale.y / 2, 0);
    }


    if (wpLoftRight) {
        wpLoftRight.scale.set(thickness / 12 * ftTom, wLoft * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wpLoftRight.position.set((thickness / 24 * ftTom + wpLoftBottom.scale.x / 2), wpLoftBottom.position.y + wpLoftRight.scale.y / 2 - wpLoftBottom.scale.y / 2, 0);
    }
    if (wpLoftTop) {
        wpLoftTop.scale.set(wWidth * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * (thickness / 12) * ftTom));
        wpLoftTop.position.set(0, wpLoftBack.scale.y + wpLoftBottom.position.y - (thickness / 12) * ftTom, 0);
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


        _extDrawers[index].position.set(index * offset, wBottom.position.y + _extDrawers[index].scale.y / 2 + (thickness / 24) * ftTom, wLeft.position.z / 2 + (thickness / 24) * ftTom);


        _extDrawers_group.position.set(offset / 2 + wLeft.position.x, _extDrawers_group.position.y, _extDrawers_group.position.z);
    }



    if (_extDrawers_splitters[index] instanceof THREE.Mesh) {
        _extDrawers_splitters[index].scale.set(offset - thickness / 12 * ftTom, _m_splitters[index].scale.y, _m_splitters[index].scale.z + (thickness / 12) * ftTom);
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
    _largeIntDrawers[index].scale.set(offset - (thickness / 12) * ftTom, (10 / 12) * ftTom, wDepth * ftTom)
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


        if (!_extDrawers[index]) {

            _largeIntDrawers[index].position.set(index * offset, wBottom.position.y + _largeIntDrawers[index].scale.y / 2 + thickness / 24 * ftTom, wLeft.position.z / 2);
        } else {

            _largeIntDrawers[index].position.set(index * offset, _extDrawers_splitters[index].position.y + _largeIntDrawers[index].scale.y / 2 + (thickness / 24) * ftTom, wLeft.position.z / 2);
        }
        _largeIntDrawers_group.position.set(offset / 2 + wLeft.position.x, _largeIntDrawers_group.position.y, _largeIntDrawers_group.position.z);
    }



    if (_largeIntDrawers[index] instanceof THREE.Mesh) {
        _largeIntDrawers_splitters[index].scale.set(offset - thickness / 12 * ftTom, _m_splitters[index].scale.y, _m_splitters[index].scale.z);
        _largeIntDrawers_splitters[index].position.set(_largeIntDrawers[index].position.x, _largeIntDrawers[index].position.y + _largeIntDrawers[index].scale.y / 2 + (thickness / 24 * ftTom), _largeIntDrawers[index].position.z);
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
        _lockers[index].scale.set(offset - (thickness / 12) * ftTom, (7.125 / 12) * ftTom, wDepth * ftTom)
        _lockers[index].position.set(index * offset, _m_splitters[index].position.y - _lockers[index].scale.y / 2 - _m_splitters[index].scale.y / 2, wLeft.position.z / 2);

    }

    _locker_group.position.set(offset / 2 + wLeft.position.x, _locker_group.position.y, _locker_group.position.z);



    if (_locker_splitters[index] instanceof THREE.Mesh) {
        _locker_splitters[index].scale.set(offset - thickness / 12 * ftTom, _m_splitters[index].scale.y, _m_splitters[index].scale.z);
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
        _smallIntDrawers[index].scale.set(offset - (thickness / 12) * ftTom, (8 / 12) * ftTom, wDepth * ftTom)
        _smallIntDrawers_group.position.set(offset / 2 + wLeft.position.x, _smallIntDrawers_group.position.y, _smallIntDrawers_group.position.z);
        if (!_lockers[index]) {

            _smallIntDrawers[index].position.set(index * offset, _m_splitters[index].position.y - _smallIntDrawers[index].scale.y / 2 - (thickness / 24) * ftTom, wLeft.position.z / 2);
        } else {

            _smallIntDrawers[index].position.set(index * offset, _lockers[index].position.y - _smallIntDrawers[index].scale.y - (thickness / 24) * ftTom, wLeft.position.z / 2);
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


    var vertical_offset = (1 * ftTom);


    if (_top_shelves_parent[index] instanceof THREE.Group) {

        for (var j = 0; j < _top_shelves_parent[index].children.length; j++) {

            if (_top_shelves_parent[index].children[j] instanceof THREE.Mesh) {
                _top_shelves_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);

                _top_shelves_parent[index].children[j].position.set(index * offset, (j * vertical_offset), wLeft.position.z / 2);

            }

        }
        _top_shelves_parent[index].position.set(offset / 2 + wLeft.position.x, wTop.position.y - (_top_shelves_parent[index].children.length * ftTom) + (thickness / 12) * ftTom + wTop.scale.y / 2, _top_shelves_parent[index].position.z);
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
    _bot_shelf_parent[index].visible = false;
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
        if (_lockers[index] instanceof THREE.Mesh || _largeIntDrawers[index] instanceof THREE.Mesh ||
            _smallIntDrawers[index] instanceof THREE.Mesh || _extDrawers[index]) {

            //No Locker
            if (!_lockers[index]) {
                if (_bot_shelf_parent[index]) {
                    // No Other Parts
                    if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {
                        if (wHeight > 6.5) {

                            dist = (_m_splitters[index].position.y - wBottom.position.y);
                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1);
                            pos = _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;
                        }
                    }
                    //ID_L
                    if (_largeIntDrawers[index] && !_smallIntDrawers[index] && !_extDrawers[index]) {
                        dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 24) * ftTom;
                        pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    }
                    //ID_S
                    else if (_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {
                        dist = (_smallIntDrawers[index].position.y - wBottom.position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 24) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (2 * thickness / 12) * ftTom;
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
            //No Locker
            else {
                if (_bot_shelf_parent[index]) {
                    //Nothing
                    if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {

                        if (_bot_shelf_parent[index].children.length > 1) {
                            dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (wBottom.scale.y / 2 - wBottom.position.y);
                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (((_bot_shelf_parent[index].children.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                            pos = _lockers[index].position.y - _lockers[index].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;

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

        } else {
            if (!_lockers[index] && !_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {


                if (wHeight > 6.5) {

                    if (_m_splitters[index]) {
                        dist = (_m_splitters[index].position.y - wBottom.position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1);
                        pos = _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset + (thickness / 24) * ftTom;
                    }

                }
            }
        }

        if (_bot_shelf_parent[index] instanceof THREE.Group) {
            for (var j = 0; j < _bot_shelf_parent[index].children.length; j++) {
                if (_bot_shelf_parent[index].children[j] instanceof THREE.Mesh) {
                    _bot_shelf_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
                    _bot_shelf_parent[index].children[j].position.set(index * offset, (j * vertical_offset), wLeft.position.z / 2 + (thickness / 24) * ftTom);
                }

            }
        }
        _bot_shelf_parent[index].position.set(offset / 2 + wLeft.position.x, pos, _bot_shelf_parent[index].position.z);
        _bot_shelf_parent[index].visible = true;
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
        interactivePlanes[index].scale.set(offset - thickness / 12 * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y);
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
                deleteSprites_group.remove(deleteSprites[i])
                _columns_group.remove(_columns[i]);
                removed.push(_columns[i]);
            }

        }




        // setflipDoor();
        selectedObject = null;

    }

    if (selectedPlane) {

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
    }
    if (selectedMirror) {
        if (flipVerticalSprite.includes(selectedMirror)) {
            var flipIndex = flipVerticalSprite.indexOf(selectedMirror);
            _flipDoor(flipIndex);
        }

    }

    // plane_index = interactivePlanes.findIndex(e => e === selectedObject);

}

function onPointerMove(event) {

    if (selectedSprite instanceof THREE.Sprite) {
        if (selectedSprite.visible) {
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

    if (selectedMirror) {
        selectedMirror.material.map = onNormalFlipSprite;
        selectedMirror = null;
    }

    if (selectedPlane) {
        outlinePass.visibleEdgeColor.set("#fcbe03")
        outlinePass.edgeStrength = 10;
        outlinePass.edgeGlow = 0;
        outlinePass.selectedObjects = selectedObjects;
        selectedPlane = null
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

    // URL.revokeObjectURL( url ); breaks Firefox...

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
    // Parse the input and generate the glTF output
    exporter.parse(
        scene,
        // called when the gltf has been generated
        function (gltf) {

            if (gltf instanceof ArrayBuffer) {

                saveArrayBuffer(gltf, 'wardrobe.glb');

            } else {

                const output = JSON.stringify(gltf, null, 2);
                console.log(output);
                saveString(output, 'wardrobe.gltf');

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





    ssaoPass = new THREE.SSAOPass(scene, camera, fwidth, fheight);
    ssaoPass.kernalRadius = 6;
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
    // outlinePass.visibleEdgeColor.set("#ff0000");

    // outlinePass.hiddenEdgeColor.set("#ff0000");
    composer.addPass(outlinePass);
    composer.addPass(planeOultinePass);
    const pixelRatio = renderer.getPixelRatio();

    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);

    // effectFXAA.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
    // effectFXAA.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
    // effectFXAA.uniforms['resolution'].value.set(1 / fwidth, 1 / fheight);
    composer.addPass(effectFXAA);

    const copyPass = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(copyPass);

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
            columns_radio.setAttribute("onclick", "set_columns_number(" + (i + 1) + ")");
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


    adjacentParts = [];

}

function onHeightChanged(plane_index) {
    var row = 0;



    if (wHeight == 6.5) {
        if (!_largeIntDrawers[plane_index] && !_extDrawers[plane_index] && !_smallIntDrawers[plane_index] && !_lockers[plane_index]) {
            row = 0;
        } else {
            row = 1;
        }

    } else if (wHeight == 7 && !_lockers[plane_index] && !_largeIntDrawers[plane_index] && !_extDrawers[plane_index] && !_smallIntDrawers[plane_index]) {
        row = 3;
    } else if (wHeight == 7 && !_lockers[plane_index]) {
        row = 1;
    } else if (wHeight == 7 && _lockers[plane_index] && !_smallIntDrawers[plane_index] || _largeIntDrawers[plane_index] && !_extDrawers[plane_index]) {
        row = 2;
    } else if (wHeight == 7 && _lockers[plane_index] && _smallIntDrawers[plane_index] && !_largeIntDrawers[plane_index] && !_extDrawers[plane_index]) {

        row = 3;

    } else if (wHeight == 7 && _lockers[plane_index] && !_smallIntDrawers[plane_index] || !_largeIntDrawers[plane_index] && _extDrawers[plane_index]) {
        row = 2;
    } else if (wHeight == 7 && !_lockers[plane_index] && !_smallIntDrawers[plane_index] && _largeIntDrawers[plane_index] && _extDrawers[plane_index]) {
        row = 2;
    } else if (wHeight == 7 && _lockers[plane_index] && !_smallIntDrawers[plane_index] || _largeIntDrawers[plane_index] && !_extDrawers[plane_index]) {
        row = 2;
    } else if (wHeight == 7 && _lockers[plane_index] && !_smallIntDrawers[plane_index] || !_largeIntDrawers[plane_index] && _extDrawers[plane_index]) {
        row = 2;
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
                        removeInternalDrawerLarge(i + 1);
                    } else if (_largeIntDrawers[i + 1]) {
                        var a = _largeIntDrawers[i + 1];

                        var b = _largeIntDrawers_splitters[i + 1];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        b.scale.setX(sizeToChange);
                        b.position.setX(a.position.x);

                        removeInternalDrawerLarge(i);
                    }

                    //Hangers
                    if (_hangers[i]) {
                        var a = _hangers[i];
                        a.scale.setY(sizeToChange);
                        a.position.setX(posToChange);
                        removeHanger(i + 1);
                    } else if (_hangers[i + 1]) {
                        var a = _hangers[i + 1];
                        a.scale.setY(sizeToChange);
                        a.position.setX(posToChange);
                        removeHanger(i);
                    }
                    //Top Shelves
                    if (_top_shelves_parent[i]) {
                        var a = _top_shelves_parent[i];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }

                        })
                        removeTopShelves(i + 1);

                    } else if (_top_shelves_parent[i + 1]) {
                        var a = _top_shelves_parent[i + 1];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }

                        })
                        removeTopShelves(i);
                    }

                    //Bottom Shelves
                    if (_bot_shelf_parent[i]) {
                        var a = _bot_shelf_parent[i];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }

                        })
                        removeBotShelves(i + 1);

                    } else if (_bot_shelf_parent[i + 1]) {
                        var a = _bot_shelf_parent[i + 1];
                        a.traverse(function (e) {
                            if (e instanceof THREE.Mesh) {
                                e.scale.setX(sizeToChange);
                                e.position.setX(posToChange);
                            }

                        })
                        removeBotShelves(i);
                    }


                    //Horizontal Splitter
                    if (_m_splitters[i]) {
                        var a = _m_splitters[i];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);

                        // removeHorizontalSplitter(i+1);
                    } else if (_m_splitters[i + 1]) {
                        var a = _m_splitters[i];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
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
                                b.scale.setX(offset);
                                var a = _smallIntDrawers[i];
                                a.scale.setX(sizeToChange);
                                a.position.setX(posToChange);
                                var c = _lockers[i];
                                var d = _locker_splitters[i];
                                c.scale.setX(offset);
                                d.scale.setX(offset);
                            } else {
                                createInternalDrawerSmall(i + 1);
                                updateInternalDrawerSmall(i + 1);

                                var b = _smallIntDrawers[i + 1];
                                b.scale.setX(offset);
                                var c = _lockers[i];
                                var d = _locker_splitters[i];
                                c.scale.setX(offset);
                                d.scale.setX(offset);
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
                                b.scale.setX(offset);
                            }
                        } else {
                            var b = _smallIntDrawers[i + 1];
                            updateInternalDrawerSmall(i + 1)
                            b.scale.setX(offset);
                        }

                        if (_lockers[i]) {
                            var b = _smallIntDrawers[i + 1];
                            b.scale.setX(offset);
                            var a = _lockers[i];
                            var c = _locker_splitters[i]
                            a.scale.setX(offset);
                            c.scale.setX(offset);
                        } else {
                            createLocker(i);
                            updateLocker(i);
                            var a = _lockers[i];
                            var b = _locker_splitters[i]
                            a.scale.setX(offset);
                            b.scale.setX(offset);
                        }
                    } else {
                        if (_lockers[i]) {
                            createInternalDrawerSmall(i + 1);
                            updateInternalDrawerSmall(i + 1);
                            var b = _smallIntDrawers[i + 1];
                            b.scale.setX(offset);

                            var c = _lockers[i];
                            var d = _locker_splitters[i];
                            c.scale.setX(offset);
                            d.scale.setX(offset);
                        } else if (_lockers[i + 1]) {
                            removeLocker(i + 1);
                            createLocker(i);
                            updateLocker(i);
                            createInternalDrawerSmall(i + 1);
                            updateInternalDrawerSmall(i + 1);
                            var b = _smallIntDrawers[i + 1];
                            b.scale.setX(offset);

                            var c = _lockers[i];
                            var d = _locker_splitters[i];
                            c.scale.setX(offset);
                            d.scale.setX(offset);
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

    removeDoor();
    removeSlideDoors();
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
    var posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
    var scaleY = wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y;
    if (_extDrawers_splitters.length > 0) {
        posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2 + ftTom / 2 + thickness / 24 * ftTom;
        scaleY = wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - ((thickness / 12) * ftTom + ftTom) - wBottom.position.y;
    } else {
        posY = (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2;
        scaleY = wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y;
    }

    if (_hDoors_parent[index] instanceof THREE.Group) {

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
    var scaleY = wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y;
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

                                                child.material.color.set("#fafa22");
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
                                                    child.material.color.set("#fafa22");
                                                } else {
                                                    child.material.color.set("#49eb34");
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

                                                child.material.color.set("#fafa22");
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

                                            child.material.color.set("#49eb34");
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

                                                child.material.color.set("#49eb34");
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

                                                child.material.color.set("#34deeb");
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

    var x = wWidth * ftTom;
    var y = wHeight * ftTom;
    wood_albedo.repeat.set(x, y);
    wood_roughness.repeat.set(x, y);
    wood_normal.repeat.set(x, y);


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

    if (deleteSprites.includes(deleteSprites[index])) {
        deleteSprites[index].scale.set(0.15, 0.15);
        deleteSprites[index].position.set(index * offset, wBottom.position.y - 0.2);

        deleteSprites_group.position.set(offset + wLeft.position.x, deleteSprites_group.position.y, deleteSprites_group.position.z);
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
    wood_albedo = texLoader.load("./textures/Wood_ZebranoVeneer_512_albedo.jpg");
    wood_normal = texLoader.load("./textures/Wood_ZebranoVeneer_512_normal.jpg");
    wood_roughness = texLoader.load("./textures/Wood_ZebranoVeneer_512_roughness.jpg");
    wood_albedo.wrapS = THREE.MirroredRepeatWrapping;
    wood_albedo.wrapT = THREE.MirroredRepeatWrapping;
    wood_normal.wrapS = THREE.MirroredRepeatWrapping;
    wood_normal.wrapT = THREE.MirroredRepeatWrapping;
    wood_roughness.wrapS = THREE.MirroredRepeatWrapping;
    wood_roughness.wrapT = THREE.MirroredRepeatWrapping;

    _wardrobeMaterial = new THREE.MeshStandardMaterial({
        color: 0xdfdfdf,
        roughness: 0.8,
        name: "wm_wardrobe"
    });
    _railMaterial = new THREE.MeshStandardMaterial({
        name: "wm_door_rail",
        color: 0xfdfdfd,
        roughness: 0.2,
        metalness: 0.8
    });
    _splitterMaterial = new THREE.MeshStandardMaterial({
        color: 0x22ffaa,
        roughness: 0.8,
        name: "wm_splitter"
    });
    _lockerMaterial = new THREE.MeshStandardMaterial({
        color: 0xddffdd,
        roughness: 0.8,
        name: "wm_locker"
    });
    _doorMaterial = new THREE.MeshStandardMaterial({
        color: 0xfafa22,
        roughness: 0.8,
        name: "wm_door"
    });
    _hangerMaterial = new THREE.MeshStandardMaterial({
        color: 0xfdfdfd,
        name: "wm_hanger",
        roughness: 0.2,
        metalness: 1
    });
    _shelfMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaaaee,
        roughness: 0.8,
        name: "wm_shelf"
    });
    _columnsMaterial = new THREE.MeshStandardMaterial({
        color: 0xff55dd,
        roughness: 0.8,
        name: "wm_column"
    });
    _extDrawerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff7f50,
        roughness: 0.8,
        name: "wm_extDrawer"
    });
    _intSmallMaterial = new THREE.MeshStandardMaterial({
        color: 0xadaffa,
        roughness: 0.8,
        name: "wm_intSmallDrawer"
    });
    _intLargeMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa7f50,
        roughness: 0.8,
        name: "wm_intLargeDrawer"
    });

    new THREE.RGBELoader()
        .setPath('./hdri/')
        .load('studio.hdr', function (texture) {

            var envMap = pmremGenerator.fromEquirectangular(texture).texture;
            texture.mapping = THREE.EquirectangularReflectionMapping;

            // scene.background = new THREE.Color(0xefefef);
            // scene.environment = envMap;
            _railMaterial.envMap = envMap;
            _hangerMaterial.envMap = envMap;
            texture.dispose();
            pmremGenerator.dispose();
        })
}

function renderOption() {
    var defaultColor = "#dfdfdf";
    var splitterColor = "#d0d0d0";
    var debug_extDrawerColor = "#ff7f50";
    var debug_intSmallColor = "#adaffa";
    var debug_intLargeColor = "#aa7f50";
    var debug_splitterColor = "#22ffaa";
    var debug_topShelfColor = "#faaaee";
    var debug_botShelfColor = "#faaaee";
    var debug_columns_color = "#ff55dd";
    var debug_locker_color = "#ddffdd";
    var debug_door_color = "#fafa22"
    var wireframeColor = "#000000";
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
                        child.material.color.set(defaultColor)
                    }
                })
            }
        })
        _wardrobeMaterial.color.set(defaultColor);
        _extDrawerMaterial.color.set(defaultColor);
        _splitterMaterial.color.set(defaultColor);
        _doorMaterial.color.set(defaultColor);
        _intLargeMaterial.color.set(defaultColor);
        _intSmallMaterial.color.set(defaultColor);
        _lockerMaterial.color.set(defaultColor);
        _columnsMaterial.color.set(defaultColor);
        _shelfMaterial.color.set(defaultColor);
        ssaoPass.output = THREE.SSAOPass.OUTPUT.Default;
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
    } else if (renderOptionsValue == 2) {

        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {

                if (child.visible) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.visible = true;
                    child.material.wireframe = true;
                    child.material.wireframeLinejoin = "round";
                    child.material.wireframeLinecap = "square";
                }



            }
        })
    }



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

        removeColumns();
        removeColumnsSprite();
        removeDoor();
        removeSlideDoors();
        removeHorizontalSplitter();
        removeInteractivePlane();




        updateColumns();
        updateColumnSprite();
        deleteSprites_group.visible = true;
        isCreated = false;
    }
}

function createColumns_Doors(bool) {

    updateColumns();
    deleteSprites_group.visible = true;


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
    _rLeft.scale.set(ftTom * 0.03125 / 12, ftTom * 0.5 / 12 - _rBottom.scale.y, 1);
    _rRight.scale.set(ftTom * 0.03125 / 12, ftTom * 0.5 / 12 - _rBottom.scale.y, 1);
    _rMiddle.scale.set(ftTom * 0.03125 / 12, ftTom * 0.5 / 12 - _rBottom.scale.y, 1);


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



function updateDoorRail() {

    var posZ = wBottom.position.z + wBottom.scale.z / 2 - (ftTom * 1.35 / 12) / 2;

    if(_doorRailParent instanceof THREE.Group){
        
        for (var i = 0; i < _doorRailParent.children.length; i++) {
       
            if (_doorRails_parent_group[i] instanceof THREE.Group) {
               
                if(i==0){
                    _doorRails_parent_group[i].position.set( _columns[1].position.x  ,   _doorRailParent.position.y,  _doorRailParent.position.z)
                }else if(i==1){
                    _doorRails_parent_group[i].position.set( _columns[5].position.x    ,   _doorRailParent.position.y,  _doorRailParent.position.z)
                }else{
                    _doorRails_parent_group[i].position.set( _columns[9].position.x  ,   _doorRailParent.position.y,  _doorRailParent.position.z)
                }
                console.log(i)


                for (var j = 0; j < _doorRails_parent_group[i].children.length; j++) {
                    if (_doorRails_parent_group[i].children[j] instanceof THREE.Group) {
    
                       
                        var rail =  _doorRails_parent_group[i].children[j];
                        if (j == 0) {
                          
                            rail.name = "rail_top"
                            rail.scale.setZ( (_columns[0].position.x - _columns[2].position.x )- 2* offset + thickness/12 *ftTom )
                            rail.position.set (0, wTop.position.y - wTop.scale.y / 2 - ftTom * 0.05 / 24, posZ);
                            rail.rotation.x=(180 * THREE.Math.DEG2RAD); 
                            rail.rotation.y = (90 * THREE.Math.DEG2RAD) 
                            // rail.rotateX(180 * THREE.Math.DEG2RAD);
                            // rail.rotateY(90 * THREE.Math.DEG2RAD);
                        } 
                        else if(j==_doorRails_parent_group[i].children.length-1){
                            rail.name = "rail_bottom"
                            rail.scale.setZ( (_columns[0].position.x - _columns[2].position.x )- 2* offset + thickness/12 *ftTom )
                            rail.position.set (0, wBottom.scale.y/2 + wBottom.position.y + ftTom * 0.05 / 24, posZ);
                          
                            rail.rotation.y = (90 * THREE.Math.DEG2RAD) 
                        }
                       
                        else if(j==1){
                            rail.name = "rail_left"
                            rail.scale.setZ(wHeight * ftTom - (2 / 12 * ftTom) + thickness / 24 * ftTom +ftTom * 0.05 / 24 - wBottom.position.y )
                            if(i!=0){
                                if(i<2){
                                    rail.position.set ( _doorRails_parent_group[i].position.x -_columns[5].position.x - 2*offset   + thickness/24 * ftTom  + ftTom * 0.05 / 24, wBack.scale.y/2- wBottom.scale.y/2 + wBottom.position.y, posZ);
                                }else{
                                    rail.position.set ( _doorRails_parent_group[i].position.x -_columns[7].position.x - 4*offset    + thickness/24 * ftTom  + ftTom * 0.05 / 24, wBack.scale.y/2- wBottom.scale.y/2 + wBottom.position.y, posZ);
                                }
                                
                            }else{
                                rail.position.set ( _doorRails_parent_group[i].position.x - 3*offset + thickness/24 * ftTom  + ftTom * 0.05 / 24, wBack.scale.y/2- wBottom.scale.y/2 + wBottom.position.y, posZ);
                            }
                            
                            rail.rotation.x = (90 * THREE.Math.DEG2RAD) 
                            rail.rotation.z = (-90 * THREE.Math.DEG2RAD) 
                        }
                        else {
                            rail.name = "rail_right"
                            rail.scale.setZ(wHeight * ftTom - (2 / 12 * ftTom) + thickness / 24 * ftTom  +ftTom * 0.05 / 24- wBottom.position.y )
                            if(i!=0){
                                if(i<2){
                                    rail.position.set ( _doorRails_parent_group[i].position.x -_columns[5].position.x + 2*offset   - thickness/24 * ftTom - ftTom * 0.05 / 24, wBack.scale.y/2- wBottom.scale.y/2 + wBottom.position.y, posZ);
                                }else{
                                    rail.position.set ( _doorRails_parent_group[i].position.x -_columns[7].position.x - thickness/24 * ftTom - ftTom * 0.05 / 24, wBack.scale.y/2- wBottom.scale.y/2 + wBottom.position.y, posZ);
                                }
                                
                            }else{
                                rail.position.set ( _doorRails_parent_group[i].position.x - thickness/24 * ftTom + offset - ftTom * 0.05 / 24, wBack.scale.y/2- wBottom.scale.y/2 + wBottom.position.y, posZ);
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
    updateDoorRail();
}


function removeSlideDoors(){
    
    _doorRails_parent_group.forEach(e=>{
        _doorRailParent.remove(e);
    })
}
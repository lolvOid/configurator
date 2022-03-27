let scene, camera, renderer, directionalLight, ambientLight, controls;


const viewer = document.getElementById("modelviewer");
const fwidth = viewer.clientWidth;
const fheight = viewer.clientHeight;

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

let composer, effectFXAA, outlinePass;


let bBox;
let isCreated = true;
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

let flippableDoor = [];
var defaultRotation = new THREE.Quaternion();

var rowCount = 0;
var isSplitterCreated = false;
var removed_index, removed_id = [],
    removed_plane = [];
var clock;
var delta = 0;
_hDoors = [];

var isDoorOpened = false;
init();
animate();
var currenWidth = 2.5,
    currentHeight = 6,
    currentDepth = 1.5;

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


    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    viewer.appendChild(renderer.domElement);
    post_process();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableDamping = true;

    controls.minDistance = 8;
    controls.maxDistance = 9;
    controls.panSpeed = 0;

    controls.enableDamping = true;
    controls.dampingFactor = 0.0;
    controls.target.set(0, 1.5, 0);



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


    $("input:radio[name='columnsOptions']").click(function () {
        removeColumns();
        updateColumns();

    })

    updateWardrobe();
    topShelfOnSelected(plane_index);
    botShelfFilter();

    columnsCombination();
    delta = clock.getDelta();
    doorAction();
    
    // renderer.render(scene, camera);
    document.getElementById('column_id').innerHTML = plane_index + 1;
    document.getElementById('capturedImage').src = renderer.domElement.toDataURL();
    composer.render();
    // interactivePlane_group.visible = true;

}

function getInputs() {
    chooseColumns_number();



    $("#editDimensions").hide();
    $("#editInterior").hide();

    $("#width").on("input", function () {
        wWidth = $("#width").val();

        chooseColumns_number();
        removeColumns();
        removeHorizontalSplitter();
        removeExternalDrawer();
        removeInteractivePlane();

    })

    $("input:radio[name='heightOptions']").click(function () {

        removeColumns();
        removeHorizontalSplitter();
        removeExternalDrawer();
        wHeight = $(this).val();

    });

    $("input:radio[name='depthOptions']").click(function () {

        removeColumns();
        removeHorizontalSplitter();
        removeExternalDrawer();
        wDepth = $(this).val();

    });


    $("#doneWidth").click(function () {


    })

    $("#loftOptionsPanel").hide();

    $("#addloft").change(function () {
        addLoft($(this).is(":checked"));
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

    $("#editDimensions").click(function () {
        $(this).hide();

        $("#doneDimensions").show();
        $("#editInterior").hide();
        $("#sizeOptions").show();
        removeColumns();
        removeHorizontalSplitter();
        removeExternalDrawer();
        removeAllInterior();
        removeInteractivePlane();
    })
    $("#doneDimensions").click(function () {

        updateColumns();

        $("#sizeOptions").hide();
        $("#editDimensions").show();
        $("#editInterior").show();

        $(this).hide();


        generateInteractivePlanes(customColumns);
        updateInteractivePlane();

    })
    $("#export").click(function () {
        Export();
    })

}


function create_lights() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 0.5).normalize();

    scene.add(directionalLight);

    var directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(0, 0, -0.5).normalize();


    scene.add(directionalLight1);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light

    scene.add(ambientLight);
}



function createColumns(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xff55dd
    });
    m.name = "wm_columns";
    var mesh = new THREE.Mesh(g, m);
    mesh.name = "w_columns_" + index;


    _columns[index] = mesh;
    _columns_group.name = "w_columns";
    _columns_group.add(_columns[index]);

    // scene.add(_lockers[index]);
    scene.add(_columns_group);
    return _columns[index];

}

function removeColumns(index) {

    if (index != null) {
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
        }
    }
}

function updateColumns() {

    offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;
    for (var i = 0; i < customColumns - 1; i++) {
        if (!_columns[i]) {
            createColumns(i);
            _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
            _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, (((thickness / 24)) * ftTom));

        } else {
            if (_columns[i] instanceof THREE.Mesh) {
                _columns[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom + wDepth * ftTom);
                _columns[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, (((thickness / 24)) * ftTom));
            }
        }
    }
    _columns_group.position.set(offset + wLeft.position.x, _columns_group.position.y, _columns_group.position.z);

    for (var i = 0; i < customColumns; i++) {

        if (!_m_splitters[i]) {

            createHorizontalSplitter(i);

            _m_splitters[i].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
            _m_splitters[i].position.set(i * offset, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, wLeft.position.z / 2);

        } else {
            if (_m_splitters[i] instanceof THREE.Mesh) {
                _m_splitters[i].scale.set(offset - thickness / 12 * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
                _m_splitters[i].position.set(i * offset, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, wLeft.position.z / 2);
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
    $("#addED").click(function () {
        if(!_extDrawers[plane_index]){
            for(var i =0 ; i < customColumns;i++){
                createExternalDrawer(i);
                updateExternalDrawer(i);
            }
            
        }else{
            return;
        }

    })

    $("#addIDL").click(function () {
        if(!_largeIntDrawers[plane_index]){
            createInternalDrawerLarge(plane_index);
            updateInternalDrawerLarge(plane_index);
        }else{
            return;
        }
    })

    $("#addIDS").click(function () {
        if(!_smallIntDrawers[plane_index]){
            createInternalDrawerSmall(plane_index);
            updateInternalDrawerSmall(plane_index);
        }else{
            return;
        }
    })

    $("#addLocker").click(function () {

        if(!_lockers[plane_index]){
            createLocker(plane_index);
            updateLocker(plane_index);
        }else{
            return;
        }

    })

    $("#addBottomShelf").click(function () {
        if(!_bot_shelf_parent[plane_index]){
            createBotShelves(onHeightChanged(plane_index),plane_index);
            updateBotShelves(plane_index)
        }else{
            return;
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




    $("#addHingedDoor").click(function () {


        if (_hDoors_parent) {

            for (var i = 0; i < customColumns; i++) {

                createHingedDoor(i);
                updateHingedDoor(i);

            }
        } else {
            for (var i = 0; i < customColumns; i++) {
                updateHingedDoor(i);
            }
        }
      
    })


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
    $("#copyto").change(function () {
        pasetToColumn($(this).children("option:selected").val());
        columnsCombination()
    })
    $("#removeAll").click(function () {
        removeAllInterior();
    })

    $("#editDoor").click(function(){
            
        interactivePlane_group.visible=false;
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



    // if (wHeight < 6.5) {
    //     $("#addBottomShelf").addClass("disabled");
    // } else if (wHeight == 6.5) {
    //     $("#addBottomShelf").removeClass("disabled");
    //     $("#addLocker").removeClass("disabled");
    //     $("#addIDS").removeClass("disabled");
    // } else if (wHeight > 6.5 && (!_smallIntDrawers[plane_index||removed_index||removed_index+1] && !_lockers[plane_index])) {
    //     $("#addBottomShelf").removeClass("disabled");
    //     $("#addIDL").removeClass("disabled");
    //     $("#addED").removeClass("disabled");
    // } else if (wHeight > 6.5 && (!_extDrawers[plane_index] && !_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index])) {
    //     $("#addLocker").removeClass("disabled");

    // }


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

function addLoft(visible) {

    wpLoftTop.visible = visible;
    wpLoftBottom.visible = visible;
    wpLoftLeft.visible = visible;
    wpLoftRight.visible = visible;
    wpLoftBack.visible = visible;




}

function createWardrobe() {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
    });

    m.name = "m_wardrobe";
    wBottom = new THREE.Mesh(g, m);
    wBottom.name = "wardrobe_bottom";
    wBottom.position.set(0, 0, 0);
    wBottom.layers.set(0);

    wBack = new THREE.Mesh(g, m);
    wBack.name = "wardrobe_back";
    wBack.position.set(0, 0, 0);
    wBottom.layers.set(0);

    wLeft = new THREE.Mesh(g, m);
    wLeft.name = "wardrobe_left";
    wLeft.position.set(0, 0, 0);
    wLeft.layers.set(0);

    wRight = new THREE.Mesh(g, m);
    wRight.name = "wardrobe_right";
    wRight.position.set(0, 0, 0);
    wRight.layers.set(0);

    wTop = new THREE.Mesh(g, m);
    wTop.name = "wardrobe_top";
    wTop.position.set(0, 0, 0);
    wTop.layers.set(0);

    wpLoftTop = new THREE.Mesh(g, m);
    wpLoftTop.name = "wardrobe_loft_top";
    wpLoftTop.position.set(0, 0, 0);
    wpLoftTop.visible = false;
    wpLoftTop.layers.set(1);

    wpLoftLeft = new THREE.Mesh(g, m);
    wpLoftLeft.name = "wardrobe_loft_left";
    wpLoftLeft.position.set(0, 0, 0);
    wpLoftLeft.visible = false;
    wpLoftLeft.layers.set(1);

    wpLoftRight = new THREE.Mesh(g, m);
    wpLoftRight.name = "wardrobe_loft_right";
    wpLoftRight.position.set(0, 0, 0);
    wpLoftRight.visible = false;
    wpLoftRight.layers.set(1);

    wpLoftBottom = new THREE.Mesh(g, m)
    wpLoftBottom.name = "wardrobe_loft_bottom";
    wpLoftBottom.position.set(0, 0, 0);
    wpLoftBottom.visible = false;
    wpLoftBottom.layers.set(1);

    wpLoftBack = new THREE.Mesh(g, m);
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

function createHorizontalSplitter(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "wm_h_splitter";
    var _splitter = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0xff7f50
    });
    m.name = "wm_ext_d_large";
    var _ext = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "wm_ext_d_splitter";
    var _splitter = new THREE.Mesh(g, m);
    _splitter.name = "w_ext_d_splitter_" + index;

    _extDrawers_splitters[index] = _splitter;
    _extDrawers_splitters_group.name = "w_ext_d_splitters";
    _extDrawers_splitters_group.add(_extDrawers_splitters[index]);

    scene.add(_extDrawers_splitters_group);

}

function updateExternalDrawer(index) {

    if (_extDrawers[index] instanceof THREE.Mesh) {
        _extDrawers[index].scale.set(offset - (thickness / 12) * ftTom, 1 * ftTom, wDepth * ftTom + (thickness / 12) * ftTom)

        if (!_extDrawers[index]) {

            _extDrawers[index].position.set(index * offset, wBottom.position.y + _extDrawers[index].scale.y / 2 + thickness / 24 * ftTom, wLeft.position.z / 2 + (thickness / 24) * ftTom);
        } else {

            _extDrawers[index].position.set(index * offset, wBottom.position.y + _extDrawers[index].scale.y / 2 + (thickness / 24) * ftTom, wLeft.position.z / 2 + (thickness / 24) * ftTom);
        }

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
    var m = new THREE.MeshStandardMaterial({
        color: 0xaa7f50
    });
    m.name = "wm_int_d_large";
    var _large_int = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "wm_int_d_large_splitter";
    var _splitter = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0xddffdd
    });
    m.name = "wm_locker";
    var _locker = new THREE.Mesh(g, m);
    _locker.name = "_locker_" + index;

    _lockers[index] = _locker;
    _locker_group.name = "w_lockers";
    _locker_group.add(_lockers[index]);
    scene.add(_locker_group);
    createLockerSplitter(index);
}

function createLockerSplitter(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "wm_locker_splitter";
    var _splitter = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0xadaffa
    });
    m.name = "wm_int_d_small";
    var _small_int = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0xdedede,
        roughness: 0.2,
        metalness: 0.4
    });

    m.name = "wm_hanger";

    _hangers[index] = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0xfaaaee
    });
    var _top_shelves_group = new THREE.Group();
    m.name = "wm_top_shelf";

    for (var i = 0; i < row; i++) {
        _top_shelves[i] = new THREE.Mesh(g, m);
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
    var m = new THREE.MeshStandardMaterial({
        color: 0xfaaaee
    });
    let _bot_group = new THREE.Group();
    m.name = "wm_bot_shelf";

    for (var j = 0; j < row; j++) {
        _bot_shelves[j] = new THREE.Mesh(g, m);
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

    var vertical_offset = 0;
    var pos = 0;

    vertical_offset *= -1;

    if (_bot_shelf_parent[index] instanceof THREE.Group) {
        if (_lockers[index] instanceof THREE.Mesh || _largeIntDrawers[index] instanceof THREE.Mesh ||
            _smallIntDrawers[index] instanceof THREE.Mesh || _extDrawers[index]) {

            //No Locker
            if (!_lockers[index]) {
                if (_bot_shelf_parent[index]) {
                    // No Other Parts
                    if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {
                        if (wHeight > 6.5) {
                            console.log("OK")
                            var dist = (_m_splitters[index].position.y - wBottom.position.y);
                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1);
                            pos = _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;
                        }
                    }
                    //ID_L
                    if (_largeIntDrawers[index] && !_smallIntDrawers[index] && !_extDrawers[index]) {
                        var dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 24) * ftTom;
                        pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                    }
                    //ID_S
                    else if (_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {
                        var dist = (_smallIntDrawers[index].position.y - wBottom.position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (thickness / 24) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (2 * thickness / 12) * ftTom;
                    }
                    //ID_S and ED
                    else if (_smallIntDrawers[index] && !_largeIntDrawers[index] && _extDrawers[index]) {
                        var dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_extDrawers[index].scale.y / 2 + _extDrawers[index].position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (_bot_shelf_parent[index].children.length * thickness / 12) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                    }
                    //ID_L and ID_S
                    else if (_smallIntDrawers[index] && _largeIntDrawers[index] && !_extDrawers[index]) {
                        var dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (_bot_shelf_parent[index].children.length * thickness / 12) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                    }
                    //ID_L and ID_S and ED
                    else if (_smallIntDrawers[index] && _largeIntDrawers[index] && _extDrawers[index]) {
                        var dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (_bot_shelf_parent[index].children.length * thickness / 12) * ftTom;
                        pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                    }
                    //ED
                    else if (!_smallIntDrawers[index] && !_largeIntDrawers[index] && _extDrawers[index]) {
                        var dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_extDrawers[index].scale.y / 2 + _extDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        pos = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;

                    }
                    //ED and ID_L
                    else if (!_smallIntDrawers[index] && _largeIntDrawers[index] && _extDrawers[index]) {
                        var dist = (_m_splitters[index].position.y - _m_splitters[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

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
                            var dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (wBottom.scale.y / 2 - wBottom.position.y);
                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (((_bot_shelf_parent[index].children.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                            pos = _lockers[index].position.y - _lockers[index].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;

                        } else {
                            var dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                            pos = (_lockers[index].position.y - _lockers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        }
                    }

                    //ID_S
                    else if (!_largeIntDrawers[index] && !_extDrawers[index] && _smallIntDrawers[index]) {
                        if (_bot_shelf_parent[index].children.length > 1) {


                            var dist = (_smallIntDrawers[index].position.y + _smallIntDrawers[index].scale.y / 2) + (wBottom.scale.y / 2 - wBottom.position.y);

                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) - (((_bot_shelf_parent[index].children.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                            pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom);
                        } else {
                            var dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                            pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        }

                    }
                    //ED
                    else if (!_largeIntDrawers[index] && _extDrawers[index]) {
                        var dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (_extDrawers[index].scale.y / 2 + _extDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        pos = (_lockers[index].position.y - _lockers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;

                    }
                    //ID_L
                    else if (_largeIntDrawers[index] && !_smallIntDrawers[index]) {
                        var dist = (_lockers[index].position.y - _lockers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        pos = (_lockers[index].position.y - _lockers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;

                    }
                    //ID_L
                    else if (_largeIntDrawers[index] && _smallIntDrawers[index]) {
                        if (_bot_shelf_parent[index].children.length < 2) {
                            var dist = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - (_largeIntDrawers[index].scale.y / 2 + _largeIntDrawers[index].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1) + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                            pos = (_smallIntDrawers[index].position.y - _smallIntDrawers[index].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[index].children.length)) * ftTom;
                        }
                    }

                }
            }
            vertical_offset *= -1;
        } else {
            if (!_lockers[index] && !_smallIntDrawers[index] && !_largeIntDrawers[index] && !_extDrawers[index]) {


                if (wHeight > 6.5) {

                    if (_m_splitters[index]) {
                        var dist = (_m_splitters[index].position.y - wBottom.position.y);
                        vertical_offset = dist / (_bot_shelf_parent[index].children.length + 1);
                        pos = _m_splitters[index].position.y - _m_splitters[index].scale.y / 2 - _bot_shelf_parent[index].children.length * vertical_offset + (thickness / 24) * ftTom;
                    }

                }
            }
        }
        for (var j = 0; j < _bot_shelf_parent[index].children.length; j++) {
            if (_bot_shelf_parent[index].children[j] instanceof THREE.Mesh) {
                _bot_shelf_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + wBack.scale.z);
                _bot_shelf_parent[index].children[j].position.set(index * offset, (j * vertical_offset), wLeft.position.z / 2 + (thickness / 24) * ftTom);
            }

        }
        _bot_shelf_parent[index].position.set(offset / 2 + wLeft.position.x, pos, _bot_shelf_parent[index].position.z);
        _bot_shelf_parent[index].visible = true;
    }



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

    if (selectedObject) {

        for (var i = 0; i < columns; i++) {

            if (_columns[i] == selectedObject) {

                if (_columns[i - 1]) {


                    adjacentParts.push(_columns[i - 1]);
                }
                if (_columns[i + 1]) {

                    adjacentParts.push(_columns[i + 1]);
                }
                removed_index = i;
                removed_id.push(i);
                _columns_group.remove(_columns[i]);
                removed.push(_columns[i]);
            }

        }
        columnsCombination();
        setflipDoor();

        for (var i = 0; i < interactivePlanes.length; i++) {
            if (interactivePlanes[i] == selectedObject) {
                plane_index = i;
            }
        }
    }


    // plane_index = interactivePlanes.findIndex(e => e === selectedObject);

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


    const intersects = raycaster.intersectObject(_columns_group, true);

    const p = raycaster.intersectObject(interactivePlane_group, true);

    if (p.length > 0) {

        const res = p.filter(function (res) {

            return res && res.object;

        })[0];

        getColumnToCopy();
        if (res && res.object) {

            selectedObject = res.object;
            addSelectedObject(selectedObject);
            outlinePass.selectedObjects = selectedObjects;
        }

    } else {
        outlinePass.selectedObjects = [];
        selectedObject = null;
    }


    if (intersects.length > 0) {

        const res = intersects.filter(function (res) {

            return res && res.object;

        })[0];


        if (res && res.object) {

            selectedObject = res.object;
            addSelectedObject(selectedObject);

            adjacentParts.forEach(e => {
                if (e == selectedObject) {

                    selectedObject = null;
                    outlinePass.visibleEdgeColor.set("#ff0000");


                } else {

                    outlinePass.selectedObjects = [];
                }

            });
            outlinePass.selectedObjects = selectedObjects;


        }

    } else {
        outlinePass.visibleEdgeColor.set("#00ffff");
        // selectedObject = null;
    }

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
    composer.addPass(renderPass);


    const copyPass = new THREE.ShaderPass(THREE.CopyShader);
    // composer.addPass( copyPass );

    const ssaoPass = new THREE.SSAOPass(scene, camera, fwidth, fheight);
    ssaoPass.kernalRadius = 16;
    ssaoPass.minDistance = 0.005;
    ssaoPass.maxDistance = 0.1;
    //    composer.addPass(ssaoPass);

    outlinePass = new THREE.OutlinePass(new THREE.Vector2(fwidth, fheight), scene, camera);
    outlinePass.edgeStrength = 5;
    outlinePass.edgeGlow = 0;
    outlinePass.edgeThickness = 0.5;
    outlinePass.pulsePeriod = 0;
    // outlinePass.visibleEdgeColor.set("#ff0000");

    // outlinePass.hiddenEdgeColor.set("#ff0000");
    composer.addPass(outlinePass);

    const pixelRatio = renderer.getPixelRatio();

    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
    effectFXAA.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
    // effectFXAA.uniforms['resolution'].value.set(1 / fwidth, 1 / fheight);
    composer.addPass(effectFXAA);
}



function getColumnToCopy() {

    while (cp.firstChild) {
        cp.removeChild(cp.firstChild);
    }
    for (var i = 0; i < columns; i++) {

        var op = document.createElement("option");

        if (i != 0) {
            op.setAttribute("value", i);

            op.innerHTML = i + 1;
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
        columnsCombination();
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
    if (wWidth == 9.5) {
        columns = 10;
    } else {
        columns = Math.floor(wWidth);
    }

    while (columns_group.firstChild) {
        columns_group.removeChild(columns_group.firstChild);
    }
    customColumns = columns;


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

    // columns_div.firstElementChild.setAttribute("checked", "true");


}

function set_columns_number(value) {
    // removeColumns();
    // removeHorizontalSplitter();
    // removeExternalDrawer();
    reset_adjacents_removed_columns();
    customColumns = value;

}

function reset_adjacents_removed_columns() {


    adjacentParts = [];

}

function onHeightChanged(plane_index) {
    var row = 1;



    if (wHeight == 6.5) {
        row = 1;
    } else if (wHeight == 7 && !_lockers[plane_index] && !_largeIntDrawers[plane_index] && !_extDrawers[plane_index] && !_smallIntDrawers[plane_index]) {
        row = 3;
    } else if (wHeight == 7 && !_lockers[plane_index]) {
        row = 1;
    } else if (wHeight == 7 && _lockers[plane_index] && !_smallIntDrawers[plane_index]) {
        row = 2;
    } else if (wHeight == 7 && _lockers[plane_index] && _smallIntDrawers[plane_index]) {
        row = 3;
    } else if (wHeight == 6 || (wHeight == 6.5 && !_lockers[plane_index] && !_largeIntDrawers[plane_index] && !_extDrawers[plane_index] && !_smallIntDrawers[plane_index])) {


    }

    return row;

}

function columnsCombination() {
    if (removed.length > 0) {
        removed.forEach(e => {

            if (e == _columns[removed_index]) {

                // _columns[removed_index].position.x + offset / 2
                var sizeToChange = offset * 2 - thickness / 12 * ftTom;
                var posToChange = _columns[removed_index].position.x + offset / 2;


                //Interactive Plane
                if (interactivePlanes[removed_index]) {
                    var a = interactivePlanes[removed_index];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    removeInteractivePlane(removed_index + 1);

                } else if (interactivePlanes[removed_index + 1]) {
                    var a = interactivePlanes[removed_index + 1];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    removeInteractivePlane(removed_index);
                }

                //Large Internal Drawers
                if (_largeIntDrawers[removed_index]) {
                    var a = _largeIntDrawers[removed_index];
                    var b = _largeIntDrawers_splitters[removed_index];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    b.scale.setX(sizeToChange);
                    b.position.setX(a.position.x);
                    removeInternalDrawerLarge(removed_index + 1);
                } else if (_largeIntDrawers[removed_index + 1]) {
                    var a = _largeIntDrawers[removed_index + 1];

                    var b = _largeIntDrawers_splitters[removed_index + 1];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    b.scale.setX(sizeToChange);
                    b.position.setX(a.position.x);

                    removeInternalDrawerLarge(removed_index);
                }

                //Hangers
                if (_hangers[removed_index]) {
                    var a = _hangers[removed_index];
                    a.scale.setY(sizeToChange);
                    a.position.setX(posToChange);
                    removeHanger(removed_index + 1);
                } else if (_hangers[removed_index + 1]) {
                    var a = _hangers[removed_index + 1];
                    a.scale.setY(sizeToChange);
                    a.position.setX(posToChange);
                    removeHanger(removed_index);
                }
                //Top Shelves
                if (_top_shelves_parent[removed_index]) {
                    var a = _top_shelves_parent[removed_index];
                    a.traverse(function (e) {
                        if (e instanceof THREE.Mesh) {
                            e.scale.setX(sizeToChange);
                            e.position.setX(posToChange);
                        }

                    })
                    removeTopShelves(removed_index + 1);

                } else if (_top_shelves_parent[removed_index + 1]) {
                    var a = _top_shelves_parent[removed_index + 1];
                    a.traverse(function (e) {
                        if (e instanceof THREE.Mesh) {
                            e.scale.setX(sizeToChange);
                            e.position.setX(posToChange);
                        }

                    })
                    removeTopShelves(removed_index);
                }

                //Bottom Shelves
                if (_bot_shelf_parent[removed_index]) {
                    var a = _bot_shelf_parent[removed_index];
                    a.traverse(function (e) {
                        if (e instanceof THREE.Mesh) {
                            e.scale.setX(sizeToChange);
                            e.position.setX(posToChange);
                        }

                    })
                    removeBotShelves(removed_index + 1);

                } else if (_bot_shelf_parent[removed_index + 1]) {
                    var a = _bot_shelf_parent[removed_index + 1];
                    a.traverse(function (e) {
                        if (e instanceof THREE.Mesh) {
                            e.scale.setX(sizeToChange);
                            e.position.setX(posToChange);
                        }

                    })
                    removeBotShelves(removed_index);
                }


                //Horizontal Splitter
                if (_m_splitters[removed_index]) {
                    var a = _m_splitters[removed_index];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    _m_splitters[removed_index + 1].visible = false;
                    // removeHorizontalSplitter(removed_index+1);
                } else if (_m_splitters[removed_index + 1]) {
                    var a = _m_splitters[removed_index];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    _m_splitters[removed_index + 1].visible = false;
                    // removeHorizontalSplitter(removed_index+1);
                }

                //External Drawers
                if (_extDrawers[removed_index]) {
                    var a = _extDrawers[removed_index];
                    var b = _extDrawers_splitters[removed_index];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    b.scale.setX(sizeToChange);
                    b.position.setX(posToChange);
                    removeExternalDrawer(removed_index + 1);
                } else if (_extDrawers[removed_index + 1]) {
                    var a = _extDrawers[removed_index + 1];
                    var b = _extDrawers_splitters[removed_index + 1];
                    a.scale.setX(sizeToChange);
                    a.position.setX(posToChange);
                    b.scale.setX(sizeToChange);
                    b.position.setX(posToChange);
                    removeExternalDrawer(removed_index);
                }


                if (_smallIntDrawers[removed_index]) {
                    if (_lockers[removed_index]) {

                        if (_smallIntDrawers[removed_index + 1]) {
                            updateInternalDrawerSmall(removed_index + 1);

                            var b = _smallIntDrawers[removed_index + 1];
                            b.scale.setX(offset);

                            var c = _lockers[removed_index];
                            var d = _locker_splitters[removed_index];
                            c.scale.setX(offset);
                            d.scale.setX(offset);
                        } else {
                            createInternalDrawerSmall(removed_index + 1);
                            updateInternalDrawerSmall(removed_index + 1);

                            var b = _smallIntDrawers[removed_index + 1];
                            b.scale.setX(offset);
                            var c = _lockers[removed_index];
                            var d = _locker_splitters[removed_index];
                            c.scale.setX(offset);
                            d.scale.setX(offset);
                        }


                    } else if (_lockers[removed_index + 1]) {

                        var a = _smallIntDrawers[removed_index];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        removeLocker(removed_index + 1);

                    } else {
                        var a = _smallIntDrawers[removed_index];
                        a.scale.setX(sizeToChange);
                        a.position.setX(posToChange);
                        removeInternalDrawerSmall(removed_index + 1);
                    }
                } else if (_smallIntDrawers[removed_index + 1]) {

                    if (_lockers[removed_index + 1]) {

                        if (_smallIntDrawers[removed_index + 1]) {

                            updateInternalDrawerSmall(removed_index + 1)

                            var b = _smallIntDrawers[removed_index + 1];
                            removeLocker(removed_index + 1);
                            b.scale.setX(offset);
                        }
                    } else {
                        var b = _smallIntDrawers[removed_index + 1];
                        updateInternalDrawerSmall(removed_index + 1)
                        b.scale.setX(offset);
                    }

                    if (_lockers[removed_index]) {
                        var b = _smallIntDrawers[removed_index + 1];
                        b.scale.setX(offset);
                        var a = _lockers[removed_index];
                        var c = _locker_splitters[removed_index]
                        a.scale.setX(offset);
                        c.scale.setX(offset);
                    } else {
                        createLocker(removed_index);
                        updateLocker(removed_index);
                        var a = _lockers[removed_index];
                        var b = _locker_splitters[removed_index]
                        a.scale.setX(offset);
                        b.scale.setX(offset);
                    }
                } else {
                    if (_lockers[removed_index]) {
                        createInternalDrawerSmall(removed_index + 1);
                        updateInternalDrawerSmall(removed_index + 1);
                        var b = _smallIntDrawers[removed_index + 1];
                        b.scale.setX(offset);

                        var c = _lockers[removed_index];
                        var d = _locker_splitters[removed_index];
                        c.scale.setX(offset);
                        d.scale.setX(offset);
                    } else if (_lockers[removed_index + 1]) {
                        removeLocker(removed_index + 1);
                        createLocker(removed_index);
                        updateLocker(removed_index);
                        createInternalDrawerSmall(removed_index + 1);
                        updateInternalDrawerSmall(removed_index + 1);
                        var b = _smallIntDrawers[removed_index + 1];
                        b.scale.setX(offset);

                        var c = _lockers[removed_index];
                        var d = _locker_splitters[removed_index];
                        c.scale.setX(offset);
                        d.scale.setX(offset);
                    }
                }

                updateHingedDoorOnColumnCombined();
            }
        })
    }

    updateBotShelves();
}

function removeAllInterior() {
    removeLocker();
    removeInternalDrawerLarge();
    removeInternalDrawerSmall();
    removeExternalDrawer();
    removeTopShelves();
    removeBotShelves();
    removeHanger();
    reset_adjacents_removed_columns();
    removeDoor();


}




function createHingedDoor(index) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xfafa22,
        transparent: true,
        opacity: 1
    });
    m.name = "wm_hinged_door";


    var door = new THREE.Mesh(g, m);
    door.name = "hinged_door_" + index;
    var _hDoors_group = new THREE.Group();
    _hDoors_group.add(door);
    _hDoors_group.name = "hinged_door_pivot_" + index;
    _hDoors_parent[index] = _hDoors_group;
    _hDoors_parent_group.name = "hinged_doors";
    _hDoors_parent_group.add(_hDoors_parent[index]);
    scene.add(_hDoors_parent_group);
}


function updateHingedDoor(index) {

    
    // _columns_group.position.x + _columns[index - 1].position.x + thickness / 24 * ftTom
    if (_hDoors_parent[index] instanceof THREE.Group) {
    
        _hDoors_parent_group.position.set(offset + wLeft.position.x, _hDoors_parent_group.position.y, _hDoors_parent_group.position.z);
        if (index % 2 == 0) {

            for (var j = 0; j < _hDoors_parent[index].children.length; j++) {

                if (_hDoors_parent[index].children[j] instanceof THREE.Mesh) {
                    _hDoors_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom);

                    _hDoors_parent[index].children[j].position.set(_hDoors_parent[index].children[j].scale.x / 2, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, -(thickness / 24) * ftTom);

                }

            }
            if (index != customColumns - 1) {
                _hDoors_parent[index].position.set(_columns[index].position.x - offset + thickness / 24 * ftTom, _hDoors_parent[index].position.y, _hDoors_parent[index].position.z + wLeft.scale.z / 2);
                _hDoors_parent[index].rotation.set(0, 0 * THREE.Math.DEG2RAD, 0);
            } else {
                _hDoors_parent[index].position.set(_columns[index - 1].position.x + thickness / 24 * ftTom, _hDoors_parent[index].position.y, _hDoors_parent[index].position.z + wLeft.scale.z / 2);
                _hDoors_parent[index].rotation.set(0, 0 * THREE.Math.DEG2RAD, 0);
            }

        } else {
            for (var j = 0; j < _hDoors_parent[index].children.length; j++) {

                if (_hDoors_parent[index].children[j] instanceof THREE.Mesh) {
                    _hDoors_parent[index].children[j].scale.set(offset - (thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom);

                    _hDoors_parent[index].children[j].position.set(_hDoors_parent[index].children[j].scale.x / 2, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, (thickness / 24) * ftTom);
                    _hDoors_parent[index].children[j].material.color.set("#34deeb");
                }

            }
            _hDoors_parent[index].position.set(_columns[index - 1].position.x + offset - thickness / 24 * ftTom, _hDoors_parent[index].position.y, _hDoors_parent[index].position.z + wLeft.scale.z / 2);
            _hDoors_parent[index].rotation.set(0, -180 * THREE.Math.DEG2RAD, 0);
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
            }else{
                adjacentParts.forEach(a => {

                    if (e == a) {
    
                        for (var i = 0; i < removed_id.length; i++) {
                            if (removed_id[i] % 2 != 0) {
    
    
                                _hDoors_parent[removed_id[i]].position.setX(_columns[removed_id[i]].position.x + offset - thickness / 24 * ftTom);
                                _hDoors_parent[removed_id[i] + 1].position.setX(_columns[removed_id[i]].position.x - offset + thickness / 24 * ftTom);
    
                                for (var j = 0; j < _hDoors_parent[removed_id[i]].children.length; j++) {
    
                                    _hDoors_parent[removed_id[i]].children[j].scale.set(offset - thickness / 24 * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom);
    
                                    _hDoors_parent[removed_id[i]].children[j].position.set(_hDoors_parent[removed_id[i]].children[j].scale.x / 2, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, (thickness / 24) * ftTom);
    
    
                                }
    
                                for (var j = 0; j < _hDoors_parent[removed_id[i] + 1].children.length; j++) {
    
                                    _hDoors_parent[removed_id[i] + 1].children[j].scale.set(offset - thickness / 24 * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (thickness / 12) * ftTom);
    
                                    _hDoors_parent[removed_id[i] + 1].children[j].position.set(_hDoors_parent[removed_id[i] + 1].children[j].scale.x / 2, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, -(thickness / 24) * ftTom);
    
    
                                }
                            }
                        }
    
                    } else {
    
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
    
                    }
    
                })
            }
           
        })


    }
  
}
function setflipDoor(){


    for(var i = 0;i<_hDoors_parent.length;i++){
        if(interactivePlanes[plane_index] instanceof THREE.Mesh){

            if((interactivePlanes[plane_index].scale.x- _hDoors_parent[i].scale.x/2)<0){
                flippableDoor.push(_hDoors_parent[i]);

            }else{
                flippableDoor[i]=null;
            }
        }
    
    }


}
function flipDoor(index){

}
function removeDoor(index) {

    if (index) {



        if (_hDoors_parent[index] instanceof THREE.Group) {
            _hDoors_parent_group.remove(_hDoors_parent[index]);
           
        }


    } else {



    }
}


function doorAction(index) {
    if (_hDoors_parent) {

        if (isDoorOpened) {
            for (var i = 0; i < customColumns; i++) {


                if (_hDoors_parent[i] instanceof THREE.Group) {

                    if (i % 2 == 0) {

                        if (_hDoors_parent[i].rotation.y > -80 * THREE.Math.DEG2RAD) {
                            _hDoors_parent[i].rotation.y = -80 * THREE.Math.DEG2RAD;
                        }






                    } else {
                        if (_hDoors_parent[i].rotation.y < -100 * THREE.Math.DEG2RAD) {
                            _hDoors_parent[i].rotation.y = -100 * THREE.Math.DEG2RAD;
                        }
                        // if (_hDoors_parent[i].rotation.y >= -80 * THREE.Math.DEG2RAD) {
                        //     _hDoors_parent[i].rotateY(delta * 100 * THREE.MathUtils.DEG2RAD);


                        // }

                    }
                }

            }

        } else {
            for (var i = 0; i < customColumns; i++) {


                if (_hDoors_parent[i] instanceof THREE.Group) {

                    if (i % 2 == 0) {

                        if (_hDoors_parent[i].rotation.y < 0 * THREE.Math.DEG2RAD) {
                            _hDoors_parent[i].rotation.y = 0 * THREE.Math.DEG2RAD;
                        }






                    } else {
                        if (_hDoors_parent[i].rotation.y > -180 * THREE.Math.DEG2RAD) {
                            _hDoors_parent[i].rotation.y = -180 * THREE.Math.DEG2RAD;
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
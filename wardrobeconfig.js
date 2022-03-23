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



let isCreated = true;
var removed = [];
var adjacentParts = [];
var substitubale = 0;
var columns_group = document.getElementById("columns-group");
var top_shelf_group, bot_shelf_group, ext_drawer_group, splitters_group,
    m_splitters_group, int_drawer_small_group, int_drawer_large_group, m_locker_group, hanger_group;

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
    plane_group, column_id = [];
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
    _top_shelves = [],_top_shelves_parent = [],
_bot_shelves = [], _bot_shelf_parent = [];

var rowCount = 0;

init();
animate();

create_top_shelves(2);

create_h_splitter();
create_locker();
create_internalDrawerSmall();
create_externalDrawer();
create_internalDrawerLarge();
create_horizontal();
create_plane();

function getValues() {

    $("#loftOptionsPanel").hide();

    $("#width").on('input', function () {

        if ($("#width")) {

            wWidth = $(this).val();

            setColumns = true;
            isCreated = true;


            reset_adjacents_removed_columns();
        }
    });

    $("#height1").change(function () {
        if ($(this).is(':checked')) {
            wHeight = 6;

        }
    })
    $("#height2").change(function () {
        if ($(this).is(':checked')) {
            wHeight = 6.5;

        }
    })
    $("#height3").change(function () {
        if ($(this).is(':checked')) {
            wHeight = 7;
        }
    })

    $("#depth1").change(function () {
        if ($(this).is(":checked")) {
            wDepth = 1.5;
        }
    })
    $("#depth2").change(function () {
        if ($(this).is(":checked")) {
            wDepth = 1.75;
        }
    })
    $("#depth3").change(function () {
        if ($(this).is(":checked")) {
            wDepth = 2;
        }
    })

    $("#addloft").change(function () {
        if ($(this).is(":checked")) {
            $("#loftOptionsPanel").show();
            isLoft = true;
        } else {
            $("#loftOptionsPanel").hide();
            isLoft = false;
        }
    });


    $("#loft1").change(function () {
        if ($(this).is(":checked")) {
            wLoft = 3;
        }
    })
    $("#loft2").change(function () {
        if ($(this).is(":checked")) {
            wLoft = 3.5;
        }
    })
    $("#loft3").change(function () {
        if ($(this).is(":checked")) {
            wLoft = 4;
        }
    });

    $("#export").click(function () {
        Export();
    })

    $("#copyto").change(function () {
        set_copies($(this).children("option:selected").val());
    })

}


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
    top_shelf_group = new THREE.Group();
    bot_shelf_group = new THREE.Group();
    ext_drawer_group = new THREE.Group();
    splitters_group = new THREE.Group();
    m_splitters_group = new THREE.Group();
    internalPart = new THREE.Group();
    cloned_int_S_group = new THREE.Group();
    int_drawer_large_group = new THREE.Group();
    int_drawer_small_group = new THREE.Group();
    m_locker_group = new THREE.Group();
    hanger_group = new THREE.Group();
    plane_group = new THREE.Group();

    _locker_group = new THREE.Group();
    _locker_splitter_group = new THREE.Group();
    _largeIntDrawers_group = new THREE.Group();
    _smallIntDrawers_group = new THREE.Group();
    _extDrawers_group = new THREE.Group();
    _smallIntDrawers_splitters_group = new THREE.Group();
    _largeIntDrawers_splitters_group = new THREE.Group();
    _extDrawers_splitters_group = new THREE.Group();
    _hanger_group = new THREE.Group();
   

    exporter = new THREE.GLTFExporter();
    create_lights();
    helpers();
    generate_wardrobe();




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
    controls.panSpeed = 1;

    controls.enableDamping = true;
    controls.dampingFactor = 0.050;
    controls.target.set(0, 1.5, 0);


    getValues();
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
        effectFXAA.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
        effectFXAA.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
    }

}

function animate() {
    requestAnimationFrame(animate);

    controls.update();


    render();

}



function render() {

    generate_columns();
    add_loft();
    update_wardrobe();
    create_int_parts();
    onHeightChanged();

    // update_columns();

    // renderer.render(scene, camera);
    document.getElementById('column_id').innerHTML = plane_index + 1;
    document.getElementById('capturedImage').src = renderer.domElement.toDataURL();
    composer.render();
}

function update_wardrobe() {
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
        wLeft.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wLeft.position.set(-(((thickness / 24) * ftTom) + (wBack.scale.x / 2)), (wBack.scale.y / 2) + (wBottom.position.y) - wBottom.scale.y - thickness / 24 * ftTom, 0);

    }
    if (wRight) {
        wRight.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
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
        wpLoftLeft.scale.set(thickness / 12 * ftTom, wLoft * ftTom, ((2 * thickness / 12) + wDepth) * ftTom);
        wpLoftLeft.position.set(-(thickness / 24 * ftTom + wpLoftBottom.scale.x / 2), wpLoftBottom.position.y + wpLoftLeft.scale.y / 2 - wpLoftBottom.scale.y / 2, 0);
    }


    if (wpLoftRight) {
        wpLoftRight.scale.set(thickness / 12 * ftTom, wLoft * ftTom, ((2 * thickness / 12) + wDepth) * ftTom);
        wpLoftRight.position.set((thickness / 24 * ftTom + wpLoftBottom.scale.x / 2), wpLoftBottom.position.y + wpLoftRight.scale.y / 2 - wpLoftBottom.scale.y / 2, 0);
    }
    if (wpLoftTop) {
        wpLoftTop.scale.set(wWidth * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + (2 * (thickness / 12) * ftTom));
        wpLoftTop.position.set(0, wpLoftBack.scale.y + wpLoftBottom.position.y - (thickness / 12) * ftTom, 0);
    }
}

function add_loft() {
    if (isLoft) {
        wpLoftTop.visible = true;
        wpLoftBottom.visible = true;
        wpLoftLeft.visible = true;
        wpLoftRight.visible = true;
        wpLoftBack.visible = true;

        $("#loftLabel").html("Remove Loft");
    } else {
        wpLoftTop.visible = false;
        wpLoftBottom.visible = false;
        wpLoftLeft.visible = false;
        wpLoftRight.visible = false;
        wpLoftBack.visible = false;

        $("#loftLabel").html("Add Loft");
    }

}

function generate_wardrobe() {

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

function helpers() {
    // const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    // gridHelper.position.y = 0;
    // gridHelper.position.x = 0;

    // scene.add(gridHelper);

    // const axesHelper = new THREE.AxesHelper(1);
    // scene.add(axesHelper);


}

function update_columns() {
    // part.forEach(element => {
    //     element.scale.set((thickness / 12) * ftTom, (wHeight + (thickness / 12)) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));

    // });


}

function generate_columns() {

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



    if (wWidth == 9.5) {
        columns = 10;
    } else {
        columns = Math.floor(wWidth);
    }


    if (isCreated) {
        columns_number();
        get_copies();
    }

    if (setColumns) {
        part.forEach(e => {

            group.remove(e);
        });
        setColumns = false;
        isExtCreated = true;
    } else {
        isExtCreated = false;
        offset = Math.abs(((wLeft.position.x - wLeft.scale.x / 2) - (wRight.position.x - wRight.scale.x / 2))) / customColumns;


        for (var i = 0; i < customColumns - 1; i++) {

            var g = new THREE.BoxGeometry(1, 1, 1);
            var m = new THREE.MeshStandardMaterial({
                color: 0xacacac,
            });
            m.name = "m_segments" + i;

            part.push(new THREE.Mesh(g, m));


            part[i].scale.set((thickness / 12) * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y, (((thickness / 12) + wDepth) * ftTom));
            // if(i%2==0){
            //     part[i].position.set(i * offset  + (thickness/24) *ftTom, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, (((thickness / 24)) * ftTom));
            // }   
            {
                part[i].position.set(i * offset, (wBack.scale.y / 2) + wBottom.position.y - wBottom.scale.y / 2, (((thickness / 24)) * ftTom));
            }
            // part[i].receiveShadow = true;

            part[i].name = "segments_" + i;


            for (var j = 0; j <= i; j++) {
                segment_id[i, j] = [i, part[j].uuid];

            }

            group.add(part[i]);


        }
        group.name = "segments";
        group.layers.set(2);
        group.position.set(offset + wLeft.position.x, group.position.y, group.position.z);

        scene.add(group);

        update_object(plane_index);

        update_interior(0, width);


    }
}
splitters_group.visible = false;
ext_drawer_group.visible = false;
m_splitter.visible = false;

function create_int_parts() {

    if (isExtCreated) {



        interactivePlanes.forEach(e => {
            plane_group.remove(e);
        })

        m_splitters.forEach(e => {
            m_splitters_group.remove(e);
        })
        ext_drawer.forEach(e => {
            ext_drawer_group.remove(e);
        })
        splitters.forEach(s => {
            splitters_group.remove(s);
        })

    } else {
        if (ED) {


            for (var i = 0; i < customColumns; i++) {

                interactivePlanes.push(plane.clone());
                interactivePlanes[i].scale.set(offset - thickness / 12 * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y);
                interactivePlanes[i].position.set(i * offset, wBack.position.y, wBottom.scale.z / 2);
                plane_group.add(interactivePlanes[i]);
                column_id.push(i);


                ext_drawer.push(ED.clone());
                ext_drawer[i].scale.set(offset, ED.scale.y, ED.scale.z);
                ext_drawer[i].visible = true;
                ext_drawer[i].scale.set(offset - (thickness / 12) * ftTom, 1 * ftTom, wDepth * ftTom);
                ext_drawer[i].position.set(i * offset, wBottom.position.y + ext_drawer[i].scale.y / 2 + (thickness / 24) * ftTom, wLeft.position.z / 2);
                ext_drawer_group.add(ext_drawer[i]);

                splitters.push(m_splitter.clone());
                splitters[i].scale.set(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
                splitters[i].position.set(ext_drawer[i].position.x, ext_drawer[i].position.y + ext_drawer[i].scale.y / 2 + (thickness / 24 * ftTom), ext_drawer[i].position.z);
                splitters[i].visible = true;
                splitters_group.add(splitters[i]);

                m_splitters.push(m_splitter.clone());
                m_splitters[i].scale.set(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
                m_splitters[i].position.set(ext_drawer[i].position.x, m_splitter.position.y, m_splitter.position.z);
                m_splitters_group.add(m_splitters[i]);
                m_splitters[i].visible = true;

            }
            ext_drawer_group.name = "external_drawers";
            ext_drawer_group.position.set(offset / 2 + wLeft.position.x, ext_drawer_group.position.y, ext_drawer_group.position.z);
            scene.add(ext_drawer_group);

            splitters_group.name = "splitters";
            splitters_group.position.set(offset / 2 + wLeft.position.x, splitters_group.position.y, splitters_group.position.z)
            scene.add(splitters_group);

            m_splitters_group.name = "m_splitters";
            m_splitters_group.position.set(offset / 2 + wLeft.position.x, m_splitters_group.position.y, m_splitters_group.position.z);
            scene.add(m_splitters_group);



            plane_group.name = "interactive planes";
            plane_group.position.set(offset / 2 + wLeft.position.x, m_splitters_group.position.y, m_splitters_group.position.z);
            scene.add(plane_group);
        }
        update_plane();
    }




}


function stop() {
    window.cancelAnimationFrame(renderer);



}

function Reset() {


}

function onClick() {



    if (selectedObject) {

        for (var i = 0; i < columns; i++) {

            if (part[i] === selectedObject) {
                if (part[i - 1]) {


                    adjacentParts.push(part[i - 1]);
                }
                if (part[i + 1]) {

                    adjacentParts.push(part[i + 1]);
                }
                part[i].visible = false;
                removed.push(part[i]);

            }
        }

        plane_index = interactivePlanes.findIndex(e => e === selectedObject);

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


    const intersects = raycaster.intersectObject(group, true);

    const p = raycaster.intersectObject(plane_group, true);

    if (p.length > 0) {

        const res = p.filter(function (res) {

            return res && res.object;

        })[0];


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
    plane_group.visible = false;
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



function get_copies() {

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

function set_copies(index) {


    if(index>-1){
        if(_top_shelves_parent[plane_index]){
            create_top_shelves(index);
        }
        else if(_hangers[plane_index]){
            createHanger(index);
        }
        if(_largeIntDrawers[plane_index]){
            createInternalDrawerLarge(index);
        }
        if(_smallIntDrawers[plane_index]){
            createInternalDrawerSmall(index);
        }
        if(_lockers[plane_index]){
            createLocker(index);
        }
        
    }
    
    



}


function columns_number() {

    while (columns_group.firstChild) {
        columns_group.removeChild(columns_group.firstChild);
    }
    customColumns = columns;
    // var columns_radio = (' <input class="form-check-input btn-check " type="radio" name="columnsOptions" id="columns',i+1,'"',' value = ',(i+1),' checked > <label class = "form-check-label btn btn-outline-secondary m-1" for = "columns',(i+1),'">', (i+1) ,'< /label>');
    for (var i = columns - 1; i > substitubale; i--) {





        var columns_radio = document.createElement("input");
        columns_radio.type = "radio";
        columns_radio.value = (i + 1);
        columns_radio.id = "columns" + (i + 1);
        columns_radio.setAttribute("onclick", "set_columns_number(" + (i + 1) + ")");
        columns_radio.className = "form-check-input columns-change  btn-check";
        columns_radio.name = "columnsOptions";

        var columns_label = document.createElement("label");
        columns_label.htmlFor = "columns" + (i + 1);
        columns_label.className = "form-check-label btn btn-outline-secondary m-1";
        columns_label.innerHTML = i + 1;




        columns_group.appendChild(columns_radio);
        columns_group.appendChild(columns_label);




        // if ($("#columns" + (i + 1))) {


        //     $("#columns" + (i + 1)).on('input',function () {
        //         if ($(this).is(":checked")) {

        //             customColumns = $(this).val();

        //             setColumns = true;
        //         }


        //     })

        // }

        // console.log("segments:", i, " columns:", i + 1);

    }

    columns_group.firstElementChild.setAttribute("checked", "true");
    isCreated = false

}

function set_columns_number(value) {
    reset_adjacents_removed_columns();
    customColumns = value;
    setColumns = true;
}

function reset_adjacents_removed_columns() {
    if (removed) {
        removed.forEach(e => {
            e.visible = true;
        });
    }
    removed = [];
    adjacentParts = [];

}



function create_top_shelves(count) {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xffddee
    });
    m.name = "m_shelf";

    if (top_shelves.length > 0) {

    } else {

        for (var i = 0; i < count; i++) {
            top_shelves[i] = new THREE.Mesh(g, m);
            top_shelves[i].name = "top_shelf_" + i;
            top_shelf_group.add(top_shelves[i]);

        }
        top_shelf_group.name = "top_shelves";
        scene.add(top_shelf_group);
        top_shelf_group.visible = false;
    }
}


function update_top_shelves(segmentNumber) {

    var vertical_offset = (1 * ftTom);


    for (var i = 0; i < top_shelves.length; i++) {
        top_shelves[i].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);

        top_shelves[i].position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, (i * vertical_offset), wLeft.position.z / 2);

    }

    top_shelf_group.position.set(top_shelf_group.position.x, wTop.position.y - (top_shelves.length * ftTom) + (thickness / 12) * ftTom + wTop.scale.y / 2, top_shelf_group.position.z);
}

function create_bot_shelves(count) {

    // bot_shelves.forEach(function (e) {
    //     scene.remove(e);
    // })


    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xfaaaee
    });
    m.name = "m_bot_shelf";

    if (bot_shelves.length > 0) {

    } else {

        for (var i = 0; i < count; i++) {
            bot_shelves[i] = new THREE.Mesh(g, m);
            bot_shelves[i].name = "bot_shelf_" + i;
            bot_shelf_group.add(bot_shelves[i]);

        }
        bot_shelf_group.name = "bot_shelves";
        scene.add(bot_shelf_group);

    }


}

function update_bot_shelves(segmentNumber) {
    var vertical_offset = 0;
    var pos = 0;

    if (locker instanceof(THREE.Mesh) || ID_L instanceof(THREE.Mesh) || ID_S instanceof(THREE.Mesh) || ED instanceof(THREE.Mesh)) {
        if (!locker.visible) {
            if (bot_shelves) {
                if (!ID_L.visible && !ED.visible && !ID_S.visible) {
                    if (wHeight > 6.5) {
                        var dist = (m_splitter.position.y - wBottom.position.y);
                        vertical_offset = dist / (bot_shelves.length + 1);
                        pos = m_splitter.position.y - m_splitter.scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;
                    }

                }

                if (ID_L.visible && !ID_S.visible && !ED.visible) {
                    var dist = (m_splitter.position.y - m_splitter.scale.y / 2) - (ID_L.scale.y / 2 + ID_L.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                    pos = (m_splitter.position.y - m_splitter.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;

                } else if (!ID_L.visible && !ED.visible && ID_S.visible) {
                    var dist = (ID_S.position.y - wBottom.position.y);
                    vertical_offset = dist / (bot_shelves.length + 1) - (thickness / 24) * ftTom;
                    pos = ID_S.position.y - ID_S.scale.y / 2 - vertical_offset + (2 * thickness / 12) * ftTom;
                } else if (!ID_L.visible && ED.visible && ID_S.visible) {
                    var dist = (ID_S.position.y - ID_S.scale.y / 2) - (ED.scale.y / 2 + ED.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) - (bot_shelves.length * thickness / 12) * ftTom;
                    pos = (ID_S.position.y - ID_S.scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                } else if (ID_L.visible && !ED.visible && ID_S.visible) {
                    var dist = (ID_S.position.y - ID_S.scale.y / 2) - (ID_L.scale.y / 2 + ID_L.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) - (bot_shelves.length * thickness / 12) * ftTom;
                    pos = (ID_S.position.y - ID_S.scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                } else if (ID_L.visible && ED.visible && ID_S.visible) {
                    var dist = (ID_S.position.y - ID_S.scale.y / 2) - (ID_L.scale.y / 2 + ID_L.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) - (bot_shelves.length * thickness / 12) * ftTom;
                    pos = (ID_S.position.y - ID_S.scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                } else if (ED.visible && !ID_L.visible && !ID_S.visible) {
                    var dist = (m_splitter.position.y - m_splitter.scale.y / 2) - (ED.scale.y / 2 + ED.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                    pos = (m_splitter.position.y - m_splitter.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;

                } else if (ED.visible && ID_L.visible && !ID_S.visible) {
                    var dist = (m_splitter.position.y - m_splitter.scale.y / 2) - (ID_L.scale.y / 2 + ID_L.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                    pos = (m_splitter.position.y - m_splitter.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;

                }
            }

        } else {
            if (bot_shelves) {
                if (!ID_L.visible && !ED.visible && !ID_S.visible) {

                    if (bot_shelves.length > 1) {
                        var dist = (locker.position.y - locker.scale.y / 2) - (wBottom.scale.y / 2 - wBottom.position.y);
                        vertical_offset = dist / (bot_shelves.length + 1) - (((bot_shelves.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                        pos = locker.position.y - locker.scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;

                    } else {
                        var dist = (locker.position.y - locker.scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                        vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                        pos = (locker.position.y - locker.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;
                    }
                } else if (!ID_L.visible && !ED.visible && ID_S.visible) {
                    if (bot_shelves.length > 1) {


                        var dist = (ID_S.position.y + ID_S.scale.y / 2) + (wBottom.scale.y / 2 - wBottom.position.y);

                        vertical_offset = dist / (bot_shelves.length + 1) - (((bot_shelves.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                        pos = (ID_S.position.y - ID_S.scale.y / 2 - vertical_offset + (thickness / 24) * ftTom);
                    } else {
                        var dist = (ID_S.position.y - ID_S.scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                        vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                        pos = (ID_S.position.y - ID_S.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;
                    }

                } else if (!ID_L.visible && ED.visible) {
                    var dist = (locker.position.y - locker.scale.y / 2) - (ED.scale.y / 2 + ED.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                    pos = (locker.position.y - locker.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;

                } else if (ID_L.visible && !ID_S.visible) {
                    var dist = (locker.position.y - locker.scale.y / 2) - (ID_L.scale.y / 2 + ID_L.position.y);

                    vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                    pos = (locker.position.y - locker.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;

                } else if (ID_L.visible && ID_S.visible) {
                    if (bot_shelves.length < 2) {
                        var dist = (ID_S.position.y - ID_S.scale.y / 2) - (ID_L.scale.y / 2 + ID_L.position.y);

                        vertical_offset = dist / (bot_shelves.length + 1) + (thickness / (12 * bot_shelves.length)) * ftTom;
                        pos = (ID_S.position.y - ID_S.scale.y / 2) - vertical_offset + (thickness / (12 * bot_shelves.length)) * ftTom;
                    }
                }

            }



        }




        vertical_offset *= -1;
    }
    for (var i = 0; i < bot_shelves.length; i++) {
        bot_shelves[i].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);

        bot_shelves[i].position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, (i * vertical_offset), wLeft.position.z / 2);

    }


    bot_shelf_group.position.set(bot_shelf_group.position.x, pos, bot_shelf_group.position.z);


}

function create_h_splitter() {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "m_splitter";
    m_splitter = new THREE.Mesh(g, m);
    m_splitter.name = "horizontal_splitter";

    scene.add(m_splitter);


}



function update_h_splitter(posX, posY, scaleX) {

    if (m_splitter) {

        m_splitter.scale.set(scaleX - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);

        m_splitter.position.set(posX, posY, wLeft.position.z / 2);


    }




}

function create_locker() {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xddffdd
    });
    m.name = "m_locker";
    locker = new THREE.Mesh(g, m);
    locker.name = "locker";
    scene.add(locker);
    sp1 = new Splitter();
    sp1.create();
    sp1.set_texture("./wood.jpg");

    locker.visible = false;
}

function update_locker(segmentNumber) {

    if (locker) {
        locker.scale.set(offset - (thickness / 12) * ftTom, (7.125 / 12) * ftTom, wDepth * ftTom)
        if (m_splitter) {
            locker.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, m_splitter.position.y - locker.scale.y / 2 - m_splitter.scale.y / 2, wLeft.position.z / 2);
            sp1.set_scale(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
            sp1.set_position(locker.position.x, locker.position.y - locker.scale.y / 2 - (thickness / 24 * ftTom), locker.position.z);

        }
        // } else if (top_shelves) {
        //     locker.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, top_shelf_group.position.y - wTop.scale.y / 2 - (4 * thickness / 12) * ftTom, wLeft.position.z / 2);
        // }
        sp1.visible(locker.visible);

    }




}

function create_internalDrawerSmall() {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xaaddaa
    });
    m.name = "m_internal_drawer_small";


    ID_S = new THREE.Mesh(g, m);

    ID_S.name = "internal_drawer_small";
    scene.add(ID_S);
    ID_S.visible = false;

}

function update_internalDrawerSmall(segmentNumber) {
    if (ID_S) {
        ID_S.scale.set(offset - (thickness / 12) * ftTom, (8 / 12) * ftTom, wDepth * ftTom)
        if (locker.visible) {
            ID_S.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, locker.position.y - ID_S.scale.y + (thickness / 24) * ftTom, wLeft.position.z / 2);
        } else {
            ID_S.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, m_splitter.position.y - ID_S.scale.y / 2 - (thickness / 24) * ftTom, wLeft.position.z / 2);

        }
    }
}

function create_externalDrawer() {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xff7f50
    });
    m.name = "m_externaldrawer";

    ED = new THREE.Mesh(g, m);

    ED.name = "external_drawer";

    scene.add(ED);

    ED.visible = false;

    sp2 = new Splitter();
    sp2.create();

}

function update_externalDrawer(segmentNumber) {
    if (ED) {
        ED.scale.set(offset - (thickness / 12) * ftTom, 1 * ftTom, wDepth * ftTom);
        ED.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, wBottom.position.y + ED.scale.y / 2, wLeft.position.z / 2);
        sp2.set_scale(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
        sp2.set_position(ED.position.x, ED.position.y + ED.scale.y / 2 + (thickness / 24 * ftTom), ED.position.z);
        sp2.visible(ED.visible);
    }
}



function create_internalDrawerLarge() {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xaa7f50
    });
    m.name = "m_internaldrawer_large";

    ID_L = new THREE.Mesh(g, m);
    ID_L.name = "internaldrawer_large";
    scene.add(ID_L);
    ID_L.visible = false;
    sp3 = new Splitter();
    sp3.create();

}

function update_internalDrawerLarge(segmentNumber) {
    if (ID_L) {
        ID_L.scale.set(offset, (10 / 12) * ftTom, wDepth * ftTom);

        if (ext_drawer_group.visible) {

            ext_drawer.forEach(e => {
                ID_L.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, e.position.y + ID_L.scale.y + (2 * thickness / 12) * ftTom, wLeft.position.z / 2);
            })

        } else {
            ID_L.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, wBottom.position.y + ID_L.scale.y / 2, wLeft.position.z / 2);
        }
        sp3.set_scale(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
        sp3.set_position(ID_L.position.x, ID_L.position.y + ID_L.scale.y / 2 + (thickness / 24 * ftTom), ID_L.position.z);
        sp3.visible(ID_L.visible);
    }
}

function update_interior(column_number, width) {

 
    update_top_shelves(column_number);
    update_h_splitter((group.position.x + part[column_number].position.x) - offset / 2, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, offset);
    update_locker(column_number);
    update_internalDrawerSmall(column_number);
    update_externalDrawer(column_number);

    update_internalDrawerLarge(column_number);
    update_bot_shelves(column_number);
}

function remove_all_internal() {
    $("#addLocker").removeClass("disabled");
    $("#addIDS").removeClass("disabled");
    $("#addIDL").removeClass("disabled");
    $("#addED").removeClass("disabled");


    if (bot_shelf_group) {
        bot_shelves.forEach(function (e) {
            bot_shelf_group.remove(e);
            scene.remove(bot_shelf_group);
            console.log(e);
        })

        bot_shelves = [];
    }
    if (top_shelf_group) {
        top_shelf_group.visible = false

    }
    if (locker) {
        locker.visible = false

    }
    if (ID_L) {
        ID_L.visible = false


    }
    if (ID_S) {
        ID_S.visible = false

    }
    if (ED) {
        ED.visible = false

    }



}

function create_horizontal() {

    $("#hangerOrShelf").change(function () {

        if ($(this).children("option:selected").val() == 1) {
            createHanger(plane_index);
            // hangerRod.visible = true;
            // top_shelf_group.visible = false;

        } else if ($(this).children("option:selected").val() == 2) {
            createTopShelves(2,plane_index);
            // hangerRod.visible = false;
            // top_shelf_group.visible = true;


        }

        // if($("#hangerOrShelf").children("option:selected").val() !=0){
        //     $(this).children("option:selected").val(0);
        // };



    })

    $("#addLocker").click(function () {
        if ($(this)) {
            createLocker(plane_index);
            //locker.visible = true;
        }
        if (wHeight == 6) {

            $("#addIDS").addClass("disabled");

        } else if (wHeight == 7 && ID_S.visible && locker.visible) {
            $("#addED").addClass("disabled");
            $("#addIDL").addClass("disabled");
        }
    })


    $("#addIDS").click(function () {
        if ($(this)) {
            createInternalDrawerSmall(plane_index);
        }
        if (wHeight == 6) {

            $("#addLocker").addClass("disabled");

        } else if (wHeight == 7 && ID_S.visible && locker.visible) {
            $("#addED").addClass("disabled");
            $("#addIDL").addClass("disabled");
        } else if (wHeight == 7 && (ED.visible && ID_L.visible && ID_S.visible)) {
            $("#addLocker").addClass("disabled");

        }
    })

    $("#addIDL").click(function () {
        if ($(this)) {
            createInternalDrawerLarge(plane_index);
        }
        if (wHeight == 6 || wHeight == 6.5) {

            $("#addED").addClass("disabled");

        } else if (wHeight == 7 && (ED.visible && ID_L.visible && ID_S.visible)) {
            $("#addLocker").addClass("disabled");

        }
    })

    $("#addED").click(function () {
        if ($(this)) {
            //ED.visible = true;
            splitters_group.visible = true;
            ext_drawer_group.visible = true;
        }
        if (wHeight == 6 || wHeight == 6.5) {

            $("#addIDL").addClass("disabled");

        } else if (wHeight == 7 && (ED.visible && ID_L.visible && ID_S.visible)) {
            $("#addLocker").addClass("disabled");

        }
    })

    $("#addBottomShelf").click(function () {

        if ($(this)) {

            isCreatedBotRow = false;
            
        }

    })


}



function onHeightChanged() {

    if (wHeight < 6.5) {
        $("#addBottomShelf").addClass("disabled");
    } else if (wHeight == 6.5) {
        $("#addBottomShelf").removeClass("disabled");
        $("#addLocker").removeClass("disabled");
        $("#addIDS").removeClass("disabled");
    } else if (wHeight > 6.5 && (!_smallIntDrawers[plane_index] && !_lockers[plane_index])) {
        $("#addBottomShelf").removeClass("disabled");
        $("#addIDL").removeClass("disabled");
        $("#addED").removeClass("disabled");
    } else if (wHeight > 6.5 && (!ext_drawer.visible && !_largeIntDrawers[plane_index] && !_smallIntDrawers[plane_index])) {
        $("#addLocker").removeClass("disabled");

    }
    if (!isCreatedBotRow) {

        if (wHeight == 6.5) {
            set_bot_rows(1);
        } else if (wHeight == 7 && !_lockers[plane_index]) {
            set_bot_rows(1);
        } else if (_lockers[plane_index] && wHeight == 7 && !_largeIntDrawers[plane_index] && !ext_drawer.visible && !_smallIntDrawers[plane_index]) {
            set_bot_rows(2);
        } else if (_lockers[plane_index] && wHeight == 7 && ext_drawer.visible && !_smallIntDrawers[plane_index] && !_largeIntDrawers[plane_index]) {
            set_bot_rows(2);
        } else if (wHeight == 7 && _lockers[plane_index] && _largeIntDrawers[plane_index] && !ext_drawer.visible && !_smallIntDrawers[plane_index]) {
            set_bot_rows(2);
        } else if (wHeight == 7 && _lockers[plane_index] && _largeIntDrawers[plane_index] && ext_drawer.visible && !_smallIntDrawers[plane_index]) {
            set_bot_rows(2);
        } else if (wHeight == 7 && _lockers[plane_index] && !_largeIntDrawers[plane_index] && !ext_drawer.visible && _smallIntDrawers[plane_index]) {
            set_bot_rows(3);
        } else if (wHeight == 6 || (wHeight == 6.5 && !_lockers[plane_index] && !_largeIntDrawers[plane_index] && !ext_drawer.visible && !_smallIntDrawers[plane_index])) {


        }
        isCreatedBotRow = true;

    }

}

function set_bot_rows(num) {
        createBotShelves(num , plane_index); 
}


function create_splitter() {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshBasicMaterial({
        color: 0xaaaafd
    });
    var splitter = new THREE.Mesh(g, m);
    splitter.name = "splitter";
    return splitter;
}


function update_splitter(obj, posX, posY, posZ, scaleX, scaleY, scaleZ) {

    if (obj instanceof(THREE.Mesh)) {
        obj.position.set(posX, posY, posZ);
    }
    return obj;
}



function create_plane() {


    var g = new THREE.PlaneGeometry(1, 1);
    var m = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
    });

    plane = new THREE.Mesh(g, m);
    plane.name = "InteractivePlane";
    plane.scale.set(offset, 1 * ftTom, wDepth * ftTom);
    //   const map = new THREE.TextureLoader().load( './sprite.png' );
    // const material = new THREE.SpriteMaterial( { map: map,opacity:0.4,name:"btn_plus" } );
    // const sprite = new THREE.Sprite( material );
    // sprite.name = "InteractivePlane";
    // // sprite.position.set(1,1,1);
    // sprite.scale.set(0.2,0.2);
    // scene.add( sprite );


}

function update_plane() {

    // var p = scene.getObjectByName("InteractivePlane");
    if (plane instanceof(THREE.Mesh)) {
        plane.scale.set(offset - thickness / 12 * ftTom, wHeight * ftTom - (2 / 12 * ftTom) + thickness / 12 * ftTom - wBottom.position.y);
        plane.position.set((group.position.x + part[0].position.x) - offset / 2, wBack.position.y, wBottom.scale.z / 2);
    }

}

function createLocker(num) {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xddffdd
    });
    m.name = "wm_locker";
    var _locker = new THREE.Mesh(g, m);
    _locker.name = "_locker_" + num;

    // spLocker = new Splitter();
    // spLocker.create();

    _lockers[num] = _locker;
    _locker_group.name = "w_lockers";
    _locker_group.add(_lockers[num]);
    // scene.add(_lockers[num]);
    scene.add(_locker_group);
    createLockerSplitter(num);

}

function createLockerSplitter(num) {
    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "wm_locker_splitter";
    var _locker_splitter = new THREE.Mesh(g, m);
    _locker_splitter.name = "_locker_splitter_" + num;

    _locker_splitters[num] = _locker_splitter;
    _locker_splitter_group.name = "w_locker_splitters";
    _locker_splitter_group.add(_locker_splitters[num]);
    scene.add(_locker_splitter_group);
}

function updateLocker() {

    _lockers.forEach(e => {
        if (e instanceof THREE.Mesh) {
            _lockers[_lockers.indexOf(e)].scale.set(offset - (thickness / 12) * ftTom, (7.125 / 12) * ftTom, wDepth * ftTom)
            _lockers[_lockers.indexOf(e)].position.set(_lockers.indexOf(e) * offset, m_splitter.position.y - _lockers[_lockers.indexOf(e)].scale.y / 2 - m_splitter.scale.y / 2, wLeft.position.z / 2);
            _locker_group.position.set(offset / 2 + wLeft.position.x, _locker_group.position.y, _locker_group.position.z);
        }
    })

    _locker_splitters.forEach(e => {
        if (e instanceof THREE.Mesh) {
            _locker_splitters[_locker_splitters.indexOf(e)].scale.set(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
            _locker_splitters[_locker_splitters.indexOf(e)].position.set(_lockers[_locker_splitters.indexOf(e)].position.x, _lockers[_locker_splitters.indexOf(e)].position.y - locker.scale.y / 2 - (thickness / 24 * ftTom), _lockers[_locker_splitters.indexOf(e)].position.z);
            _locker_splitter_group.position.set(offset / 2 + wLeft.position.x, _locker_splitter_group.position.y, _locker_splitter_group.position.z);
        }
    })
}


function createInternalDrawerSmall(num) {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xadaffa
    });
    m.name = "wm_int_d_small";
    var _small_int = new THREE.Mesh(g, m);
    _small_int.name = "_int_d_small" + num;

    // spLocker = new Splitter();
    // spLocker.create();

    _smallIntDrawers[num] = _small_int;
    _smallIntDrawers_group.name = "w_int_d_small";
    _smallIntDrawers_group.add(_smallIntDrawers[num]);

    // scene.add(_lockers[num]);
    scene.add(_smallIntDrawers_group);


}

function updateInternalDrawerSmall() {
    _smallIntDrawers.forEach(e => {
        if (e instanceof THREE.Mesh) {
            _smallIntDrawers[_smallIntDrawers.indexOf(e)].scale.set(offset - (thickness / 12) * ftTom, (8 / 12) * ftTom, wDepth * ftTom)
            _smallIntDrawers_group.position.set(offset / 2 + wLeft.position.x, _smallIntDrawers_group.position.y, _smallIntDrawers_group.position.z);
            if (!_lockers[_smallIntDrawers.indexOf(e)]) {

                _smallIntDrawers[_smallIntDrawers.indexOf(e)].position.set(_smallIntDrawers.indexOf(e) * offset, m_splitters[_smallIntDrawers.indexOf(e)].position.y - _smallIntDrawers[_smallIntDrawers.indexOf(e)].scale.y / 2 - (thickness / 24) * ftTom, wLeft.position.z / 2);
            } else {

                _smallIntDrawers[_smallIntDrawers.indexOf(e)].position.set(_smallIntDrawers.indexOf(e) * offset, _lockers[_smallIntDrawers.indexOf(e)].position.y - _smallIntDrawers[_smallIntDrawers.indexOf(e)].scale.y - (thickness / 24) * ftTom, wLeft.position.z / 2);
            }
        }
    });
}

function createInternalDrawerLarge(num) {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xaa7f50
    });
    m.name = "wm_int_d_large";
    var _large_int = new THREE.Mesh(g, m);
    _large_int.name = "_int_d_large" + num;

    // spLocker = new Splitter();
    // spLocker.create();

    _largeIntDrawers[num] = _large_int;
    _largeIntDrawers_group.name = "w_int_d_large";
    _largeIntDrawers_group.add(_largeIntDrawers[num]);
    // scene.add(_lockers[num]);
    scene.add(_largeIntDrawers_group);
    createInternalDrawerLargeSplitters(num);

}

function createInternalDrawerLargeSplitters(num) {

    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0x22ffaa
    });
    m.name = "wm_int_d_large_splitter";
    var _splitter = new THREE.Mesh(g, m);
    _splitter.name = "w_int_d_splitter" + num;

    // spLocker = new Splitter();
    // spLocker.create();

    _largeIntDrawers_splitters[num] = _splitter;
    _largeIntDrawers_splitters_group.name = "w_int_d_splitters";
    _largeIntDrawers_splitters_group.add(_largeIntDrawers_splitters[num]);
    // scene.add(_lockers[num]);
    scene.add(_largeIntDrawers_splitters_group);


}

function updateInternalDrawerLarge() {

    _largeIntDrawers.forEach(e => {
        if (e instanceof THREE.Mesh) {
            _largeIntDrawers[_largeIntDrawers.indexOf(e)].scale.set(offset - (thickness / 12) * ftTom, (8 / 12) * ftTom, wDepth * ftTom)

            if (!ext_drawer_group.visible) {

                _largeIntDrawers[_largeIntDrawers.indexOf(e)].position.set(_largeIntDrawers.indexOf(e) * offset, wBottom.position.y + _largeIntDrawers[_largeIntDrawers.indexOf(e)].scale.y / 2 + thickness/24 * ftTom, wLeft.position.z / 2);
            } else {

                _largeIntDrawers[_largeIntDrawers.indexOf(e)].position.set(_largeIntDrawers.indexOf(e) * offset, splitters[_largeIntDrawers.indexOf(e)].position.y + _largeIntDrawers[_largeIntDrawers.indexOf(e)].scale.y / 2 + (thickness / 24) * ftTom, wLeft.position.z / 2);
            }

            _largeIntDrawers_group.position.set(offset / 2 + wLeft.position.x, _largeIntDrawers_group.position.y, _largeIntDrawers_group.position.z);
        }
    })

    _largeIntDrawers_splitters.forEach(e => {
        if (e instanceof THREE.Mesh) {
            _largeIntDrawers_splitters[_largeIntDrawers_splitters.indexOf(e)].scale.set(m_splitter.scale.x, m_splitter.scale.y, m_splitter.scale.z);
            _largeIntDrawers_splitters[_largeIntDrawers_splitters.indexOf(e)].position.set(_largeIntDrawers[_largeIntDrawers_splitters.indexOf(e)].position.x, _largeIntDrawers[_largeIntDrawers_splitters.indexOf(e)].position.y + _largeIntDrawers[_largeIntDrawers_splitters.indexOf(e)].scale.y / 2 + (thickness / 24 * ftTom), _largeIntDrawers[_largeIntDrawers_splitters.indexOf(e)].position.z);
            _largeIntDrawers_splitters_group.position.set(offset / 2 + wLeft.position.x, _largeIntDrawers_splitters_group.position.y, _largeIntDrawers_splitters_group.position.z);
        }
    })


}





function update_object(index) {
    if (index > -1) {

        updateLocker();
        updateInternalDrawerSmall();
        updateInternalDrawerLarge();
        updateBotShelves();
        updateHanger();
        updateTopShelves();
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
    _bot_group.visible = false;
}

function updateBotShelves() {


    
    var vertical_offset = 0;
    var pos = 0;
    for (var i = 0; i < _bot_shelf_parent.length; i++) {
        vertical_offset *= -1;

        if (_bot_shelf_parent[i] instanceof THREE.Group) {
            if (_lockers[i] instanceof THREE.Mesh || _largeIntDrawers[i] instanceof THREE.Mesh ||
                _smallIntDrawers[i] instanceof THREE.Mesh || ext_drawer_group.visible) {

                //No Locker
                if (!_lockers[i]) {
                    if (_bot_shelf_parent[i]) {
                        // No Other Parts
                        if (!_smallIntDrawers[i] && !_largeIntDrawers[i] && !ext_drawer_group.visible) {
                            if (wHeight > 6.5) {
                                var dist = (m_splitters[i].position.y - wBottom.position.y);
                                vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1);
                                pos = m_splitters[i].position.y - m_splitters[i].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;
                            }
                        }
                        //ID_L
                        if (_largeIntDrawers[i] && !_smallIntDrawers[i] && !ext_drawer_group.visible) {
                            var dist = (m_splitters[i].position.y - m_splitters[i].scale.y / 2) - (_largeIntDrawers[i].scale.y / 2 + _largeIntDrawers[i].position.y);
                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (thickness / 24) * ftTom;
                            pos = (m_splitters[i].position.y - m_splitters[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                        }
                        //ID_S
                        else if (_smallIntDrawers[i] && !_largeIntDrawers[i] && !ext_drawer_group.visible) {
                            var dist = (_smallIntDrawers[i].position.y - wBottom.position.y);
                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (thickness / 24) * ftTom;
                            pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - vertical_offset + (2 * thickness / 12) * ftTom;
                        }
                        //ID_S and ED
                        else if (_smallIntDrawers[i] && !_largeIntDrawers[i] && ext_drawer_group.visible) {
                            var dist = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - (ext_drawer[i].scale.y / 2 + ext_drawer[i].position.y);
                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (_bot_shelf_parent[i].children.length * thickness / 12) * ftTom;
                            pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                        }
                        //ID_L and ID_S
                        else if (_smallIntDrawers[i] && _largeIntDrawers[i] && !ext_drawer_group.visible) {
                            var dist = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - (_largeIntDrawers[i].scale.y / 2 + _largeIntDrawers[i].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (_bot_shelf_parent[i].children.length * thickness / 12) * ftTom;
                            pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                        }
                        //ID_L and ID_S and ED
                        else if (_smallIntDrawers[i] && _largeIntDrawers[i] && ext_drawer_group.visible) {
                            var dist = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - (_largeIntDrawers[i].scale.y / 2 + _largeIntDrawers[i].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (_bot_shelf_parent[i].children.length * thickness / 12) * ftTom;
                            pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2 - vertical_offset - (thickness / 12) * ftTom);
                        }
                        //ED
                        else if (!_smallIntDrawers[i] && !_largeIntDrawers[i] && ext_drawer_group.visible) {
                            var dist = (m_splitters[i].position.y - m_splitters[i].scale.y / 2) - (ext_drawer[i].scale.y / 2 + ext_drawer[i].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            pos = (m_splitters[i].position.y - m_splitters[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;

                        }
                        //ED and ID_L
                        else if (!_smallIntDrawers[i] && _largeIntDrawers[i] && ext_drawer_group.visible) {
                            var dist = (m_splitters[i].position.y - m_splitters[i].scale.y / 2) - (_largeIntDrawers[i].scale.y / 2 + _largeIntDrawers[i].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            pos = (m_splitters[i].position.y - m_splitters[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length + 1)) * ftTom;

                        }
                    }
                }
                //No Locker
                else {
                    if (_bot_shelf_parent[i]) {
                        //Nothing
                        if (!_smallIntDrawers[i] && !_largeIntDrawers[i] && !ext_drawer_group.visible) {

                            if (_bot_shelf_parent[i].children.length > 1) {
                                var dist = (_lockers[i].position.y - _lockers[i].scale.y / 2) - (wBottom.scale.y / 2 - wBottom.position.y);
                                vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (((_bot_shelf_parent[i].children.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                                pos = _lockers[i].position.y - _lockers[i].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom;

                            } else {
                                var dist = (_lockers[i].position.y - _lockers[i].scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                                vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                                pos = (_lockers[i].position.y - _lockers[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            }
                        }

                        //ID_S
                        else if (!_largeIntDrawers[i] && !ext_drawer_group.visible && _smallIntDrawers[i]) {
                            if (_bot_shelf_parent[i].children.length > 1) {


                                var dist = (_smallIntDrawers[i].position.y + _smallIntDrawers[i].scale.y / 2) + (wBottom.scale.y / 2 - wBottom.position.y);

                                vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) - (((_bot_shelf_parent[i].children.length * thickness / 12) * ftTom) - (thickness / 24) * ftTom);
                                pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2 - vertical_offset + (thickness / 24) * ftTom);
                            } else {
                                var dist = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - (wBottom.scale.y / 2 + wBottom.position.y);

                                vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                                pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            }

                        }
                        //ED
                        else if (!_largeIntDrawers[i] && ext_drawer_group.visible) {
                            var dist = (_lockers[i].position.y - _lockers[i].scale.y / 2) - (ext_drawer[i].scale.y / 2 + ext_drawer[i].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            pos = (_lockers[i].position.y - _lockers[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;

                        }
                        //ID_L
                        else if (_largeIntDrawers[i] && !_smallIntDrawers[i]) {
                            var dist = (_lockers[i].position.y - _lockers[i].scale.y / 2) - (_largeIntDrawers[i].scale.y / 2 + _largeIntDrawers[i].position.y);

                            vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            pos = (_lockers[i].position.y - _lockers[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;

                        }
                        //ID_L
                        else if (_largeIntDrawers[i] && _smallIntDrawers[i]) {
                            if (_bot_shelf_parent[i].children.length < 2) {
                                var dist = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - (_largeIntDrawers[i].scale.y / 2 + _largeIntDrawers[i].position.y);

                                vertical_offset = dist / (_bot_shelf_parent[i].children.length + 1) + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                                pos = (_smallIntDrawers[i].position.y - _smallIntDrawers[i].scale.y / 2) - vertical_offset + (thickness / (12 * _bot_shelf_parent[i].children.length)) * ftTom;
                            }
                        }

                    }
                }
                vertical_offset *= -1;
            }
            for (var j = 0; j < _bot_shelf_parent[i].children.length; j++) {
                if(_bot_shelf_parent[i].children[j] instanceof THREE.Mesh){
                    _bot_shelf_parent[i].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);
                    _bot_shelf_parent[i].children[j].position.set(i* offset , (j * vertical_offset), wLeft.position.z / 2); 
                }
                
            }
            _bot_shelf_parent[i].position.set(offset / 2 + wLeft.position.x, pos, _bot_shelf_parent[i].position.z);
            _bot_shelf_parent[i].visible = true;
        }

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
    _hanger_group.name="w_hangers";
    scene.add(_hanger_group);
    removeTopShelves(index);
}

function updateHanger() {
   
    _hangers.forEach(e => {
        if (e instanceof THREE.Mesh) {
           
            _hangers[_hangers.indexOf(e)].scale.set(1, offset - (thickness / 12) * ftTom, 1);
            _hangers[_hangers.indexOf(e)].position.set(_hangers.indexOf(e) * offset, wTop.position.y - (1.5 / 12) * ftTom - wTop.scale.y, wLeft.position.z / 2);
            _hanger_group.position.set(offset / 2 + wLeft.position.x, _hanger_group.position.y, _hanger_group.position.z);  
        }
    })
}

function removeHanger(index){
    
    _hangers.forEach(e=>{
        if(_hangers[index] instanceof THREE.Mesh && _hangers[index] == e){
            if(_hanger_group instanceof THREE.Group){
                _hanger_group.remove(e);
            }
        }
    })
    _hangers[index] = null;
    
    
    
}

function createTopShelves(row,index) {
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


function updateTopShelves(){
    var vertical_offset = (1 * ftTom);
   
    for(var i = 0; i< _top_shelves_parent.length;i++){
        if(_top_shelves_parent[i] instanceof THREE.Group){
           
            for(var j = 0; j< _top_shelves_parent[i].children.length;j++){
              
                if(_top_shelves_parent[i].children[j] instanceof THREE.Mesh){
                    _top_shelves_parent[i].children[j].scale.set(offset - (thickness / 12) * ftTom, (thickness / 12) * ftTom, wDepth * ftTom);

                    _top_shelves_parent[i].children[j].position.set(i*offset, (j * vertical_offset), wLeft.position.z / 2);
            
                }

           }
           _top_shelves_parent[i].position.set(offset / 2 + wLeft.position.x, wTop.position.y - (_top_shelves_parent[i].children.length * ftTom) + (thickness / 12) * ftTom + wTop.scale.y / 2, _top_shelves_parent[i].position.z);
         
          
        }
        
    }
}

function removeTopShelves(index){
   
   
    _top_shelves_parent.forEach(e=>{
        if(e instanceof THREE.Group && index == _top_shelves_parent.indexOf(e)){
            scene.remove(e);
        }
    })
    _top_shelves_parent[index] = null;
    
  
}
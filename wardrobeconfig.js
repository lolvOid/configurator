let scene, camera, renderer, directionalLight, ambientLight, controls;


const viewer = document.getElementById("modelviewer");
const fwidth = viewer.clientWidth;
const fheight = viewer.clientHeight;

let wWidth = 2.5,
    wHeight = 6,
    wDepth = 1.5,
    segment_id = [],
    columns, customColumns = 2;
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
var top_shelf_group, bot_shelf_group;
let hangerRod;

let top_shelves = [],
    bot_shelves = [];

let internalPart;
let locker, ID_S, ID_L, ED, m_splitter;
init();
animate();


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
    internalPart = new THREE.Group();
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

    controls.minDistance = 7;
    controls.maxDistance = 10;
    controls.panSpeed = 1;

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.5, 0);


    getValues();
    window.addEventListener('resize', onWindowResize, true);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('click', onClick);


}

// create_hanger();
// create_top_shelves(3);
// create_bot_shelves(2);

// create_h_splitter();
// create_locker();
// create_internalDrawerSmall();
// create_externalDrawer();
// create_internalDrawerLarge();
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



    // update_columns();

    // renderer.render(scene, camera);
    document.getElementById('capturedImage').src = renderer.domElement.toDataURL();
    composer.render();
}


function update_wardrobe() {
    if (wBottom) {
        wBottom.scale.set(wWidth * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
        wBottom.position.set(0, (2 / 12) * ftTom + (thickness / 24) * ftTom , ((thickness / 24) * ftTom));
     
    }
    if (wBack) {
        wBack.scale.set(wWidth * ftTom, wHeight*ftTom -( 2/12  * ftTom)  , (thickness / 12) * ftTom);
        wBack.position.set(0, (wBack.scale.y / 2)  +wBottom.position.y - wBottom.scale.y/2, -wBottom.scale.z / 2);
        
    }
   
    if (wTop) {
        wTop.scale.set((wWidth * ftTom), (thickness / 12) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wTop.position.set(0, ((wBack.scale.y)+wBottom.position.y)-thickness/14*ftTom , 0);

        // ((wBack.scale.y)-wTop.scale.y/2+wBottom.position.y+wBottom.scale.y/2-(thickness/12)*ftTom)
    }


    if (wLeft) {
        wLeft.scale.set((thickness / 12) * ftTom, (wHeight ) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wLeft.position.set(-(((thickness / 24) * ftTom) + (wBack.scale.x / 2)),(wBack.scale.y / 2) +(wBottom.position.y)-wBottom.scale.y-thickness/24*ftTom, 0);
       
    }
    if (wRight) {
        wRight.scale.set((thickness / 12) * ftTom, (wHeight) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wRight.position.set((((thickness / 24) * ftTom) + (wBack.scale.x / 2)), (wBack.scale.y / 2) +(wBottom.position.y)-wBottom.scale.y-thickness/24*ftTom, 0);
    }


    if (wpLoftBottom) {
      wpLoftBottom.scale.set(wWidth*ftTom, (thickness / 12) * ftTom,wDepth*ftTom  + (2*(thickness / 12) * ftTom));
      wpLoftBottom.position.set(wTop.position.x,wTop.position.y+wpLoftBottom.scale.y, wTop.position.z);
    }

    if (wpLoftBack) {
       wpLoftBack.scale.set(wWidth * ftTom + (wpLoftLeft.scale.x + wpLoftRight.scale.x), wLoft*ftTom  , (thickness / 12) * ftTom);
       wpLoftBack.position.set(0,wpLoftBottom.position.y + wpLoftBack.scale.y/2  - wpLoftBottom.scale.y/2, -wpLoftBottom.scale.z/2 + (thickness / 24) * ftTom);
    }
    if (wpLoftLeft) {
      wpLoftLeft.scale.set(thickness/12*ftTom, wLoft * ftTom, ((2*thickness/12)+wDepth)*ftTom);
      wpLoftLeft.position.set(-(thickness/24 * ftTom+ wpLoftBottom.scale.x/2), wpLoftBottom.position.y+wpLoftLeft.scale.y/2 - wpLoftBottom.scale.y/2,0);
    }


    if (wpLoftRight) {
        wpLoftRight.scale.set(thickness/12*ftTom, wLoft * ftTom, ((2*thickness/12)+wDepth)*ftTom);
        wpLoftRight.position.set((thickness/24 * ftTom+ wpLoftBottom.scale.x/2), wpLoftBottom.position.y+wpLoftRight.scale.y/2 - wpLoftBottom.scale.y/2,0);
    }
    if (wpLoftTop) {
      wpLoftTop.scale.set(wWidth*ftTom, (thickness / 12) * ftTom,wDepth*ftTom  + (2*(thickness / 12) * ftTom));
      wpLoftTop.position.set(0,wpLoftBack.scale.y+wpLoftBottom.position.y - (thickness/12)*ftTom  ,0 );
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
    directionalLight = new THREE.DirectionalLight(0xfefefe,0.4);
    directionalLight.position.set(0, 0, 0.5).normalize();

    scene.add(directionalLight);

    var directionalLight1 = new THREE.DirectionalLight(0xfefefe, 0.2);
    directionalLight1.position.set(0, 0, -0.5).normalize();


    scene.add(directionalLight1);

    ambientLight = new THREE.AmbientLight(0x828282, 1); // soft white light

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
    }





    if (setColumns) {




        part.forEach(e => {

            group.remove(e);
        });




        //columns_number();

        setColumns = false;

    } else {

        offset = (wWidth * ftTom)/ customColumns;
      

        for (var i = 0; i < customColumns - 1; i++) {

            var g = new THREE.BoxGeometry(1, 1, 1);
            var m = new THREE.MeshStandardMaterial({
                color: 0xacacac,
            });
            m.name = "m_segments" + i;

            part.push(new THREE.Mesh(g, m));


            part[i].scale.set((thickness / 12) * ftTom,wHeight*ftTom -( 2/12  * ftTom) + thickness/12 * ftTom -wBottom.position.y, (((thickness / 12) + wDepth) * ftTom));
            part[i].position.set(i * offset, (wBack.scale.y / 2)  +wBottom.position.y - wBottom.scale.y/2 , (((thickness / 24)) * ftTom));

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

        // create_top_shelves(3);


        // console.log(wLeft.position.x-part[0].position.x);
        // console.log(part[0].position.xoffset);
        // console.log(wLeft.position.x/2);

        if (columns > 3) {
            update_hanger(1);
            update_top_shelves(1);
            update_bot_shelves(1);
            update_h_splitter((group.position.x + part[1].position.x) - offset / 2, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, offset);
            update_locker(1);
            update_internalDrawerSmall(1);
            update_externalDrawer(1);
            update_internalDrawerLarge(1);
        } else {
            update_hanger(0);
            update_top_shelves(0);
            update_bot_shelves(0);
            update_h_splitter((group.position.x + part[0].position.x) - offset / 2, wTop.position.y - (3 * ftTom) + wTop.scale.y / 2 + (thickness / 12) * ftTom, offset);
            update_locker(0);
            update_internalDrawerSmall(0);
            update_externalDrawer(0);
            update_internalDrawerLarge(0);
        }

    }


    // console.log("Size of Columns:",(((offset/ftTom)-(thickness/12))*12)/(columns-1),"in");

    // $("#columnSize").html(((wWidth/customColumns)*12 - (customColumns*thickness)));

}

function stop() {
    window.cancelAnimationFrame(renderer);



}

function Reset() {


}

function onClick() {



    if (selectedObject) {

        adjacentParts.forEach(e => {
            if (e == selectedObject) {

                selectedObject = null;
            }

        });

        for (var i = 0; i < columns; i++) {

            if (part[i] === selectedObject) {
                if (part[i - 1]) {
                    //part[i-1].material.color.set('#ffff00');

                    adjacentParts.push(part[i - 1]);
                }
                if (part[i + 1]) {
                    //part[i+1].material.color.set('#ff00ff');

                    adjacentParts.push(part[i + 1]);
                }
                part[i].visible = false;
                removed.push(part[i]);

            } else {

            }
        }

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


    // if (intersects.length > 0) {

    //     selectedObject = intersects[0].object;

    //     addSelectedObject(selectedObject);

    //     adjacentParts.forEach(e => {
    //         if (e == selectedObject) {


    //             outlinePass.visibleEdgeColor.set("#ff0000");


    //         }

    //     });
    //     outlinePass.selectedObjects = selectedObjects;

    // } else {
    //     outlinePass.visibleEdgeColor.set("#00ffff");
    //     outlinePass.selectedObjects = [];

    //     selectedObject = null;
    // }


    if (intersects.length > 0) {

        const res = intersects.filter(function (res) {

            return res && res.object;

        })[0];


        if (res && res.object) {

            selectedObject = res.object;
            addSelectedObject(selectedObject);

            adjacentParts.forEach(e => {
                if (e == selectedObject) {


                    outlinePass.visibleEdgeColor.set("#ff0000");


                }

            });
            outlinePass.selectedObjects = selectedObjects;


        }

    } else {

        outlinePass.visibleEdgeColor.set("#00ffff");
        outlinePass.selectedObjects = [];

        selectedObject = null;
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

function create_hanger() {
    var g = new THREE.CylinderGeometry((1 / 12) * ftTom, (1 / 12) * ftTom, 1, 32, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xdedede,
        roughness: 0.2,
        metalness: 0.4
    });

    m.name = "m_rod";

    hangerRod = new THREE.Mesh(g, m);
    hangerRod.name = "hanger_rod";

    hangerRod.rotateZ(90 * THREE.Math.DEG2RAD);

    scene.add(hangerRod);

    console.log(hangerRod.position.x)
}

function update_hanger(segmentNumber) {
    if (hangerRod) {
        hangerRod.scale.set(1, offset, 1);
        hangerRod.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2,((wTop.position.y) - (ftTom * (1.5 / 12)))-  (1 / 12) * ftTom+( thickness / 12) * ftTom, wLeft.position.z / 2);
        

        // console.log(((wTop.position.y - hangerRod.position.y)+(wTop.scale.y)/ftTom)*12);
    }




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
    }



}

function update_top_shelves(segmentNumber) {

    var vertical_offset = (1 * ftTom);


    for (var i = 0; i < top_shelves.length; i++) {
        top_shelves[i].scale.set(offset, (thickness / 12) * ftTom, wDepth * ftTom);

        top_shelves[i].position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, (i * vertical_offset), wLeft.position.z / 2);

    }

    top_shelf_group.position.set(top_shelf_group.position.x, wTop.position.y - (top_shelves.length * ftTom) + (thickness / 12) * ftTom + wTop.scale.y / 2, top_shelf_group.position.z);

}

function create_bot_shelves(count) {
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
    var vertical_offset = (1 * ftTom);


    for (var i = 0; i < bot_shelves.length; i++) {
        bot_shelves[i].scale.set(offset, (thickness / 12) * ftTom, wDepth * ftTom);

        bot_shelves[i].position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, (i * vertical_offset), wLeft.position.z / 2);

    }
    
    
    bot_shelf_group.position.set(bot_shelf_group.position.x, wBottom.position.y + vertical_offset - (bot_shelves.length*thickness/12)*ftTom  , bot_shelf_group.position.z);
    
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

        m_splitter.scale.set(scaleX, (thickness / 12) * ftTom, wDepth * ftTom);

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

}

function update_locker(segmentNumber) {

    if (locker) {
        locker.scale.set(offset, (7.125 / 12) * ftTom, wDepth * ftTom)
        if (m_splitter) {
            locker.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, m_splitter.position.y - locker.scale.y / 2 - m_splitter.scale.y / 2, wLeft.position.z / 2);
        } else if (top_shelves) {
            locker.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, top_shelf_group.position.y - wTop.scale.y / 2 - (4 * thickness / 12) * ftTom, wLeft.position.z / 2);
        }

    }

}

function remove_locker() {
    if (locker) {
        scene.remove(locker);
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
}

function update_internalDrawerSmall(segmentNumber) {
    if (ID_S) {
        ID_S.scale.set(offset, (8 / 12) * ftTom, wDepth * ftTom)
        if (locker) {
            ID_S.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, locker.position.y - ID_S.scale.y + (thickness /24) * ftTom, wLeft.position.z / 2);
        } else {
            ID_S.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, m_splitter.position.y - ID_S.scale.y / 2  - (thickness / 24) * ftTom, wLeft.position.z / 2);
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

}



function update_externalDrawer(segmentNumber) {
    if (ED) {
        ED.scale.set(offset, ftTom, wDepth * ftTom);
        ED.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, wBottom.position.y + ED.scale.y / 2, wLeft.position.z / 2);
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
}

function update_internalDrawerLarge(segmentNumber) {
    if (ID_L) {
        ID_L.scale.set(offset, (10 / 12) * ftTom, wDepth * ftTom);
        if(ED){
            ID_L.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, ED.position.y + ID_L.scale.y + (thickness / 12) * ftTom, wLeft.position.z / 2);    
        }
        else{
            ID_L.position.set((group.position.x + part[segmentNumber].position.x) - offset / 2, wBottom.position.y + ID_L.scale.y/2 + (thickness / 12) * ftTom, wLeft.position.z / 2);
        }
        
        
    }
}

function remove_all_internal(){

    if(bot_shelf_group){
        scene.remove(bot_shelf_group);
    }
    if(top_shelf_group){
        scene.remove(top_shelf_group);
    }
    if(locker){
        scene.remove(locker);
    }
    if(ID_L){
        scene.remove(ID_L);
    }
    if(ID_S){
        scene.remove(ID_S);
    }
    if(ED){
        scene.remove(ED);
    }
    if(m_splitter){
        scene.remove(m_splitter);
    }
    
    if(hangerRod){
        scene.remove(hangerRod);    
    }
    
}
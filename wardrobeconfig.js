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
    controls.dampingFactor = 0;
    controls.minDistance = 7 ;
    controls.maxDistance = 8;
    controls.panSpeed = 0;
    
    controls.enableDamping = true;
    controls.dampingFactor = 0;
    controls.target.set(0,1.5, 0);


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
    // update_columns();
    
    // renderer.render(scene, camera);
    document.getElementById('capturedImage').src = renderer.domElement.toDataURL();
    composer.render();
}


function update_wardrobe() {
    if (wBottom) {
        wBottom.scale.set(wWidth * ftTom, (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
        wBottom.position.set(0, -((thickness / 24) * ftTom), ((thickness/24) * ftTom));
    }
    if (wBack) {
        wBack.scale.set(wWidth * ftTom, ((thickness / 12) + wHeight) * ftTom, (thickness / 12) * ftTom);
        wBack.position.set(0, (wBack.scale.y / 2) - ((thickness / 12) * ftTom), -wBottom.scale.z / 2);
    }
    if (wLeft) {
        wLeft.scale.set((thickness / 12) * ftTom, (wHeight + (thickness / 12)) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wLeft.position.set(-(((thickness / 24) * ftTom) + (wBottom.scale.x / 2)), (wBack.scale.y / 2) - ((thickness / 12) * ftTom), 0);
    }
    if (wRight) {
        wRight.scale.set((thickness / 12) * ftTom, (wHeight + (thickness / 12)) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wRight.position.set((((thickness / 24) * ftTom) + (wBottom.scale.x / 2)), (wBack.scale.y / 2) - ((thickness / 12) * ftTom), 0);
    }

    if (wTop) {
        wTop.scale.set((wWidth * ftTom) + ((2 * thickness / 12) * ftTom), (thickness / 12) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wTop.position.set(0, ((wBack.scale.y) + (wTop.scale.y / 2)) - ((thickness / 12) * ftTom), 0);


    }



    if (wpLoftBottom) {
        wpLoftBottom.scale.set((wWidth * ftTom) + ((2 * thickness / 12) * ftTom), (thickness / 12) * ftTom, wDepth * ftTom + ((thickness / 12) * ftTom));
        wpLoftBottom.position.set(0, (wBack.scale.y) + (wpLoftBottom.scale.y / 2), 0);
    }

    if (wpLoftBack) {
        wpLoftBack.scale.set(wWidth * ftTom, ((thickness / 12) + wLoft) * ftTom, (thickness / 12) * ftTom);
        wpLoftBack.position.set(0, (wpLoftBottom.position.y) + (wpLoftBack.scale.y / 2) - ((thickness / 12) * ftTom), -wpLoftBottom.scale.z / 2);
    }
    if (wpLoftLeft) {
        wpLoftLeft.scale.set((thickness / 12) * ftTom, (wLoft + (thickness / 12)) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wpLoftLeft.position.set(-(((thickness / 24) * ftTom) + (wBottom.scale.x / 2)), (wpLoftBottom.position.y) + ((wpLoftBack.scale.y / 2) - ((thickness / 12) * ftTom)), 0);
    }

    if (wpLoftRight) {
        wpLoftRight.scale.set((thickness / 12) * ftTom, (wLoft + (thickness / 12)) * ftTom, (((2 * thickness / 12) + wDepth) * ftTom));
        wpLoftRight.position.set((((thickness / 24) * ftTom) + (wBottom.scale.x / 2)), (wpLoftBottom.position.y) + ((wpLoftRight.scale.y / 2) - ((thickness / 12) * ftTom)), 0);
    }
    if (wpLoftTop) {
        wpLoftTop.scale.set((wWidth * ftTom) + ((2 * thickness / 12) * ftTom), (thickness / 12) * ftTom, wDepth * ftTom + (2 * thickness / 12) * ftTom);
        wpLoftTop.position.set(0, (wpLoftBottom.position.y) + (((wpLoftBack.scale.y) + (wpLoftTop.scale.y / 2)) - ((thickness / 12) * ftTom)), 0);
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
    wBottom = new THREE.Mesh(g, m);
    wBottom.position.set(0, 0, 0);
    wBottom.layers.set(0);

    wBack = new THREE.Mesh(g, m);
    wBack.position.set(0, 0, 0);
    wBottom.layers.set(0);

    wLeft = new THREE.Mesh(g, m);
    wLeft.position.set(0, 0, 0);
    wLeft.layers.set(0);

    wRight = new THREE.Mesh(g, m);
    wRight.position.set(0, 0, 0);
    wRight.layers.set(0);

    wTop = new THREE.Mesh(g, m);
    wTop.position.set(0, 0, 0);
    wTop.layers.set(0);

    wpLoftTop = new THREE.Mesh(g, m);
    wpLoftTop.position.set(0, 0, 0);
    wpLoftTop.visible = false;
    wpLoftTop.layers.set(1);

    wpLoftLeft = new THREE.Mesh(g, m);
    wpLoftLeft.position.set(0, 0, 0);
    wpLoftLeft.visible = false;
    wpLoftLeft.layers.set(1);

    wpLoftRight = new THREE.Mesh(g, m);
    wpLoftRight.position.set(0, 0, 0);
    wpLoftRight.visible = false;
    wpLoftRight.layers.set(1);

    wpLoftBottom = new THREE.Mesh(g, m);
    wpLoftBottom.position.set(0, 0, 0);
    wpLoftBottom.visible = false;
    wpLoftBottom.layers.set(1);

    wpLoftBack = new THREE.Mesh(g, m);
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
    directionalLight = new THREE.DirectionalLight(0xfefefe, 0.2);
    directionalLight.position.set(0,0, 0.5).normalize();

    scene.add(directionalLight);

    var directionalLight1 = new THREE.DirectionalLight(0xfefefe, 0.4);
    directionalLight1.position.set(-0.5, 0, 0).normalize();


    scene.add(directionalLight1);

    ambientLight = new THREE.AmbientLight(0xfefefe, 0.8); // soft white light

    scene.add(ambientLight);
}

function helpers() {
    // const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    // gridHelper.position.y = -150;
    // gridHelper.position.x = -150;

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




    var g = new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.MeshStandardMaterial({
        color: 0xacacac,
        roughness: 1

    });


    if (setColumns) {



   
        part.forEach(e => {
            
            group.remove(e);
        });




        //columns_number();

        setColumns = false;

    } else {

        offset = (wWidth * ftTom) / customColumns;

        for (var i = 0; i < customColumns - 1; i++) {

            part.push(new THREE.Mesh(g, m));



            part[i].position.set(i * offset, (wBack.scale.y / 2) - ((thickness / 24) * ftTom), (((thickness / 24)) * ftTom));
            part[i].scale.set((thickness / 12) * ftTom, (wHeight + (thickness / 48)) * ftTom, (((thickness / 12) + wDepth) * ftTom));
           // part[i].receiveShadow = true;

            


            for (var j = 0; j <= i; j++) {
                segment_id[i, j] = [i, part[j].uuid];

            }

            group.add(part[i]);
          
                
        }
        
        group.layers.set(2);
        group.position.set(offset + wLeft.position.x, group.position.y,group.position.z);
        
        scene.add(group);

    }


    // console.log("Size of Columns:",(((offset/ftTom)-(thickness/12))*12)/(columns-1),"in");

    $("#columnSize").html((((wWidth * 12) - (4 * thickness)) / (customColumns)).toFixed(3) + " in, " + ((wWidth - (2 * thickness / 12)) / (customColumns)).toFixed(3) + " ft");

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
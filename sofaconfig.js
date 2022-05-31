    let scene, cssScene, camera, orthoCameraTop, orthoCameraLeft, dimensionScene, dimensionRenderer, renderer, directionalLight, ambientLight, controls;
    let css2DRenderer, css3DRenderer, css2DRenderer2;

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
        leg: null
    };
    var legs = [];
    var loading = 0;


    var singleCount = 0,
        leftCount = 0,
        rightCount = 0;

    const btn_group = new THREE.Group();

    var leftIndex = 0,
        rightIndex = 0;

    var currentSingleCount = 0,
        currentChaiseCount = 0,
        currentCornerCount = 0;
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
    init();

    animate();



    dimensionviewer.hidden = true;

    function getInputs() {
        $("#btn").click(function () {

        })

        $("#export").click(function () {
            Export();
        })



        $("#selectSofa").change(function () {

            loadSofa($(this).children("option:selected").val());
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

        camera.position.set(0, 5, 10);
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




        css2DRenderer2 = new THREE.CSS2DRenderer();

        css2DRenderer2.setSize(fwidth, fheight);
        css2DRenderer2.domElement.style.position = 'fixed';
        // css2DRenderer.domElement.style.fontFamily = "Arial"
        // css2DRenderer2.domElement.style.color = '#000000';
        css2DRenderer2.domElement.style.top = '0px';
        css2DRenderer2.domElement.style.left = '0px';
        css2DRenderer2.domElement.style.zIndex = 1

        css3DRenderer = new THREE.CSS3DRenderer();
        css3DRenderer.setSize(fwidth, fheight);
        css3DRenderer.domElement.style.position = 'absolute';
        // css2DRenderer.domElement.style.fontFamily = "Arial"
        css3DRenderer.domElement.style.color = '#000000';
        css3DRenderer.domElement.style.top = '0px';
        css3DRenderer.domElement.style.left = '0px';


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


        // createBufferBox();
        // createSofa(0);

        getInputs();
        // createArmRest();
        // loadSofa(0);
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
        fxaaPass.material.uniforms['resolution'].value.x = 1 / (fwidth * pixelRatio);
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (fheight * pixelRatio);
        render();

    }

    function animate() {
        requestAnimationFrame(animate);



        update();
        render();

    }

    function update() {
        controls.update();
        updateFloor();


        var singles = sofas.filter(sofas => sofas.name == sofa.single.name);
        var chaiseL = sofas.filter(sofas => sofas.name == sofa.chaiseL.name);
        var chaiseR = sofas.filter(sofas => sofas.name == sofa.chaiseR.name);
        var cornerL = sofas.filter(sofas => sofas.name == sofa.cornerL.name);
        var cornerR = sofas.filter(sofas => sofas.name == sofa.cornerR.name);
        currentSingleCount = singles.length;
        currentChaiseCount = chaiseL.length + chaiseR.length;
        currentCornerCount = cornerL.length + cornerR.length;




        sofaCount = currentSingleCount + currentChaiseCount + currentCornerCount;
        if (sofaCount < 16) {
            btn_group.visible = true;
        } else {
            btn_group.visible = false;
        }
        $("#sofaCount").html(sofaCount);

        checkDistance();


        updateArmrests(leftIndex, rightIndex);
        updateButtonCorner(leftIndex, rightIndex);


        if (sofas.length > 0) {
            btn_group.position.set(0, 0, 0);


        }


        if (lasthSingleCount <= hSingleCount) {
            enableHorizontalBottomAdding = true;
        } else {
            enableHorizontalBottomAdding = false;
        }
        console.log("last: " + lasthSingleCount + ", single: " + hSingleCount, ", Enable: " + enableHorizontalBottomAdding)
        updateHorizontalBottoms();
        updateVerticalBottomLeft();
        updateVerticalBottomRight();

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
            var f = new THREE.Box3().setFromObject(sofa.leg).getSize(new THREE.Vector3());

            floor.position.setY(-f.y);
        }
    }

    function render() {

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


    function addButton() {
        if (sofas.length > 0) {
            createButton("left", -0.8);
            createButton("right", 0.8);
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
                var sofaSize = new THREE.Box3().setFromObject(sofas[index].children[0]).getSize(new THREE.Vector3());
                var cornerSize = new THREE.Box3().setFromObject(sofa.cornerL).getSize(new THREE.Vector3());
                var cornerSeatSize = new THREE.Box3().setFromObject(sofa.cornerL.children[5]).getSize(new THREE.Vector3());
                var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());



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
                        s.translateX((-1 - leftverticalSingleCount) * sofaSize.x)
                        s.position.setX(sofas[index].position.x);





                        leftverticalSingleCount += 1;

                        addVerticalBottomLeft();

                    } else {
                        enableHorizontalBottomAdding = true;
                        hSingleCount += 1;
                        lasthSingleCount = hSingleCount;
                        s.position.setX(sofas[index].position.x - sofaSize.x)
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
                        s.translateX((1 + rightverticalSingleCount) * sofaSize.x)
                        s.position.setX(sofas[index].position.x);





                        rightverticalSingleCount += 1;
                        addVerticalBottomRight();
                    } else {
                        enableHorizontalBottomAdding = true;
                        hSingleCount += 1;
                        lasthSingleCount = hSingleCount;
                        s.position.setX(sofas[index].position.x + sofaSize.x)
                    }


                }







            } else {


                s.position.setX(0);

            }


            if (!sofas.includes(s)) {
                sofas.push(s)
            }


            if (sofas.length > 0) {
                if (enableHorizontalBottomAdding) {

                    addHorizontalBottom()
                }


            }

        }



    }

    function addHorizontalBottom() {


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



        // console.log(singleCount)
        var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
        if (lastBottomSofa.length > 0) {
            // Bottom

            var btmLSize = new THREE.Box3().setFromObject(lastBottomSofa[1]).getSize(new THREE.Vector3());
            var btmSize = new THREE.Box3().setFromObject(lastBottomSofa[0]).getSize(new THREE.Vector3());


            lastBottomSofa[0].position.setZ(sofas[leftHorizontalIndex].position.z);

            lastBottomSofa[0].scale.setX(singleCount + btmLSize.x * 8);

            var btmSize = new THREE.Box3().setFromObject(lastBottomSofa[0]).getSize(new THREE.Vector3());


            //back
            var bkLSize = new THREE.Box3().setFromObject(lastBackSofa[1]).getSize(new THREE.Vector3());
            var bkSize = new THREE.Box3().setFromObject(lastBackSofa[0]).getSize(new THREE.Vector3());




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

                var btmSize = new THREE.Box3().setFromObject(lastBottomSofa[0]).getSize(new THREE.Vector3());
                lastBottomSofa[1].position.setX(lastBottomSofa[0].position.x + btmSize.x / 2);
                lastBottomSofa[1].position.setZ(lastBottomSofa[0].position.z);


                lastBottomSofa[2].position.setX(lastBottomSofa[0].position.x - btmSize.x / 2);
                lastBottomSofa[2].position.setZ(lastBottomSofa[0].position.z);

                const btm_group = new THREE.Group();
                btm_group.name = "Bottoms";
                lastBottomSofa.forEach(e => {
                    btm_group.add(e);

                })

                if (!bottoms.includes(btm_group)) {

                    bottoms.push(btm_group);

                }
                bottoms.forEach(e => {
                    scene.add(e)
                })
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

                var bkSize = new THREE.Box3().setFromObject(lastBackSofa[0]).getSize(new THREE.Vector3());
                lastBackSofa[0].position.setZ(sofas[leftHorizontalIndex].position.z - seatSize.z / 2);
                lastBackSofa[1].position.setX(lastBackSofa[0].position.x + bkSize.x / 2);
                lastBackSofa[1].position.setZ(lastBackSofa[0].position.z);


                lastBackSofa[2].position.setX(lastBackSofa[0].position.x - bkSize.x / 2);
                lastBackSofa[2].position.setZ(lastBackSofa[0].position.z);

                const bk_group = new THREE.Group();
                bk_group.name = "Backs";
                lastBackSofa.forEach(e => {
                    bk_group.add(e);

                })

                if (!backs.includes(bk_group)) {

                    backs.push(bk_group);

                }
                backs.forEach(e => {
                    scene.add(e)
                })
            }



        }
        if (singleCount == 1) {
            // Legs


            var leg_group = new THREE.Group();
            leg_group.name = "Legs";
            for (var i = 0; i < 4; i++) {
                leg_group.add(sofa.leg.clone());

            }
            if (!legs.includes(leg_group)) {
                legs.push(leg_group);
            }




            legs.forEach(e => {
                scene.add(e)
            });


        }



    }

    function updateHorizontalBottoms() {

        if (bottoms.length > 0) {
            if (enableHorizontalBottomAdding) {
                var sofaSize = new THREE.Box3().setFromObject(sofas[leftHorizontalIndex]).getSize(new THREE.Vector3());
                for (var i = 0; i < bottoms.length; i++) {
                    if (i > 0) {

                        var prevBtmLSize = new THREE.Box3().setFromObject(bottoms[i - 1].children[1]).getSize(new THREE.Vector3());
                        if (hSingleCount > 3) {
                            if (hSingleCount % 2 == 0) {



                                bottoms[i].children[0].scale.setX(2 + prevBtmLSize.x * 3);

                                var currentBtmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());

                                var prevBtmSize = new THREE.Box3().setFromObject(bottoms[i - 1]).getSize(new THREE.Vector3());


                                var prevBtmLSize = new THREE.Box3().setFromObject(bottoms[i - 1].children[1]).getSize(new THREE.Vector3());



                                bottoms[i].children[1].position.setX(bottoms[i].children[0].position.x + currentBtmSize.x / 2);
                                bottoms[i].children[1].position.setZ(bottoms[i].children[0].position.z);

                                bottoms[i].children[2].position.setX(bottoms[i].children[0].position.x - currentBtmSize.x / 2);
                                bottoms[i].children[2].position.setZ(bottoms[i].children[0].position.z);


                                bottoms[i].position.setX(bottoms[i - 1].position.x + currentBtmSize.x + prevBtmLSize.x * 2);

                                var bkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                                var lSize = new THREE.Box3().setFromObject(legs[i].children[0]).getSize(new THREE.Vector3());
                                legs[i].position.setX(bottoms[i].position.x);
                                legs[i].children[0].position.set(-currentBtmSize.x / 2 + lSize.x, 0, -currentBtmSize.z / 2 - bkSize.z / 2);
                                legs[i].children[1].position.set(-currentBtmSize.x / 2 + lSize.x, 0, currentBtmSize.z / 2 - bkSize.z / 2);
                                legs[i].children[2].position.set(currentBtmSize.x / 2 - lSize.x, 0, -currentBtmSize.z / 2 - bkSize.z / 2);
                                legs[i].children[3].position.set(currentBtmSize.x / 2 - lSize.x, 0, currentBtmSize.z / 2 - bkSize.z / 2);
                            } else {

                                bottoms[i - 1].children[0].scale.setX(2 + prevBtmLSize.x * 3);
                                bottoms[i].children[0].scale.setX(3 + (prevBtmLSize.x * 6));




                                var prevBtmSize = new THREE.Box3().setFromObject(bottoms[i - 1].children[0]).getSize(new THREE.Vector3());

                                var prevBtmScale = new THREE.Box3().setFromObject(bottoms[i - 1]).getSize(new THREE.Vector3())

                                bottoms[i - 1].children[1].position.setX(bottoms[i - 1].children[0].position.x + prevBtmSize.x / 2);
                                bottoms[i - 1].children[1].position.setZ(bottoms[i - 1].children[0].position.z);

                                bottoms[i - 1].children[2].position.setX(bottoms[i - 1].children[0].position.x - prevBtmSize.x / 2);
                                bottoms[i - 1].children[2].position.setZ(bottoms[i - 1].children[0].position.z);

                                var currentBtmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());



                                if (i - 2 >= 0) {
                                    bottoms[i - 1].position.setX(bottoms[i - 2].position.x + prevBtmSize.x + prevBtmLSize.x * 2);
                                }

                                bottoms[i].position.setX((bottoms[i - 1].position.x + currentBtmSize.x / 2 + prevBtmSize.x / 2 + prevBtmLSize.x * 2));

                                bottoms[i].children[1].position.setX(bottoms[i].children[0].position.x + currentBtmSize.x / 2);
                                bottoms[i].children[1].position.setZ(bottoms[i].children[0].position.z);

                                bottoms[i].children[2].position.setX(bottoms[i].children[0].position.x - currentBtmSize.x / 2);
                                bottoms[i].children[2].position.setZ(bottoms[i].children[0].position.z);


                                var bkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                                var lSize = new THREE.Box3().setFromObject(legs[i].children[0]).getSize(new THREE.Vector3());
                                legs[i].position.setX(bottoms[i].position.x);
                                legs[i].children[0].position.set(-currentBtmSize.x / 2 + lSize.x, 0, -currentBtmSize.z / 2 - bkSize.z / 2);
                                legs[i].children[1].position.set(-currentBtmSize.x / 2 + lSize.x, 0, currentBtmSize.z / 2 - bkSize.z / 2);
                                legs[i].children[2].position.set(currentBtmSize.x / 2 - lSize.x, 0, -currentBtmSize.z / 2 - bkSize.z / 2);
                                legs[i].children[3].position.set(currentBtmSize.x / 2 - lSize.x, 0, currentBtmSize.z / 2 - bkSize.z / 2);

                                legs[i - 1].position.setX(bottoms[i - 1].position.x);
                                legs[i - 1].children[0].position.set(-prevBtmSize.x / 2 + lSize.x, 0, -prevBtmSize.z / 2 - bkSize.z / 2);
                                legs[i - 1].children[1].position.set(-prevBtmSize.x / 2 + lSize.x, 0, prevBtmSize.z / 2 - bkSize.z / 2);
                                legs[i - 1].children[2].position.set(prevBtmSize.x / 2 - lSize.x, 0, -prevBtmSize.z / 2 - bkSize.z / 2);
                                legs[i - 1].children[3].position.set(prevBtmSize.x / 2 - lSize.x, 0, prevBtmSize.z / 2 - bkSize.z / 2);

                            }


                        }





                    }
                    if (i == 0) {
                        var btmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());
                        var btmLSize = new THREE.Box3().setFromObject(bottoms[i].children[1]).getSize(new THREE.Vector3());
                        if (hSingleCount == 3) {
                            bottoms[i].position.setX(sofas[leftHorizontalIndex].position.x + sofaSize.x)
                        } else if (hSingleCount == 2) {
                            bottoms[i].position.setX(sofas[leftHorizontalIndex].position.x + sofaSize.x / 2)
                        } else if (hSingleCount == 1) {
                            bottoms[i].position.setX(sofas[leftHorizontalIndex].position.x)
                        } else if (hSingleCount > 3) {
                            bottoms[i].children[0].scale.setX(2 + btmLSize.x * 2);
                            bottoms[i].position.setX(sofas[leftHorizontalIndex].position.x + sofaSize.x / 2)
                        }






                        bottoms[i].children[1].position.setX(bottoms[i].children[0].position.x + btmSize.x / 2);
                        bottoms[i].children[1].position.setZ(bottoms[i].children[0].position.z);

                        bottoms[i].children[2].position.setX(bottoms[i].children[0].position.x - btmSize.x / 2);
                        bottoms[i].children[2].position.setZ(bottoms[i].children[0].position.z);

                        var bkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                        var lSize = new THREE.Box3().setFromObject(legs[i].children[0]).getSize(new THREE.Vector3());
                        legs[i].position.setX(bottoms[i].position.x);
                        legs[i].children[0].position.set(-btmSize.x / 2 + lSize.x, 0, -btmSize.z / 2 - bkSize.z / 2);
                        legs[i].children[1].position.set(-btmSize.x / 2 + lSize.x, 0, btmSize.z / 2 - bkSize.z / 2);
                        legs[i].children[2].position.set(btmSize.x / 2 - lSize.x / 2, 0, -btmSize.z / 2 - bkSize.z / 2);
                        legs[i].children[3].position.set(btmSize.x / 2 - lSize.x / 2, 0, btmSize.z / 2 - bkSize.z / 2);
                    }


                }

                //back
                for (var i = 0; i < backs.length; i++) {
                    if (i > 0) {

                        var prevBtmLSize = new THREE.Box3().setFromObject(backs[i - 1].children[1]).getSize(new THREE.Vector3());
                        if (hSingleCount > 3) {
                            if (hSingleCount % 2 == 0) {



                                backs[i].children[0].scale.setX(2 + prevBtmLSize.x * 3);

                                var currentBtmSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());

                                var prevBtmSize = new THREE.Box3().setFromObject(backs[i - 1]).getSize(new THREE.Vector3());


                                var prevBtmLSize = new THREE.Box3().setFromObject(backs[i - 1].children[1]).getSize(new THREE.Vector3());



                                backs[i].children[1].position.setX(backs[i].children[0].position.x + currentBtmSize.x / 2);
                                backs[i].children[1].position.setZ(backs[i].children[0].position.z);

                                backs[i].children[2].position.setX(backs[i].children[0].position.x - currentBtmSize.x / 2);
                                backs[i].children[2].position.setZ(backs[i].children[0].position.z);


                                backs[i].position.setX(backs[i - 1].position.x + currentBtmSize.x + prevBtmLSize.x * 2);
                            } else {

                                backs[i - 1].children[0].scale.setX(2 + prevBtmLSize.x * 3);
                                backs[i].children[0].scale.setX(3 + (prevBtmLSize.x * 6));




                                var prevBtmSize = new THREE.Box3().setFromObject(backs[i - 1].children[0]).getSize(new THREE.Vector3());

                                var prevBtmScale = new THREE.Box3().setFromObject(backs[i - 1]).getSize(new THREE.Vector3())

                                backs[i - 1].children[1].position.setX(backs[i - 1].children[0].position.x + prevBtmSize.x / 2);
                                backs[i - 1].children[1].position.setZ(backs[i - 1].children[0].position.z);

                                backs[i - 1].children[2].position.setX(backs[i - 1].children[0].position.x - prevBtmSize.x / 2);
                                backs[i - 1].children[2].position.setZ(backs[i - 1].children[0].position.z);

                                var currentBtmSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());



                                if (i - 2 >= 0) {
                                    backs[i - 1].position.setX(backs[i - 2].position.x + prevBtmSize.x + prevBtmLSize.x * 2);
                                }

                                backs[i].position.setX((backs[i - 1].position.x + currentBtmSize.x / 2 + prevBtmSize.x / 2 + prevBtmLSize.x * 2));

                                backs[i].children[1].position.setX(backs[i].children[0].position.x + currentBtmSize.x / 2);
                                backs[i].children[1].position.setZ(backs[i].children[0].position.z);

                                backs[i].children[2].position.setX(backs[i].children[0].position.x - currentBtmSize.x / 2);
                                backs[i].children[2].position.setZ(backs[i].children[0].position.z);






                            }


                        }




                    }
                    if (i == 0) {
                        var btmSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                        var btmLSize = new THREE.Box3().setFromObject(backs[i].children[1]).getSize(new THREE.Vector3());
                        if (hSingleCount == 3) {
                            backs[i].position.setX(sofas[leftHorizontalIndex].position.x + sofaSize.x)
                        } else if (hSingleCount == 2) {
                            backs[i].position.setX(sofas[leftHorizontalIndex].position.x + sofaSize.x / 2)
                        } else if (hSingleCount == 1) {
                            backs[i].position.setX(sofas[leftHorizontalIndex].position.x)
                        } else if (hSingleCount > 3) {
                            backs[i].children[0].scale.setX(2 + btmLSize.x * 2);
                            backs[i].position.setX(sofas[leftHorizontalIndex].position.x + sofaSize.x / 2)
                        }






                        backs[i].children[1].position.setX(backs[i].children[0].position.x + btmSize.x / 2);
                        backs[i].children[1].position.setZ(backs[i].children[0].position.z);

                        backs[i].children[2].position.setX(backs[i].children[0].position.x - btmSize.x / 2);
                        backs[i].children[2].position.setZ(backs[i].children[0].position.z);


                    }


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


        var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
        if (lastBottomSofasLV.length > 0) {
            // Bottom

            var btmLSize = new THREE.Box3().setFromObject(lastBottomSofasLV[1]).getSize(new THREE.Vector3());
            var btmSize = new THREE.Box3().setFromObject(lastBottomSofasLV[0]).getSize(new THREE.Vector3());




            lastBottomSofasLV[0].scale.x = leftCount + btmLSize.z * 4;

            //back
            var bkLSize = new THREE.Box3().setFromObject(lastBackSofaLV[1]).getSize(new THREE.Vector3());
            var bkSize = new THREE.Box3().setFromObject(lastBackSofaLV[0]).getSize(new THREE.Vector3());




            lastBackSofaLV[0].scale.x = leftCount + bkLSize.z * 4;









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

                var btmSize = new THREE.Box3().setFromObject(lastBottomSofasLV[0]).getSize(new THREE.Vector3());
                lastBottomSofasLV[1].position.setX(lastBottomSofasLV[0].position.x);
                lastBottomSofasLV[1].position.setZ(lastBottomSofasLV[0].position.z + btmSize.z / 2);


                lastBottomSofasLV[2].position.setX(lastBottomSofasLV[0].position.x);
                lastBottomSofasLV[2].position.setZ(lastBottomSofasLV[0].position.z - btmSize.z / 2);

                const btm_group = new THREE.Group();
                btm_group.name = "LeftBottoms";
                lastBottomSofasLV.forEach(e => {
                    e.rotation.y = Math.PI / 2;
                    btm_group.add(e);

                })

                if (!leftbottoms.includes(btm_group)) {

                    leftbottoms.push(btm_group);

                }
                leftbottoms.forEach(e => {
                    scene.add(e)
                })
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

                var bkSize = new THREE.Box3().setFromObject(lastBackSofaLV[0]).getSize(new THREE.Vector3());



                lastBackSofaLV[1].position.setX(lastBackSofaLV[0].position.x);
                lastBackSofaLV[1].position.setZ(lastBackSofaLV[0].position.z + bkSize.z / 2);


                lastBackSofaLV[2].position.setX(lastBackSofaLV[0].position.x);
                lastBackSofaLV[2].position.setZ(lastBackSofaLV[0].position.z - bkSize.z / 2);

                const bk_group = new THREE.Group();
                bk_group.name = "LeftBacks";

                lastBackSofaLV.forEach(e => {
                    e.rotation.y = Math.PI / 2;
                    bk_group.add(e);

                })

                if (!leftbacks.includes(bk_group)) {

                    leftbacks.push(bk_group);

                }
                leftbacks.forEach(e => {
                    scene.add(e)
                })
            }






        }
        if (leftCount == 1) {
            // Legs


            var leg_group = new THREE.Group();
            leg_group.name = "LeftLegs";
            for (var i = 0; i < 4; i++) {
                leg_group.add(sofa.leg.clone());

            }
            if (!leftlegs.includes(leg_group)) {
                leftlegs.push(leg_group);
            }




            leftlegs.forEach(e => {
                scene.add(e)
            });


        }
    }

    function updateVerticalBottomLeft() {

        if (leftbottoms.length > 0) {

            var sofaSize = new THREE.Box3().setFromObject(sofas[leftverticalIndex]).getSize(new THREE.Vector3());
            for (var i = 0; i < leftbottoms.length; i++) {

                if (i > 0) {



                    var prevBtmLSize = new THREE.Box3().setFromObject(leftbottoms[i - 1].children[1]).getSize(new THREE.Vector3());

                    if (leftverticalSingleCount > 3) {

                        if (leftverticalSingleCount % 2 == 0) {



                            leftbottoms[i].children[0].scale.setX(2 + (prevBtmLSize.z * 3));

                            var currentBtmSize = new THREE.Box3().setFromObject(leftbottoms[i].children[0]).getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3().setFromObject(leftbottoms[i - 1]).getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3().setFromObject(leftbottoms[i - 1].children[1]).getSize(new THREE.Vector3());

                            leftbottoms[i].children[1].position.setX(leftbottoms[i].children[0].position.x);
                            leftbottoms[i].children[1].position.setZ(leftbottoms[i].children[0].position.z - currentBtmSize.z / 2);

                            leftbottoms[i].children[2].position.setX(leftbottoms[i].children[0].position.x);
                            leftbottoms[i].children[2].position.setZ(leftbottoms[i].children[0].position.z + currentBtmSize.z / 2);

                            leftbottoms[i].position.setZ(leftbottoms[i - 1].position.z - currentBtmSize.z - prevBtmLSize.z * 2);


                            leftbottoms[i].position.setX(sofas[leftverticalIndex].position.x)
                            leftbottoms[i - 1].position.setX(sofas[leftverticalIndex].position.x)

                            var bkSize = new THREE.Box3().setFromObject(leftbacks[i].children[0]).getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3().setFromObject(leftlegs[i].children[0]).getSize(new THREE.Vector3());
                            leftlegs[i].position.setX(leftbottoms[i].position.x);
                            leftlegs[i].position.setZ(leftbottoms[i].position.z);
                            leftlegs[i].children[0].position.set(btmSize.x / 2 - lSize.x, 0, btmSize.z / 2);
                            leftlegs[i].children[1].position.set(btmSize.x / 2 - lSize.x, 0, -btmSize.z / 2);
                            leftlegs[i].children[2].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                            leftlegs[i].children[3].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);
                        } else {


                            leftbottoms[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            leftbottoms[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3().setFromObject(leftbottoms[i - 1].children[0]).getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3().setFromObject(leftbottoms[i - 1]).getSize(new THREE.Vector3());


                            leftbottoms[i - 1].children[1].position.setX(leftbottoms[i - 1].children[0].position.x);
                            leftbottoms[i - 1].children[1].position.setZ(leftbottoms[i - 1].children[0].position.z - prevBtmSize.z / 2);

                            leftbottoms[i - 1].children[2].position.setX(leftbottoms[i - 1].children[0].position.x);
                            leftbottoms[i - 1].children[2].position.setZ(leftbottoms[i - 1].children[0].position.z + prevBtmSize.z / 2);

                            var currentBtmSize = new THREE.Box3().setFromObject(leftbottoms[i].children[0]).getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {


                                leftbottoms[i - 1].position.setZ(leftbottoms[i - 2].position.z - prevBtmSize.z - prevBtmLSize.z * 2);
                            }


                            leftbottoms[i].position.setZ(leftbottoms[i - 1].position.z - currentBtmSize.z / 2 - prevBtmSize.z / 2 - prevBtmLSize.z * 2);


                            leftbottoms[i].children[1].position.setX(leftbottoms[i].children[0].position.x);
                            leftbottoms[i].children[1].position.setZ(leftbottoms[i].children[0].position.z - currentBtmSize.z / 2);

                            leftbottoms[i].children[2].position.setX(leftbottoms[i].children[0].position.x);
                            leftbottoms[i].children[2].position.setZ(leftbottoms[i].children[0].position.z + currentBtmSize.z / 2);


                            leftbottoms[i].position.setX(sofas[leftverticalIndex].position.x)
                            leftbottoms[i - 1].position.setX(sofas[leftverticalIndex].position.x)


                            var bkSize = new THREE.Box3().setFromObject(leftbacks[i].children[0]).getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3().setFromObject(leftlegs[i].children[0]).getSize(new THREE.Vector3());
                            leftlegs[i].position.setX(leftbottoms[i].position.x);
                            leftlegs[i].position.setZ(leftbottoms[i].position.z);
                            leftlegs[i].children[0].position.set(btmSize.x / 2 - lSize.x, 0, btmSize.z / 2);
                            leftlegs[i].children[1].position.set(btmSize.x / 2 - lSize.x, 0, -btmSize.z / 2);
                            leftlegs[i].children[2].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                            leftlegs[i].children[3].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);

                            leftlegs[i - 1].position.setX(leftbottoms[i - 1].position.x);
                            leftlegs[i - 1].position.setZ(leftbottoms[i - 1].position.z);
                            leftlegs[i - 1].children[0].position.set(btmSize.x / 2 - lSize.x, 0, btmSize.z / 2);
                            leftlegs[i - 1].children[1].position.set(btmSize.x / 2 - lSize.x, 0, -btmSize.z / 2);
                            leftlegs[i - 1].children[2].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                            leftlegs[i - 1].children[3].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);
                        }


                    }



                }
                if (i == 0) {
                    var btmSize = new THREE.Box3().setFromObject(leftbottoms[i].children[0]).getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3().setFromObject(leftbottoms[i].children[1]).getSize(new THREE.Vector3());
                    if (leftverticalSingleCount == 3) {
                        leftbottoms[i].position.setZ(sofas[leftverticalIndex].position.z - sofaSize.z)
                    } else if (leftverticalSingleCount == 2) {
                        leftbottoms[i].position.setZ(sofas[leftverticalIndex].position.z - sofaSize.z / 2)
                    } else if (leftverticalSingleCount == 1) {
                        leftbottoms[i].position.setZ(sofas[leftverticalIndex].position.z)
                    } else if (leftverticalSingleCount > 3) {
                        leftbottoms[i].children[0].scale.setX(2);
                        leftbottoms[i].position.setZ(sofas[leftverticalIndex].position.z - sofaSize.z / 2)
                    }






                    leftbottoms[i].children[1].position.setX(leftbottoms[i].children[0].position.x);
                    leftbottoms[i].children[1].position.setZ(leftbottoms[i].children[0].position.z - btmSize.z / 2);

                    leftbottoms[i].children[2].position.setX(leftbottoms[i].children[0].position.x);
                    leftbottoms[i].children[2].position.setZ(leftbottoms[i].children[0].position.z + btmSize.z / 2);


                    leftbottoms[i].position.setX(sofas[leftverticalIndex].position.x)

                    var bkSize = new THREE.Box3().setFromObject(leftbacks[i].children[0]).getSize(new THREE.Vector3());
                    var lSize = new THREE.Box3().setFromObject(leftlegs[i].children[0]).getSize(new THREE.Vector3());
                    leftlegs[i].position.setX(leftbottoms[i].position.x);
                    leftlegs[i].position.setZ(leftbottoms[i].position.z);
                    leftlegs[i].children[0].position.set(btmSize.x / 2 - lSize.x, 0, btmSize.z / 2);
                    leftlegs[i].children[1].position.set(btmSize.x / 2 - lSize.x, 0, -btmSize.z / 2);
                    leftlegs[i].children[2].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                    leftlegs[i].children[3].position.set(-btmSize.x / 2 - bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);

                }


            }
            for (var i = 0; i < leftbacks.length; i++) {

                if (i > 0) {



                    var prevBtmLSize = new THREE.Box3().setFromObject(leftbacks[i - 1].children[1]).getSize(new THREE.Vector3());

                    if (leftverticalSingleCount > 3) {

                        if (leftverticalSingleCount % 2 == 0) {



                            leftbacks[i].children[0].scale.setX(2 + (prevBtmLSize.z * 3));

                            var currentBtmSize = new THREE.Box3().setFromObject(leftbacks[i].children[0]).getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3().setFromObject(leftbacks[i - 1]).getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3().setFromObject(leftbacks[i - 1].children[1]).getSize(new THREE.Vector3());

                            leftbacks[i].children[1].position.setX(leftbacks[i].children[0].position.x);
                            leftbacks[i].children[1].position.setZ(leftbacks[i].children[0].position.z - currentBtmSize.z / 2);

                            leftbacks[i].children[2].position.setX(leftbacks[i].children[0].position.x);
                            leftbacks[i].children[2].position.setZ(leftbacks[i].children[0].position.z + currentBtmSize.z / 2);

                            leftbacks[i].position.setZ(leftbacks[i - 1].position.z - currentBtmSize.z - prevBtmLSize.z * 2);


                            leftbacks[i].position.setX(sofas[leftverticalIndex].position.x - sofaSize.z / 2)
                            leftbacks[i - 1].position.setX(sofas[leftverticalIndex].position.x - sofaSize.z / 2)
                        } else {


                            leftbacks[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            leftbacks[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3().setFromObject(leftbacks[i - 1].children[0]).getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3().setFromObject(leftbacks[i - 1]).getSize(new THREE.Vector3());


                            leftbacks[i - 1].children[1].position.setX(leftbacks[i - 1].children[0].position.x);
                            leftbacks[i - 1].children[1].position.setZ(leftbacks[i - 1].children[0].position.z - prevBtmSize.z / 2);

                            leftbacks[i - 1].children[2].position.setX(leftbacks[i - 1].children[0].position.x);
                            leftbacks[i - 1].children[2].position.setZ(leftbacks[i - 1].children[0].position.z + prevBtmSize.z / 2);

                            var currentBtmSize = new THREE.Box3().setFromObject(leftbacks[i].children[0]).getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {


                                leftbacks[i - 1].position.setZ(leftbacks[i - 2].position.z - prevBtmSize.z - prevBtmLSize.z * 2);
                            }


                            leftbacks[i].position.setZ(leftbacks[i - 1].position.z - currentBtmSize.z / 2 - prevBtmSize.z / 2 - prevBtmLSize.z * 2);


                            leftbacks[i].children[1].position.setX(leftbacks[i].children[0].position.x);
                            leftbacks[i].children[1].position.setZ(leftbacks[i].children[0].position.z - currentBtmSize.z / 2);

                            leftbacks[i].children[2].position.setX(leftbacks[i].children[0].position.x);
                            leftbacks[i].children[2].position.setZ(leftbacks[i].children[0].position.z + currentBtmSize.z / 2);


                            leftbacks[i].position.setX(sofas[leftverticalIndex].position.x - sofaSize.z / 2)
                            leftbacks[i - 1].position.setX(sofas[leftverticalIndex].position.x - sofaSize.z / 2)

                        }


                    }



                }
                if (i == 0) {
                    var btmSize = new THREE.Box3().setFromObject(leftbacks[i].children[0]).getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3().setFromObject(leftbacks[i].children[1]).getSize(new THREE.Vector3());
                    if (leftverticalSingleCount == 3) {
                        leftbacks[i].position.setZ(sofas[leftverticalIndex].position.z - sofaSize.z)
                    } else if (leftverticalSingleCount == 2) {
                        leftbacks[i].position.setZ(sofas[leftverticalIndex].position.z - sofaSize.z / 2)
                    } else if (leftverticalSingleCount == 1) {
                        leftbacks[i].position.setZ(sofas[leftverticalIndex].position.z)
                    } else if (leftverticalSingleCount > 3) {
                        leftbacks[i].children[0].scale.setX(2);
                        leftbacks[i].position.setZ(sofas[leftverticalIndex].position.z - sofaSize.z / 2)
                    }






                    leftbacks[i].children[1].position.setX(leftbacks[i].children[0].position.x);
                    leftbacks[i].children[1].position.setZ(leftbacks[i].children[0].position.z - btmSize.z / 2);

                    leftbacks[i].children[2].position.setX(leftbacks[i].children[0].position.x);
                    leftbacks[i].children[2].position.setZ(leftbacks[i].children[0].position.z + btmSize.z / 2);


                    leftbacks[i].position.setX(sofas[leftverticalIndex].position.x - sofaSize.z / 2)

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


        var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
        if (lastBottomSofasRV.length > 0) {
            // Bottom

            var btmLSize = new THREE.Box3().setFromObject(lastBottomSofasRV[1]).getSize(new THREE.Vector3());
            var btmSize = new THREE.Box3().setFromObject(lastBottomSofasRV[0]).getSize(new THREE.Vector3());




            lastBottomSofasRV[0].scale.x = rightCount + btmLSize.z * 4;

            //back

            var bkLSize = new THREE.Box3().setFromObject(lastBackSofaRV[1]).getSize(new THREE.Vector3());
            var bkSize = new THREE.Box3().setFromObject(lastBackSofaRV[0]).getSize(new THREE.Vector3());




            lastBackSofaRV[0].scale.x = rightCount + bkLSize.z * 4;









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

                var btmSize = new THREE.Box3().setFromObject(lastBottomSofasRV[0]).getSize(new THREE.Vector3());
                lastBottomSofasRV[1].position.setX(lastBottomSofasRV[0].position.x);
                lastBottomSofasRV[1].position.setZ(lastBottomSofasRV[0].position.z + btmSize.z / 2);


                lastBottomSofasRV[2].position.setX(lastBottomSofasRV[0].position.x);
                lastBottomSofasRV[2].position.setZ(lastBottomSofasRV[0].position.z - btmSize.z / 2);

                const btm_group = new THREE.Group();
                btm_group.name = "RightBottoms";
                lastBottomSofasRV.forEach(e => {
                    e.rotation.y = Math.PI / 2;
                    btm_group.add(e);

                })

                if (!rightbottoms.includes(btm_group)) {

                    rightbottoms.push(btm_group);

                }
                rightbottoms.forEach(e => {
                    scene.add(e)
                })
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

                var bkSize = new THREE.Box3().setFromObject(lastBackSofaRV[0]).getSize(new THREE.Vector3());



                lastBackSofaRV[1].position.setX(lastBackSofaRV[0].position.x);
                lastBackSofaRV[1].position.setZ(lastBackSofaRV[0].position.z + bkSize.z / 2);


                lastBackSofaRV[2].position.setX(lastBackSofaRV[0].position.x);
                lastBackSofaRV[2].position.setZ(lastBackSofaRV[0].position.z - bkSize.z / 2);

                const bk_group = new THREE.Group();
                bk_group.name = "RightBacks";

                lastBackSofaRV.forEach(e => {
                    e.rotation.y = -Math.PI / 2;
                    bk_group.add(e);

                })

                if (!rightbacks.includes(bk_group)) {

                    rightbacks.push(bk_group);

                }
                rightbacks.forEach(e => {
                    scene.add(e)
                })
            }






        }
        if (rightCount == 1) {
            // Legs


            var leg_group = new THREE.Group();
            leg_group.name = "RightLegs";
            for (var i = 0; i < 4; i++) {
                leg_group.add(sofa.leg.clone());

            }
            if (!rightlegs.includes(leg_group)) {
                rightlegs.push(leg_group);
            }




            rightlegs.forEach(e => {
                scene.add(e)
            });


        }
    }

    function updateVerticalBottomRight() {

        if (rightbottoms.length > 0) {

            var sofaSize = new THREE.Box3().setFromObject(sofas[rightverticalIndex]).getSize(new THREE.Vector3());
            for (var i = 0; i < rightbottoms.length; i++) {

                if (i > 0) {



                    var prevBtmLSize = new THREE.Box3().setFromObject(rightbottoms[i - 1].children[1]).getSize(new THREE.Vector3());

                    if (rightverticalSingleCount > 3) {

                        if (rightverticalSingleCount % 2 == 0) {



                            rightbottoms[i].children[0].scale.setX(2 + (prevBtmLSize.z * 3));

                            var currentBtmSize = new THREE.Box3().setFromObject(rightbottoms[i].children[0]).getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3().setFromObject(rightbottoms[i - 1]).getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3().setFromObject(rightbottoms[i - 1].children[1]).getSize(new THREE.Vector3());

                            rightbottoms[i].children[1].position.setX(rightbottoms[i].children[0].position.x);
                            rightbottoms[i].children[1].position.setZ(rightbottoms[i].children[0].position.z - currentBtmSize.z / 2);

                            rightbottoms[i].children[2].position.setX(rightbottoms[i].children[0].position.x);
                            rightbottoms[i].children[2].position.setZ(rightbottoms[i].children[0].position.z + currentBtmSize.z / 2);

                            rightbottoms[i].position.setZ(rightbottoms[i - 1].position.z - currentBtmSize.z - prevBtmLSize.z * 2);


                            rightbottoms[i].position.setX(sofas[rightverticalIndex].position.x)
                            rightbottoms[i - 1].position.setX(sofas[rightverticalIndex].position.x)

                            var bkSize = new THREE.Box3().setFromObject(rightbacks[i].children[0]).getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3().setFromObject(rightlegs[i].children[0]).getSize(new THREE.Vector3());
                            rightlegs[i].position.setX(rightbottoms[i].position.x);
                            rightlegs[i].position.setZ(rightbottoms[i].position.z);
                            rightlegs[i].children[0].position.set(btmSize.x / 2 + lSize.x, 0, btmSize.z / 2);
                            rightlegs[i].children[1].position.set(btmSize.x / 2 + lSize.x, 0, -btmSize.z / 2);
                            rightlegs[i].children[2].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                            rightlegs[i].children[3].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);
                        } else {


                            rightbottoms[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            rightbottoms[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3().setFromObject(rightbottoms[i - 1].children[0]).getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3().setFromObject(rightbottoms[i - 1]).getSize(new THREE.Vector3());


                            rightbottoms[i - 1].children[1].position.setX(rightbottoms[i - 1].children[0].position.x);
                            rightbottoms[i - 1].children[1].position.setZ(rightbottoms[i - 1].children[0].position.z - prevBtmSize.z / 2);

                            rightbottoms[i - 1].children[2].position.setX(rightbottoms[i - 1].children[0].position.x);
                            rightbottoms[i - 1].children[2].position.setZ(rightbottoms[i - 1].children[0].position.z + prevBtmSize.z / 2);

                            var currentBtmSize = new THREE.Box3().setFromObject(rightbottoms[i].children[0]).getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {


                                rightbottoms[i - 1].position.setZ(rightbottoms[i - 2].position.z - prevBtmSize.z - prevBtmLSize.z * 2);
                            }


                            rightbottoms[i].position.setZ(rightbottoms[i - 1].position.z - currentBtmSize.z / 2 - prevBtmSize.z / 2 - prevBtmLSize.z * 2);


                            rightbottoms[i].children[1].position.setX(rightbottoms[i].children[0].position.x);
                            rightbottoms[i].children[1].position.setZ(rightbottoms[i].children[0].position.z - currentBtmSize.z / 2);

                            rightbottoms[i].children[2].position.setX(rightbottoms[i].children[0].position.x);
                            rightbottoms[i].children[2].position.setZ(rightbottoms[i].children[0].position.z + currentBtmSize.z / 2);


                            rightbottoms[i].position.setX(sofas[rightverticalIndex].position.x)
                            rightbottoms[i - 1].position.setX(sofas[rightverticalIndex].position.x)


                            var bkSize = new THREE.Box3().setFromObject(rightbacks[i].children[0]).getSize(new THREE.Vector3());
                            var lSize = new THREE.Box3().setFromObject(rightlegs[i].children[0]).getSize(new THREE.Vector3());
                            rightlegs[i].position.setX(rightbottoms[i].position.x);
                            rightlegs[i].position.setZ(rightbottoms[i].position.z);
                            rightlegs[i].children[0].position.set(btmSize.x / 2 + lSize.x, 0, btmSize.z / 2);
                            rightlegs[i].children[1].position.set(btmSize.x / 2 + lSize.x, 0, -btmSize.z / 2);
                            rightlegs[i].children[2].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                            rightlegs[i].children[3].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);

                            rightlegs[i - 1].position.setX(rightbottoms[i - 1].position.x);
                            rightlegs[i - 1].position.setZ(rightbottoms[i - 1].position.z);
                            rightlegs[i - 1].children[0].position.set(btmSize.x / 2 + lSize.x, 0, btmSize.z / 2);
                            rightlegs[i - 1].children[1].position.set(btmSize.x / 2 + lSize.x, 0, -btmSize.z / 2);
                            rightlegs[i - 1].children[2].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                            rightlegs[i - 1].children[3].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);
                        }


                    }



                }
                if (i == 0) {
                    var btmSize = new THREE.Box3().setFromObject(rightbottoms[i].children[0]).getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3().setFromObject(rightbottoms[i].children[1]).getSize(new THREE.Vector3());
                    if (rightverticalSingleCount == 3) {
                        rightbottoms[i].position.setZ(sofas[rightverticalIndex].position.z - sofaSize.z)
                    } else if (rightverticalSingleCount == 2) {
                        rightbottoms[i].position.setZ(sofas[rightverticalIndex].position.z - sofaSize.z / 2)
                    } else if (rightverticalSingleCount == 1) {
                        rightbottoms[i].position.setZ(sofas[rightverticalIndex].position.z)
                    } else if (rightverticalSingleCount > 3) {
                        rightbottoms[i].children[0].scale.setX(2);
                        rightbottoms[i].position.setZ(sofas[rightverticalIndex].position.z - sofaSize.z / 2)
                    }






                    rightbottoms[i].children[1].position.setX(rightbottoms[i].children[0].position.x);
                    rightbottoms[i].children[1].position.setZ(rightbottoms[i].children[0].position.z - btmSize.z / 2);

                    rightbottoms[i].children[2].position.setX(rightbottoms[i].children[0].position.x);
                    rightbottoms[i].children[2].position.setZ(rightbottoms[i].children[0].position.z + btmSize.z / 2);


                    rightbottoms[i].position.setX(sofas[rightverticalIndex].position.x)

                    var bkSize = new THREE.Box3().setFromObject(rightbacks[i].children[0]).getSize(new THREE.Vector3());
                    var lSize = new THREE.Box3().setFromObject(rightlegs[i].children[0]).getSize(new THREE.Vector3());
                    rightlegs[i].position.setX(rightbottoms[i].position.x);
                    rightlegs[i].position.setZ(rightbottoms[i].position.z);
                    rightlegs[i].children[0].position.set(btmSize.x / 2 + lSize.x, 0, btmSize.z / 2);
                    rightlegs[i].children[1].position.set(btmSize.x / 2 + lSize.x, 0, -btmSize.z / 2);
                    rightlegs[i].children[2].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, btmSize.z / 2 - lSize.z / 2);
                    rightlegs[i].children[3].position.set(-btmSize.x / 2 + bkSize.x / 2, 0, -btmSize.z / 2 + lSize.z / 2);

                }


            }
            for (var i = 0; i < rightbacks.length; i++) {

                if (i > 0) {



                    var prevBtmLSize = new THREE.Box3().setFromObject(rightbacks[i - 1].children[1]).getSize(new THREE.Vector3());

                    if (rightverticalSingleCount > 3) {

                        if (rightverticalSingleCount % 2 == 0) {



                            rightbacks[i].children[0].scale.setX(2 + (prevBtmLSize.z * 3));

                            var currentBtmSize = new THREE.Box3().setFromObject(rightbacks[i].children[0]).getSize(new THREE.Vector3());
                            var prevBtmSize = new THREE.Box3().setFromObject(rightbacks[i - 1]).getSize(new THREE.Vector3());
                            var prevBtmLSize = new THREE.Box3().setFromObject(rightbacks[i - 1].children[1]).getSize(new THREE.Vector3());

                            rightbacks[i].children[1].position.setX(rightbacks[i].children[0].position.x);
                            rightbacks[i].children[1].position.setZ(rightbacks[i].children[0].position.z + currentBtmSize.z / 2);

                            rightbacks[i].children[2].position.setX(rightbacks[i].children[0].position.x);
                            rightbacks[i].children[2].position.setZ(rightbacks[i].children[0].position.z - currentBtmSize.z / 2);

                            rightbacks[i].position.setZ(rightbacks[i - 1].position.z - currentBtmSize.z - prevBtmLSize.z * 2);


                            rightbacks[i].position.setX(sofas[rightverticalIndex].position.x + sofaSize.z / 2)
                            rightbacks[i - 1].position.setX(sofas[rightverticalIndex].position.x + sofaSize.z / 2)
                        } else {


                            rightbacks[i - 1].children[0].scale.setX(2 + prevBtmLSize.z * 3);
                            rightbacks[i].children[0].scale.setX(3 + prevBtmLSize.z * 6);
                            var prevBtmSize = new THREE.Box3().setFromObject(rightbacks[i - 1].children[0]).getSize(new THREE.Vector3());
                            var prevBtmScale = new THREE.Box3().setFromObject(rightbacks[i - 1]).getSize(new THREE.Vector3());


                            rightbacks[i - 1].children[1].position.setX(rightbacks[i - 1].children[0].position.x);
                            rightbacks[i - 1].children[1].position.setZ(rightbacks[i - 1].children[0].position.z + prevBtmSize.z / 2);

                            rightbacks[i - 1].children[2].position.setX(rightbacks[i - 1].children[0].position.x);
                            rightbacks[i - 1].children[2].position.setZ(rightbacks[i - 1].children[0].position.z - prevBtmSize.z / 2);

                            var currentBtmSize = new THREE.Box3().setFromObject(rightbacks[i].children[0]).getSize(new THREE.Vector3());
                            if (i - 2 >= 0) {


                                rightbacks[i - 1].position.setZ(rightbacks[i - 2].position.z - prevBtmSize.z - prevBtmLSize.z * 2);
                            }


                            rightbacks[i].position.setZ(rightbacks[i - 1].position.z - currentBtmSize.z / 2 - prevBtmSize.z / 2 - prevBtmLSize.z * 2);


                            rightbacks[i].children[1].position.setX(rightbacks[i].children[0].position.x);
                            rightbacks[i].children[1].position.setZ(rightbacks[i].children[0].position.z + currentBtmSize.z / 2);

                            rightbacks[i].children[2].position.setX(rightbacks[i].children[0].position.x);
                            rightbacks[i].children[2].position.setZ(rightbacks[i].children[0].position.z - currentBtmSize.z / 2);


                            rightbacks[i].position.setX(sofas[rightverticalIndex].position.x + sofaSize.z / 2)
                            rightbacks[i - 1].position.setX(sofas[rightverticalIndex].position.x + sofaSize.z / 2)

                        }


                    }



                }
                if (i == 0) {
                    var btmSize = new THREE.Box3().setFromObject(rightbacks[i].children[0]).getSize(new THREE.Vector3());
                    var btmLSize = new THREE.Box3().setFromObject(rightbacks[i].children[1]).getSize(new THREE.Vector3());
                    if (rightverticalSingleCount == 3) {
                        rightbacks[i].position.setZ(sofas[rightverticalIndex].position.z - sofaSize.z)
                    } else if (rightverticalSingleCount == 2) {
                        rightbacks[i].position.setZ(sofas[rightverticalIndex].position.z - sofaSize.z / 2)
                    } else if (rightverticalSingleCount == 1) {
                        rightbacks[i].position.setZ(sofas[rightverticalIndex].position.z)
                    } else if (rightverticalSingleCount > 3) {
                        rightbacks[i].children[0].scale.setX(2);
                        rightbacks[i].position.setZ(sofas[rightverticalIndex].position.z - sofaSize.z / 2)
                    }






                    rightbacks[i].children[1].position.setX(rightbacks[i].children[0].position.x);
                    rightbacks[i].children[1].position.setZ(rightbacks[i].children[0].position.z + btmSize.z / 2);

                    rightbacks[i].children[2].position.setX(rightbacks[i].children[0].position.x);
                    rightbacks[i].children[2].position.setZ(rightbacks[i].children[0].position.z - btmSize.z / 2);


                    rightbacks[i].position.setX(sofas[rightverticalIndex].position.x + sofaSize.z / 2)

                }


            }

        }




    }

    function addArmrest() {
        if (sofa.armrestL && sofa.armrestR) {
            var sl = sofa.armrestL.clone();
            var sr = sofa.armrestR.clone();
            if (!armrests.includes(sl)) {
                armrests.push(sl);
            }
            if (!armrests.includes(sr)) {
                armrests.push(sr);
            }

            armrests.forEach(e => {
                if (e instanceof THREE.Mesh) {
                    scene.add(e);
                }
            })
        }
    }

    function updateArmrests(index1, index2) {

        if (sofas.length > 0)

        {

            var a = new THREE.Box3().setFromObject(sofa.single.children[0]).getSize(new THREE.Vector3());
            var b = new THREE.Box3().setFromObject(sofa.single.children[0]).getSize(new THREE.Vector3());
            var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());
            var bkSize = new THREE.Box3().setFromObject(sofa.singleback).getSize(new THREE.Vector3());
            if (armrests.length > 0) {

                if (sofas[index1].rotation.y > 0) {
                    armrests[0].visible = true;

                    armrests[0].rotation.y = Math.PI / 2;


                    armrests[0].position.setZ(sofas[index1].position.z + a.x / 2 + armrestSize.x)
                    armrests[0].position.setX(sofas[index1].position.x - a.z / 2 + armrestSize.z / 2 - bkSize.z / 2);
                } else {
                    armrests[0].position.setX(sofas[index1].position.x - a.x / 2 - armrestSize.x)
                    // armrests[0].position.setZ(0.3)
                }

                if (sofas[index2].rotation.y < 0) {
                    armrests[1].visible = true;

                    armrests[1].rotation.y = -Math.PI / 2;


                    armrests[1].position.setZ(sofas[index2].position.z + b.x / 2 + armrestSize.x)
                    armrests[1].position.setX(sofas[index2].position.x - b.z / 2 + armrestSize.z / 2 - bkSize.z / 2);
                } else {
                    armrests[1].position.setX(sofas[index2].position.x + b.x / 2 + armrestSize.x)
                    // armrests[1].position.setZ(0.3)
                }



                // sofas[index1].position.setY(armrests[0].position.y);
                // sofas[index2].position.setY(armrests[1].position.y)
            }
        }

    }

    function addChaise(index) {
        if (sofa.chaiseL && sofa.chaiseR) {





            if (index != null) {
                var sofaSize = new THREE.Box3().setFromObject(sofas[index]).getSize(new THREE.Vector3());
                if (isLeft) {
                    var s = sofa.chaiseR.clone();

                    scene.add(s)
                    s.position.setX(sofas[index].position.x - sofaSize.x)

                    if (!sofas.includes(s)) {
                        sofas.push(s)
                    }
                    armrests[0].visible = false;
                }
                if (isRight) {
                    var s = sofa.chaiseL.clone();

                    scene.add(s)
                    s.position.setX(sofas[index].position.x + sofaSize.x)
                    if (!sofas.includes(s)) {
                        sofas.push(s)
                    }
                    armrests[1].visible = false;
                }
            }





        }



    }

    function addCorner(index) {
        if (sofa.cornerL && sofa.cornerR) {





            if (index != null) {
                var sofaSize = new THREE.Box3().setFromObject(sofas[index]).getSize(new THREE.Vector3());
                if (isLeft) {
                    var s = sofa.cornerR.clone();

                    scene.add(s)

                    if (sofas[index].rotation.y > 0) {
                        s.rotation.y = Math.PI / 2;
                        s.position.setX(sofas[index].position.x);
                        s.position.setZ(sofas[index].position.z + sofaSize.z)
                    } else {
                        s.position.setX(sofas[index].position.x - sofaSize.x)
                    }


                    if (!sofas.includes(s)) {
                        sofas.push(s)
                    }
                    armrests[0].visible = false;
                    lasthSingleCount += 1;

                }
                if (isRight) {
                    var s = sofa.cornerL.clone();

                    scene.add(s)
                    s.position.setX(sofas[index].position.x + sofaSize.x)
                    if (!sofas.includes(s)) {
                        sofas.push(s)
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
                var sofaSize = new THREE.Box3().setFromObject(sofas[index]).getSize(new THREE.Vector3());
                var sSize = new THREE.Box3().setFromObject(s).getSize(new THREE.Vector3());

                if (isLeft) {


                    scene.add(s);
                    s.position.setX(sofas[index].position.x - 0.06)
                    s.position.setZ(sofas[index].position.z + sofaSize.z - sSize.z / 6)

                    if (!sofas.includes(s)) {
                        sofas.push(s)
                    }
                    lasthSingleCount += 1;
                }
                if (isRight) {
                    scene.add(s);
                    s.position.setX(sofas[index].position.x + 0.06)
                    s.position.setZ(sofas[index].position.z + sofaSize.z - sSize.z / 6)

                    if (!sofas.includes(s)) {
                        sofas.push(s)
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
        return new Promise(resolve => {
            new THREE.GLTFLoader().load(url, resolve);
        });
    }

    function loadSofa(type) {

        let p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16;

        var a = Object.keys(sofa);


        if (type == 0) {
            p1 = loadAsync('models/sofas/sofa1/components/single.gltf').then(result => {
                sofa.single = result.scene.children[0];
            });
            p2 = loadAsync('models/sofas/sofa1/components/armrestL.gltf').then(result => {
                sofa.armrestL = result.scene.children[0];
            });
            p3 = loadAsync('models/sofas/sofa1/components/armrestR.gltf').then(result => {
                sofa.armrestR = result.scene.children[0];
            });
            p4 = loadAsync('models/sofas/sofa1/components/chaise.gltf').then(result => {
                sofa.chaise = result.scene.children[0];
            });
            p5 = loadAsync('models/sofas/sofa1/components/chaiseL.gltf').then(result => {
                sofa.chaiseL = result.scene.children[0];
            });
            p6 = loadAsync('models/sofas/sofa1/components/chaiseR.gltf').then(result => {
                sofa.chaiseR = result.scene.children[0];
            });
            p7 = loadAsync('models/sofas/sofa1/components/cornerL.gltf').then(result => {
                sofa.cornerL = result.scene.children[0];
            });
            p8 = loadAsync('models/sofas/sofa1/components/cornerR.gltf').then(result => {
                sofa.cornerR = result.scene.children[0];
            });
            p9 = loadAsync('models/sofas/sofa1/components/ottoman.gltf').then(result => {
                sofa.ottoman = result.scene.children[0];
            });

            p10 = loadAsync('models/sofas/sofa1/components/singleback.gltf').then(result => {
                sofa.singleback = result.scene.children[0];
            });
            p11 = loadAsync('models/sofas/sofa1/components/singlebackL.gltf').then(result => {
                sofa.singlebackL = result.scene.children[0];
            });
            p12 = loadAsync('models/sofas/sofa1/components/singlebackR.gltf').then(result => {
                sofa.singlebackR = result.scene.children[0];
            });
            p13 = loadAsync('models/sofas/sofa1/components/bottom.gltf').then(result => {
                sofa.bottom = result.scene.children[0];
            });
            p14 = loadAsync('models/sofas/sofa1/components/bottomL.gltf').then(result => {
                sofa.bottomL = result.scene.children[0];
            });
            p15 = loadAsync('models/sofas/sofa1/components/bottomR.gltf').then(result => {
                sofa.bottomR = result.scene.children[0];
            });
            p16 = loadAsync('models/sofas/sofa1/components/leg.gltf').then(result => {
                sofa.leg = result.scene.children[0];
            });

        }
        // else if (type == 1) {
        //     p1 = loadAsync('models/sofas/sofa1/components/single.gltf').then(result => {
        //         sofa.single = result.scene.children[0];
        //     });
        //     p2 = loadAsync('models/sofas/sofa2/components/armrestL.gltf').then(result => {
        //         sofa.armrestL = result.scene.children[0];
        //     });
        //     p3 = loadAsync('models/sofas/sofa2/components/armrestR.gltf').then(result => {
        //         sofa.armrestR = result.scene.children[0];
        //     });
        //     p4 = loadAsync('models/sofas/sofa1/components/chaise.gltf').then(result => {
        //         sofa.chaise = result.scene.children[0];
        //     });
        //     p5 = loadAsync('models/sofas/sofa1/components/chaiseL.gltf').then(result => {
        //         sofa.chaiseL = result.scene.children[0];
        //     });
        //     p6 = loadAsync('models/sofas/sofa1/components/chaiseR.gltf').then(result => {
        //         sofa.chaiseR = result.scene.children[0];
        //     });
        //     p7 = loadAsync('models/sofas/sofa1/components/cornerL.gltf').then(result => {
        //         sofa.cornerL = result.scene.children[0];
        //     });
        //     p8 = loadAsync('models/sofas/sofa1/components/cornerR.gltf').then(result => {
        //         sofa.cornerR = result.scene.children[0];
        //     });
        //     p9 = loadAsync('models/sofas/sofa1/components/ottoman.gltf').then(result => {
        //         sofa.ottoman = result.scene.children[0];
        //     });

        // }

        Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16]).then(() => {

            setSofa(sofa.leg);
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
            addSingle();
            hSingleCount += 1;
            addButton();
        })

    }




    function setLeg(index) {

    }

    function setSofa(objA) {




        // objA.scale.set(0.01, 0.01, 0.01);


        objA.traverse(function (e) {

            if (e instanceof THREE.Mesh) {

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
                // e.material.map = null;
                e.material.roughness = 1;

                e.material.normalMap = null;

            }

        })


    }



    function createButton(name, pos) {
        var g = new THREE.PlaneGeometry(1, 1);
        var m = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: btnPlus,
            alphaMap: btnPlus,
            transparent: true
        });
        const btn = new THREE.Mesh(g, m);
        btn_group.add(btn);

        btn.scale.set(0.5, 0.5, 0.5);
        btn.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
        btn.position.setY(0.01);
        btn.position.setX(pos);
        btn.name = name;
        scene.add(btn_group);
    }

    function updateButtonCorner(index1, index2) {


        if (btn_group.children[0] || btn_group.children[1]) {
            var obj1 = btn_group.children[0];
            var obj2 = btn_group.children[1];

            if (sofas[index1].name == sofa.cornerR.name || sofas[index1].name == sofa.chaiseR.name) {

                var sofaSize = new THREE.Box3().setFromObject(sofas[index1]).getSize(new THREE.Vector3());

                var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());

                if (sofas[index1].rotation.y > 0) {
                    obj1.position.x = sofas[index1].position.x + sofaSize.z / 2 + obj1.scale.x;
                    obj1.position.z = sofas[index1].position.z;
                } else {
                    obj1.position.x = sofas[index1].position.x;
                    obj1.position.z = sofas[index1].position.z + sofaSize.z / 2 + obj1.scale.z;
                }


            } else if (sofas[index1].rotation.y > 0) {

                var sofaSize = new THREE.Box3().setFromObject(sofas[index1]).getSize(new THREE.Vector3());

                var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());
                obj1.position.x = sofas[index1].position.x;
                obj1.position.z = sofas[index1].position.z + sofaSize.z / 2 + obj1.scale.z;
            }

            if (sofas[index2].name == sofa.cornerL.name || sofas[index2].name == sofa.chaiseL.name || sofas[index2].rotation.y < 0) {
                var sofaSize = new THREE.Box3().setFromObject(sofas[index2]).getSize(new THREE.Vector3());

                var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());


                obj2.position.x = sofas[index2].position.x;
                obj2.position.z = sofas[index2].position.z + sofaSize.z / 2 + obj2.scale.z;
            }

        }



    }

    function updateButton(obj, index) {

        var sofaSize = new THREE.Box3().setFromObject(sofas[index]).getSize(new THREE.Vector3());
        // var cornerSize = new THREE.Box3().setFromObject(sofas[leftIndex]).getSize(new THREE.Vector3());
        var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());

        if (obj == btn_group.children[0]) {


            obj.position.x = sofas[index].position.x - sofaSize.x - obj.scale.x - armrestSize.x * 2;


        }


        if (obj == btn_group.children[1]) {
            obj.position.x = sofas[index].position.x + sofaSize.x + obj.scale.x + armrestSize.x * 2;
        }
    }

    function removeButton() {
        btn_group.traverse(function (e) {
            btn_group.remove(e);
        })
    }

    function checkDistance() {
        sofas.forEach(e => {
            var a = btn_group.children[0].position.x - e.position.x;
            var b = btn_group.children[1].position.x - e.position.x;



            if (a > -1) {
                leftIndex = sofas.indexOf(e);
                if (e.rotation.y == 0) {
                    if (e.name != sofa.cornerR.name) {

                        leftHorizontalIndex = sofas.indexOf(e);
                    }
                }
                if (e.rotation.y > 0) {
                    leftverticalIndex = sofas.indexOf(e);
                }


            }


            if (b < 1) {
                rightIndex = sofas.indexOf(e);

                if (e.rotation.y < 0) {
                    rightverticalIndex = sofas.indexOf(e);
                }
            }


            // if(btn_group.children[0].position.z == e.position.z){

            //         if(e.children[0].name != sofa.cornerR.children[0].name){
            //             leftHorizontalIndex = sofas.indexOf(e);
            //         }





            // }


        });










    }

    function onClick() {



        if (selectedBtn) {
            if (selectedBtn == btn_group.children[0]) {
                removeContextMenu(selectedBtnParent);
                isRight = false;
                isLeft = true;



                createContextMenu(selectedBtn, leftIndex);


                selectedBtnParent = selectedBtn;
            }
            if (selectedBtn == btn_group.children[1]) {
                removeContextMenu(selectedBtnParent);
                isLeft = false;
                isRight = true;


                createContextMenu(selectedBtn, rightIndex);

                selectedBtnParent = selectedBtn;
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

        const intersectButton = raycaster.intersectObject(btn_group, true);

        if (intersectButton.length > 0) {
            const res = intersectButton.filter(function (res) {
                return res && res.object;
            })[0];

            if (res && res.object) {
                if (btn_group.visible) {
                    selectedBtn = res.object;
                    selectedBtn.material.color.set("#000000");
                }



            }
        }

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

    function createContextMenu(obj, index) {
        var div = document.createElement("div");
        div.id = "#contextMenu"
        var table = document.createElement('TABLE');

        // table.border = '1';
        table.className = "table table-hover bg-white";
        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
        var row = 3;

        // if (sofas[index].name == sofa.single.name) {
        //     row = 3;
        // } else if (sofas[index].name == sofa.cornerR.name || sofas[index].name == sofa.cornerL.name) {
        //     row = 2;
        // } else if (sofas[index].name == sofa.chaiseR.name || sofas[index].name == sofa.chaiseR.name) {
        //     row = 1;
        // }
        for (var i = 0; i < 4; i++) {
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);

            for (var j = 0; j < 1; j++) {
                var td = document.createElement('TD');
                if (i == 0) {
                    // td.appendChild(document.createElement("a"));
                    // td.innerHTML="<a id='addSingle' >Single</a>";

                    td.id = "addSingle";
                    td.innerHTML = "Single";
                    td.addEventListener("pointerdown", function () {
                        addSingle(index);
                        updateButton(obj, index);

                    });

                }
                if (i == 1) {
                    td.id = "addCorner";
                    td.innerHTML = "Corner";
                    td.addEventListener("pointerdown", function () {
                        addCorner(index);
                        updateButton(obj, index);
                    });
                }
                if (i == 2) {
                    td.id = "addChaise";
                    td.innerHTML = "Chaise";
                    td.addEventListener("pointerdown", function () {
                        addChaise(index);
                        updateButton(obj, index);
                    });
                }
                if (i == 3) {
                    td.id = "addOttoman";
                    td.innerHTML = "Ottoman";
                    td.addEventListener("pointerdown", function () {
                        addOttoman(index);
                        updateButton(obj, index);
                    });
                }

                tr.appendChild(td);
            }




        }
        div.appendChild(table);
        // var table = '<table id="myTable" class="table table-hover"><tbody><tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr><tr></tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr><tr><td>3</td><td>Larry</td><td>the Bird</td><td>@twitter</td></tr></tbody></table>'

        div.style.fontSize = "15px"

        var s = new THREE.CSS2DObject(div);
        var e = s.element.childNodes[0].childNodes[0];
        if (currentSingleCount < 3) {
            e.childNodes[1].className = "d-none";
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
        if (sofas[index].name == sofa.chaiseL.name || sofas[index].name == sofa.chaiseR.name) {
            e.childNodes[0].className = "d-none";
            e.childNodes[1].className = "d-none";
            e.childNodes[2].className = "d-none";
        }
        if (sofas[index].name == sofa.cornerL.name || sofas[index].name == sofa.cornerR.name) {
            e.childNodes[1].className = "d-none";
            e.childNodes[2].className = "d-none";
            e.childNodes[3].className = "d-none";
        }

        s.position.setZ(1)
        obj.add(s);
    }

    function removeContextMenu(parent) {
        if (parent instanceof THREE.Mesh) {

            if (parent.children.length > 0) {
                parent.traverse(function (e) {

                    parent.remove(e);

                })
            }
        }

    }
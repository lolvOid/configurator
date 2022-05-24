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
    var bottoms= [],backs=[];
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
    const btn_group = new THREE.Group();
    var leftIndex = 0,
        rightIndex = 0;

    var currentSingleCount = 0,
        currentChaiseCount = 0,
        currentCornerCount = 0;
    var lastBottomSofa = [],lastBackSofa = [];
    var max = 0;
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


        if (currentSingleCount < 8) {
            btn_group.visible = true;
        } else {
            btn_group.visible = false;
        }
    
        sofaCount = currentSingleCount + currentChaiseCount + currentCornerCount;
        $("#sofaCount").html(sofaCount);

        checkDistance();
        
        // console.log("Left " + leftIndex + ", " + "Right " + rightIndex)
        
        updateArmrests(leftIndex, rightIndex);
        updateButtonCorner(leftIndex, rightIndex);
        // addBottom();
        // $("#sofaIndex").html(currentSofaIndex);
        updateBottoms();
        if (sofas.length > 0) {
            btn_group.position.set(0, 0, 0);
    

        }
       
       
      
 
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

    function createBox(name) {
        var g = new THREE.BoxBufferGeometry(1, 1, 1);
        var m = new THREE.MeshStandardMaterial({
            color: 0xdedede,
            name: "m_" + name,






        });
        var mesh = new THREE.Mesh(g, m);
        mesh.name = "s_" + name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
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

    function addLegs(count, index, parent) {
        var legCounts = 0;

        // if => 4 legs counts 8 -> parent 4 .2 set
        // if=> 5 legs counts 8-> parent 4 .2 set different distance 2/3 + 0.25
        // if=>6 legs counts 12-> parent 6. 3
        //if=>7 legs counts 12 -> parent 6.3 different distance 2/3 + 0.25
        //if = 8 legs counts 16 -> parent 8 . 4

        // if(count <4){
        //     legCounts = 4;
        // }else if(count >=4 && count<6){
        //     legCounts = 8;
        // }else if(count >=6 && count < 8){
        //     legCounts = 12;
        // }else if(count == 8){
        //     legCounts = 16;
        // }



        for (var i = 0; i < count; i++) {
            var leg_group = new THREE.Group();
            leg_group.name = "legs" + i;
            for (var j = 0; j < 2; j++) {

                leg_group.add(sofa.leg.clone());


            }



            sofas[index].add(leg_group);
        }

        var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());
        var sofaSize = new THREE.Box3().setFromObject(sofas[index]).getSize(new THREE.Vector3());
        var leftLeg = sofas[index].children[sofas[index].children.length - 2];
        var rightLeg = sofas[index].children[sofas[index].children.length - 1];

        leftLeg.position.setX(sofas[index].position.x - sofaSize.x / 2);
        rightLeg.position.setX(sofas[index].position.x + sofaSize.x / 2);
        // sofas[index].children[0].position.setX(sofas[index].position.x+sofaSize.x/2);
        // sofas[index].children[1].position.setX(sofas[index].position.x+sofaSize.x/2);
        // for(var i =0;i<legs.length;i++){

        //       legs[0].position.setX(sofas[index].position.x+sofaSize.x/2+armrestSize.x/2)
        //       legs[0].position.setZ(sofas[index].position.z);
        //       legs[legs.length-1].position.setX(sofas[index].position.x-sofaSize.x/2-armrestSize.x/2)
        //       legs[legs.length-1].position.setZ(sofas[index].position.z);
        // }

        // legs[0].position.setX(armrests[0].position.x+armrestSize.x/2)
        // legs[0].position.setZ(armrests[0].position.z);
        // legs[1].position.setX(armrests[1].position.x-armrestSize.x/2)
        // legs[1].position.setZ(armrests[1].position.z);


        // legs[0].children[0].position.setZ(legs[0].position.z+0.25)
        // legs[0].children[1].position.setZ(legs[0].position.z-0.4)


        // legs[1].children[0].position.setZ(legs[1].position.z+0.25)
        // legs[1].children[1].position.setZ(legs[1].position.z-0.4)

    }
    var singleCount = 0;
    function addSingle(index, rotation) {


        if (sofa.single) {

            var s = sofa.single.clone();

            scene.add(s);

            // addArmrest();
            // removeButton();

            if (index != null) {
                var sofaSize = new THREE.Box3().setFromObject(sofas[index].children[0]).getSize(new THREE.Vector3());

                var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());



                if (isLeft) {

                    if (sofas[index].name == sofa.cornerR.name) {
                        if (sofas[index].rotation.y > 0) {
                            s.position.setX(sofas[index].position.x + sofaSize.z / 2 + armrestSize.x)
                            s.position.setZ(sofas[index].position.z)
                            s.rotation.y = Math.PI;
                        } else {
                            s.position.setX(sofas[index].position.x)
                            s.position.setZ(sofas[index].position.z + sofaSize.z - armrestSize.x)
                            s.rotation.y = Math.PI / 2;
                        }
                    } else if (sofas[index].rotation.y > 0) {


                        s.position.setX(sofas[index].position.x)
                        s.position.setZ(sofas[index].position.z + sofaSize.z)
                        // s.position.setY(sofa.armrestL.position.y)
                        s.rotation.y = Math.PI / 2;


                    } else {
                        s.position.setX(sofas[index].position.x - sofaSize.x)
                    }
                }
                if (isRight) {
                    if (sofas[index].name == sofa.cornerL.name) {

                        s.position.setX(sofas[index].position.x)
                        s.position.setZ(sofas[index].position.z + sofaSize.z - armrestSize.x)
                        s.rotation.y = -Math.PI / 2;
                    } else if (sofas[index].rotation.y < 0) {
                        s.position.setX(sofas[index].position.x)
                        s.position.setZ(sofas[index].position.z + sofaSize.z)
                        s.position.setY(sofa.armrestL.position.y)
                        s.rotation.y = -Math.PI / 2;
                    } else {
                        s.position.setX(sofas[index].position.x + sofaSize.x)
                    }
                }



            } else {


                s.position.setX(0);
            }
            if (!sofas.includes(s)) {
                sofas.push(s)
            }
           if(sofas.length>0){
            addBottom()
           }
         
        }
        


    }
    function addBottom(){
     
        if(sofas.length>0){
            var c = currentSingleCount+1;
            if(c >3){
                
                if(c %2==0){
                    max = 2;
                }else{
                    max = 3;
                }
            }else{
              max = 3;
                
            }

            if(singleCount<max){
                
                singleCount += 1;
               
               

            }else{
                lastBottomSofa= [];
                lastBackSofa = [];

                singleCount = 1;
             
                
            }
       
            var seatSize = new THREE.Box3().setFromObject(sofas[0].children[0]).getSize(new THREE.Vector3());
            if(lastBottomSofa.length>0){
                // Bottom
              
                var btmLSize =new THREE.Box3().setFromObject(lastBottomSofa[1]).getSize(new THREE.Vector3()); 
                var btmSize = new THREE.Box3().setFromObject(lastBottomSofa[0]).getSize(new THREE.Vector3());
               
                
                lastBottomSofa[0].position.setZ(sofas[leftIndex].position.z);
               
                lastBottomSofa[0].scale.x= singleCount +btmLSize.x*4;
                var btmSize = new THREE.Box3().setFromObject(lastBottomSofa[0]).getSize(new THREE.Vector3());
               

              
                lastBottomSofa[1].position.setX(lastBottomSofa[0].position.x + btmSize.x / 2);
                lastBottomSofa[1].position.setZ(lastBottomSofa[0].position.z);
    
    
                lastBottomSofa[2].position.setX(lastBottomSofa[0].position.x - btmSize.x / 2);
                lastBottomSofa[2].position.setZ(lastBottomSofa[0].position.z);
                

                //back
                var bkLSize =new THREE.Box3().setFromObject(lastBackSofa[1]).getSize(new THREE.Vector3()); 
                var bkSize = new THREE.Box3().setFromObject(lastBackSofa[0]).getSize(new THREE.Vector3());
               
                
              
               
                lastBackSofa[0].scale.x= singleCount +bkLSize.x*4;
                var btmSize = new THREE.Box3().setFromObject(lastBackSofa[0]).getSize(new THREE.Vector3());
               

              
                lastBackSofa[1].position.setX(lastBackSofa[0].position.x + bkSize.x / 2);
                lastBackSofa[1].position.setZ(lastBottomSofa[0].position.z);
    
    
                lastBackSofa[2].position.setX(lastBackSofa[0].position.x - btmSize.x / 2);
                lastBackSofa[2].position.setZ(lastBackSofa[0].position.z);
                
             
            }else{
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
                    lastBottomSofa.forEach(e=>{
                        btm_group.add(e);
                        
                    })
                    
                    if(!bottoms.includes(btm_group)){
                        
                        bottoms.push(btm_group);
                        
                    }
                    bottoms.forEach(e=>{
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
                    lastBackSofa[0].position.setZ(sofas[leftIndex].position.z-seatSize.z/2);
                    lastBackSofa[1].position.setX(lastBackSofa[0].position.x + bkSize.x / 2);
                    lastBackSofa[1].position.setZ(lastBackSofa[0].position.z);
                    
                    
                    lastBackSofa[2].position.setX(lastBackSofa[0].position.x - bkSize.x / 2);
                    lastBackSofa[2].position.setZ(lastBackSofa[0].position.z);
    
                    const bk_group = new THREE.Group();
                    bk_group.name = "Backs";
                    lastBackSofa.forEach(e=>{
                        bk_group.add(e);
                        
                    })
                    
                    if(!backs.includes(bk_group)){
                        
                        backs.push(bk_group);
                        
                    }
                    backs.forEach(e=>{
                        scene.add(e)
                    })
                }
            

               
            }
            if(singleCount == 1){
                   // Legs
                
                
                var leg_group = new THREE.Group();
                leg_group.name= "Legs";
                for(var i = 0;i<4;i++){
                    leg_group.add(sofa.leg.clone());
                    
                }
                if(!legs.includes(leg_group)){
                    legs.push(leg_group);
                }
            

               
               
                legs.forEach(e => {
                    scene.add(e)
                });
            
            
            }
         

           
        }
       
    
        
    }

    function updateBottoms(){
        
        if(bottoms.length>0){
          
            var sofaSize = new THREE.Box3().setFromObject(sofas[leftIndex]).getSize(new THREE.Vector3());
            for(var i = 0;i<bottoms.length;i++){
                if(i>0){
                    
                    var currentBtmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());
                     if(currentSingleCount>3){
                         if(currentSingleCount%2==0){
                            bottoms[i].children[0].scale.setX(2);
                           
                             currentBtmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());
                           
                         }else{
                            bottoms[i-1].children[0].scale.setX(2);
                            bottoms[i].children[0].scale.setX(3);
                        
                             currentBtmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());
                           
                            if( i-2==0){
                           
                                var btmSize = new THREE.Box3().setFromObject(bottoms[i-2]).getSize(new THREE.Vector3());    
                            
                                var btmLSize = new THREE.Box3().setFromObject(bottoms[i-2].children[1]).getSize(new THREE.Vector3());
            
                                var bottomSize = btmLSize.x + btmSize.x;
                                var btmSizeUp = new THREE.Box3().setFromObject(bottoms[i-1]).getSize(new THREE.Vector3());
                                bottoms[i-1].position.setX(bottoms[i-2].position.x+bottomSize);
                            }
                            
                            
                            var prevBtmSize = new THREE.Box3().setFromObject(bottoms[i-1].children[0]).getSize(new THREE.Vector3());
                            
                            bottoms[i-1].children[1].position.setX(   bottoms[i-1].children[0].position.x + prevBtmSize.x / 2);
                            bottoms[i-1].children[1].position.setZ(   bottoms[i-1].children[0].position.z);
                            
                            bottoms[i-1].children[2].position.setX(   bottoms[i-1].children[0].position.x - prevBtmSize.x / 2);
                            bottoms[i-1].children[2].position.setZ(   bottoms[i-1].children[0].position.z);
                           
                    
                         
                         }
                        
                      
                    }
          
                     currentBtmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());
                 
                    var btmSize = new THREE.Box3().setFromObject(bottoms[i-1]).getSize(new THREE.Vector3());
                   
                    var btmLSize = new THREE.Box3().setFromObject(bottoms[i-1].children[1]).getSize(new THREE.Vector3());

                    var bottomSize = btmLSize.x + btmSize.x;
                    var btmSizeUp = new THREE.Box3().setFromObject(bottoms[i]).getSize(new THREE.Vector3());

                    
                    bottoms[i].children[1].position.setX(   bottoms[i].children[0].position.x + currentBtmSize.x / 2);
                    bottoms[i].children[1].position.setZ(   bottoms[i].children[0].position.z);
                    
                    bottoms[i].children[2].position.setX(   bottoms[i].children[0].position.x - currentBtmSize.x / 2);
                    bottoms[i].children[2].position.setZ(   bottoms[i].children[0].position.z);
                    
                    
                    bottoms[i].position.setX(bottoms[i-1].position.x+bottomSize/2+btmSizeUp.x/2);

                    var bkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                    var lSize =  new THREE.Box3().setFromObject(legs[i].children[0]).getSize(new THREE.Vector3());
                    legs[i].position.setX(bottoms[i].position.x);
                    legs[i].children[0].position.set(-currentBtmSize.x/2+lSize.x,0,-currentBtmSize.z/2-bkSize.z/2);
                    legs[i].children[1].position.set(-currentBtmSize.x/2+lSize.x,0,currentBtmSize.z/2-bkSize.z/2);
                    legs[i].children[2].position.set(currentBtmSize.x/2-lSize.x,0,-currentBtmSize.z/2-bkSize.z/2);
                    legs[i].children[3].position.set(currentBtmSize.x/2-lSize.x,0,currentBtmSize.z/2-bkSize.z/2);
                }   
                if(i==0){
                    
                    if(currentSingleCount==3){                        
                        bottoms[i].position.setX(sofas[leftIndex].position.x+sofaSize.x)    
                    }
                    else if(currentSingleCount==2 ){
                        bottoms[i].position.setX(sofas[leftIndex].position.x+sofaSize.x/2)    
                    }
                    else if(currentSingleCount==1){
                        bottoms[i].position.setX(sofas[leftIndex].position.x)    
                    }else if(currentSingleCount>3){
                        bottoms[i].children[0].scale.setX(2);
                        bottoms[i].position.setX(sofas[leftIndex].position.x+sofaSize.x/2)    
                    }
               
                    var btmSize = new THREE.Box3().setFromObject(bottoms[i].children[0]).getSize(new THREE.Vector3());
                  
                
                   
            
                    bottoms[i].children[1].position.setX(   bottoms[i].children[0].position.x + btmSize.x / 2);
                    bottoms[i].children[1].position.setZ(   bottoms[i].children[0].position.z);
                    
                    bottoms[i].children[2].position.setX(   bottoms[i].children[0].position.x - btmSize.x / 2);
                    bottoms[i].children[2].position.setZ(   bottoms[i].children[0].position.z);
                    
                    var bkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                    var lSize =  new THREE.Box3().setFromObject(legs[i].children[0]).getSize(new THREE.Vector3());
                   legs[i].position.setX(bottoms[i].position.x);
                   legs[i].children[0].position.set(-btmSize.x/2+lSize.x,0,-btmSize.z/2-bkSize.z/2);
                   legs[i].children[1].position.set(-btmSize.x/2+lSize.x,0,btmSize.z/2-bkSize.z/2);
                   legs[i].children[2].position.set(btmSize.x/2-lSize.x/2,0,-btmSize.z/2-bkSize.z/2);
                   legs[i].children[3].position.set(btmSize.x/2-lSize.x/2,0,btmSize.z/2-bkSize.z/2);
                }

              
            }
           
            for(var i = 0;i<backs.length;i++){
                if(i>0){
             
                     if(currentSingleCount>3){
                         if(currentSingleCount%2==0){
                            backs[i].children[0].scale.setX(2);
                           
                         }else{
                            backs[i-1].children[0].scale.setX(2);
                            backs[i].children[0].scale.setX(3);
                        
                 
                           
                            if( i-2==0){
                           
                                var bkSize = new THREE.Box3().setFromObject(backs[i-2]).getSize(new THREE.Vector3());    
                            
                                var bkLSize = new THREE.Box3().setFromObject(backs[i-2].children[1]).getSize(new THREE.Vector3());
            
                                var backSize = bkLSize.x + bkSize.x;
                                var bkSizeUp = new THREE.Box3().setFromObject(backs[i-1]).getSize(new THREE.Vector3());
                                backs[i-1].position.setX(backs[i-2].position.x+backSize);
                            }
                            
                            
                            var prevBkSize = new THREE.Box3().setFromObject(backs[i-1].children[0]).getSize(new THREE.Vector3());
                            
                            backs[i-1].children[1].position.setX(   backs[i-1].children[0].position.x + prevBkSize.x / 2);
                            backs[i-1].children[1].position.setZ(   backs[i-1].children[0].position.z);
                            
                            backs[i-1].children[2].position.setX(   backs[i-1].children[0].position.x - prevBkSize.x / 2);
                            backs[i-1].children[2].position.setZ(   backs[i-1].children[0].position.z);
                    
                         }
                        
                    
                    }
                            
               
                    var currentBkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                 
                    var bkSize = new THREE.Box3().setFromObject(backs[i-1]).getSize(new THREE.Vector3());
                   
                    var bkLSize = new THREE.Box3().setFromObject(backs[i-1].children[1]).getSize(new THREE.Vector3());

                    var backSize = bkLSize.x + bkSize.x;
                    var bkSizeUp = new THREE.Box3().setFromObject(backs[i]).getSize(new THREE.Vector3());

                    
                    backs[i].children[1].position.setX(   backs[i].children[0].position.x + currentBkSize.x / 2);
                    backs[i].children[1].position.setZ(   backs[i].children[0].position.z);
                    
                    backs[i].children[2].position.setX(   backs[i].children[0].position.x - currentBkSize.x / 2);
                    backs[i].children[2].position.setZ(   backs[i].children[0].position.z);
                    
                    backs[i].position.setX(bottoms[i-1].position.x+backSize/2+bkSizeUp.x/2);
                }   
                if(i==0){
                    
                    if(currentSingleCount==3){                        
                        backs[i].position.setX(sofas[leftIndex].position.x+sofaSize.x)    
                    }
                    else if(currentSingleCount==2 ){
                        backs[i].position.setX(sofas[leftIndex].position.x+sofaSize.x/2)    
                    }
                    else if(currentSingleCount==1){
                        backs[i].position.setX(sofas[leftIndex].position.x)    
                    }else if(currentSingleCount>3){
                        backs[i].children[0].scale.setX(2);
                        backs[i].position.setX(sofas[leftIndex].position.x+sofaSize.x/2)    
                    }
               
                    var bkSize = new THREE.Box3().setFromObject(backs[i].children[0]).getSize(new THREE.Vector3());
                  
                
                   
            
                    backs[i].children[1].position.setX(   backs[i].children[0].position.x + bkSize.x / 2);
                    backs[i].children[1].position.setZ(   backs[i].children[0].position.z);
                    
                    backs[i].children[2].position.setX(   backs[i].children[0].position.x - bkSize.x / 2);
                    backs[i].children[2].position.setZ(   backs[i].children[0].position.z);
                    
    
                   
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

            var a = new THREE.Box3().setFromObject(sofas[index1].children[0]).getSize(new THREE.Vector3());
            var b = new THREE.Box3().setFromObject(sofas[index2].children[0]).getSize(new THREE.Vector3());
            var armrestSize = new THREE.Box3().setFromObject(sofa.armrestL).getSize(new THREE.Vector3());
            if (armrests.length > 0) {

                if (sofas[index1].rotation.y > 0) {
                    armrests[0].visible = true;

                    armrests[0].rotation.y = Math.PI / 2;


                    armrests[0].position.setZ(sofas[index1].position.z + a.z / 2)
                    armrests[0].position.setX(sofas[index1].position.x + a.x / 2 - armrestSize.x / 2);
                } else {
                    armrests[0].position.setX(sofas[index1].position.x - a.x / 2 - armrestSize.x)
                    // armrests[0].position.setZ(0.3)
                }

                if (sofas[index2].rotation.y < 0) {
                    armrests[1].visible = true;

                    armrests[1].rotation.y = -Math.PI / 2;


                    armrests[1].position.setZ(sofas[index2].position.z + b.z / 2 + armrestSize.x)
                    armrests[1].position.setX(sofas[index2].position.x + b.x / 2 + armrestSize.x / 2);
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
                }
                if (isRight) {
                    var s = sofa.cornerL.clone();

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

                }
                if (isRight) {
                    scene.add(s);
                    s.position.setX(sofas[index].position.x + 0.06)
                    s.position.setZ(sofas[index].position.z + sofaSize.z - sSize.z / 6)

                    if (!sofas.includes(s)) {
                        sofas.push(s)
                    }
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

            }
            if (b < 1) {
                rightIndex = sofas.indexOf(e);

            }


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
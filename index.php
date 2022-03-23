<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='viewport' content='width=device-width' />
    <title>Wardrobe Config</title>


    <link rel="stylesheet" href="./styleconfig.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/fontawesome.min.css"
        integrity="sha384-jLKHWM3JRmfMU0A5x5AkjWkw/EYfGUAGagvnfryNV3F9VqM98XiIH7VBGVoxVSc7" crossorigin="anonymous">



    <link href="//db.onlinewebfonts.com/c/49abeade3aa5ceb90bb591afec3aa013?family=FF+Karbid+Slab" rel="stylesheet"
        type="text/css">
    <script src="./threejs/build/three.js"></script>
    <script src="./threejs/exporters/GLTFExporter.js"></script>
    <script src="./threejs/controls/OrbitControls.js"></script>
    <script src="./threejs/loaders/GLTFLoader.js"></script>
    <script src="./threejs/postprocessing/EffectComposer.js"></script>
    <script src="./threejs/shaders/FXAAShader.js"></script>
    <script src="./threejs/postprocessing/RenderPass.js"></script>
    <script src="./threejs/postprocessing/ShaderPass.js"></script>
    <script src="./threejs/postprocessing/OutlinePass.js"></script>
    <script src="./threejs/shaders/SSAOShader.js"></script>
    <script src="./threejs/shaders/CopyShader.js"></script>
    <script src="./threejs/math/SimplexNoise.js"></script>
    <script src="./threejs/postprocessing/SSAOPass.js"></script>


</head>

<body>
    <div class="rightnavigator shadow">
        <div class="col-12">
            <form action="" class="p-2 ">
                <h5 class="text-center">Wardrobe Options</h5>
                <div class="form-control m-1">
                    <label for="width">Width: <output id="rangeoutput">2.5</output> ft</label>
                    <input type="range" name="width" id="width" class="form-range" min="2.5" max="12" step="0.5"
                        value="2.5" oninput="rangeoutput.value = this.value">

                    <h6>Choose Columns:</h6>
                    <div class="d-md-inline-block justify-content-center " id="columns-group">

                    </div>

                    <!-- <p>Verticle Columns: <span id="columnSize"> 1in</span></p> -->
                </div>

                <div class="form-control m-1 ">
                    <p>Height:</p>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input btn-check" type="radio" name="heightOptions" id="height1"
                            value="option1" checked>
                        <label class="form-check-label btn btn-outline-secondary" for="height1">6 ft</label>
                    </div>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input btn-check" type="radio" name="heightOptions" id="height2"
                            value="option1">
                        <label class="form-check-label btn btn-outline-secondary" for="height2">6.5 ft</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input btn-check" type="radio" name="heightOptions" id="height3"
                            value="option1">
                        <label class="form-check-label btn btn-outline-secondary" for="height3">7 ft</label>
                    </div>

                </div>

                <div class="form-control m-1">
                    <p>Depth:</p>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input btn-check" type="radio" name="depthOptions" id="depth1"
                            value="option1" checked>
                        <label class="form-check-label btn btn-outline-secondary" for="depth1">1.5 ft</label>
                    </div>

                    <div class="form-check form-check-inline">
                        <input class="form-check-input btn-check" type="radio" name="depthOptions" id="depth2"
                            value="option1">
                        <label class="form-check-label btn btn-outline-secondary" for="depth2">1.75 ft</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input btn-check" type="radio" name="depthOptions" id="depth3"
                            value="option1">
                        <label class="form-check-label btn btn-outline-secondary" for="depth3">2 ft</label>
                    </div>
                    
                </div>

                <div class="form-control m-1">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" name="loftOptions" id="addloft">
                        <label class="form-check-label" for="addloft" id="loftLabel"></label>
                    </div>

                    <div class="form-check-inline" id="loftOptionsPanel">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input btn-check" type="radio" name="loftOptions" id="loft1"
                                value="option1" checked>
                            <label class="form-check-label btn btn-outline-secondary" for="loft1">3 ft</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input btn-check" type="radio" name="loftOptions" id="loft2"
                                value="option1">
                            <label class="form-check-label btn btn-outline-secondary" for="loft2">3.5 ft</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input btn-check" type="radio" name="loftOptions" id="loft3"
                                value="option1">
                            <label class="form-check-label btn btn-outline-secondary" for="loft3">4 ft</label>
                        </div>
                    </div>

                </div>
                <div class="form-control m-1">


                    <h6>Features:</h6>
                    <div class="row m-1">
                        
                        <p for="editColumn">Edit Column:  <span id="column_id"></span></p>
                      
                        
                        <select class="form-select m-1"  name="hangerOrShelf" id="hangerOrShelf">
                            <option value="0">Select Hanger or Shelf</option>
                            <option value="1">Hanger</option>
                            <option value="2">Shelf</option>
                        </select>
                        <!-- <a class="btn btn-outline-dark m-1" style="color:#faaaee; border-color: #faaaee;"
                            data-bs-toggle="modal" data-bs-target="#optionModal" >Add Bottom Shelves</a> -->
                        <!-- <a class="btn btn-outline-dark m-1" style="color:#22ffaa; border-color: #22ffaa;"
                            data-bs-toggle="modal" data-bs-target="#optionModal" >Add Splitter</a> -->
                        <a class="btn btn-outline-dark m-1" id="addLocker">Add Locker</a>
                        <a class="btn btn-outline-dark m-1" id="addIDS">Add I.Drawer S</a>
                        <a class="btn btn-outline-dark m-1" id="addIDL">Add I.Drawer L</a>
                        <a class="btn btn-outline-dark m-1" id="addED">Add E.Drawer</a>
                        <a class="btn btn-outline-dark m-1" id="addBottomShelf">Add Shelf at Bottom </a>
                        <a class="btn btn-outline-danger m-1" onclick="remove_all_internal()">Remove All</a>
                    </div>

                    <label for="copyto" class="form-label m-1">Copy To:</label>
                    <select class="form-select m-1" id="copyto" aria-label="copyto">
                        <!-- <option selected>Copy to Column:</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option> -->
                    </select>
                </div>
                <div class="row m-1">
                    <button class="btn btn-outline-success m-1"> Reset</button>
                    <a class="btn btn-outline-dark m-1" id="export"> Export</a>
                </div>


                <div class="row  m-1 position-relative ">

                    <div class="col-12 col-sm-12">
                        <img class=" img-fluid" src="https://unsplash.it/250/100" id="capturedImage" width="100px"
                            alt="thumbnail" />
                    </div>
                </div>


            </form>
        </div>
    </div>




    <div id="modelviewer"></div>
    <!-- Small modal -->




    <script src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
        integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI=" crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"
        integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous">
    </script>

    <script src="./Splitter.js"></script>
    <script src="./Drawer.js"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script> -->
    <script src="./wardrobeconfig.js"></script>
</body>

</html>
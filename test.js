
const viewer = document.getElementById("viewer");
const fwidth = viewer.clientWidth;
const fheight = viewer.clientHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(30, fwidth / fheight, 0.1, 100);
camera.position.set(0.1, 0.2, 4);
var wWidth = 2.5;

const renderer = new THREE.WebGL1Renderer({
  alpha: false,
  preserveDrawingBuffer: true,
  logarithmicDepthBuffer: true,
});
renderer.setSize(fwidth, fheight);

scene.add(new THREE.AmbientLight(0xdedede, 1));
const light = new THREE.DirectionalLight(0xdedede, 2);
light.position.set(2, 3, 1);
scene.add(light);
const g = new THREE.BoxGeometry(0.5, 0.5, 0.1);

const m = new THREE.MeshStandardMaterial({ color: 0xdedede, name: "texture" });
const cube = new THREE.Mesh(g, m);
cube.rotation.y = Math.PI / 4;
const tex = new THREE.TextureLoader().load(
  "Textures/uvchecker.png"
);
scaleUV(cube, 1, 2);  
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(2, 2);
tex.anisotropy = 16;
m.map = tex;
scene.add(cube);

viewer.appendChild(renderer.domElement);
animate();

window.addEventListener("resize", OnWindowResize);

function OnWindowResize() {
  renderer.setSize(fwidth, fheight);
  camera.updateProjectionMatrix();
}
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
 
}

$("#range").on("input",function () {
  wWidth = $(this).val();
  scaleUV(cube, 1, 2);
});

function scaleUV(obj, x, y) {
  try {
    obj.scale.x = wWidth * 0.3048;
    obj.scale.y = 6 * 0.3048;
    if (obj.hasOwnProperty("geometry")) {
      var uvAttribute = obj.geometry.getAttribute("uv");

      var factor = (wWidth / 2.5) * 0.25;

      for (var i = 0; i < uvAttribute.count; i++) {
        var u = uvAttribute.getX(i);
        var v = uvAttribute.getY(i);

        if (u != 0) {
          u = factor;
          u = u.toFixed(2);
        }
        uvAttribute.setXY(i, u, v);
      }

      uvAttribute.needsUpdate = true;
    }
  } catch (err) {}
}

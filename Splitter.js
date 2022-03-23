

function Splitter(mesh) {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshStandardMaterial({
        color: 0xaaaafd
    });
    this.mesh = mesh;
    this.name = "splitter";
    this.map = null
    

    this.set_name = function (name) {
        this.mesh.name = name;
    }
    this.set_texture = function(tex){
    
        this.material.map =  new THREE.TextureLoader().load(tex);
    }
    this.create = function () {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = this.name;
        scene.add(this.mesh);
    }

    this.remove = function () {
        scene.remove(this.mesh);
    }
    this.setPosition = function (vector3) {
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.position = vector3;
        }
    }
    this.setScale = function (vector3) {
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.scale = vector3;
        }
    }
    this.set_position = function (pX, pY, pZ) {
        if (this.mesh instanceof THREE.Mesh) {

            this.mesh.position.setX(pX);
            this.mesh.position.setY(pY);
            this.mesh.position.setZ(pZ);

        }

    }
    this.set_scale = function (sX, sY, sZ) {
        if (this.mesh instanceof THREE.Mesh) {
           
            this.mesh.scale.setX(sX);
            this.mesh.scale.setY(sY);
            this.mesh.scale.setZ(sZ);

        }
    }

    this.visible = function (bool) {
        this.mesh.visible = bool;
    }

    this.getPosition = function(){
       return this.mesh.position;
        

    }
    this.getScale = function(){
        return this.mesh.scale;
    }
}
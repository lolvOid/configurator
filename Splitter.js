function Splitter() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
        color: 0xaaaafd
    });
    this.obj = null;
    this.name = "Splitter";
    this.set_name = function (name) {
        this.obj.name = name;
    }

    this.create = function () {
        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.obj.name = this.name;
        scene.add(this.obj);
    }

    this.remove = function () {
        scene.remove(this.obj);
    }
    this.setPosition = function (vector3) {
        if (this.obj instanceof THREE.Mesh) {
            this.obj.position = vector3;
        }
    }
    this.setScale = function (vector3) {
        if (this.obj instanceof THREE.Mesh) {
            this.obj.scale = vector3;
        }
    }
    this.set_position = function (pX, pY, pZ) {
        if (this.obj instanceof THREE.Mesh) {

            this.obj.position.setX(pX);
            this.obj.position.setY(pY);
            this.obj.position.setZ(pZ);

        }

    }
    this.set_scale = function (sX, sY, sZ) {
        if (this.obj instanceof THREE.Mesh) {

            this.obj.scale.setX(sX);
            this.obj.scale.setY(sY);
            this.obj.scale.setZ(sZ);

        }
    }

    this.visible = function (bool) {
        this.obj.visible = bool;
    }
}
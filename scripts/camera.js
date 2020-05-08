import { gl } from "./gl.js";

export class Camera {
    constructor(ID) {
        this.ID = ID;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.viewMat = glMatrix.mat4.create();
        this.projMat = glMatrix.mat4.create();

        this.resize();
        this.calcViewMat();
    }

    calcViewMat() {
        let eye = [this.x, this.y, this.z];
        let center = [this.x, this.y, this.z + 1];
        let up = [0, 1, 0];

        glMatrix.mat4.lookAt(this.viewMat, eye, center, up);
        return glMatrix.mat4.invert(this.viewMat, this.viewMat);
    }

    resize() {
        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let fov = 180;
        let zNear = 1;
        let zFar = 200;
        glMatrix.mat4.perspective(this.projMat, fov, aspect, zNear, zFar);
    }
}
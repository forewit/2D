// imports
import * as utils from "./utils.js";
import { gl, elm } from "./gl.js";
import { Camera } from "./camera.js";
import { Layer } from "./layer.js";
import { materials } from "./materials.js";

export class Canvas {
    constructor() {
        this.layers = [];
        this.active_layer_ID;
        this.cameras = [];
        this.active_camera_ID;

        gl.clearColor(0.4, 0.6, 1.0, 1.0);
        
        this.resize();
    }

    addCamera() {
        let ID = utils.generate_ID();
        this.cameras[ID] = new Camera(ID);
        return ID;
    }
    removeCamera(ID) { return delete this.cameras[ID]; }

    addLayer() {
        let ID = utils.generate_ID();
        this.layers[ID] = new Layer(ID);
        return ID;
    }
    removeLayer(ID) {
        layer.destroy();
        return delete this.layers[ID];
    }

    resize() {
        elm.width = window.innerWidth;
        elm.height = window.innerHeight;
        gl.viewport(0, 0, elm.width, elm.height);

        for (const id in this.cameras) { this.cameras[ID].resize(); }
    }

    render() { 
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        for (const mat in materials) {
            materials[mat].render();
        }

        gl.flush();
    }
}
// imports
import * as utils from "./utils.js";
import { gl, elm } from "./gl.js";
import { Camera } from "./camera.js";
import { Layer } from "./layer.js";

export class Canvas {
    constructor() {
        this.layers = [];
        this.active_layer_ID = this.addLayer();
        this.cameras = [];
        this.active_camera_ID = this.addCamera();
        this.update = false;
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

        //TODO: update camera projection matrix
    }

    render() { }
}
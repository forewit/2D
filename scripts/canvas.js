// imports
import * as utils from "./utils.js";
import gl from "./gl.js";
import elm from "./gl.js";
import { Camera } from "./camera.js";
import { Layer } from "./layer.js";

class Canvas {
    constructor() {
        this.layers = [];
        this.active_layer_ID = this.addLayer();
        this.cameras = [];
        this.active_camera_ID = this.addCamera();
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

    resize(w, h) { }

    render() { }
}
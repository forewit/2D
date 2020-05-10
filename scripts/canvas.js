// imports
import * as utils from "./math.js";
import { gl, elm } from "./gl.js";
import { Layer } from "./layer.js";
import { materials } from "./materials.js";

export class Canvas {
    constructor() {
        this.layers = [];
        this.camera = {
            x: 0,
            y: 0,
            z: 0
        };

        gl.clearColor(0.4, 0.6, 1.0, 1.0);
        this.resize();
    }

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
        this.render(this.active_camera_ID);
    }

    render() {         
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        for (const mat in materials) { 
            materials[mat].render(this.camera); 
        }

        gl.flush();
    }
}
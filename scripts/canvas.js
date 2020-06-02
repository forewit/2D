// imports
import * as utils from "./math.js";
import { gl, elm } from "./gl.js";
import { Layer } from "./layer.js";

export class Canvas {
    constructor() {
        this.layers = [];
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
        this.render();
    }

    render(time) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        for (const ID in this.layers) {
            this.layers[ID].render(time);
        }

        gl.flush();
    }
}
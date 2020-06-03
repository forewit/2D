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
        let layer = new Layer(ID);
        this.layers.push(layer);
        return layer;
    }
    
    destroyLayer(layer) {
        for (var i = 0, len = this.layers.length; i < len; i++) {
            if (this.layers[i].ID == layer.ID) {
                this.layers[i].destroy;
                this.layers.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    resize() {
        elm.width = window.innerWidth;
        elm.height = window.innerHeight;
        gl.viewport(0, 0, elm.width, elm.height);
    }

    render(time) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        for (var i = 0, len = this.layers.length; i < len; i++) {
            this.layers[i].render(time);
        }

        gl.flush();
    }
}
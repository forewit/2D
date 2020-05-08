import { Canvas } from "./canvas.js";
import { materials } from "./materials.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    // using for debug
    let canvas = new Canvas();
    let layerID = canvas.addLayer();
    let spriteID = canvas.layers[layerID].addSprite("./img/untitled2.png");
    let cameraID = canvas.addCamera();

    window.setTimeout(function() {
        canvas.render();
    }, 1000);
    
    exports.canvas = canvas;
    exports.materials = materials;
    // ***************

    function load(URL) { };
    function newCanvas() { }
    function save() { };

    exports.load = load;
    exports.save = save;
    exports.newCanvas = newCanvas;

    Object.defineProperty(exports, '__esModule', { value: true });
})));
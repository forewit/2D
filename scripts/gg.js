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
    let spriteID = canvas.layers[layerID].addSprite("./img/fireball.png");
    let fireball = canvas.layers[layerID].sprites[spriteID];
    fireball.x = 100;
    fireball.y = 100;


    window.addEventListener("resize", function () {
        canvas.resize();
    });

    function loop(delta) {
        requestAnimationFrame(loop);
        var perSec = delta / 1000;

        fireball.rotation +=0.01;
        fireball.frame_x = Math.floor(10 * perSec % 6);
        
        canvas.render();
    }
    requestAnimationFrame(loop);
    
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
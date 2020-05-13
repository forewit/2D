import { Canvas } from "./canvas.js";
import { materials } from "./materials.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    // using for debug ****************************
    let canvas = new Canvas();
    window.addEventListener("resize", function () {
        canvas.resize();
    });

    let layerID = canvas.addLayer();
    var sprites = [];
    for (var i = 0; i < 4; i++) {
        let spriteID = canvas.layers[layerID].addSprite("./img/fireball.png");
        let sprite = canvas.layers[layerID].sprites[spriteID];
        sprite.x = Math.floor(Math.random() * Math.floor(512));
        sprite.y = Math.floor(Math.random() * Math.floor(512));
        sprite.rotation = Math.random() * 3.14;
        sprite.scale_x = Math.random();
        sprite.scale_y = sprite.scale_x;
        sprites.push(sprite);
    }

    var FPS = 0;
    var ticks = 0;
    var lastFPS = 0;
    var fps_div = document.getElementById("fps");

    function loop(delta) {
        requestAnimationFrame(loop);
        var perSec = delta / 1000;

        for (const sprite in sprites) {
            sprites[sprite].rotation = 0.2 * perSec;
            sprites[sprite].frame_x = Math.floor(10 * perSec % 6);
        }
        canvas.render();

        // FPS counter
        var now = Date.now();
        if (now - lastFPS >= 1000) {
            lastFPS = now;
            FPS = ticks;
            ticks = 0;
        }
        ticks++;
        fps_div.innerHTML = FPS;
    }
    requestAnimationFrame(loop);

    exports.canvas = canvas;
    exports.materials = materials;
    // **********************************************

    function load(URL) { };
    function newCanvas() { }
    function save() { };

    exports.load = load;
    exports.save = save;
    exports.newCanvas = newCanvas;

    Object.defineProperty(exports, '__esModule', { value: true });
})));
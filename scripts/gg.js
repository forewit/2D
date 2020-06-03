import { Canvas } from "./canvas.js";
import { interact } from "./interact.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    // using for debug ****************************
    let canvas = new Canvas();
    window.addEventListener("resize", canvas.resize);

    let layer = canvas.addLayer();
    var sprites = [];

    for (var i = 3; i < 4; i++) {
        let sprite = layer.addSprite("./img/fireball.png");

        sprite.x = Math.floor(Math.random() * Math.floor(512));
        sprite.y = Math.floor(Math.random() * Math.floor(512));
        //sprite.x = i*50 + 128;
        //sprite.y = 128 ;
        sprite.rotation = Math.random() * 3.14;
        sprite.opacity = Math.random() + 0.5;
        //sprite.scale_x = Math.random();
        //sprite.scale_y = sprite.scale_x;
        sprites.push(sprite);
    }
    
    let emitter = layer.addEmitter();
    
    //layer.bringForward(sprites[2].ID);
    interact.start();

    var FPS = 0;
    var ticks = 0;
    var lastFPS = 0;
    var fps_div = document.getElementById("fps");

    function loop(delta) {
        requestAnimationFrame(loop);
        var perSec = delta / 1000;

        for (var i = 0, len = sprites.length; i < len; i++) {
            sprites[i].rotation += 0.01;
            sprites[i].frame_x = Math.floor(11 * perSec % 6);
        }
        
        canvas.render(delta);

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
    // **********************************************

    function load(URL) { };
    function newCanvas() { }
    function save() { };

    exports.load = load;
    exports.save = save;
    exports.newCanvas = newCanvas;

    Object.defineProperty(exports, '__esModule', { value: true });
})));
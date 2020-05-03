import { Canvas } from "./canvas.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    function start(canvas) {
        let map1 = new Canvas();
    }

    function load(URL) { };
    function save() { };
    function command(command) { };

    exports.start = start;
    exports.load = load;
    exports.save = save;
    exports.command = command;

    Object.defineProperty(exports, '__esModule', { value: true });
})));
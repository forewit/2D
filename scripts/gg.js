import { Canvas } from "./canvas.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';



    exports.Canvas = Canvas;

    Object.defineProperty(exports, '__esModule', { value: true });
})));
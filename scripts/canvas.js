// imports
import * as utils from "./utils.js";
import { Material } from "./material.js";

// constants
const VS_01 = `#version 300 es
    in vec2 a_position;
    in vec2 a_texCoord;

    uniform float u_depth;
    uniform mat3 u_world;
    uniform mat3 u_object;
    uniform vec2 u_frame;

    out vec2 texCoord;
    void main(){
        gl_Position = vec4((u_world * u_object * vec3(a_position, 1)).xy, u_depth, u_depth);
        texCoord = a_texCoord + u_frame;
    }
`;
const FS_01 = `#version 300 es
    precision mediump float;

    in vec2 texCoord;

    uniform sampler2D u_image;
    uniform vec2 u_stepSize;

    out vec4 fragmentColor;

    void main(){
        fragmentColor = texture(u_image, texCoord);
    }
`;


/*!
 * UMD Boilerplate
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
//
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.canvas = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Create canvas
	let canvas = document.createElement("canvas");
	let gl = canvas.getContext("webgl2");
	gl.clearColor(0.4, 0.6, 1.0, 1.0);

    let test = new Material(gl, VS_01, FS_01);



    return { utils, Material };

});
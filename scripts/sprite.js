import { materials } from "./materials.js";
import { gl } from "./gl.js";

export class Sprite {
    constructor(ID, URL) {
        this.ID = ID;
        this.isLoaded = false;
        this.material = materials.default;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale_x = 1;
        this.scale_y = 1;
        this.rotation = 0;
        this.opacity = 1;
        this.frame_x = 0;
        this.frame_y = 0;
        this.image = new image();
        this.image.src = URL;

        let me = this;
        me.image.onload = function () {
            me.w = image.width;
            me.h = image.height;

            gl.useProgram(me.material.program);

            me.gl_tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, me.gl_tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // maybe change to bilinear?
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // maybe change to bilinear
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
            gl.bindTexture(gl.TEXTURE_2D, null);

            let rect = new Float32Array([
                0, 0,
                me.w, 0,
                0, me.h,
                0, me.h,
                me.w, 0,
                me.w, me.h
            ]);

            me.tex_buff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, me.tex_buff);
            gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW);

            me.geo_buff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, me.geo_buff);
            gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW);

            gl.useProgram(null);
            me.isLoaded = true;
        }
    }

    destroy() {
        this.isLoaded = false;
        gl.deleteBuffer(this.tex_buff);
        gl.deleteBuffer(this.geo_buff);
        gl.deleteTexture(this.gl_tex);
        gl.deleteProgram(this.material.program)
    }
}
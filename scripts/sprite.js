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
        this.URL = URL;

        let me = this;
        if (me.material.buffers[URL]) {
            me.material.buffers[URL].count++;
        } else {
            me.material.buffers[URL] = { sprites: [] };
            me.material.buffers[URL].sprites[ID] = me;
            me.material.buffers[URL].count = 1;
            me.material.buffers[URL].image = new image();
            me.material.buffers[URL].image.src = URL;

            me.material.buffers[URL].image.onload = function () {
                let w = me.material.buffers[URL].image.width;
                let h = me.material.buffers[URL].image.height;

                gl.useProgram(me.material.program);

                me.material.buffers[URL].gl_tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, me.material.buffers[URL].gl_tex);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); //TODO: maybe change to bilinear?
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //TODO:  maybe change to bilinear
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, me.material.buffers[URL].image);
                gl.bindTexture(gl.TEXTURE_2D, null);

                let rect = new Float32Array([
                    0, 0,
                    w, 0,
                    0, h,
                    0, h,
                    w, 0,
                    w, h
                ]);

                me.material.buffers[URL].tex_buff = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, me.material.buffers[URL].tex_buff);
                gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW);

                me.material.buffers[URL].geo_buff = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, me.material.buffers[URL].geo_buff);
                gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW);

                gl.useProgram(null);
            }
        }
        this.isLoaded = true;
        me.material.buffers[URL].sprites[ID] = me;
    }

    destroy() {
        let me = this
        me.isLoaded = false;
        delete me.material.buffers[me.URL].sprites[me.ID];
        if (me.material.buffers[me.URL].count-- <= 0) {
            gl.deleteBuffer(me.material.buffers[me.URL].tex_buff);
            gl.deleteBuffer(me.material.buffers[me.URL].geo_buff);
            gl.deleteTexture(me.material.buffers[me.URL].gl_tex);
            delete me.material.buffers[me.URL];
        }
    }
}
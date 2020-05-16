import { materials } from "./materials.js";
import { gl, elm } from "./gl.js";
import { m3 } from "./math.js";

export class Sprite {
    static createRectArray(w = 1, h = 1) {
        return new Float32Array([
            0, 0,
            w, 0,
            0, h,
            0, h,
            w, 0,
            w, h
        ]);
    }

    constructor(ID, URL) {
        this.ID = ID;
        this.enabled = false;
        this.material = materials.default;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale_x = 0.5;
        this.scale_y = 0.5;
        this.rotation = 0;
        this.opacity = 1;
        this.frame_w = 512;
        this.frame_h = 512;
        this.frame_x = 0;
        this.frame_y = 0;
        this.URL = URL;

        let me = this;
        if (me.material.buffers[URL]) {
            me.material.buffers[URL].count++;
            me.enabled = true;
        } else {
            me.material.buffers[URL] = { sprites: [] };
            me.material.buffers[URL].image = new Image();
            me.material.buffers[URL].image.src = URL;

            me.material.buffers[URL].image.onload = function () {
                me.material.buffers[URL].sprites[ID] = me;
                me.material.buffers[URL].count = 1;

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

                me.material.buffers[URL].tex_buff = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, me.material.buffers[URL].tex_buff);
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    Sprite.createRectArray(
                        me.frame_w / w,
                        me.frame_h / h
                    ),
                    gl.STATIC_DRAW
                );

                me.material.buffers[URL].geo_buff = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, me.material.buffers[URL].geo_buff);
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    Sprite.createRectArray(
                        me.frame_w,
                        me.frame_h
                    ),
                    gl.STATIC_DRAW
                );

                gl.useProgram(null);

                me.enabled = true;
            }
        }
    }

    destroy() {
        let me = this
        me.enabled = false;
        delete me.material.buffers[me.URL].sprites[me.ID];
        if (--me.material.buffers[me.URL].count <= 0) {
            gl.deleteBuffer(me.material.buffers[me.URL].tex_buff);
            gl.deleteBuffer(me.material.buffers[me.URL].geo_buff);
            gl.deleteTexture(me.material.buffers[me.URL].gl_tex);
            delete me.material.buffers[me.URL];
        }
    }

    render(camera, layerOpacity) {
        if (!this.enabled) return;

        let buffer = this.material.buffers[this.URL]

        // render sprite
        gl.useProgram(this.material.program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, buffer.gl_tex);
        this.material.set("u_texture", 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.tex_buff);
        this.material.set("a_texcoord");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.geo_buff);
        this.material.set("a_position");

        let w = buffer.image.width;
        let h = buffer.image.height;

        let translation = m3.translation(this.x - camera.x, this.y - camera.y);
        let center = m3.translation(-this.frame_w * this.scale_x / 2, -this.frame_h * this.scale_y / 2);
        let rotation = m3.rotation(this.rotation);
        let scaling = m3.scaling(this.scale_x, this.scale_y);
        let projection = m3.projection(elm.width, elm.height);

        let matrix = m3.multiply(projection, translation);
        matrix = m3.multiply(matrix, rotation);
        matrix = m3.multiply(matrix, center);
        matrix = m3.multiply(matrix, scaling);

        this.material.set("u_matrix", matrix);
        this.material.set("u_opacity", this.opacity * layerOpacity);
        this.material.set("u_frame",
            this.frame_x * this.frame_w / w,
            this.frame_y * this.frame_h / h
        );

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

        gl.useProgram(null);
    }
}
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
        this.material = materials.default;
        this.URL = URL;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale_x = 0.5;
        this.scale_y = 0.5;
        this.rotation = 0; // in radians
        this.opacity = 1;
        this.frame_w = 512;
        this.frame_h = 512;
        this.frame_x = 0;
        this.frame_y = 0;

        let me = this;
        if (me.material.buffers[URL]) {
            me.material.buffers[URL].count++;
        } else {
            me.material.buffers[URL] = { image: new Image(), count: 1 };
            me.material.buffers[URL].image.onload = function () { me.setup_buffers(); };
            me.material.buffers[URL].image.src = URL;
        }
    }

    setup_buffers() {
        let buffer = this.material.buffers[this.URL];
        
        let w = buffer.image.width;
        let h = buffer.image.height;

        gl.useProgram(this.material.program);

        buffer.gl_tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, buffer.gl_tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); //TODO: maybe change to bilinear?
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buffer.image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        buffer.tex_buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.tex_buff);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            Sprite.createRectArray(
                this.frame_w / w,
                this.frame_h / h
            ),
            gl.STATIC_DRAW
        );

        buffer.geo_buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.geo_buff);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            Sprite.createRectArray(
                this.frame_w,
                this.frame_h
            ),
            gl.STATIC_DRAW
        );

        gl.useProgram(null);
        buffer.loaded = true;
    }

    destroy() {
        if (--this.material.buffers[this.URL].count <= 0) {
            gl.deleteBuffer(this.material.buffers[this.URL].tex_buff);
            gl.deleteBuffer(this.material.buffers[this.URL].geo_buff);
            gl.deleteTexture(this.material.buffers[this.URL].gl_tex);
            delete this.material.buffers[this.URL];
        }
    }

    render(camera, layerOpacity) {
        let buffer = this.material.buffers[this.URL]

        if (!buffer.loaded) return;

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

        //TODO: can make this math more efficient
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
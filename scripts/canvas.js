// imports
import * as utils from "./math.js";
import { gl, elm } from "./gl.js";
import { Layer } from "./layer.js";
import { m3 } from "./math.js";
import { materials } from "./materials.js";

export class Canvas {
    constructor() {
        this.layers = [];
        this.camera = {
            x: 0,
            y: 0,
            z: 0
        };

        gl.clearColor(0.4, 0.6, 1.0, 1.0);
        this.resize();
    }

    addLayer() {
        let ID = utils.generate_ID();
        this.layers[ID] = new Layer(ID);
        return ID;
    }
    removeLayer(ID) {
        layer.destroy();
        return delete this.layers[ID];
    }

    resize() {
        elm.width = window.innerWidth;
        elm.height = window.innerHeight;
        gl.viewport(0, 0, elm.width, elm.height);
        this.render(this.active_camera_ID);
    }

    render() {         
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // OPTION #1: render by material
        for (const mat in materials) { 
            materials[mat].render(this.camera); 
        } 
        /*
        // OPTION #2: render by sprites
        for (const layerID in this.layers) {
            let layer = this.layers[layerID];
            for (const spriteID in layer.sprites) {
                let sprite = layer.sprites[spriteID];

                if (!sprite.enabled) break;

                let material = sprite.material;
                let buffer = material.buffers[sprite.URL]
                
                // render sprite
                gl.useProgram(sprite.material.program);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, buffer.gl_tex);
                material.set("u_texture", 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.tex_buff);
                material.set("a_texcoord");
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.geo_buff);
                material.set("a_position");

                let w = buffer.image.width;
                let h = buffer.image.height;
                
                let translation = m3.translation(sprite.x - this.camera.x, sprite.y - this.camera.y);
				let center = m3.translation(-sprite.frame_w * sprite.scale_x / 2,-sprite.frame_h * sprite.scale_y / 2);
				let rotation = m3.rotation(sprite.rotation);
				let scaling = m3.scaling(sprite.scale_x, sprite.scale_y);
				let projection = m3.projection(elm.width, elm.height);

				let matrix = m3.multiply(projection, translation);
				matrix = m3.multiply(matrix, rotation);
				matrix = m3.multiply(matrix, center);
				matrix = m3.multiply(matrix, scaling);

				material.set("u_matrix", matrix);
				material.set("u_opacity", sprite.opacity);
				material.set("u_frame", 
					sprite.frame_x * sprite.frame_w / w,
					sprite.frame_y * sprite.frame_h / h
				);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
                
                gl.useProgram(null);
            }
        }*/
        

        gl.flush();
    }
}
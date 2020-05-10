import { gl, elm } from "./gl.js";
import { m3 } from "./math.js";

// Example
// https://jsfiddle.net/dyvfg5n0/

const SPRITE_VS = `#version 300 es
in vec2 a_position;
in vec2 a_texcoord;

uniform mat3 u_matrix;
uniform vec2 u_frame;

out vec2 v_texcoord;

void main() {
  gl_Position = vec4(u_matrix * vec3(a_position, 1), 1);
  v_texcoord = a_texcoord + u_frame;
}`;

const SPRITE_FS = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform float u_opacity; 

out vec4 outColor;

void main() {
   outColor = texture(u_texture, v_texcoord) * vec4(1,1,1,u_opacity);
}`;

class Material {
    constructor(vs, fs) {
		this.buffers = [];
        let vsShader = this.getShader(vs, gl.VERTEX_SHADER);
        let fsShader = this.getShader(fs, gl.FRAGMENT_SHADER);

        if (vsShader && fsShader) {
            this.program = gl.createProgram();
            gl.attachShader(this.program, vsShader);
            gl.attachShader(this.program, fsShader);
            gl.linkProgram(this.program);

            if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error("Cannot load shader: \n" + gl.getProgramInfoLog(this.program));
                return null;
            }

            this.gatherParameters();
            gl.detachShader(this.program, vsShader);
            gl.detachShader(this.program, fsShader);
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.useProgram(null);
        }
    }

    gatherParameters() {
		let isUniform = 0;
		
		this.parameters = {};
		
		while(isUniform < 2){
			let paramType = isUniform ? gl.ACTIVE_UNIFORMS : gl.ACTIVE_ATTRIBUTES;
			let count = gl.getProgramParameter(this.program, paramType);
			
			for(let i=0; i < count; i++){
				let details;
				let location;
				if(isUniform){
					details = gl.getActiveUniform(this.program, i);
					location = gl.getUniformLocation(this.program, details.name);
				} else {
					details = gl.getActiveAttrib(this.program, i);
					location = gl.getAttribLocation(this.program, details.name);
				}
				
				this.parameters[details.name] = {
					location : location,
					uniform : !!isUniform,
					type : details.type
				}
			}
			isUniform++;
		}
    }

    set(name, a, b, c, d, e){
		if(name in this.parameters){
			let param = this.parameters[name];
			if(param.uniform){
				switch(param.type){
					case gl.FLOAT: gl.uniform1f(param.location, a); break;
					case gl.FLOAT_VEC2: gl.uniform2f(param.location, a, b); break;
					case gl.FLOAT_VEC3: gl.uniform3f(param.location, a, b, c); break;
					case gl.FLOAT_VEC4: gl.uniform4f(param.location, a, b, c, d); break;
					case gl.FLOAT_MAT3: gl.uniformMatrix3fv(param.location, false, a); break;
					case gl.FLOAT_MAT4: gl.uniformMatrix4fv(param.location, false, a); break;
					case gl.SAMPLER_2D: gl.uniform1i(param.location, a); break;
				}
			} else {
				gl.enableVertexAttribArray(param.location);
				
				if(a == undefined) a = gl.FLOAT;
				if(b == undefined) b = false;
				if(c == undefined) c = 0;
				if(d == undefined) d = 0;
				
				switch(param.type){
					case gl.FLOAT : gl.vertexAttribPointer(param.location, 1, a, b, c, d); break;
					case gl.FLOAT_VEC2 : gl.vertexAttribPointer(param.location, 2, a, b, c, d); break;
					case gl.FLOAT_VEC3 : gl.vertexAttribPointer(param.location, 3, a, b, c, d); break;
					case gl.FLOAT_VEC4 : gl.vertexAttribPointer(param.location, 4, a, b, c, d); break;
				}
			}
		}
    }
    
    getShader(script, type) {
        var output = gl.createShader(type);
        gl.shaderSource(output, script);
        gl.compileShader(output);

        if(!gl.getShaderParameter(output, gl.COMPILE_STATUS)) {
            console.error("Shader Error: \n" + gl.getShaderInfoLog(output));
            return null;
        }

        return output;
	}

	render(camera) {
		gl.useProgram(this.program);		
		
		for (const url in this.buffers) {
			let buffer = this.buffers[url];
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, buffer.gl_tex);
			this.set("u_texture", 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer.tex_buff);
			this.set("a_texcoord");
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer.geo_buff);
			this.set("a_position");

			let w = buffer.image.width;
			let h = buffer.image.height;

			for (const id in buffer.sprites) {
				let sprite = buffer.sprites[id];

				let translation = m3.translation(sprite.x - camera.x, sprite.y - camera.y);
				let center = m3.translation(-sprite.frame_w / 2,-sprite.frame_h / 2);
				let rotation = m3.rotation(sprite.rotation);
				let scaling = m3.scaling(sprite.scale_x, sprite.scale_y);
				let projection = m3.projection();

				let matrix = m3.multiply(projection, translation);
				matrix = m3.multiply(matrix, rotation);
				matrix = m3.multiply(matrix, center);
				matrix = m3.multiply(matrix, scaling);

				this.set("u_matrix", matrix);
				this.set("u_opacity", sprite.opacity);
				this.set("u_frame", 
					sprite.frame_x * sprite.frame_w / w,
					sprite.frame_y * sprite.frame_h / h
				);

				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
			}
		}
		gl.useProgram(null);
	}
	
	destroy() {}
}

export let materials = {
	default: new Material(SPRITE_VS, SPRITE_FS)
};
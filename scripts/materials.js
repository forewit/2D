import { gl } from "./gl.js";

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
}`;

const FS_01 = `#version 300 es
precision mediump float;

in vec2 texCoord;

uniform sampler2D u_image;
uniform vec2 u_stepSize;

out vec4 fragmentColor;

void main(){
	fragmentColor = texture(u_image, texCoord);
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

	render() {
		gl.useProgram(this.program);

		for (const url in this.buffers) {
			let buffer = this.buffers[url];

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, buffer.gl_tex);
			this.set("u_image", 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer.tex_buff);
			this.set("a_texCoord");
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer.geo_buff);
			this.set("a_position");

			for (const id in buffer.sprites) {
				let sprite = buffer.sprites[id];

				/* ********** Set frame, world mat, object mat, ect. **********
				this.set("u_frame", sprite.uv_frame.x, sprite.uv_frame.y);
				this.set("u_world", this.layer.worldSpaceMatrix);
				this.set("u_object", this.objectMatrix);
				this.set("u_depth", this.layer.depth);
				this.set("u_stepSize", 10/this.size.x, 10/this.size.y);
				* *************************************************************/

				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
			}
		}

		gl.useProgram(null);
	}
	
	destroy() {}
}

export let materials = {
	default: new Material(VS_01, FS_01)
};
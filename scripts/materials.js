import { gl, elm } from "./gl.js";
import { m3 } from "./math.js";

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

//TODO: set default values to something cool
const PARTICLE_VS = `#version 300 es
layout(location=0) in vec2 a_vertices;
layout(location=1) in vec2 a_position;
layout(location=2) in vec2 a_velocity;
layout(location=3) in float a_age; // current age of particle in seconds
layout(location=4) in float a_life; // maximum age of particle

uniform float u_time;
uniform mat3 u_matrix;

out vec2 v_position;
out vec2 v_velocity;
out float v_age;

// -----------------------------------
highp float random(vec2 co){
	highp float a = 12.9898;
	highp float b = 78.233;
	highp float c = 43758.5453;
	highp float dt = dot(co.xy ,vec2(a,b));
	highp float sn = mod(dt,3.14);
	return fract(sin(sn) * c);
}
// ------------------------------------

void main() {
	gl_PointSize = 10.0;
	float age = u_time - a_age;

	if(age > a_life){
		//float r = random(vec2(gl_VertexID,u_time));
		float r = random(vec2(gl_InstanceID,u_time));

		// generate new particle
		v_position = vec2(r * 256.0, 0.0);
		v_velocity = vec2(0.0, -r);
		v_age = u_time;
	}else{
		// update particle
		v_velocity = a_velocity + vec2(0.0, 0.01);
		v_position = a_position + v_velocity;
		v_age = a_age;
	}

	gl_Position = vec4(u_matrix * vec3(v_position, 1), 1);
}`;
const PARTICLE_FS = `#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
   outColor = vec4(0.0, 0.0, 0.0, 1.0);
}`;

const PARTICLE_QUAD_VS = `#version 300 es
layout(location=0) in vec2 a_position;
layout(location=1) in vec2 a_uv;
layout(location=2) in vec2 a_offset;
layout(location=3) in float a_ageNorm;

uniform mat3 u_matrix;

out vec2 v_uv;
out float v_age;

void main() {
	v_uv = a_uv;
	v_age = a_ageNorm;

	gl_Position = vec4(u_matrix * vec3(a_position + a_offset, 1), 1);
}`;
const PARTICLE_QUAD_FS = `#version 300 es
precision mediump float;

in vec2 v_uv;
in float v_age;

out vec4 outColor;

void main() {
	outColor = vec4(0.0, 0.0, 0.0, 1.0);
}`;

const PARTICLE_COMPUTE_VS = `#version 300 es
layout(location=0) in vec2 a_offset;
layout(location=1) in vec2 a_velocity;
layout(location=2) in float a_age; // current age of particle in seconds
layout(location=3) in float a_ageNorm;
layout(location=4) in float a_life; // maximum age of particle

uniform float u_time;

out vec2 o_offset;
out vec2 o_velocity;
out float o_age;
out float o_ageNorm;

// -----------------------------------
highp float random(vec2 co){
	highp float a = 12.9898;
	highp float b = 78.233;
	highp float c = 43758.5453;
	highp float dt = dot(co.xy ,vec2(a,b));
	highp float sn = mod(dt,3.14);
	return fract(sin(sn) * c);
}
// ------------------------------------

void main() {
	float age = u_time - a_age;

	if(age > a_life){
		//float r = random(vec2(gl_VertexID,u_time));
		float r = random(vec2(gl_InstanceID,u_time));

		// generate new particle
		o_offset = vec2(r * 256.0, 0.0);
		o_velocity = vec2(0.0, -r);
		o_age = u_time;
		o_ageNorm = 0.0;
	}else{
		// update particle
		o_velocity = a_velocity + vec2(0.0, 0.01);
		o_offset = a_offset + o_velocity;
		o_age = a_age;
		o_ageNorm = age / a_life;
	}
}`;
const PARTICLE_COMPUTE_FS = `#version 300 es
void main() { }`;

class Material {
	constructor(vs, fs, transFeedbackVars) {
		this.buffers = [];
		let vsShader = this.getShader(vs, gl.VERTEX_SHADER);
		let fsShader = this.getShader(fs, gl.FRAGMENT_SHADER);

		if (vsShader && fsShader) {
			this.program = gl.createProgram();
			gl.attachShader(this.program, vsShader);
			gl.attachShader(this.program, fsShader);

			// setup Transform Feedback Varying Vars before linking
			if (transFeedbackVars !== undefined && transFeedbackVars != null) {
				gl.transformFeedbackVaryings(this.program, transFeedbackVars, gl.SEPARATE_ATTRIBS); // could replace with INTERLEAVED_ATTRIBS
			}

			gl.linkProgram(this.program);

			if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
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

		while (isUniform < 2) {
			let paramType = isUniform ? gl.ACTIVE_UNIFORMS : gl.ACTIVE_ATTRIBUTES;
			let count = gl.getProgramParameter(this.program, paramType);

			for (let i = 0; i < count; i++) {
				let details;
				let location;
				if (isUniform) {
					details = gl.getActiveUniform(this.program, i);
					location = gl.getUniformLocation(this.program, details.name);
				} else {
					details = gl.getActiveAttrib(this.program, i);
					location = gl.getAttribLocation(this.program, details.name);
				}

				this.parameters[details.name] = {
					location: location,
					uniform: !!isUniform,
					type: details.type
				}
			}
			isUniform++;
		}
	}

	set(name, a, b, c, d, e) {
		if (name in this.parameters) {
			let param = this.parameters[name];
			if (param.uniform) {
				switch (param.type) {
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

				if (a == undefined) a = gl.FLOAT;
				if (b == undefined) b = false;
				if (c == undefined) c = 0;
				if (d == undefined) d = 0;

				switch (param.type) {
					case gl.FLOAT: gl.vertexAttribPointer(param.location, 1, a, b, c, d); break;
					case gl.FLOAT_VEC2: gl.vertexAttribPointer(param.location, 2, a, b, c, d); break;
					case gl.FLOAT_VEC3: gl.vertexAttribPointer(param.location, 3, a, b, c, d); break;
					case gl.FLOAT_VEC4: gl.vertexAttribPointer(param.location, 4, a, b, c, d); break;
				}
			}
		}
	}

	getShader(script, type) {
		var output = gl.createShader(type);
		gl.shaderSource(output, script);
		gl.compileShader(output);

		if (!gl.getShaderParameter(output, gl.COMPILE_STATUS)) {
			console.error("Shader Error: \n" + gl.getShaderInfoLog(output));
			return null;
		}

		return output;
	}
}

export let materials = {
	default: new Material(SPRITE_VS, SPRITE_FS),
	particle: new Material(PARTICLE_VS, PARTICLE_FS, ["v_position", "v_velocity", "v_age"]),
	particleQuad: new Material(PARTICLE_QUAD_VS, PARTICLE_QUAD_FS),
	particleCompute: new Material(PARTICLE_COMPUTE_VS, PARTICLE_COMPUTE_FS, [ "o_offset", "o_velocity", "o_age", "o_ageNorm" ])
};
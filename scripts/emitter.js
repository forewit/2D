import { elm, gl, camera } from "./gl.js";

export class Emitter {
    constructor(ID) {
        this.drawMode = gl.POINTS;

        // define defaults
        var aPos = new Float32Array ([0,0,  0,0,  0,0]);
        var aVel = new Float32Array ([0,1,  0,1,  0,1]);
        var aAge = new Float32Array ([-9000, -9000, -9000]);
        var aLife = new Float32Array ([8000, 5000, 3000]); // age in ms

        var aVao = [gl.createVertexArray(), gl.createVertexArray()];
        var aTFB = [gl.createTransformFeedback(), gl.createTransformFeedback()];

        this.vao = aVao;
        this.tFeedback = aTFB;
        this.totalParticles = aLife.length;

        var v = [null, null]
        this.bufs = v;

        // setup buffers
        for (var i=0; i < aVao.length; i++) {
            v[i] = {
                bPosition: gl.createBuffer(),
                bVelocity: gl.createBuffer(),
                bAge: gl.createBuffer(),
                bLife: gl.createBuffer()
            }
            // --------------------------------
            gl.bindVertexArray(aVao[i]);

            // --------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, v[i].bPosition);
            gl.bufferData(gl.ARRAY_BUFFER, aPos, gl.STREAM_COPY);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            // --------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, v[i].bVelocity);
            gl.bufferData(gl.ARRAY_BUFFER, aVel, gl.STREAM_COPY);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            // --------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, v[i].bAge);
            gl.bufferData(gl.ARRAY_BUFFER, aAge, gl.STREAM_COPY);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            // --------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, v[i].bLife);
            gl.bufferData(gl.ARRAY_BUFFER, aLife, gl.STREAM_COPY);
            gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            // --------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, aTFB[i]);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, v[i].bPosition);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, v[i].bVelocity);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, v[i].bAge);
            gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 3, v[i].bLife);

            gl.bindVertexArray(null);
        }

        this.vaoCurrent = 0;
    }

    render() {
        var i = (this.vaoCurrent + 1) % 2; // alternate between the VAOs
        var vaoSource = this.vao[this.vaoCurrent];
        var tFeedback = this.tFeedback[i];

        gl.bindVertexArray(vaoSource);
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tFeedback);

            
    }
}


// v_position, v_velocity, v_age, v_life
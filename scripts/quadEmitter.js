// https://www.youtube.com/watch?v=PWjIeJDE7Rc

/**
 * SETUP TRANSFORM FEEDBACK
 * -- WE NEED TWO SETS OF READ AND WRITE HANDLERS TO ALTERNATE AT EVERY OTHER FRAME
 * -- SETUP A VAO TO READ FROM BUFFERS
 * -- SETUP FEEDBACK TO WRITE TO THE BUFFERS
 * 
 * SETUP RENDERING
 * -- 
 */

import { elm, gl, camera } from "./gl.js";
import { materials } from "./materials.js";
import { m3 } from "./math.js";

export class quadEmitter {
    constructor(ID) {
        this.ID = ID;
        this.quadMaterial = materials.particleQuad;
        this.computeMaterial = materials.particleCompute;
        this.x = 256;
        this.y = 64;
        this.scale_x = 1.0;
        this.scale_y = 1.0;

        this.vaoCount = 0; // how many verticies in one particle
        this.instanceCount = 0; // how many particles to render
        this.currentIdx = 0; // alternates between 0 and 1

        this.setup_buffers();
    }
    setup_buffers() {
        var ABUF = gl.ARRAY_BUFFER;
        var EBUF = gl.ELEMENT_ARRAY_BUFFER;
        var TFBUF = gl.TRANSFORM_FEEDBACK_BUFFER;
        var SDRAW = gl.STATIC_DRAW;
        var DCOPY = gl.DYNAMIC_COPY;
        var FL = gl.FLOAT;

        var rFeedback = [gl.createVertexArray(), gl.createVertexArray()];	//Read is just VAO
        var wFeedback = [gl.createTransformFeedback(), gl.createTransformFeedback()];

        this.readFeedback = rFeedback;
        this.writeFeedback = wFeedback;

        //Reusable Buffers
        var cnt = 100;
        var bOffset = [gl.createBuffer(), gl.createBuffer()];
        var locOffset = 0;
        var bVelocity = [gl.createBuffer(), gl.createBuffer()];
        var locVelocity = 1;

        var bAge = [gl.createBuffer(), gl.createBuffer()];
        var aAge = new Float32Array(cnt);
        var locAge = 2;

        var bAgeNorm = [gl.createBuffer(), gl.createBuffer()];
        var aAgeNorm = new Float32Array(cnt);
        var locAgeNorm = 3;

        var bLife = [gl.createBuffer(), gl.createBuffer()];
        var aLife = new Float32Array(cnt);
        var locLife = 4;

        for (var i = 0; i < cnt; i++) {
            aLife[i] = (2000 * Math.random()) + 1000;
            aAge[i] = -9000;
        }

        this.instanceCount = cnt;

        //........................................................
        //CREATE FEEDBACK
        for (var i = 0; i < 2; i++) {
            gl.bindVertexArray(rFeedback[i]);

            //OFFSET - EMPTY
            gl.bindBuffer(ABUF, bOffset[i]);
            gl.bufferData(ABUF, this.instanceCount * 2 * 4, DCOPY); // count * 2 items (x, y) * 4 bytes per float
            gl.vertexAttribPointer(locOffset, 2, FL, false, 0, 0);
            gl.enableVertexAttribArray(locOffset);

            //VELOCITY - EMPTY
            gl.bindBuffer(ABUF, bVelocity[i]);
            gl.bufferData(ABUF, this.instanceCount * 2 * 4, DCOPY); // count * 2 items (x, y) * 4 bytes per float
            gl.vertexAttribPointer(locVelocity, 2, FL, false, 0, 0);
            gl.enableVertexAttribArray(locVelocity);

            //AGE
            gl.bindBuffer(ABUF, bAge[i]);
            gl.bufferData(ABUF, aAge, DCOPY);
            gl.vertexAttribPointer(locAge, 1, FL, false, 0, 0);
            gl.enableVertexAttribArray(locAge);

            //AGE NORM - EMPTY
            gl.bindBuffer(ABUF, bAgeNorm[i]);
            gl.bufferData(ABUF, this.instanceCount * 4, DCOPY);
            gl.vertexAttribPointer(locAgeNorm, 1, FL, false, 0, 0);
            gl.enableVertexAttribArray(locAgeNorm);

            //LIFE
            gl.bindBuffer(ABUF, bLife[i]);
            gl.bufferData(ABUF, aLife, SDRAW); // SDRAW -- because life isn't changing
            gl.vertexAttribPointer(locLife, 1, FL, false, 0, 0);
            gl.enableVertexAttribArray(locLife);

            //CLEANUP
            gl.bindVertexArray(null);
            gl.bindBuffer(ABUF, null);

            //Setup Transform Feedback
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, wFeedback[i]);
            gl.bindBufferBase(TFBUF, locOffset, bOffset[i]); //Feedback
            gl.bindBufferBase(TFBUF, locVelocity, bVelocity[i]); //Feedback
            gl.bindBufferBase(TFBUF, locAge, bAge[i]); //Feedback
            gl.bindBufferBase(TFBUF, locAgeNorm, bAgeNorm[i]); //Feedback
            gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
            //gl.bindBufferBase(TFBUF, 0, null);
        }

        //........................................................
        //CREATE RENDER VAO
        var vaoRender = [gl.createVertexArray(), gl.createVertexArray()];
        this.vaoRender = vaoRender;

        //-----------------------	
        //Index					
        var bIndex = gl.createBuffer();
        var aIndex = new Uint16Array([0, 1, 2, 2, 3, 0]);

        gl.bindBuffer(EBUF, bIndex);
        gl.bufferData(EBUF, aIndex, SDRAW);

        this.vaoCount = aIndex.length;

        //-----------------------
        //Vertices
        var bVertices = gl.createBuffer();
        var aVert = new Float32Array([
            -5.0, -5.0,
            5.0, -5.0,
            5.0, 5.0,
            -5.0, 5.0,
        ]);

        var locVert = 0;
        gl.bindBuffer(ABUF, bVertices);
        gl.bufferData(ABUF, aVert, SDRAW);

        //-----------------------
        //Vertices
        var bUV = gl.createBuffer();
        var aUV = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);

        var locUV = 1;
        gl.bindBuffer(ABUF, bUV);
        gl.bufferData(ABUF, aUV, SDRAW);


        //-----------------------
        //Setup VAOs for Rendering
        locOffset = 2;
        locAgeNorm = 3;
        for (var i = 0; i < 2; i++) {
            gl.bindVertexArray(vaoRender[i]);

            //INDEX
            gl.bindBuffer(EBUF, bIndex);

            //VERTICES
            gl.bindBuffer(ABUF, bVertices);
            gl.vertexAttribPointer(locVert, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(locVert);

            //UVs
            gl.bindBuffer(ABUF, bUV);
            gl.vertexAttribPointer(locUV, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(locUV);

            //OFFSET
            gl.bindBuffer(ABUF, bOffset[i]);
            gl.vertexAttribPointer(locOffset, 2, FL, false, 0, 0);
            gl.enableVertexAttribArray(locOffset);
            gl.vertexAttribDivisor(locOffset, 1); //instanced

            //AGE NORM
            gl.bindBuffer(ABUF, bAgeNorm[i]);
            gl.vertexAttribPointer(locAgeNorm, 1, FL, false, 0, 0);
            gl.enableVertexAttribArray(locAgeNorm);
            gl.vertexAttribDivisor(locAgeNorm, 1); //instanced

            //CLEANUP
            gl.bindVertexArray(null);
            gl.bindBuffer(EBUF, null);
            gl.bindBuffer(ABUF, null);
        }
    }

    destroy() {
        //TODO: delete buffers
    }

    render(options) {
        var nextIdx = (this.currentIdx + 1) % 2;
        var vaoTFRead = this.readFeedback[this.currentIdx];
        var vaoTFWrite = this.writeFeedback[nextIdx];

        // ---------------------------
        // Compute Shader
        gl.useProgram(this.computeMaterial.program);

        this.computeMaterial.set("u_time", options.time);

        gl.bindVertexArray(vaoTFRead);                                  // READ FROM
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, vaoTFWrite);    // WRITE TO
        gl.enable(gl.RASTERIZER_DISCARD)                                // Disable fragment shader

        gl.beginTransformFeedback(gl.POINTS);                           // Begin feedback process
        gl.drawArrays(gl.POINTS, 0, this.instanceCount);                // Execute feedback shader
        gl.endTransformFeedback();                                      // End feedback process

        gl.disable(gl.RASTERIZER_DISCARD);                              // Enable fragment shader
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);          // Cleanup


        // ---------------------------
        // Render Quad Shader
        gl.useProgram(this.quadMaterial.program);

        let translation = m3.translation(this.x - camera.x, this.y - camera.y)
        let scaling = m3.scaling(this.scale_x, this.scale_y);
        let projection = m3.projection(elm.width, elm.height);
        let matrix = m3.multiply(projection, translation);
        matrix = m3.multiply(matrix, scaling);

        this.quadMaterial.set("u_matrix", matrix);

        gl.bindVertexArray(this.vaoRender[nextIdx]); // Alternate between two render VAOs
        gl.drawElementsInstanced(gl.TRIANGLES, this.vaoCount, gl.UNSIGNED_SHORT, 0, this.instanceCount);


        // ---------------------------
        // Cleanup
        gl.bindVertexArray(null);
        this.currentIdx = nextIdx; // Next frame to use the other feedback and render VAOs
    }
}


// v_position, v_velocity, v_age, v_life
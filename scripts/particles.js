import { elm, gl, camera } from "./gl.js";

export class Particles {
    constructor(ID) {
        this.ID = ID;
        this.count = 100; // number of particles
        this.lifespan = 1000; // duration in ms
        this.acceleration_x = 0;
        this.acceleration_y = -4;

        /**
         * Points:
         * [
         *  x1, y1, vx1, vy1, age1,
         *  x2, y2, vx1, vy1, age,
         *  ... 
         * ]
         * 
         * new position, opacity, and color are
         * calculated each frame.
         */
        this.points = new Float32Array(count * 5);

        this.decay_function = function(index) {
            let i = index * 5;

            let x = this.points[i];
            let y = this.points[i + 1];
            let vx = this.points[i + 2];
            let vy = this.points[i + 3];
            let age = this.points[i + 4];


            // opacity
            // position
            // color

            if (this.points[index * 3])

        }
    }
}
/**
 * Creates a psudo random unique identifier string
 * 
 * @returns {string} randomized unique ID
 */
export function generate_ID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Creates an array of 6 points that describe the two
 * triangles that make up a rectangle
 * 
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} w Width
 * @param {Number} h Height
 * @returns {Float32Array} a new rectangle array
 */
export function createRectArray(x = 0, y = 0, w = 1, h = 1) {
    return new Float32Array([
        x, y,
        x + w, y,
        x, y + h,
        x, y + h,
        x + w, y,
        x + w, y + h
    ]);
}

/**
 * Linear interpolation function
 * Example: lerp(0, 100, 0.5) == 50
 * 
 * @param {Number} a range start
 * @param {Number} b range end
 * @param {Number} c amount (0.0 - 1.0)
 */
export function lerp(a, b, c) {
    return a + c * (b - a);
}

/**
 * Remaps a value from a given range (a) to another 
 * range (b). Example: remap(20, 0, 100, 0, 1) == 0.2
 * 
 * @param {Number} x value
 * @param {Number} a1 range a start
 * @param {Number} a2 range a end
 * @param {Number} b1 range b start
 * @param {Number} b2 range b end
 */
export function remap(x, a1, a2, b1, b2) {
    return b1 + (x - a1) / (a2 - a1) * (b2 - b1);
}
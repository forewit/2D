import { materials } from "./materials.js";
import { gl } from "./gl.js";

export class Sprite {
    constructor(ID, URL) {
        this.ID = ID;
        this.isLoaded = false;
        this.material = materials.default;
    }
    
    destroy() {}
}
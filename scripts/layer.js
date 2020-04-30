import * as utils from "./utils.js";
import { Sprite } from "./sprite.js";

export class Layer {
    constructor(ID) {
        this.ID = ID;
        this.sprites = [];
        this.opacity = 1.0;
    }

    addSprite(URL, material) {
        let ID = utils.generate_ID();
        this.sprites[ID] = new Sprite(ID, URL);
        return ID;
    }
    removeSprite(ID) {
        this.sprites[ID].destroy();
        return delete this.sprites[ID];
    }

    destroy() {
        for (const i in this.sprites) {
            this.removeSprite(this.sprites[i].ID);
        }
    }
}
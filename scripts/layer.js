import * as utils from "./math.js";
import { Sprite } from "./sprite.js";

export class Layer {
    constructor(ID) {
        this.ID = ID;
        this.sprites = [];
        this.opacity = 1.0;
        this.sortedSprites = [];
    }

    addSprite(URL) {
        let ID = utils.generate_ID();
        this.sprites[ID] = new Sprite(ID, URL);
        this.sortedSprites.push(ID);
        return ID;
    }

    removeSprite(ID) {
        this.sprites[ID].destroy();
        for (const i in this.sortedSprites) {
            if (this.sortedSprites[i] == ID) {
                this.sortedSprites.splice(i, 1);
                return;
            }
        }
        return delete this.sprites[ID];
    }

    destroy() {
        for (const i in this.sprites) {
            this.removeSprite(this.sprites[i].ID);
        }
    }

    bringForward(spriteID) {
        console.log(spriteID);
        for (const i in this.sortedSprites) {
            if (this.sortedSprites[i] == spriteID) {
                this.sortedSprites.splice(i, 1);
                this.sortedSprites.push(spriteID);
                return;
            }
        }
    }

    sendBackward(spriteID) {
        for (const i in this.sortedSprites) {
            if (this.sortedSprites[i] == spriteID) {
                this.sortedSprites.splice(i, 1);
                this.sortedSprites.unshift(spriteID);
                return;
            }
        }
    }

    render(camera) {
        for (const i in this.sortedSprites) {
            let ID = this.sortedSprites[i];
            this.sprites[ID].render(camera, this.opacity);
        }
    }
}
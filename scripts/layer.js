import * as utils from "./math.js";
import { Sprite } from "./sprite.js";

export class Layer {
    constructor(ID) {
        this.ID = ID;
        this.sprites = [];
        this.opacity = 1.0;
        this.sortedSpriteIDs = [];
    }

    addSprite(URL) {
        let ID = utils.generate_ID();
        this.sprites[ID] = new Sprite(ID, URL);
        this.sortedSpriteIDs.push(ID);
        return ID;
    }

    removeSprite(ID) {
        this.sprites[ID].destroy();
        for (const i in this.sortedSpriteIDs) {
            if (this.sortedSpriteIDs[i] == ID) {
                this.sortedSpriteIDs.splice(i, 1);
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
        for (const i in this.sortedSpriteIDs) {
            if (this.sortedSpriteIDs[i] == spriteID) {
                this.sortedSpriteIDs.splice(i, 1);
                this.sortedSpriteIDs.push(spriteID);
                return;
            }
        }
    }

    sendBackward(spriteID) {
        for (const i in this.sortedSpriteIDs) {
            if (this.sortedSpriteIDs[i] == spriteID) {
                this.sortedSpriteIDs.splice(i, 1);
                this.sortedSpriteIDs.unshift(spriteID);
                return;
            }
        }
    }

    intersections(x, y) {
        let point = center = intersections = [];
        let halfW = halfH = 0;

        for (const i in this.sortedSpriteIDs) {
            let sprite = this.sprites[this.sortedSpriteIDs[i]];

            point = utils.rotatePoint(sprite.x, sprite.y, x, y, -sprite.rotation);
            center = [sprite.x, sprite.y];
            halfW = sprite.frame_w * sprite.scale_x / 2;
            halfH = sprite.frame_h * sprite.scale_y / 2;

            if (point[0] >= center[0] - halfW && point[0] <= center[0] + halfW &&
                point[1] >= center[1] - halfH && point[1] <= center[1] + halfH) {
                intersections.push(spriteID);
            }
        }
        
        return intersections;
    }

    render(camera) {
        for (const i in this.sortedSpriteIDs) {
            let ID = this.sortedSpriteIDs[i];
            this.sprites[ID].render(camera, this.opacity);
        }
    }
}
import * as utils from "./math.js";
import { Sprite } from "./sprite.js";
import { Emitter } from "./emitter.js";
import { camera } from "./gl.js";

export class Layer {
    constructor(ID) {
        this.ID = ID;
        this.sprites = [];
        this.opacity = 1.0;
        this.sortedSpriteIDs = [];

        // objects must have a render and destroy function
        this.objects = [];
    }

    addEmitter() {
        let ID = utils.generate_ID();
        let emitter = new Emitter(ID);
        this.objects.push(emitter);
        return emitter;
    }

    addSprite(URL) {
        let ID = utils.generate_ID();
        let sprite = new Sprite(ID, URL);
        this.objects.push(sprite);
        return sprite;
    }

    destroyObject(object) {
        for (var i = 0, len = this.objects.length; i < len; i++) {
            if (this.objects[i].ID == object.ID) {
                this.objects[i].destroy();
                this.objects.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    destroy() {
        // destroy objects
        for (var i = 0, len = this.objects.length; i < len; i++) {
            this.objects[i].destroy();
        }
        // clear objects array
        this.objects.length = 0;
    }

    bringForward(object) {
        for (var i = 0, len = this.objects.length; i < len; i++) {
            if (this.objects[i].ID == object.ID) {
                this.objects.splice(i, 1);
                this.objects.push(object);
                return true;
            }
        }
        return false;
    }

    sendBackward(object) {
        for (var i = 0, len = this.objects.length; i < len; i++) {
            if (this.objects[i].ID == object.ID) {
                this.objects.splice(i, 1);
                this.objects.unshift(object);
                return true;
            }
        }
        return false;
    }

    intersections(x, y) {
        let point = center = intersections = [];
        let halfW = halfH = 0;

        for (var i = 0, len = this.objects.length; i < len; i++) {
            let object = this.objects[i];

            switch (object.constructor.name) {
                case "Sprite":
                    // check for Sprite intersections
                    point = utils.rotatePoint(
                        object.x, object.y,
                        x + camera.x, y + camera.y,
                        -object.rotation
                    );
                    center = [object.x, object.y];
                    halfW = object.frame_w * object.scale_x / 2;
                    halfH = object.frame_h * object.scale_y / 2;

                    if (point[0] >= center[0] - halfW && point[0] <= center[0] + halfW &&
                        point[1] >= center[1] - halfH && point[1] <= center[1] + halfH) {
                        intersections.push(object);
                    }
                    break;

                case "Emitter":
                    // check for Emitter intersections
                    break;

                default:
                    console.log("Invalid object type for intersections!");
                    break;
            }


        }

        return intersections;
    }

    render(time) {
        for (var i = 0, len = this.objects.length; i < len; i++) {
            // Emitters and Sprites accept the same render args
            this.objects[i].render({ opacity: this.opacity, time: time });
        }
    }
}
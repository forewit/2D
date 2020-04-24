class Layer {
    constructor(canvas, options) {
        this.canvas = canvas;

        this.ID = GENERATE_ID(); // util.js
        this.sprites = [];

        this.depth = ("depth" in options) ? options.depth : 1;
        this.fade_enabled = ("fade_enabled" in options) ? options.fade_enabled : false;
        this.fade_start = ("fade_start" in options) ? options.fade_start : 0;
        this.fade_end = ("fade_end" in options) ? options.fade_end : 0;
        this.worldSpaceMatrix = mat3.create();
    }

    destroy() {
        for (const i in this.sprites) {
            this.remove_sprite(this.sprites[i]);
        }
    }

    add_sprite(url, options = {}) {
        var sprite = new Sprite(this, url, options);
        this.sprites[sprite.ID] = sprite;
        return sprite;
    }

    remove_sprite(sprite) {
        sprite.destroy();
        delete this.sprites[sprite.ID];
    }

    /**
     * TODO: intersections
     */
    intersections(p1, p2) {
        let intersections = [];

        // adjust for canvas position and canvas scale
        var offset = new Point();
        var coords = new Point(p1.x - offset.x, p1.y - offset.y);
        var coords2 = (p2) ? new Point(p2.x - offset.x, p2.y - offset.y) : undefined;

        for (const i in this.sprites) {
            var sprite = this.sprites[i];
            var size = new Point(
                sprite.size.x * sprite.scale,
                sprite.size.y * sprite.scale
            );

            if (coords2) {
                var center = new Point(sprite.position.x - size.x, sprite.position.y - pos.y);
                if (((center.x > coords.x && center.x < coords2.x) ||
                    (center.x < coords.x && center.x > coords2.x)) &&
                    ((center.y > coords.y && center.y < coords2.y) ||
                        (center.y < coords.y && center.y > coords2.y))) {
                    intersections.push(sprite);
                    console.log("sprite in intersection box!");
                }
            } else if (coords.x > sprite.position.x && coords.x < sprite.position.x + size.x &&
                coords.y > sprite.position.y && coords.y < sprite.position.y + size.y) {
                intersections.push(sprite);
            }
        }

        return intersections;
    }
}
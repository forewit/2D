class Layer {
    constructor(canvas, options) {
        this.canvas = canvas;

        this.ID = GENERATE_ID(); // util.js
        this.sprites = [];

        this.parallax_multiplier = ("parallax_multiplier" in options) ? options.parallax_multiplier : new Point(1, 1);
        this.fade_enabled = ("fade_enabled" in options) ? options.fade_enabled : false;
        this.fade_start = ("fade_start" in options) ? options.fade_start : 0;
        this.fade_end = ("fade_end" in options) ? options.fade_end : 0;
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

    intersections(coords, coords2) {
        var intersections = [];

        for (const i in this.sprites) {
            var sprite = this.sprites[i];
            var pos = sprite.position;
            var size = new Point(
                sprite.size.x * sprite.scale.x,
                sprite.size.y * sprite.scale.y
            );

            if (coords2) {
                var center = new Point(pos.x - size.x, pos.y - pos.y);
                if (((center.x > coords.x && center.x < coords2.x) ||
                    (center.x < coords.x && center.x > coords2.x)) &&
                    ((center.y > coords.y && center.y < coords2.y) ||
                        (center.y < coords.y && center.y > coords2.y))) {
                    intersections.push(sprite);
                    console.log("sprite in intersection box!");
                }
            } else if (coords.x > pos.x && coords.x < pos.x + size.x &&
                coords.y > pos.y && coords.y < pos.y + size.y) {
                intersections.push(sprite);
            }
        }

        return intersections;
    }

    // update function?

    render() {
        for (const i in this.sprites) {
            this.sprites[i].render();
        }
    }
}
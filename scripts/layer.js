class Layer {
    constructor(canvas, options) {
        this.canvas = canvas;

        this.ID = GENERATE_ID(); // util.js
        this.sprites = [];

        this.parallax_multiplier = ("parallax_multiplier" in options) ? options.parallax_multiplier : new Point(1, 1);
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

    intersections(p1, p2) {
        let intersections = [];

        // adjust for canvas position and canvas scale
        var canvasPos = new Point(
            this.canvas.position.x * this.parallax_multiplier.x * this.canvas.scale.x,
            this.canvas.position.y * this.parallax_multiplier.y * this.canvas.scale.y
        );

        // adjust for sprite position and scale
        for (const i in this.sprites) {
            var sprite = this.sprites[i];

            var spritePos = new Point(
                canvasPos.x + sprite.position.x,
                canvasPos.y + sprite.position.y
            );

            // check if p1 inside sprite

            // check if p1-p2 rect contains sprite
        }
    }
}
class Canvas {
    constructor(elm) {
        this.canvasElm = elm;

        this.gl = this.canvasElm.getContext("webgl2");

        if (this.gl && this.gl instanceof WebGL2RenderingContext) {
            LOG_DIV.innerHTML = "webgl 2 enabled";
        } else {
            LOG_DIV.innerHTML = "webgl 2 disabled";
        }

        this.gl.clearColor(0.4, 0.6, 1.0, 1.0);
        this.projectionMatrix = mat3.create();
        this.position = new Point();
        this.scale = 1;
        this.layers = [];
    }

    resize() {
        this.canvasElm.width = window.innerWidth;
        this.canvasElm.height = window.innerHeight;

        this.projectionMatrix = mat3.make2DProjection(
            this.canvasElm.width,
            this.canvasElm.height
        );

        this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
        this.update();
    }

    zoom(mouse, scaleFactor) {
        this.position.x += mouse.x / (this.scale * scaleFactor) - mouse.x / this.scale;
        this.position.y += mouse.y / (this.scale * scaleFactor) - mouse.y / this.scale;

        this.scale *= scaleFactor;
    }

    add_layer(options = {}) {
        var layer = new Layer(this, options);
        this.layers[layer.ID] = layer;
        this.update();
        return layer;
    }

    remove_layer(layer) {
        layer.destroy();
        delete this.layers[layer.ID];
        this.update()
    }

    update() {
        // parallax
        for (const i in this.layers) {
            var layer = this.layers[i];

            // scale
            mat3.scale(
                layer.worldSpaceMatrix,
                this.projectionMatrix,
                [this.scale, this.scale]
            );

            // translate
            mat3.translate(
                layer.worldSpaceMatrix,
                layer.worldSpaceMatrix,
                [this.position.x, this.position.y]
            );
        }
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        for (const i in this.layers) {
            for (const j in this.layers[i].sprites) {
                this.layers[i].sprites[j].render();
            }
        }

        this.gl.flush();
    }

    // load game JSON
    load_json(url, callback) {

    }

    // save game as JSON
    save_json() {

    }
}
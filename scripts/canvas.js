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
        this.worldSpaceMatrix = mat3.create();
        this.position = new Point();
        this.scale = new Point(0.5, 0.5);
        this.layers = [];
    }

    resize(w, h) {
        this.canvasElm.width = w;
        this.canvasElm.height = h;

        this.update();

        this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
    }

    add_layer(options = {}) {
        var layer = new Layer(this, options);
        this.layers[layer.ID] = layer;
        return layer;
    }

    remove_layer(layer) {
        layer.destroy();
        delete this.layers[layer.ID];
    }

    get_coords(point) {
        return  new Point(
            (point.x) / this.scale.x,
            (point.y) / this.scale.y
        );
    }

    update() {
        // translate and scale to screen
        mat3.identity(this.worldSpaceMatrix);
        mat3.translate(this.worldSpaceMatrix, this.worldSpaceMatrix, [-1, 1]);
        mat3.scale(this.worldSpaceMatrix, this.worldSpaceMatrix, [2 / this.canvasElm.width, -2 / this.canvasElm.height]);

         // position
         mat3.translate(this.worldSpaceMatrix, this.worldSpaceMatrix, [this.position.x, this.position.y]);

         // scale
         mat3.scale(this.worldSpaceMatrix, this.worldSpaceMatrix, [this.scale.x, this.scale.y]);

         // lock position of all sprites in selection
         // update all sprites??
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        for (const i in this.layers) {
            this.layers[i].render();
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
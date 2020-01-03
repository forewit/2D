VS_01 = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    uniform mat3 u_world;
    uniform mat3 u_object;
    uniform vec2 u_frame;

    varying vec2 v_texCoord;
    void main(){
        gl_Position = vec4( u_world * u_object * vec3(a_position, 1), 1);
        v_texCoord = a_texCoord + u_frame;
    }
`;

FS_01 = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    
    void main(){
        gl_FragColor = texture2D(u_image, v_texCoord);
    }
`;

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
        this.position = new Point(0, 0);
        this.scale = new Point(0.5, 0.5);
        this.layers = [];
    }

    resize(w, h) {
        this.canvasElm.width = w;
        this.canvasElm.height = h;

        this.update();

        this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
    }

    add_sprite(url, layer, options = {}) {
        var ID = GENERATE_ID(); // util.js
        var sprite = new Sprite(ID, this, layer, this.gl, url, VS_01, FS_01, options);
        
        layer.sprites[ID] = sprite;
        return sprite;
    }

    remove_sprite(sprite) {
        sprite.destroy();
        delete sprite.layer.sprites[sprite.ID];
    }

    add_layer(options = {}) {
        var ID = GENERATE_ID(); // util.js
        var parallax_multiplier = ("parallax_multiplier" in options) ? options.parallax_multiplier : new Point(1, 1);
        var fade_enabled = ("fade_enabled" in options) ? options.fade_enabled : false;
        var fade_start = ("fade_start" in options) ? options.fade_start : 0;
        var fade_end = ("fade_end" in options) ? options.fade_end : 0;

        var layer = {
            ID: ID,
            parallax_multiplier: parallax_multiplier, // parallax position multiplier
            fade_enabled: fade_enabled,
            fade_start: fade_start, // zoom level that fade starts
            fade_end: fade_end, // zoom level that fade ends
            sprites: [] // always initializes empty
        }

        this.layers[ID] = layer;
        return layer;
    }

    remove_layer(layer) {
        for (const i in layer.sprites) {
            this.remove_sprite(layer.sprites[i]);
        }
        delete this.layers[layer.ID];
    }

    // returns all sprites in a layer that intersect a given point
    intersections(point, layer) {
        var intersections = [];
        for (i in layer.sprites) {
            var sprite = layer.sprites[i];
            var pos = sprite.position;
            var size = sprite.size;
            
            if (point.x > pos.x && point.x < pos.x + size.x &&
                point.y > pos.y && point.y < pos.y + size.y) {
                    intersections.push(sprite);
            }
        }
        return intersections;
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

    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // render each layer's sprites
        for (const i in this.layers) {
            var layer = this.layers[i];
            for (const j in layer.sprites) {
                layer.sprites[j].render();
            }
        }

        this.gl.flush();
    }
}
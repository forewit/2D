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
    constructor() {
        this.canvasElm = document.createElement("canvas");
        document.body.appendChild(this.canvasElm);

        this.gl = this.canvasElm.getContext("webgl2");

        if (this.gl && this.gl instanceof WebGL2RenderingContext) {
            LOG_DIV.innerHTML = "webgl 2 enabled";
        } else {
            LOG_DIV.innerHTML = "webgl 2 disabled";
        }

        this.gl.clearColor(0.4, 0.6, 1.0, 1.0);
        this.worldSpaceMatrix = mat3.create();
        this.layers = [
            {
                parallax_multiplier: new Point(1, 1), // parallax position multiplier
                fade_enabled: false,
                fade_start: 0, // zoom level that fade starts
                fade_end: 0, // zoom level that fade ends
                sprites: [] // contains all sprites on the layer
            }
        ];
    }

    resize(w, h) {
        this.canvasElm.width = w;
        this.canvasElm.height = h;

        mat3.identity(this.worldSpaceMatrix);
        mat3.translate(this.worldSpaceMatrix, this.worldSpaceMatrix, [-1, 1]);
        mat3.scale(this.worldSpaceMatrix, this.worldSpaceMatrix, [1 / w, -1 / h]);

        this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
    }

    add_sprite(url, layer, options) {
        var ID = GENERATE_ID();
        var sprite = new Sprite(ID, this.gl, url, VS_01, FS_01, options);
        sprite.layer = layer;

        this.layers[layer].sprites[ID] = sprite;

        return sprite;
    }

    remove_sprite(sprite) {
        sprite.destroy();
        delete this.layers[sprite.layer].sprites[sprite.ID];
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        for (const i in this.layers) {
            var layer = this.layers[i];
            for (const j in layer.sprites) {
                layer.sprites[j].render();
            }
        }

        this.gl.flush();
    }
}
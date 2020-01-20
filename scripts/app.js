LOG_DIV = document.getElementById("log");
FPS_DIV = document.getElementById("fps");
LOADER_DIV = document.getElementById("loader");

let canvas;

function init() {
    // create canvas
    var elm = document.getElementById("canvas");
    canvas = new Canvas(elm);
    canvas.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
        canvas.resize(window.innerWidth, window.innerHeight);
    });

    // create startup content
    layer1 = canvas.add_layer();
    fireball = layer1.add_sprite("./img/fireball.png", { scale: 1, width: 512, height: 512 });

    // start interactions
    Interactions.start(layer1);

    // start app update loop
    requestAnimationFrame(update_loop);
}

var FPS = 0;
var ticks = 0;
var lastFPS = 0;

function update_loop(delta) {
    requestAnimationFrame(update_loop);
    var perSec = delta / 1000;

    // updates
    fireball.frame.x = 10 * perSec % 6;
    fireball.update();

    // render
    canvas.render();

    // FPS counter
    var now = Date.now();
    if (now - lastFPS >= 1000) {
        lastFPS = now;
        FPS = ticks;
        ticks = 0;
    }
    ticks++;
    FPS_DIV.innerHTML = FPS;
}
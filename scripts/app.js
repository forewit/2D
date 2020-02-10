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
        canvas.resize();
    });

    // create startup content ****************
    layer1 = canvas.add_layer();
    layer2 = canvas.add_layer({parallax_multiplier: new Point (0.9, 0.5), parallax_scale: 0.5});
    fireball = layer1.add_sprite("./img/fireball.png", { x: 0, y: 0, scale: 1, size: new Point(512, 512)});
    fireball2 = layer2.add_sprite("./img/untitled2.png", { x: 0, y: 0, scale: 1, size: new Point(20, 20)});
    fireball3 = layer2.add_sprite("./img/untitled2.png", { x: 512, y: 512, scale: 1, size: new Point(20, 20)});

    // ***************************************

    // start interactions
    Interactions.start(layer2);

    // start app update loop
    canvas.update();
    requestAnimationFrame(update_loop); 
}

var FPS = 0;
var ticks = 0;
var lastFPS = 0;

function update_loop(delta) {
    requestAnimationFrame(update_loop);
    var perSec = delta / 1000;

    // updates *******************************
    fireball.frame.x = 10 * perSec % 6;
    fireball.update();

    canvas.update();
    canvas.render();
    // ***************************************

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
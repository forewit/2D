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
    layer2 = canvas.add_layer({offset_multiplier: new Point (0.9, 0.5), scale_multiplier: 1.5});
    fireball = layer1.add_sprite("./img/untitled.png", { x: 0, y: 0, scale: 1, size: new Point(512, 512)});
    corner1 = layer2.add_sprite("./img/untitled2.png", { x: 0, y: 0, scale: 1, size: new Point(20, 20)});
    corner2 = layer2.add_sprite("./img/untitled2.png", { x: canvas.canvasElm.width, y: canvas.canvasElm.height, scale: 1, size: new Point(-20, -20)});
    corner3 = layer2.add_sprite("./img/untitled2.png", { x: 0, y: canvas.canvasElm.height, scale: 1, size: new Point(20, -20)});
    corner4 = layer2.add_sprite("./img/untitled2.png", { x: canvas.canvasElm.width, y: 0, scale: 1, size: new Point(-20, 20)});
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
    //fireball.frame.x = 10 * perSec % 6;
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
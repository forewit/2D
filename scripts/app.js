LOG_DIV = document.getElementById("log");
FPS_DIV = document.getElementById("fps");
LOADER_DIV = document.getElementById("loader");

let canvas;

function init() {
    var elm = document.getElementById("canvas");
    canvas = new Canvas(elm);

    canvas.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
        canvas.resize(window.innerWidth, window.innerHeight);
    });

    layer1 = canvas.add_layer();
    layer2 = canvas.add_layer();
    this.fireball = canvas.add_sprite("./img/fireball.png", layer1, { width: 512, height: 512, scale: 0.5});
    this.fireball2 = canvas.add_sprite("./img/fireball.png", layer2, { width: 512, height: 512,  x: 0,  y: 0});

    pointer_control();
    requestAnimationFrame(update_loop);
}

var FPS = 0;
var ticks = 0;
var lastFPS = 0;

//  temp testing variables
var temp_removed = false;

function update_loop(delta) {
    requestAnimationFrame(update_loop);
    var perSec = delta / 1000;

    // update
    fireball.frame.x = 10 * perSec % 6;
    fireball.position.x = 100 * perSec;
    fireball2.frame.x = 10 * perSec % 6;

    if (perSec >= 5 && !temp_removed) {
        canvas.remove_layer(layer1);
        temp_removed = true;
        LOG_DIV.innerHTML = "Removed layer1";
    }
    fireball.update();
    fireball2.update();

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
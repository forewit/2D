LOG_DIV = document.getElementById("log");
FPS_DIV = document.getElementById("fps");
LOADER_DIV = document.getElementById("loader");

let canvas;

function init() {
    canvas = new Canvas();

    canvas.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
        canvas.resize(window.innerWidth, window.innerHeight);
    });

    layer1 = canvas.add_layer();
    this.fireball = canvas.add_sprite("./img/fireball.png", layer1, { width: 512, height: 512 });
    this.fireball2 = canvas.add_sprite("./img/fireball.png", layer1, { width: 512, height: 512,  position: {x: 200,  y: 300}});

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
    fireball2.frame.x = 10 * perSec % 6;
    fireball.position.x = 10 * perSec;

    if (perSec >= 5 && !temp_removed) {
        canvas.remove_layer(layer1);
        temp_removed = true;
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
LOG_DIV = document.getElementById("log");
FPS_DIV = document.getElementById("fps");
LOADER_DIV = document.getElementById("loader");

function init() {
    window.canvas = new Canvas();

    window.canvas.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
        window.canvas.resize(window.innerWidth, window.innerHeight);
    });

    this.fireball = window.canvas.add_sprite("./img/fireball.png", { width: 512, height: 512 });
    this.fireball2 = window.canvas.add_sprite("./img/fireball.png", { width: 512, height: 512,  position: {x: 200,  y: 300}});

    requestAnimationFrame(update_loop);
}

var FPS = 0;
var ticks = 0;
var lastFPS = 0;

function update_loop(delta) {
    requestAnimationFrame(update_loop);
    var perSec = delta / 1000;

    // update
    this.fireball.frame.x = 10 * perSec % 6;
    this.fireball2.frame.x = 10 * perSec % 6;
    this.fireball.position.x = 10 * perSec;

    window.canvas.render();

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
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
    fireball = canvas.add_sprite("./img/fireball.png", layer1, { width: 512, height: 512 });

    // start pointer control
    pointer_control({ onDrag: function(mouse) {
        fireball.position.y = mouse.y / canvas.scale.y;
    } });

    // start keyboard capture
    hotkeys('f5,ctrl+r', function (event, handler) {
        // Prevent the default refresh event under WINDOWS system
        event.preventDefault()
        alert('you tried to reload!')
    });

    // start app update loop
    requestAnimationFrame(update_loop);
}

var FPS = 0;
var ticks = 0;
var lastFPS = 0;

function update_loop(delta) {
    requestAnimationFrame(update_loop);
    var perSec = delta / 1000;

    // update
    fireball.frame.x = 10 * perSec % 6;
    fireball.position.x = 100 * perSec % 1000;
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
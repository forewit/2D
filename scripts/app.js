LOG_DIV = document.getElementById("log");
FPS_DIV = document.getElementById("fps");
LOADER_DIV = document.getElementById("loader");

let canvas;

// start finalizing and implementing interaction models
//  1. Hotkeys
//  2. Selecting sprites

function init() {
    // create canvas
    var elm = document.getElementById("canvas");
    canvas = new Canvas(elm);

    canvas.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
        canvas.resize(window.innerWidth, window.innerHeight);
    });

    // start pointer control
    let offset, selected;
    pointer_control({
        onStart: function (mouse) {
            pointer = mouse;
            selected = canvas.intersections(canvas.get_coords(mouse), layer1)[0];

            if (selected) {
                let current = canvas.get_coords(mouse);
                offset = new Point(
                    selected.position.x - current.x,
                    selected.position.y - current.y
                );
            }
        },
        onDrag: function (mouse) {
            pointer = mouse;
            if (selected) {
                let current = canvas.get_coords(mouse);

                selected.position.x = current.x + offset.x;
                selected.position.y = current.y + offset.y;
            }
        },
        onEnd: function (mouse) {
            pointer = mouse;
            selected = undefined;
        }
    });

    // start keyboard capture
    hotkeys('f5,ctrl+r', function (event, handler) {
        event.preventDefault()
        alert('you tried to reload!')
    });

    // create startup content
    layer1 = canvas.add_layer();
    fireball = canvas.add_sprite("./img/fireball.png", layer1, { scale: 2, width: 512, height: 512 });

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
    //canvas.scale.x = 1 - 0.1 * perSec;
    //canvas.scale.y = 1 - 0.1 * perSec;
    //canvas.update();

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
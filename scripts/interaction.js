(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Interactions = factory();
    }
}(this, function () {

    'use strict';

    // PRIVATE VARIABLES
    var layer = undefined;
    var pointer = {};
    var selected = []
    
    var _tapDelay = 10; // delay before long touch
    var _start = 0;
    var _moving = false;
    var _selectbox = false;
    var _onItem = false;

    // PRIVATE FUNCTIONS
    function startHandler(e) {
        _start = Date.now();
        _moving = false;
        _selectbox = false;
        _onItem = false;

        if (e.type === 'mousedown') {
            window.addEventListener('mousemove', moveHandler, { passive: false });
            window.addEventListener('mouseup', endHandler);
            pointer = { x: e.clientX, y: e.clientY };
        } else {
            window.addEventListener('touchmove', moveHandler, { passive: false });
            window.addEventListener('touchend', endHandler);
            window.addEventListener('touchcancel', endHandler);
            pointer = copyTouch(e.targetTouches[0]);
            e.preventDefault();
            e.stopPropagation();
        }

        // if pointer is on a selected object
        // this._onItem = true
    }

    function moveHandler(e) {
        if (e.type == 'mousemove') {
            pointer = { x: e.clientX, y: e.clientY };
            if (_onItem) {
                // move items
                console.log("moving item");
            } else if (_selectbox || (!_moving && (hotkeys.isPressed('control') || hotkeys.isPressed('shift')))) {
                _selectbox = true;
                // draw selectbox
                console.log("drawing selectbox");
            } else {
                // pan
                console.log("panning");
            }
        } else {
            pointer = copyTouch(e.targetTouches[0]);
            e.preventDefault();
            e.stopPropagation();
            /////////////////////////
            //handle touch drag
            /////////////////////////
        }
        _moving = true;
    }

    function endHandler(e) {
        if (e.type === 'mouseup') {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', endHandler);
            if (_selectbox) {
                // add items in selectbox to selected
                console.log("selecting items in selectbox");
            } else if (!_moving) {
                if (!(hotkeys.isPressed('control') || hotkeys.isPressed('shift'))) {
                    selected = [];
                    console.log("clearing selected");
                }
                // add item to selected
                console.log("checking to add item to selected");
            }
        } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != pointer.identifier) {
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', endHandler);
            window.removeEventListener('touchcancel', endHandler);
            /////////////////////////
            //handle touch end
            /////////////////////////
        }
    }

    function copyTouch(touch) {
        return {
            identifier: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
        };
    }

    var Interactions = {
        start: function(new_layer) {
            layer = new_layer;
            selected = [];
            window.addEventListener('touchstart', startHandler, { passive: false });
            window.addEventListener('mousedown', startHandler);

            // Interupt reload
            hotkeys('f5,ctrl+r,cmd+r', function (event, handler) {
                event.preventDefault()
                alert('you tried to reload!')
            });
        },
        stop: function() {
            layer = undefined;
            selected = [];
            window.removeEventListener('touchstart', startHandler);
            window.removeEventListener('mousedown', startHandler);

            hotkeys.unbind('f5,ctrl+r,cmd+r');
        }
    };
    return Interactions;
}));
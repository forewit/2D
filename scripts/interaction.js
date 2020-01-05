class interaction {
    constructor() {
        this.pointer = {};
        this.selection = []
        this.tapDelay = 0.1;

        window.addEventListener('touchstart', startHandler, { passive: false });
        window.addEventListener('mousedown', startHandler);
    }

    startHandler(e) {
        var me = this;
        if (e.type === 'mousedown') {
            window.addEventListener('mousemove', moveHandler, { passive: false });
            window.addEventListener('mouseup', endHandler);
            me.pointer = { x: e.clientX, y: e.clientY };
            me.pointer.start = Date.now();
            /////////////////////////
            //handle mouse start
            /////////////////////////
        } else {
            window.addEventListener('touchmove', moveHandler, { passive: false });
            window.addEventListener('touchend', endHandler);
            window.addEventListener('touchcancel', endHandler);
            me.pointer = copyTouch(e.targetTouches[0]);
            me.pointer.start = Date.now();
            e.preventDefault();
            e.stopPropagation();
            /////////////////////////
            //handle touch start
            /////////////////////////
        }
    }

    moveHandler(e) {
        var me = this;
        if (e.type == 'mousemove') {
            me.pointer = { x: e.clientX, y: e.clientY };
            /////////////////////////
            //handle mouse drag
            /////////////////////////
        } else {
            me.pointer = copyTouch(e.targetTouches[0]);
            e.preventDefault();
            e.stopPropagation();
            /////////////////////////
            //handle touch drag
            /////////////////////////
        }
    }

    endHandler(e) {
        var me = this;
        if (e.type === 'mouseup') {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', endHandler);
            /////////////////////////
            //handle mouse end
            /////////////////////////
        } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', endHandler);
            window.removeEventListener('touchcancel', endHandler);
            /////////////////////////
            //handle touch end
            /////////////////////////
        }
    }

    // click:
    // (ctrl or shift) + click:
    // escape:
    // ctrl + a:
    // click-drag:
    // (shift or ctrl) + click-drag:
    // scroll:
    // middle-click-drag:
    // Tap:
    // Long-press:
    // Pinch

    static copyTouch(touch) {
        return {
            identifier: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
        };
    }
}
function pointer_control(options = {}) {
    // check for handlers in options


    
    window.addEventListener('touchstart', startHandler, { passive: false });
    window.addEventListener('mousedown', startHandler);
    function startHandler(e) {
        if (e.type === 'mousedown') {
            window.addEventListener('mousemove', moveHandler, { passive: false });
            window.addEventListener('mouseup', endHandler);
            mouse = { x: e.clientX, y: e.clientY };
        } else {
            window.addEventListener('touchmove', moveHandler, { passive: false });
            window.addEventListener('touchend', endHandler);
            window.addEventListener('touchcancel', endHandler);
            mouse = copyTouch(e.targetTouches[0]);
            e.preventDefault();
            e.stopPropagation();
        }
        /////////////////////////
        //handle pointer start
        /////////////////////////
        LOG_DIV.innerHTML = "start x:" + mouse.x + " y:" + mouse.y;
    }
    function moveHandler(e) {
        mouse = (e.type == 'mousemove')
            ? { x: e.clientX, y: e.clientY }
            : copyTouch(e.targetTouches[0]);

        e.preventDefault();
        e.stopPropagation();
        /////////////////////////
        //handle pointer DRAG
        /////////////////////////
        LOG_DIV.innerHTML = "drag x:" + mouse.x + " y:" + mouse.y;

    }
    function endHandler(e) {
        if (e.type === 'mouseup') {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', endHandler);
        } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', endHandler);
            window.removeEventListener('touchcancel', endHandler);
        } else {
            return;
        }
        /////////////////////////
        //handle pointer end
        /////////////////////////
        LOG_DIV.innerHTML = "end x:" + mouse.x + " y:" + mouse.y;

    }
    function copyTouch(touch) {
        return { identifier: touch.identifier, x: touch.clientX, y: touch.clientY };
    }
}



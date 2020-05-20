export let elm = document.createElement("canvas");
export let gl = elm.getContext("webgl2");
export let camera = { x: 0, y: 0, z: 0 };

if (!(gl instanceof WebGL2RenderingContext)) alert("webgl2 disabled");
document.body.appendChild(elm);
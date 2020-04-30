export let elm = document.createElement("canvas");
export let gl = elm.getContext("webgl2");

if (!(gl instanceof WebGL2RenderingContext)) alert("webgl2 disabled");
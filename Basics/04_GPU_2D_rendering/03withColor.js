//const vertexShaderSource = document.getElementById('vertex-shader').textContent;
//const fragmentShaderSource = document.getElementById('fragment-shader').textContent;
const canvas = document.getElementById('webgl-canvas'); // Get a reference to the canvas element
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); // Obtain a WebGL context

if (!gl) {
    alert('Your browser does not support WebGL');
}



//var gl is set to WebGL context
var glVersion = gl.getParameter(gl.VERSION); 
var glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION); 
console.log("GL Version: \t" + glVersion);
console.log("GLSL Version: \t" + glslVersion);

var v = [-1,0, 0,1,0,  1,0, 0,1,0,  0,1, 1,0,0,  0,-1, 0,0,1];
var i = [0,1,2, 0,3,1];

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

var ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);



//Vertex shader code
function getVertexShaderCode() {
    return `
        attribute vec2 pos;
        attribute vec3 col;
        
        varying vec3 c;

        void main(void) {
            c = col;
            gl_Position = vec4(pos, 0.0, 1.0);
        }
    `;
}

// Fragment shader code
function getFragmentShaderCode() {
    return `
        precision highp float;
        
        varying vec3 c;

        void main(void) {
            gl_FragColor = vec4(c, 1);
        }
    `;
}

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, getVertexShaderCode());
//gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(vertexShader));

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, getFragmentShaderCode());
//gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(fragmentShader));

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    alert(gl.getShaderInfoLog(fragmentShader));

gl.useProgram(shaderProgram);

var attrPos = gl.getAttribLocation(shaderProgram, "pos");//position
gl.enableVertexAttribArray(attrPos);
gl.vertexAttribPointer(attrPos,2,gl.FLOAT,false,20,0);

var attrCol = gl.getAttribLocation(shaderProgram, "col");//color
gl.enableVertexAttribArray(attrCol);
gl.vertexAttribPointer(attrCol,3,gl.FLOAT,false,20,8);

gl.drawElements(gl.TRIANGLES, i.length, gl.UNSIGNED_SHORT, 0);


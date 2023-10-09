//////////////// Get WEBGL context ////////////////////
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl){
    alert('Your browser doesnot support WebGL');
}

////////////// Setup Shaders ////////////////////////////
//Vertex shader code
function getVertexShaderCode() {
    return `
        attribute vec2 pos;

        void main(void){
            gl_Position = vec4(pos, 0.0, 1.0);
        }
    `;
}

// Fragment shader code
function getFragmentShaderCode() {
    return `
        precision highp float;

        void main (void){
            gl_FragColor = vec4(1,0,0,1);
        }
    `;
}



// var gl is set to webgl context
var glVersion = gl.getParameter(gl.VERSION);
var glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
console.log("Gl Version: \t" + glVersion);
console.log("GLSL Version: \t" + glslVersion);

// Vertex
var v = [-1,0, 1,0, 0,1, -1,0, 1,0, 0,-1];

// Vertex Data is transferred to GPU Memory
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

// Setup Shaders
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, getVertexShaderCode());
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(vertexShader));

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, getFragmentShaderCode());
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(fragmentShader));

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    alert(gl.getShaderInfoLog(fragmentShader))

gl.useProgram(shaderProgram); //Activated

var attrPos = gl.getAttribLocation(shaderProgram, "pos");
gl.enableVertexAttribArray(attrPos);
gl.vertexAttribPointer(attrPos, 2, gl.FLOAT, false, 8, 0);

// Render
gl.drawArrays(gl.TRIANGLES, 0, v.length/2);

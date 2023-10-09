// ERROR 

// Get webgl context
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

// Geometry (vertex buffer)
var v = [-1,-1,-1,  -1,-1,1, -1,1,-1, -1,1,1,
    1,-1,-1, 1,-1,1, 1,1,-1, 1,1,1];

// Topology (Index buffer)
var i = [0,1, 0,2, 0,4, 1,3, 1,5, 2,3, 2,6, 3,7, 4,5, 4,6, 5,7, 6,7 ];

// Parallel Projection direction
var d = [.2,.3,.8];

// Projection Matrix
var P = [
    [1,0,-d[0]/d[2],0],
    [0,1,-d[1]/d[2],0],
    [0,0,0,0],
    [0,0,0,1]
];

// before projection, scale cube by .5 to see it completely
var M = new Float32Array(16);
M[0] = P[0] * 0.5;
M[5] = P[5] * 0.5;
M[10] = P[10] * 0.5;
M[15] = P[15];



// Upload v and i to GPU Memory
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

var ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);

// Set up shaders
function getVertexShaderCode(){
    return`
    uniform mat4 M;
    attribute vec3 pos;

    void main(void){
        gl_Position = M * vec4(pos, 1.0); 
    }
    `;
}

function getFragmentShaderCode(){
    return`
    precision highp float;

    void main(void){
        gl_FragColor = vec4(0,0,0,1);
    }
    `;
}

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, getVertexShaderCode());
gl.compileShader(vertexShader);

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, getFragmentShaderCode());
gl.compileShader(fragmentShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram);

// Manage attributes
var attrPos = gl.getAttribLocation(shaderProgram, "pos");
gl.enableVertexAttribArray(attrPos);
gl.vertexAttribPointer(attrPos,3,gl.FLOAT,false,12,0);

var uniM = gl.getUniformLocation(shaderProgram, 'M');
// Transpose the matrix manually
var transposedM = new Float32Array(16);
for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
        transposedM[i * 4 + j] = M[j * 4 + i];
    }
}

gl.uniformMatrix4fv(uniM, false, transposedM);

// Render cube
gl.drawElements(gl.LINES, i.length, gl.UNSIGNED_SHORT, 0);
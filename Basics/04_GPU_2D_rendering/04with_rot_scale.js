const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

var v = [-1,0, 0,1,0,  1,0, 0,1,0,  0,1, 1,0,0,  0,-1, 0,0,1];
var i = [0,1,2, 0,3,1];

// Upload v and i in GPU Memory
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

var ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);

//setup shaders
function getVertexShaderCode(){
    return `
    attribute vec2 pos;
    attribute vec3 col;

    varying vec3 c;

    void main(void){
        c = col;
        vec2 p = vec2(0.7,0.3)*pos.x + vec2(-0.3,0.7)*pos.y;
        gl_Position = vec4(p, 0.0, 1.0);
    }
    `;
}

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
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(vertexShader));

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, getFragmentShaderCode());
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    alert(gl.getShaderInfoLog(fragmentShader));

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram,vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);


gl.useProgram(shaderProgram);

var attrPos = gl.getAttribLocation(shaderProgram,"pos");
gl.enableVertexAttribArray(attrPos);
gl.vertexAttribPointer(attrPos, 2, gl.FLOAT, false, 20,0);

var attrCol = gl.getAttribLocation(shaderProgram,"col");
gl.enableVertexAttribArray(attrCol);
gl.vertexAttribPointer(attrCol, 3, gl.FLOAT, false, 20,8);

// Render
gl.drawElements(gl.TRIANGLES, i.length, gl.UNSIGNED_SHORT, 0);

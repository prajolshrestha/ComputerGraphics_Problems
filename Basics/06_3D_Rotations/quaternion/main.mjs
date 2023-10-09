//import {mat4, quat, vec3} from 'gl-matrix';
import { vec3, mat4, quat } from 'gl-matrix/esm/index.js';

//glMatrix.setMatrixArrayType(Array);

// Get WebGL Context
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

// Setup shaders
const vertexShaderSource=`
    attribute vec4 pos;
    attribute vec4 col;
    uniform mat4 u_modelViewProjection;
    varying vec4 v_color;

    void main(){
        gl_Position = u_modelViewProjection * pos;
        v_color = col;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main(){
        gl_FragColor = v_color;
    }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Vertices and colors
const vertices = [
    -1, -1, -1, 1, 0, 0,
    1, -1, -1, 0, 1, 0,
    1, 1, -1, 0, 0, 1,
    -1, 1, -1, 1, 1, 0,
    -1, -1, 1, 1, 0, 1,
    1, -1, 1, 0, 1, 1,
    1, 1, 1, 0, 1, 1,
    -1, 1, 1, 1, 1, 1,
];

const indices = [
    0, 1, 2, 2, 3, 0,
    4, 5, 6, 6, 7, 4,
    0, 4, 7, 7, 3, 0,
    1, 5, 6, 6, 2, 1,
    0, 1, 5, 5, 4, 0,
    2, 3, 7, 7, 6, 2,
];

// Upload vertices and index to GPU
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

// Define initial model, view and projection matrices
const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.lookAt(viewMatrix, [0,0,5], [0,0,0], [0,1,0]);
mat4.perspective(projectionMatrix, Math.PI/4, canvas.clientWidth / canvas.clientHeight, 0.1, 10);

const modelViewProjectionMatrix = mat4.create();
mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);
mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

// Get shader attribute and uniform locations
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "pos");
const colorAttributeLocation = gl.getAttribLocation(shaderProgram, "col");
const modelViewProjectionUniformLocation = gl.getUniformLocation(shaderProgram, "u_modelViewProjection");

// Setup attribute pointers
gl.enableVertexAttribArray(positionAttributeLocation);
//gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 24, 0);

gl.enableVertexAttribArray(colorAttributeLocation);
//gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 24, 12);

// Setup uniform values
gl.uniformMatrix4fv(modelViewProjectionUniformLocation, false, modelViewProjectionMatrix);

// Main render loop
const rotationAxis = vec3.fromValues(1,1,1);
const rotationQuaternion = quat.create();
const rotationSpeed = 0.005;

function render(){
    quat.setAxisAngle(rotationQuaternion, rotationAxis, rotationSpeed);
    mat4.fromQuat(modelMatrix,rotationQuaternion);

    console.log("Rotration Quaternion:", rotationQuaternion);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}

render();



// //glMatrix.setMatrixArrayType(Array);

// // Get WebGL context
// const canvas = document.getElementById('webgl-canvas');
// const gl = canvas.getContext('webgl');

// // Vertex shader code
// const vertexShaderSource = `
//     attribute vec4 a_position;
//     attribute vec4 a_color;
//     uniform mat4 u_modelViewProjection;
//     varying vec4 v_color;

//     void main() {
//         gl_Position = u_modelViewProjection * a_position;
//         v_color = a_color;
//     }
// `;

// // Fragment shader code
// const fragmentShaderSource = `
//     precision mediump float;
//     varying vec4 v_color;

//     void main() {
//         gl_FragColor = v_color;
//     }
// `;

// // Compile and link shaders
// const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertexShader, vertexShaderSource);
// gl.compileShader(vertexShader);

// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragmentShader, fragmentShaderSource);
// gl.compileShader(fragmentShader);

// const shaderProgram = gl.createProgram();
// gl.attachShader(shaderProgram, vertexShader);
// gl.attachShader(shaderProgram, fragmentShader);
// gl.linkProgram(shaderProgram);
// gl.useProgram(shaderProgram);

// // Define cube vertices and colors
// const vertices = [
//     -1, -1, -1, 1, 0, 0,
//     1, -1, -1, 0, 1, 0,
//     1, 1, -1, 0, 0, 1,
//     -1, 1, -1, 1, 1, 0,
//     -1, -1, 1, 1, 0, 1,
//     1, -1, 1, 0, 1, 1,
//     1, 1, 1, 0, 1, 1,
//     -1, 1, 1, 1, 1, 1,
// ];

// const indices = [
//     0, 1, 2, 2, 3, 0,
//     4, 5, 6, 6, 7, 4,
//     0, 4, 7, 7, 3, 0,
//     1, 5, 6, 6, 2, 1,
//     0, 1, 5, 5, 4, 0,
//     2, 3, 7, 7, 6, 2,
// ];

// const vertexBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// const indexBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

// // Define initial model, view, and projection matrices
// const modelMatrix = mat4.create();
// const viewMatrix = mat4.create();
// const projectionMatrix = mat4.create();

// mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
// mat4.perspective(projectionMatrix, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 10);

// const modelViewProjectionMatrix = mat4.create();
// mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);
// mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix);

// // Get shader attribute and uniform locations
// const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
// const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_color');
// const modelViewProjectionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_modelViewProjection');

// // Set up attribute pointers
// gl.enableVertexAttribArray(positionAttributeLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 24, 0);
// gl.enableVertexAttribArray(colorAttributeLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 24, 12);

// // Set uniform values
// gl.uniformMatrix4fv(modelViewProjectionUniformLocation, false, modelViewProjectionMatrix);

// // Main render loop
// const rotationAxis = vec3.fromValues(1, 1, 1);
// const rotationQuaternion = quat.create();
// const rotationSpeed = 0.005;

// function render() {
//     quat.setAxisAngle(rotationQuaternion, rotationAxis, rotationSpeed);
//     mat4.fromQuat(modelMatrix, rotationQuaternion);

//     gl.clearColor(0.0, 0.0, 0.0, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

//     requestAnimationFrame(render);
// }

// render();




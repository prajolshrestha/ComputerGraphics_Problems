precision highp float; // High precision for floating-point calculations

varying vec3 c; // Varying variable passed from the vertex shader

void main(void) {
    gl_FragColor = vec4(c, 1); // Set the fragment color with full opacity
}

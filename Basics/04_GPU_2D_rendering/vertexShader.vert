
attribute vec2 pos;
attribute vec3 col;
        
varying vec3 c;

void main(void) {
    c = col;
    gl_Position = vec4(pos, 0.0, 1.0);
}
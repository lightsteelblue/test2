#version 300 es

precision highp float;

uniform sampler2D tex;
uniform vec2 canvasSize;
out vec4 o;

void main() {
    vec4 a = texture(tex, gl_FragCoord.xy / canvasSize);
    //o = vec4(pow(a.x / 5.,1.), 0, 0, 1);
    o = vec4(a.z, 0, 0, 1);
    //o = vec4(a.x > 0. ? 1 : 0, abs(a.y*10.), a.z>4.?1:0, 1);
}
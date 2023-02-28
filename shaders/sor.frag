#version 300 es

precision highp float;

uniform sampler2D tex; // .x:P, .y:b
uniform vec2 N;
uniform int red_black;

const float omega = 1.9;

out vec4 o;

void main() {
    vec4 c = texture(tex, gl_FragCoord.xy / N);
    vec2 e = texture(tex, (gl_FragCoord.xy + vec2(1, 0)) / N).xz;
    vec2 w = texture(tex, (gl_FragCoord.xy + vec2(-1, 0)) / N).xz;
    vec2 n = texture(tex, (gl_FragCoord.xy + vec2(0, 1)) / N).xz;
    vec2 s = texture(tex, (gl_FragCoord.xy + vec2(0, -1)) / N).xz;

    float p = (1. - omega) * c.x + omega * 0.25 * (c.y + e.x + w.x + n.x + s.x);
    
    //if (e.y * w.y * n.y * s.y == 0.) p = 0.;
    if (c.z <= 1.) p = 0.;

    if (gl_FragCoord.x < 2.) p = e.x;
    if (gl_FragCoord.x > N.x - 2.) p = w.x;
    if (gl_FragCoord.y < 2.) p = n.x;
    if (gl_FragCoord.y > N.y - 2.) p = s.x;
  
    if (gl_FragCoord.x < 2. && gl_FragCoord.y < 2.) p = 0.5 * (e.x + n.x);
    if (gl_FragCoord.x < 2. && gl_FragCoord.y > N.y - 2.) p = 0.5 * (e.x + s.x);
    if (gl_FragCoord.x > N.x - 2. && gl_FragCoord.y < 2.) p = 0.5 * (w.x + n.x);
    if (gl_FragCoord.x > N.x - 2. && gl_FragCoord.y > N.y - 2.) p = 0.5 * (w.x + s.x);

    o = c;
    vec2 q = floor(gl_FragCoord.xy);
    if ((int(q.x + q.y) & 1) == red_black)
        o = vec4(p, c.y, c.z, c.w);
}
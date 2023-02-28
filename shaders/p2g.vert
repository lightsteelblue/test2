#version 300 es

layout(location = 0) in vec4 pPosVel;
layout(location = 1) in vec4 pC;
layout(location = 2) in float pJ;

uniform vec2 u_gridRes;
uniform float u_dt;

out vec4 v_pPosVel;
out mat2 v_pC;
out mat2 v_pMomentum;

void main() {
    v_pPosVel = pPosVel;// + vec4(pPosVel.zw * u_dt, 0,0);
    v_pC = mat2(pC); // (xy,zw)=(c0,c1)

    //v_pMomentum = mat2(0);
    v_pMomentum = -0.1 * u_dt / pJ * mat2(pC.x, 0.5*(pC.y + pC.z), 0.5*(pC.y + pC.z), pC.w);

    gl_Position = vec4(2. * ((floor(v_pPosVel.xy) + 0.5) / u_gridRes) - 1., 0., 1.);
    gl_PointSize = 3.0;
}

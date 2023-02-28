#version 300 es

precision highp float;

uniform sampler2D velTex;
uniform sampler2D pressureTex;
uniform vec2 u_gridRes;
uniform float u_dt;

out vec4 o;

void main() {
    float pE = texture(pressureTex, (gl_FragCoord.xy + vec2(1, 0)) / u_gridRes).x;
    float pEE = texture(pressureTex, (gl_FragCoord.xy + vec2(2, 0)) / u_gridRes).x;
    float pW = texture(pressureTex, (gl_FragCoord.xy + vec2(-1, 0)) / u_gridRes).x;
    float pWW = texture(pressureTex, (gl_FragCoord.xy + vec2(-2, 0)) / u_gridRes).x;
    float pN = texture(pressureTex, (gl_FragCoord.xy + vec2(0, 1)) / u_gridRes).x;
    float pNN = texture(pressureTex, (gl_FragCoord.xy + vec2(0, 2)) / u_gridRes).x;
    float pS = texture(pressureTex, (gl_FragCoord.xy + vec2(0, -1)) / u_gridRes).x;
    float pSS = texture(pressureTex, (gl_FragCoord.xy + vec2(0, -2)) / u_gridRes).x;
    float pC = texture(pressureTex, gl_FragCoord.xy / u_gridRes).x;

    float uE = texture(velTex, (gl_FragCoord.xy + vec2(1, 0)) / u_gridRes).x;
    float uW = texture(velTex, (gl_FragCoord.xy + vec2(-1, 0)) / u_gridRes).x;
    float vN = texture(velTex, (gl_FragCoord.xy + vec2(0, 1)) / u_gridRes).y;
    float vS = texture(velTex, (gl_FragCoord.xy + vec2(0, -1)) / u_gridRes).y;
    vec2 uvC = texture(velTex, gl_FragCoord.xy / u_gridRes).xy;

    float mE = texture(velTex, (gl_FragCoord.xy + vec2(1, 0)) / u_gridRes).z;
    float mW = texture(velTex, (gl_FragCoord.xy + vec2(-1, 0)) / u_gridRes).z;
    float mN = texture(velTex, (gl_FragCoord.xy + vec2(0, 1)) / u_gridRes).z;
    float mS = texture(velTex, (gl_FragCoord.xy + vec2(0, -1)) / u_gridRes).z;
    float mC = texture(velTex, gl_FragCoord.xy / u_gridRes).z;

    float dpdxe = (pE - pC) - 0.25 * ((pE - pW) + (pEE - pC));
    float dpdyn = (pN - pC) - 0.25 * ((pN - pS) + (pNN - pC));
    float dpdxw = (pC - pW) - 0.25 * ((pC - pWW) + (pE - pW));
    float dpdys = (pC - pS) - 0.25 * ((pC - pSS) + (pN - pS));

    float ufe_ = 0.5 * (uE + uvC.x);
    float vfn_ = 0.5 * (vN + uvC.y);
    float ufw_ = 0.5 * (uW + uvC.x);
    float vfs_ = 0.5 * (vS + uvC.y);

    if (texture(velTex, (gl_FragCoord.xy + vec2(1, 0)) / u_gridRes).z == 0.) {
        ufe_ = uvC.x;
        dpdxe = -pC;
    }
    if (texture(velTex, (gl_FragCoord.xy + vec2(-1, 0)) / u_gridRes).z == 0.) {
        ufw_ = uvC.x;
        dpdxw = pC;
    }
    if (texture(velTex, (gl_FragCoord.xy + vec2(0, 1)) / u_gridRes).z == 0.) {
        vfn_ = uvC.y;
        dpdyn = -pC;
    }
    if (texture(velTex, (gl_FragCoord.xy + vec2(0, -1)) / u_gridRes).z == 0.) {
        vfs_ = uvC.y;
        dpdys = pC;
    }

    vec2 flux1 = vec2(ufe_, vfn_) - 0.5 * vec2(dpdxe, dpdyn) * u_dt;
    vec2 flux2 = vec2(ufw_, vfs_) - 0.5 * vec2(dpdxw, dpdys) * u_dt;

    vec4 c = texture(velTex, gl_FragCoord.xy / u_gridRes);
    float div = -(flux1.x - flux2.x + flux1.y - flux2.y) / u_dt;
    //float div = -0.125*(flux1.x*(mC+mE) - flux2.x*(mC+mW) + flux1.y*(mC+mN) - flux2.y*(mC+mS)) / u_dt;
#if 1
    float a = 0.25*0.25*0.25*abs(c.z - 4.)*(c.z - 4.)/(u_dt*u_dt);
    //if (gl_FragCoord.y < 3.) div += max(a, 0.);
    //div+=a;
    //div += max(a, 0.);
    if (a > 0.) div += a;
    else if (a < 0. && div > 0.)div =max(div+a, 0.);
#else
    
#endif

    if (mE*mW*mN*mS == 0.) div=0.;

    o = vec4(pC,div,c.z,c.w);
}

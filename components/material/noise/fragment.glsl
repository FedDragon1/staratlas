uniform float iTime;

varying vec2 varyingUV;

#include <common>

void main() {
    vec3 color = vec3(rand(varyingUV * iTime));
    gl_FragColor = vec4(color, 0.2);
}

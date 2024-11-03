uniform float minOpacity;
uniform float maxOpacity;

varying float varyingOpacity;

#ifdef withMesh
uniform sampler2D map;
varying vec2 varyingUV;
#else
varying vec3 varyingColor;
#endif

float circleMask() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist < 0.4) {
        return 1.0;
    }
    if (dist > 0.5) {
        return 0.0;
    }
    // 0.5 -> 0 opacity
    return smoothstep(0.5, 0.4, dist);
}

void main() {
    #ifdef depthTest
    // distance == 0.5 -> desired circle
    // 0.5 - distance -> if > 0 then inside, < 0 outside
    float dist = 0.5 - distance(gl_PointCoord, vec2(0.5));
    if (round < 0.1 || varyingOpacity < 0.1) {
        discard;
    }
    #endif

    float opacity = circleMask() * clamp(varyingOpacity, minOpacity, maxOpacity);

    #ifdef withMesh
    vec4 diffuse = texture(map, varyingUV);
    gl_FragColor = vec4(diffuse.rgb, opacity);
    #else
    gl_FragColor = vec4(varyingColor, opacity);
    #endif
}

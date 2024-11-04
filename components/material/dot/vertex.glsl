uniform float pixelRatio;
uniform float near;
uniform float far;
uniform float fadeDistance;
uniform float blur;
uniform float minOpacity;
uniform float maxOpacity;
uniform float referenceParticleSize;

attribute float size;

#ifdef withMesh
varying vec2 varyingUV;
attribute vec2 uv;
#else
varying float varyingOpacity;
attribute vec3 color;
#endif

varying vec3 varyingColor;

void main() {
    #ifdef withMesh
    varyingUV = uv;
    #else
    varyingColor = color;
    #endif

    varyingOpacity = 1.0;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;

    // negative z -> closer to camera -> near
    float depth = worldPosition.z;
    float blurScale;

    // z is way too positive -> not close enough to be shown
    if (depth > near) {
        // near + faseDistance -> opacity 0
        // near -> opacity 1
        varyingOpacity = smoothstep(near + fadeDistance, near, depth);
    } else if (depth < far) {
        varyingOpacity = smoothstep(far - fadeDistance, far, depth);
    }

    blurScale = 1.0 - varyingOpacity;   // [0, 1]
    blurScale *= 2.0;    // [0, 2] -> 2x size as opacity reaches 0

    gl_PointSize = pixelRatio * (size * referenceParticleSize + blurScale * blur);
    gl_Position = projectionMatrix * viewPosition;

}

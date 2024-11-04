varying vec2 varyingUV;

void main() {
    varyingUV = uv;
    gl_Position = vec4(position, 1.0);
}

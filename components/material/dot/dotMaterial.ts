import * as THREE from "three";
import vertexShader from "@/components/material/dot/vertex.glsl"
import fragmentShader from "@/components/material/dot/fragment.glsl"

type UniformVariables = {
    near: number
    far: number
    fadeDistance: number
    map: THREE.Texture | null
    blur: number
    minOpacity: number
    maxOpacity: number,
    referenceParticleSize: number
}

type DefinedMacros = {
    depthTest: boolean
} & THREE.ShaderMaterial["defines"]

const defaultUniformVariables: UniformVariables = {
    near: 10,
    far: 0,
    fadeDistance: 3,
    map: null as THREE.Texture | null,
    blur: 0,
    minOpacity: 0,
    maxOpacity: 1,
    referenceParticleSize: 4.5
}

const defaultDefinedMacros: DefinedMacros = {
    depthTest: false
}

function recordToUniformVariables(uniformVariables?: Record<string, any>) {
    if (!uniformVariables) {
        return {}
    }

    const transformed: Record<string, THREE.IUniform> = {}
    Object.entries(uniformVariables).forEach(([key, value]) => transformed[key] = { value })
    return transformed
}

export class DotMaterial extends THREE.ShaderMaterial {
    constructor(withMesh: boolean, pixelRatio: number, uniformVariables?: Partial<UniformVariables>, definedMacros?: Partial<DefinedMacros>) {
        if (withMesh && !uniformVariables?.map) {
            console.error("Trying to use UV map without UV map provided")
        }

        const mergedUniformVariables = {
            pixelRatio: {
                value: pixelRatio
            },
            ...recordToUniformVariables({ ...defaultUniformVariables, ...uniformVariables })
        }

        super({
            vertexShader,
            fragmentShader,
            uniforms: mergedUniformVariables,
            transparent: true,
            depthTest: definedMacros?.depthTest ?? defaultDefinedMacros.depthTest,
            defines: {
                ...defaultDefinedMacros,
                ...definedMacros,
                withMesh
            }
        });
    }
}
import * as THREE from 'three'
import { ModelLoader } from "@/utils/three/modelLoader";
import { Environment } from "@/utils/three/environment";

export abstract class PointsModel {
    particle?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>
    animation?: (particle: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>) => void

    constructor(modelLoader: ModelLoader, environment: Environment) {
        this.loadModel(modelLoader, environment)
    }

    onLoad() {
        this.ensureParticlesSet()
        if (this.animation) {
            this.animation(this.particle!)
        }
    }

    ensureParticlesSet() {
        if (!this.particle) {
            throw new Error("Particles not loaded when trying to create animations")
        }
    }

    setAnimation(animation: (particle: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>) => void) {
        this.animation = animation

        if (this.particle) {
            this.animation(this.particle!)
        }
    }

    abstract loadModel(modelLoader: ModelLoader, environment: Environment): void;
}
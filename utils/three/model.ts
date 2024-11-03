import * as THREE from 'three'
import { ModelLoader } from "@/utils/three/modelLoader";
import { Environment } from "@/utils/three/environment";

export abstract class PointsModel {
    particle?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>

    constructor(modelLoader: ModelLoader, environment: Environment) {
        this.loadModel(modelLoader, environment)
    }

    makeAnimation() {
        if (!this.particle) {
            throw new Error("Particles not loaded when trying to create animations")
        }
        this.animate()
    }

    abstract loadModel(modelLoader: ModelLoader, environment: Environment): void;

    abstract animate(): void;
}
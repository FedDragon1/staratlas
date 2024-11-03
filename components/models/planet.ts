import * as THREE from "three"
import { PointsModel } from "@/utils/three/model";
import { ModelLoader } from "@/utils/three/modelLoader";
import { Environment } from "@/utils/three/environment";
import { DotMaterial } from "@/components/material/dot/dotMaterial";

export class Planet extends PointsModel {
    loadModel(modelLoader: ModelLoader, environment: Environment) {
        modelLoader
            .loadDrc("/models/planet.drc")
            .then((geometry) => {
                geometry.center().rotateY(1.2)
                this.particle = new THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>(
                    geometry,
                    new DotMaterial(
                        false,
                        environment.renderer.getPixelRatio(),
                        {
                            near: 17,
                            far: -15,
                            fadeDistance: 4,
                            blur: 3,
                            referenceParticleSize: 3
                        }
                    )
                )
                environment.addObjects(this.particle)
                this.makeAnimation()
            })
    }

    animate() {
        const position = this.particle!.position;
        position.x = -18;
        position.y = 8;
        position.z = -37;
    }

}
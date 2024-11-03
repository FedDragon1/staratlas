import * as THREE from "three"
import { PointsModel } from "@/utils/three/model";
import { ModelLoader } from "@/utils/three/modelLoader";
import { Environment } from "@/utils/three/environment";

export class Planet extends PointsModel {
    loadModel(modelLoader: ModelLoader, environment: Environment) {
        modelLoader
            .loadDrc("/models/planet.drc")
            .then((geometry) => {
                geometry.center().rotateY(1.2)
                this.particle = new THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>(
                    geometry,
                    
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
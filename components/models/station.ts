import * as THREE from "three"
import { PointsModel } from "@/utils/three/model";
import { ModelLoader } from "@/utils/three/modelLoader";
import { Environment } from "@/utils/three/environment";
import { DotMaterial } from "@/components/material/dot/dotMaterial";

export class Station extends PointsModel {
    loadModel(modelLoader: ModelLoader, environment: Environment) {
        modelLoader
            .loadDrc("/models/station.drc")
            .then((geometry) => {
                geometry.center().rotateY(1.2)
                this.particle = new THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>(
                    geometry,
                    new DotMaterial(
                        false,
                        environment.renderer.getPixelRatio(),
                        {
                            near: 20,
                            far: -30,
                            fadeDistance: 0,
                            blur: 0,
                            minOpacity: 0,
                            maxOpacity: 0,
                        }
                    )
                )
                this.onLoad()
                environment.addObjects(this.particle)
            })
    }
}
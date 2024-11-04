import * as THREE from 'three'
import { PointsModel } from "@/utils/three/model";
import { ModelLoader } from "@/utils/three/modelLoader";
import { Environment } from "@/utils/three/environment";
import { DotMaterial } from "@/components/material/dot/dotMaterial";

export class RingPoint extends PointsModel {
    radius: number
    points: number
    colorGenerator: (u: number, v: number) => THREE.Color
    sizeGenerator: (u: number, v: number) => number

    constructor(
        modelLoader: ModelLoader,
        environment: Environment,
        radius: number = 11,
        points: number = 90,
        colorGenerator: (u: number, v: number) => THREE.Color = () => new THREE.Color("#A69D98"),
        sizeGenerator: (u: number, v: number) => number = () => (Math.random() * 5) + 0.75
    ) {
        super(modelLoader, environment)
        this.radius = radius
        this.points = points
        this.colorGenerator = colorGenerator
        this.sizeGenerator = sizeGenerator
        this.createModel(environment)
    }

    removeOrigin(pointArray: number[]) {
        // 0 0 0
        pointArray.shift()
        pointArray.shift()
        pointArray.shift()
        // connects back to first point
        pointArray.pop()
        pointArray.pop()
        pointArray.pop()
        return pointArray
    }

    loadModel() {}

    createModel(environment: Environment) {
        const circleGeometry = new THREE.CircleGeometry(this.radius, this.points)
        const pointArray = this.removeOrigin(
            (circleGeometry.getAttribute("position") as THREE.BufferAttribute).toJSON().array
        )

        const actualGeometry = new THREE.BufferGeometry();
        actualGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pointArray, 3))

        const pointSizes = new Float32Array(this.points)
        const pointColors = new Float32Array(this.points * 3)

        for (let point = 0; point < this.points; point++) {
            const pointX = pointArray[point * 3]
            const pointY = pointArray[point * 3 + 1]
            const pointColor = this.colorGenerator(pointX, pointY)

            pointSizes[point] = this.sizeGenerator(pointX, pointY)
            pointColors[point * 3] = pointColor.r
            pointColors[point * 3 + 1] = pointColor.g
            pointColors[point * 3 + 2] = pointColor.b
        }

        actualGeometry.setAttribute("size", new THREE.BufferAttribute(pointSizes, 1))
        actualGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3))

        this.particle = new THREE.Points(
            actualGeometry,
            new DotMaterial(
                false,
                environment.renderer.getPixelRatio(),
                {
                    near: 30,
                    far: -5,
                    maxOpacity: 0.6,
                    fadeDistance: 5,
                    referenceParticleSize: 1
                },
            )
        )

        this.onLoad()
        environment.addObjects(this.particle)
    }
}
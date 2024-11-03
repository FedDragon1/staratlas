import * as THREE from "three"
// @ts-expect-error no module types
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { performanceStats } from "@/utils/three/performance";

const MAX_PX_RATIO = 2

function createRenderer(rendererParameters: THREE.WebGLRendererParameters) {
    const renderer = new THREE.WebGLRenderer(rendererParameters)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PX_RATIO))
    return renderer
}

export class Environment {
    renderer: THREE.WebGLRenderer
    camera: THREE.PerspectiveCamera
    lights: THREE.Light[]
    scene: THREE.Scene
    canvas: THREE.WebGLRendererParameters["canvas"]
    pmremGenerator: THREE.PMREMGenerator
    
    // ensure this points to the instance
    onResize = () => this.reflow.call(this)

    constructor(rendererParameters: THREE.WebGLRendererParameters) {
        this.renderer = createRenderer(rendererParameters)
        this.camera = new THREE.PerspectiveCamera(
            50, 1, 0.1, 200
        )
        this.lights = []
        this.scene = new THREE.Scene()
        this.canvas = rendererParameters.canvas
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.reflow()
    }

    initialize() {}
    
    // RENDERING

    reflow(width?: number, height?: number) {
        const [w, h] = width !== undefined && height !== undefined 
            ? [width, height] 
            : this.computeCanvasSize()
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(w, h)
        this.render()
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    computeCanvasSize() {
        const canvasParent = this.renderer.domElement.parentElement
        if (!canvasParent) {
            throw new Error("Unable to acquire the parent element of canvas when calculating canvas size")
        }
        const { offsetWidth, offsetHeight } = canvasParent
        return [offsetWidth, offsetHeight]
    }

    setBackground(color: string) {
        this.scene.background = new THREE.Color(color)
    }
    
    // RESPONSIVE LISTENERS
    
    attachResizeListener() {
        window.addEventListener("resize", this.onResize)
    }
    
    removeResizeListener() {
        window.removeEventListener("resize", this.onResize)
    }
    
    // SCENE
    
    protected removeObjects(container: THREE.Scene | THREE.Object3D) {
        while (container.children.length > 0) {
            this.removeObjects(container.children[0])
            container.remove(container.children[0])
        }
        
        // @ts-expect-error geometry should exist on both of the types
        if (container.geometry) {
            // @ts-expect-error geometry should exist on both of the types
            container.geometry.dispose();
        }

        if (container.type.includes("Light")) {
            // @ts-expect-error dispose should exist on both of the types
            container.dispose()
        }

        // @ts-expect-error material should exist on both of the types
        if (container.material) {
            // @ts-expect-error material should exist on both of the types
            if (Array.isArray(container.material)) {
                // @ts-expect-error material should exist on both of the types
                container.material.forEach((m: THREE.Material) => m.dispose())
            } else {
                // @ts-expect-error material should exist on both of the types
                container.material.dispose()
            }
        }
    }

    clear() {
        this.renderer.dispose()
        this.removeObjects(this.scene)
        this.scene.environment?.dispose()
    }

    addObjects(...objects: THREE.Object3D[]) {
        this.scene.add(...objects)
    }
}

export class AnimatedEnvironment extends Environment {
    animationFrame?: number
    animation?: () => void
    clock: THREE.Clock

    constructor(...params: ConstructorParameters<typeof Environment>) {
        super(...params)
        this.clock = new THREE.Clock()
    }

    initialize() {
        super.initialize();
        this.camera.fov = 50;
        this.camera.position.set(0, 0, 40)
        this.startFrameByFrameRendering()
    }

    setAnimation(animation: () => void) {
        this.animation = animation
    }

    startFrameByFrameRendering() {
        this.animationFrame = requestAnimationFrame(() => this.startFrameByFrameRendering())
        if (this.animation) {
            this.animation()
        }
        this.render()
    }

    stopFrameByFrameRendering() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame)
        }
        this.animationFrame = void 0
    }
}

export class DevelopmentEnvironment extends AnimatedEnvironment {
    controls: OrbitControls

    constructor(...params: ConstructorParameters<typeof AnimatedEnvironment>) {
        super(...params);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    initialize() {
        super.initialize()
        this.showPerformance()
    }

    showPerformance() {
        performanceStats.init()
    }

    startFrameByFrameRendering() {
        super.startFrameByFrameRendering()
        performanceStats.update()
        this.controls.update()
    }

    // CONTROLS

    setZoomLimit(min: number, max: number) {
        this.controls.minZoom = min
        this.controls.maxZoom = max
    }

    setDisplacementLimit(min: number, max: number) {
        this.controls.minDistance = min
        this.controls.maxDistance = max
    }

    setAngleLimit(min: number, max: number) {
        this.controls.minPolarAngle = min
        this.controls.maxPolarAngle = max
    }

    toggleAutoRotate(to: boolean) {
        this.controls.autoRotate = to ?? !this.controls.autoRotate
        this.controls.enableRotate = to ?? !this.controls.enableRotate
    }
}
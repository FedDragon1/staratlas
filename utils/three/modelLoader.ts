import * as THREE from 'three'
// @ts-expect-error no module types
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-expect-error no module types
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const taskConfig = {
    attributeIDs: {
        position: "POSITION",
        color: "COLOR",
        size: "GENERIC",
        uv: 'TEX_COORD'
    },
    attributeTypes: {
        position: "Float32Array",
        color: "Float32Array",
        size: "Float32Array",
        uv: "Float32Array"
    },
    useUniqueIDs: false
}

export class ModelLoader {
    loadingManager = new THREE.LoadingManager()
    texureLoader = new THREE.TextureLoader()
    fileLoader = new THREE.FileLoader()

    gltfLoader: GLTFLoader
    dracoLoader: DRACOLoader

    onStart = (url: string) => console.log(`Starting to load model from ${url}`)
    onProgress = (p: number, url: string) => console.log(`Loading progress: ${p} | url: ${url}`)
    onLoaded = () => console.log("Successfully loaded the models")

    constructor() {
        this.loadingManager.onLoad = this.onLoaded
        this.loadingManager.onStart = this.onStart
        this.loadingManager.onProgress = (url, loadedItems, totalItems) => {
            const percentage = Math.floor((loadedItems / totalItems) * 100)
            if (!percentage) {  // onStart edge case
                return
            }
            this.onProgress(percentage, url)
        }

        this.dracoLoader = new DRACOLoader(this.loadingManager)
            .setDecoderConfig({ type: "js" })
            .setDecoderPath("/draco/")

        this.gltfLoader = new GLTFLoader(this.loadingManager)
            .setDRACOLoader(this.dracoLoader)
    }

    loadGltf(url: URL | string): Promise<GLTF> {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url.toString(),
                (model: GLTF) => resolve(model),
                void 0,
                (error: ErrorEvent) => reject(error)
            )
        })
    }

    loadDrc(url: URL | string): Promise<THREE.BufferGeometry<THREE.NormalBufferAttributes>> {
        return new Promise((resolve, reject) => {
            if (!url.toString().endsWith(".drc")) {
                reject(`"${url}" does not end with .drc`)
            }

            this.fileLoader
                .setResponseType("arraybuffer")
                .load(url.toString(), (result) => {
                    const resultBuffer = result as ArrayBuffer
                    this.dracoLoader.decodeGeometry(resultBuffer, taskConfig)
                        .then((geometry: THREE.BufferGeometry) => resolve(geometry))
                        .catch((error: Error) => reject(error))
                })
        })
    }

    loadTexture(url: URL | string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
            this.texureLoader.load(
                url.toString(),
                (texture) => resolve(texture),
                void 0,
                (error: unknown) => reject(error)
            )
        })
    }

}
import {
    Camera,
    Color,
    Material,
    Scene,
    WebGLRenderTarget,
    WebGLRenderer,
} from 'three';

import { Pass } from './three-pass';

export class RenderPass extends Pass {

    public needsSwap: false;
    public clear: boolean;

    private scene: Scene;
    private camera: Camera;
    private overrideMaterial: Material | null | undefined;
    private clearColor: any;
    private clearAlpha: number | undefined;

    private clearDepth: false;

    constructor(
        scene: Scene,
        camera: Camera,
        overrideMaterial?: Material | null,
        clearColor?: Color | string | number,
        clearAlpha?: number) {

        super();

        this.scene = scene;
        this.camera = camera;

        this.overrideMaterial = overrideMaterial;

        this.clearColor = clearColor;
        this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;

        this.clear = true;
        this.clearDepth = false;
        this.needsSwap = false;

    }

    public render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        delta?: number,
        maskActive?: boolean) {

        const oldAutoClear = renderer.autoClear;

        renderer.autoClear = false;

        this.scene.overrideMaterial = this.overrideMaterial ? this.overrideMaterial : null;

        let oldClearColor;
        let oldClearAlpha;

        if (this.clearColor) {

            oldClearColor = renderer.getClearColor().getHex();
            oldClearAlpha = renderer.getClearAlpha();

            renderer.setClearColor(this.clearColor, this.clearAlpha);
        }

        if (this.clearDepth) {

            renderer.clearDepth();
        }

        renderer.render(this.scene, this.camera, this.renderToScreen ? undefined : readBuffer, this.clear);

        if (this.clearColor && oldClearColor !== undefined) {

            renderer.setClearColor(oldClearColor, oldClearAlpha);

        }

        this.scene.overrideMaterial = null;
        renderer.autoClear = oldAutoClear;
    }
}

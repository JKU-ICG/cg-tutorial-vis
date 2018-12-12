import { Camera, Scene, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Pass } from './three-pass';
import { stat } from 'fs';

export class MaskPass extends Pass {

    public scene: Scene;
    public camera: Camera;
    public clear: true;
    public needsSwap: false;
    public inverse: boolean;

    constructor(scene: Scene, camera: Camera) {

        super();

        this.scene = scene;
        this.camera = camera;

        this.clear = true;
        this.needsSwap = false;

        this.inverse = false;
    }

    public render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        delta?: number,
        maskActive?: boolean) {

        const context = renderer.context;
        const state = renderer.state;

        state.buffers.color.setMask(0);
        state.buffers.depth.setMask(0);

        state.buffers.color.setLocked(true);
        state.buffers.depth.setLocked(true);

        let writeValue;
        let clearValue;

        if (this.inverse) {
            writeValue = 0;
            clearValue = 1;
        } else {
            writeValue = 1;
            clearValue = 0;
        }

        state.buffers.stencil.setTest(true);
        state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
        state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
        state.buffers.stencil.setClear(clearValue);

        renderer.render(this.scene, this.camera, readBuffer, this.clear);
        renderer.render(this.scene, this.camera, writeBuffer, this.clear);

        // unlock color and depth buffer for subsequent rendering

        state.buffers.color.setLocked(false);
        state.buffers.depth.setLocked(false);

        // only render where stencil is set to 1

        state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);  // draw if == 1
        state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);

    }
}

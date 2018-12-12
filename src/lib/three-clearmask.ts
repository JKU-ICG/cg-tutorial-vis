import { Camera, Scene, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Pass } from './three-pass';

export class ClearMaskPass extends Pass {
    public needsSwap = false;

    public render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        delta?: number,
        maskActive?: boolean) {

        renderer.state.buffers.stencil.setTest(false);
    }
}

import { WebGLRenderTarget, WebGLRenderer } from 'three';

export class Pass {
    // if set to true, the pass is processed by the composer
    public enabled = true;

    // if set to true, the pass indicates to swap read and write buffer after rendering
    public needsSwap = true;

    // if set to true, the pass clears its buffer before rendering
    public clear = false;

    // if set to true, the result of the pass is rendered to screen
    public renderToScreen = false;

    public setSize(width: number, height: number): void {
        // to be implemented by the derived pass
    }

    public render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        delta?: number,
        maskActive?: boolean) {

        // to be implemented by the derived pass
    }
}

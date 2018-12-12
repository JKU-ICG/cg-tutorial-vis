import { Camera, Scene, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Pass } from './three-pass';

export class MaskPass extends Pass {

    public scene: Scene;
    public camera: Camera;
    public clear: true;
    public needsSwap: false;
    public inverse: boolean;

    constructor(scene: Scene, camera: Camera) {

        super();


    }
}
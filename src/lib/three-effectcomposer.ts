import { WebGLRenderer, LinearFilter, RGBAFormat, WebGLRenderTarget } from 'three';

import { Pass } from './three-pass';

import { CopyShader } from './three-copyshader';

import { ShaderPass } from './three-shaderpass';

import { MaskPass } from './three-maskpass';

import { ClearMaskPass } from './three-clearmask';

export class EffectComposer {

    private renderer: WebGLRenderer;

    private renderTarget1: WebGLRenderTarget;
    private renderTarget2: WebGLRenderTarget;
    private writeBuffer: WebGLRenderTarget;
    private readBuffer: WebGLRenderTarget;

    private passes: Pass[];

    private copyPass: ShaderPass;

    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget) {

        this.renderer = renderer;

        if (renderTarget === undefined) {
            const parameters = {
                minFilter: LinearFilter,
                magFilter: LinearFilter,
                format: RGBAFormat,
                stencilBuffer: false,
            };

            const size = this.renderer.getDrawingBufferSize();

            renderTarget = new WebGLRenderTarget(size.width, size.height, parameters);
            renderTarget.texture.name = 'EffectComposer.rt2';
        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();
        this.renderTarget2.texture.name = 'EffectComposer.rt2';

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        this.passes = [];

        this.copyPass = new ShaderPass(CopyShader);
    }

    public swapBuffers() {

        const tmp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = tmp;
    }

    public addPass(pass: any) {

        const size = this.renderer.getDrawingBufferSize();
        pass.setSize(size.width, size.height);

        this.passes.push(pass);
    }

    public insertPass(pass: any, index: number) {

        this.passes.splice(index, 0, pass);
    }

    public render(delta?: number) {

        let maskActive = false;

        let pass;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.passes.length; i++) {

            pass = this.passes[i];

            if (pass.enabled === false) {
                continue;
            }

            pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

            if (pass.needsSwap) {

                if (maskActive) {

                    const context = this.renderer.context;

                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

                    this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

                    context.stencilFunc(context.EQUAL, 1, 0xffffffff);

                }

                this.swapBuffers();

            }

            if (pass instanceof MaskPass) {

                maskActive = true;
            } else {

                maskActive = false;
            }
        }

    }

    public reset(renderTarget?: WebGLRenderTarget) {

        if (renderTarget === undefined) {

            const size = this.renderer.getDrawingBufferSize();

            renderTarget = this.renderTarget1.clone();
            renderTarget.setSize(size.width, size.height);

        }

        this.renderTarget1.dispose();
        this.renderTarget2.dispose();
        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;
    }

    public setSize(width: number, height: number) {

        this.renderTarget1.setSize(width, height);
        this.renderTarget2.setSize(width, height);

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.passes.length; i++) {

            this.passes[i].setSize(width, height);

        }

    }
}

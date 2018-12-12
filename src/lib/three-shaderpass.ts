import {
    OrthographicCamera,
    IUniform,
    Mesh,
    Scene,
    Shader,
    ShaderMaterial,
    WebGLRenderTarget,
    WebGLRenderer,
    UniformsUtils,
    PlaneBufferGeometry,
    MeshBasicMaterial,
} from 'three';

import { Pass } from './three-pass';

export class ShaderPass extends Pass {

    public textureID: string;
    public uniforms: { [uniform: string]: IUniform };
    public material: ShaderMaterial;
    public camera: OrthographicCamera;
    public scene: Scene;
    public quad: Mesh;

    constructor(shader: Shader, textureID?: string) {

        super();
        this.textureID = (textureID !== undefined) ? textureID : 'tDiffuse';

        this.uniforms = UniformsUtils.clone(shader.uniforms);

        this.material = new ShaderMaterial({

            // defines: Object.assign({}, shader.defines),
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,

        });


        if (shader instanceof ShaderMaterial) {

            this.uniforms = shader.uniforms;

            this.material = shader;

        }

        this.camera = new OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
        this.scene = new Scene();

        this.quad = new Mesh(new PlaneBufferGeometry(2, 2), new MeshBasicMaterial({ color: 0xffffff }));
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add(this.quad);
    }

    public render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        delta?: number,
        maskActive?: boolean) {

        if (this.uniforms[this.textureID]) {

            this.uniforms[this.textureID].value = readBuffer.texture;

        }

        this.quad.material = this.material;

        if (this.renderToScreen) {

            renderer.render(this.scene, this.camera);

        } else {

            renderer.render(this.scene, this.camera, writeBuffer, this.clear);

        }
    }
}

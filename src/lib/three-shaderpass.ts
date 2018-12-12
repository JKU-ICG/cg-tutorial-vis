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
    PerspectiveCamera,
    Color,
    MeshBasicMaterial,
    SphereBufferGeometry,
    MeshPhongMaterial,
    DirectionalLight,
    HemisphereLight,
    Sphere,
} from 'three';

import { Pass } from './three-pass';

export class ShaderPass extends Pass {

    public textureID: string;
    public uniforms: { [uniform: string]: IUniform };
    public camera: PerspectiveCamera;
    public scene: Scene;
    private geometry = new SphereBufferGeometry(10, 64, 64);
    private material: ShaderMaterial;
    private sphere: Mesh;
    // public quad: Mesh;

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

        // this.camera = new OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
        // this.scene = new Scene();

        // this.quad = new Mesh(new PlaneBufferGeometry(2, 2), new MeshBasicMaterial({ color: 0xffffff }));
        // this.quad.frustumCulled = false; // Avoid getting clipped
        // this.scene.add(this.quad);
        this.sphere = new Mesh(this.geometry, this.material);
        this.scene = new Scene();
        this.scene.background = new Color(0xf0f0f0);
        this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, 30);

        this.scene.add(this.sphere);

        const dirLight = new DirectionalLight(0xffffff, .5);
        dirLight.position.set(150, 75, 150);
        this.scene.add(dirLight);


        const dirLight2 = new DirectionalLight(0xffffff, .2);
        dirLight2.position.set(- 150, 75, - 150);
        this.scene.add(dirLight2);

        const dirLight3 = new DirectionalLight(0xffffff, .1);
        dirLight3.position.set(0, 125, 0);
        this.scene.add(dirLight3);

        const hemisphereLight = new HemisphereLight(0xfceafc, 0x000000, .8);
        this.scene.add(hemisphereLight);
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

        this.sphere.material = this.material;

        if (this.renderToScreen) {

            const mesh = new Mesh(new SphereBufferGeometry(2, 30, 30), new MeshBasicMaterial({ color: 0xff00ff }));
            const myscene = new Scene();
            myscene.add(mesh);
            console.log(this.scene);
            console.log(this.camera);
            renderer.render(this.scene, this.camera);

        } else {

            renderer.render(this.scene, this.camera, writeBuffer, this.clear);

        }
    }
}

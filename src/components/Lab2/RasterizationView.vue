<template>
    <div>
         <script id="vertexShader" type="x-shader/x-vertex">
            
            varying vec2 vUv;

            void main()	{
                
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        </script>
        
        <script id="fragmentShader" type="x-shader/x-fragment">
            
            uniform sampler2D texture;
            uniform float pixelSize;
            uniform vec2 resolution;

            varying vec2 vUv;
            void main( void ) {
                
                vec2 dxy = pixelSize / resolution;
                vec2 coord = dxy * floor ( vUv / dxy);
                
                gl_FragColor = texture2D( texture, coord );
                
            }
        </script>
    </div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { watch } from 'fs';

import {
    PerspectiveCamera, Scene, WebGLRenderer, Mesh, SphereBufferGeometry,
    MeshPhongMaterial, Color, PlaneBufferGeometry, MeshBasicMaterial,
    RawShaderMaterial, BufferGeometry, Float32BufferAttribute,
    Uint8BufferAttribute, DoubleSide, Vector2, LinearFilter,
    RGBAFormat, WebGLRenderTarget, ShaderMaterial, SphereGeometry,
    DirectionalLight, HemisphereLight, TextureLoader, RepeatWrapping,
    BoxBufferGeometry, NearestFilter, AnyLoader, BoxGeometry, OrthographicCamera,
    ClampToEdgeWrapping,
    Texture} from 'three';

@Component({})
export class Rasterization extends Vue {

    private screenWidth = window.innerWidth / 2;
    private screenHeight = window.innerHeight / 2;
    private aspectRatio: any;

    private renderer: any;
    private scene: any;
    private camera: any;

    private bufferScene: any;
    private bufferTexture: any;
    private bufferUniforms: any;

    private boxMesh: any;

    private mounted() {
        this.init();
        this.animate();
    }

    private init() {

        this.aspectRatio = this.screenWidth / this.screenHeight;

        this.camera = new PerspectiveCamera(70, this.aspectRatio, 1, 1000);

        this.initRenderer();
        this.createBufferScene();
        this.createBufferTexture();
        this.createBufferUniforms();
        this.createMainScene();
    }

    private animate() {

        requestAnimationFrame(this.animate);

        this.renderer.render(this.bufferScene, this.camera, this.bufferTexture);

        this.boxMesh.rotation.x += 0.001;
        this.boxMesh.rotation.y += 0.001;
        this.boxMesh.rotation.z += 0.001;

        this.renderer.render(this.scene, this.camera);
    }

    private initRenderer() {

        this.renderer = new WebGLRenderer();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);

        this.$el.appendChild(this.renderer.domElement);
    }

    private createBufferScene() {

        this.bufferScene = new Scene();

        const cubeGeometry = new BoxBufferGeometry(2, 2, 2);

        const cubeMaterial = new MeshBasicMaterial({ color: 0xF06565 });

        const cube = new Mesh(cubeGeometry, cubeMaterial);

        cube.position.z = -10;

        this.bufferScene.add(cube);
    }

    private createBufferTexture() {

        const parameters = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat,
            stencilBuffer: false,
        };

        this.bufferTexture = new WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);
    }

    private createBufferUniforms() {

        const resValue = new Vector2(window.innerWidth, window.innerHeight)
            .multiplyScalar(window.devicePixelRatio);

        const textureVal = this.bufferTexture.texture;

        this.bufferUniforms = {
            texture: { value: textureVal },
            resolution: { value: resValue },
            pixelSize: { value: 2.0 },
        };
    }

    private createMainScene() {

        this.scene = new Scene();

        this.scene.background = new Color(0xffffff);

        const boxMaterial = new ShaderMaterial({
            uniforms: this.bufferUniforms,
            vertexShader: document.getElementById('vertexShader')!.textContent || '',
            fragmentShader: document.getElementById('fragmentShader')!.textContent || '',
        });

        const boxGeometry = new BoxBufferGeometry(5, 5, 5);

        this.boxMesh = new Mesh(boxGeometry, boxMaterial);

        this.boxMesh.position.z = -10;

        this.scene.add(this.boxMesh);
    }
}

export default Rasterization;
</script>

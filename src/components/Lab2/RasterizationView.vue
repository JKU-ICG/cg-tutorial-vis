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

    private renderer = new WebGLRenderer();
    private scene = new Scene();
    private camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    private bufferScene = new Scene();
    private bufferTexture: any;
    private boxMesh: any;
    private screenWidth: any;
    private screenHeight: any;
    private aspectRatio: any;

    private mounted() {
        this.init();
        this.animate();
    }

    private init() {

        this.screenWidth = window.innerWidth / 2;
        this.screenHeight = window.innerHeight / 2;
        this.aspectRatio = this.screenWidth / this.screenHeight;

        this.camera = new PerspectiveCamera(70, this.aspectRatio, 1, 1000);

        this.scene = new Scene();
        this.scene.background = new Color(0xffffff);

        // have a buffer scene, offscreen buffer
        this.bufferScene = new Scene();

        const cube = new Mesh(new BoxBufferGeometry(2, 2, 2), new MeshBasicMaterial({ color: 0xF06565 }));
        cube.position.z = -10;
        this.bufferScene.add(cube);

        const parameters = {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat,
            stencilBuffer: false,
        };

        this.bufferTexture = new WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

        const resValue = new Vector2(window.innerWidth, window.innerHeight);
        resValue.multiplyScalar(window.devicePixelRatio);

        const textureVal = this.bufferTexture.texture;

        // calculate uniforms based on the render target
        const uniforms1 = {
            texture: { value: textureVal },
            resolution: { value: resValue },
            pixelSize: { value: 2.0 },
        };

        const boxMaterial = new ShaderMaterial({
            uniforms: uniforms1,
            vertexShader: document.getElementById('vertexShader')!.textContent || '',
            fragmentShader: document.getElementById('fragmentShader')!.textContent || '',
        });

        // boxMaterial.uniforms.texture.value.wrapS = boxMaterial.uniforms.texture.value.wrapT = ClampToEdgeWrapping;

        const boxGeometry = new BoxBufferGeometry(5, 5, 5);

        this.boxMesh = new Mesh(boxGeometry, boxMaterial);

        this.boxMesh.position.z = -10;

        this.scene.add(this.boxMesh);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);

        this.$el.appendChild(this.renderer.domElement);
    }

    private animate() {

        requestAnimationFrame(this.animate);

        this.renderer.render(this.bufferScene, this.camera, this.bufferTexture);

        this.boxMesh.rotation.x += 0.001;
        this.boxMesh.rotation.y += 0.001;
        this.boxMesh.rotation.z += 0.001;

        this.renderer.render(this.scene, this.camera);
    }

}

export default Rasterization;
</script>

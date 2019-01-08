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
            varying vec2 vUv;

            void main( void ) {

                float x = fract(vUv.x * 20.0);
                float y = fract(vUv.y * 20.0);

                if(( x > 0.9 && x < 1.0 ) || ( y > 0.9 && y < 1.0 ))
                {
                    gl_FragColor = vec4(0.2,0.2,0.2,0.2);
                }
                else
                {
                    gl_FragColor = texture2D( texture, vUv );
                }
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
    Texture,
    MeshDepthMaterial} from 'three';

import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';

@Component({})
export class Rasterization extends Vue {

    private screenWidth = 600;
    private screenHeight = 600;
    private aspectRatio: any;

    private renderer: any;
    private scene: any;
    private camera: any;

    private bufferScene: any;
    private bufferTexture: any;
    private bufferUniforms: any;

    private planeMesh: any;
    private abstractSpace = new AbstractSpace();

    private planeMaterial: any;

    private timeValue: number = 0.0;

    private mounted() {
        this.init();
        this.animate();
    }

    private init() {

        this.aspectRatio = this.screenWidth / this.screenHeight;

        this.camera = new PerspectiveCamera(50, this.aspectRatio, 100, 10000);
        this.camera.position.z = 700;

        this.initRenderer();
        this.createBufferScene();
        this.createBufferTexture();
        this.createBufferUniforms();
        this.createMainScene();
    }

    private animate() {

        requestAnimationFrame(this.animate);

        this.renderer.render(this.bufferScene, this.camera, this.bufferTexture, true);

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

        const planeGeometry = new PlaneBufferGeometry(500, 500);

        const planeMaterial = new MeshPhongMaterial({
            color: 0x2194ce,
            specular: new Color().setHSL(0.1, 0.5, 0.5),
            reflectivity: 0.2,
            shininess: 4,
            wireframe: true,
        });

        const plane = new Mesh(planeGeometry, planeMaterial);

        plane.position.z = -10;

        const directionalLightModelView = new DirectionalLight(0xffffff, 1);
        directionalLightModelView.position.set(1, 1, 1).normalize();

        this.bufferScene.add(plane);
        this.bufferScene.add(directionalLightModelView);
    }

    private createBufferTexture() {

        const parameters = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            stencilBuffer: false,
        };

        this.bufferTexture = new WebGLRenderTarget(this.screenWidth / 30, this.screenHeight / 30, parameters);
    }

    private createBufferUniforms() {

        const textureVal = this.bufferTexture.texture;
        textureVal.wrapS = ClampToEdgeWrapping;
        textureVal.wrapT = ClampToEdgeWrapping;
        textureVal.repeat.set(4, 4);

        this.bufferUniforms = {
            'texture': { value: textureVal },
        };
    }

    private createMainScene() {

        this.scene = new Scene();

        this.scene.background = new Color(0xffffff);

        this.planeMaterial = new ShaderMaterial({
            uniforms: this.bufferUniforms,
            vertexShader: document.getElementById('vertexShader')!.textContent || '',
            fragmentShader: document.getElementById('fragmentShader')!.textContent || '',
        });

        const planeGeometry = new PlaneBufferGeometry(500, 500);

        this.planeMesh = new Mesh(planeGeometry, this.planeMaterial);

        this.planeMesh.position.z = -10;

        const directionalLightModelView = new DirectionalLight(0xffffff, 1);
        directionalLightModelView.position.set(1, 1, 1).normalize();

        this.scene.add(this.planeMesh);
        this.scene.add(directionalLightModelView);
    }
}

export default Rasterization;
</script>

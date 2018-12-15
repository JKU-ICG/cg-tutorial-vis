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

            uniform float time;
            uniform sampler2D texture;
            varying vec2 vUv;
            void main( void ) {
                vec2 position = - 1.0 + 2.0 * vUv;
                float a = atan( position.y, position.x );
                float r = sqrt( dot( position, position ) );
                vec2 uv;
                uv.x = cos( a ) / r;
                uv.y = sin( a ) / r;
                uv /= 10.0;
                uv += time * 0.05;
                vec3 color = texture2D( texture, uv ).rgb;
                gl_FragColor = vec4( color * r * 1.5, 1.0 );
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
    DirectionalLight, HemisphereLight, TextureLoader, RepeatWrapping, BoxBufferGeometry} from 'three';

@Component({})
export class Test2 extends Vue {

    private renderer = new WebGLRenderer();
    private scene = new Scene();
    private camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    private geometry: any;
    private material: any;

    private mounted() {
        this.init();
        this.animate();
    }

    private init() {
        this.camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000);
        this.scene = new Scene();
        this.scene.background = new Color(0xffffff);
        this.camera.position.z = 4;

        const uniforms1 = {
            time: { value: 1.0 },
            texture: { value: new TextureLoader().load('disturb.jpg') },
        };

        uniforms1.texture.value.wrapS = uniforms1.texture.value.wrapT = RepeatWrapping;

        this.material = new ShaderMaterial({
            uniforms: uniforms1,
            vertexShader: document.getElementById('vertexShader')!.textContent || '',
            fragmentShader: document.getElementById('fragmentShader')!.textContent || '',
        });


        this.geometry = new BoxBufferGeometry(0.75, 0.75, 0.75);

        const cube = new Mesh(this.geometry, this.material);

        this.scene.add(cube);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.$el.appendChild(this.renderer.domElement);

    }

    private animate() {
        requestAnimationFrame(this.animate);
        const time = performance.now();

        const object = this.scene.children[0];

        object.rotation.y = time * 0.0005;
        // object.material.uniforms.time.value = time * 0.005;

        this.renderer.render(this.scene, this.camera);
    }

}

export default Test2;
</script>

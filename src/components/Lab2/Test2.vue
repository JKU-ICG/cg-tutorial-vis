<template>
    <div>
        <script id="vertexShader" type="x-shader/x-vertex">
            precision mediump float;
            precision mediump int;
            uniform mat4 modelViewMatrix; // optional
            uniform mat4 projectionMatrix; // optional
            attribute vec3 position;
            attribute vec4 color;
            varying vec3 vPosition;
            varying vec4 vColor;
            void main()	{
                vPosition = position;
                vColor = color;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        </script>
        
        <script id="fragmentShader" type="x-shader/x-fragment">

            precision mediump int;
            uniform float time;
            varying vec3 vPosition;
            varying vec4 vColor;
            void main()	{
                vec4 color = vec4( vColor );
                color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
                gl_FragColor = color;
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
    MeshPhongMaterial,
    Color, PlaneBufferGeometry, MeshBasicMaterial, RawShaderMaterial} from 'three';


@Component({})
export class Test2 extends Vue {

    private renderer = new WebGLRenderer();
    private scene = new Scene();
    private camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    private geometry = new SphereBufferGeometry(10, 64, 64);
    private material = new MeshPhongMaterial({ color: 0xff0000, shininess: 200 });
    private sphere = new Mesh(this.geometry, this.material);
    private quad: any;

    private mounted() {
        this.init();
        this.animate();
    }

    // Change
    private init() {
        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10);
        this.camera.position.z = 2;
        this.scene = new Scene();
        this.scene.background = new Color(0x101010);


        this.quad = new Mesh(new PlaneBufferGeometry(2, 2), new MeshBasicMaterial({ color: 0xffffff }));
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add(this.quad);

        this.scene.add(this.sphere);

        const material = new RawShaderMaterial({
            uniforms: {
                time: { value: 1.0 },
            },
            vertexShader: document.getElementById('vertexShader')!.textContent || '',
            fragmentShader: document.getElementById('fragmentShader')!.textContent || '',
        });


        this.quad.material = material;

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.$el.appendChild(this.renderer.domElement);

    }

    private animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

}

export default Test2;
</script>

<template>
    <div>        
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
    BoxBufferGeometry, NearestFilter, AnyLoader, BoxGeometry} from 'three';

@Component({})
export class Test3 extends Vue {

    private renderer = new WebGLRenderer();
    private scene = new Scene();
    private camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    private geometry: any;
    private material: any;
    private bufferScene = new Scene();
    private bufferTexture: any;
    private boxMesh: any;

    private mounted() {
        this.init();
        this.animate();
    }

    private init() {
        this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        this.scene = new Scene();
        this.scene.background = new Color(0xffffff);

        this.bufferScene = new Scene();
        this.bufferTexture = new WebGLRenderTarget(window.innerWidth, window.innerHeight,
            { minFilter: LinearFilter, magFilter: NearestFilter });

        this.geometry = new BoxBufferGeometry(5, 5, 5);

        const cube = new Mesh(this.geometry, new MeshBasicMaterial({ color: 0xF06565 }));
        cube.position.z = -10;
        this.bufferScene.add(cube);

        // const plane = new PlaneBufferGeometry(2, 2, 1, 1);
        // const planeObject = new Mesh(plane, new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide }));
        // this.bufferScene.add(planeObject);

        const boxMaterial = new MeshBasicMaterial({ map: this.bufferTexture.texture });
        const boxGeometry = new BoxGeometry(5, 5, 5);

        this.boxMesh = new Mesh(boxGeometry, boxMaterial);

        this.boxMesh.position.z = -10;

        this.scene.add(this.boxMesh);

        // this.scene.add(planeObject);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

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

export default Test3;
</script>

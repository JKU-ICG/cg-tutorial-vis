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
    PerspectiveCamera, Scene, WebGLRenderer, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments, BoxHelper,
    SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color,
    CameraHelper, Vector2, MeshPhongMaterial, DirectionalLight, log,
    OrthographicCamera, HemisphereLight} from 'three';

import { ShaderPass } from '@/lib/three-shaderpass';
import { RenderPass } from '@/lib/three-renderpass';
import { EffectComposer } from '@/lib/three-effectcomposer';
import { CopyShader } from '@/lib/three-copyshader';
import { PixelShader } from '@/lib/three-pixelshader';

@Component({})
export class Test extends Vue {

    private renderer = new WebGLRenderer();
    private scene = new Scene();
    private camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    private composer = new EffectComposer(this.renderer);
    private pixelPass = new ShaderPass(PixelShader);
    private geometry = new SphereBufferGeometry(10, 64, 64);
    private material = new MeshPhongMaterial({ color: 0xff0000, shininess: 200 });
    private sphere = new Mesh(this.geometry, this.material);


    private mounted() {
        this.init();
        this.animate();
    }

    private init() {

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.$el.appendChild(this.renderer.domElement);

        this.scene.background = new Color(0xf0f0f0);
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


        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.pixelPass.uniforms.resolution.value = new Vector2(window.innerWidth, window.innerHeight);

        this.pixelPass.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);
        this.pixelPass.renderToScreen = true;
        this.composer.addPass(this.pixelPass);
    }

    private animate() {

        requestAnimationFrame(this.animate);
        this.composer.render();
        this.sphere.rotation.y += 0.01;
        this.sphere.rotation.z += 0.01;
        // this.renderer.render(this.scene, this.camera);
    }

}

export default Test;
</script>
<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export class ModelSpace extends Vue {
    private camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    private scene = new Three.Scene();
    private renderer = new Three.WebGLRenderer();

    private init() {
        this.miniWorld();
        this.addObject();
        this.renderScene();
        this.$el.appendChild(this.renderer.domElement);
    }

    private renderScene() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.z = 400;
        this.renderer.render(this.scene, this.camera);
    }

    private miniWorld() {
        const boxGeometry = new Three.BoxBufferGeometry(250, 250, 250);
        const edges = new Three.EdgesGeometry(boxGeometry);
        const line = new Three.LineSegments(edges);
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        line.position.x = 0;
        this.scene.add(new Three.BoxHelper(line));
    }

    private addObject() {
        const vertices = new Float32Array([
            25.0, 25.0, 25.0,
            25.0, 25.0, -25.0,
            25.0, -25.0, 25.0,
            25.0, -25.0, -25.0,
            -25.0, 25.0, -25.0,
            -25.0, 25.0, 25.0,
            -25.0, -25.0, 25.0,
            -25.0, -25.0, -25.0,
        ]);

        let i = 0;
        while (i < vertices.length) {
            const sphere = new Three.SphereBufferGeometry(2, 10, 10);
            const material = new Three.MeshBasicMaterial({ color: 0x00ffff });
            const drawSphere = new Three.Mesh(sphere, material);
            drawSphere.position.x = vertices[i];
            drawSphere.position.y = vertices[i + 1];
            drawSphere.position.z = vertices[i + 2];
            i = i + 3;
            this.scene.add(drawSphere);
        }
    }

    private animate() {
        requestAnimationFrame(this.animate);
        this.camera.lookAt(this.scene.position);
        const time = -performance.now() * 0.0003;
        // this.cube.rotation.x += 0.01; // cube rotation
        this.camera.position.x = 400 * Math.cos(time); // entire scene rotation
        this.renderer.render(this.scene, this.camera);
    }

    private mounted() {
        this.init();
        this.animate();
    }
}

export default ModelSpace;
</script>
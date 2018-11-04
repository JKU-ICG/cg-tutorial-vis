<template>
    <div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
    PerspectiveCamera, OrthographicCamera, Scene,
    WebGLRenderer, Group, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments,
    BoxHelper, SphereBufferGeometry, Mesh} from 'three';

// Scene comprises of a world and an object
@Component({})
export class AbstractSpace extends Vue {
    private worldCamera: any;
    private objectCamera: any;
    private worldScene = new Scene();
    private objectScene = new Scene();
    private renderer = new WebGLRenderer();

    protected init(isWorldOrthographic: boolean, isObjectOrthographic: boolean) {
        if (isWorldOrthographic) {
            this.worldCamera = new OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
        } else {
            this.worldCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        }

        if (isObjectOrthographic) {
            this.objectCamera = new OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
        } else {
            this.objectCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        }

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        this.miniWorld();
        this.addObject();
        this.renderScene();
        this.$el.appendChild(this.renderer.domElement);
    }

    protected animate() {
        requestAnimationFrame(this.animate);
        this.objectCamera.lookAt(this.objectScene.position);
        const time = -performance.now() * 0.0003;
        this.objectCamera.position.x = 400 * Math.cos(time); // entire object scene rotation
        this.renderScene();
    }

    private renderWorld() {
        this.worldCamera.position.z = 400;
        this.renderer.render(this.worldScene, this.worldCamera);
    }

    private renderObject() {
        this.objectCamera.position.z = 400;
        this.renderer.render(this.objectScene, this.objectCamera);
    }

    private renderScene() {
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderWorld();
        this.renderer.clearDepth();
        this.renderObject();
    }

    private miniWorld() {
        const boxGeometry = new BoxBufferGeometry(250, 250, 250);
        const material = new MeshBasicMaterial({ color: 0xffff00 });
        const edges = new EdgesGeometry(boxGeometry);
        const line = new LineSegments(edges);
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        line.position.x = 0;
        this.worldScene.add(new BoxHelper(line));
    }

    private addCube() {
        const geometry = new BoxBufferGeometry(50, 50, 50);
        const material = new MeshBasicMaterial({ color: 0x0000ff });
        const cube = new Mesh(geometry, material);
        this.objectScene.add(cube);
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
            const sphere = new SphereBufferGeometry(2, 10, 10);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const drawSphere = new Mesh(sphere, material);
            drawSphere.position.x = vertices[i];
            drawSphere.position.y = vertices[i + 1];
            drawSphere.position.z = vertices[i + 2];
            i = i + 3;
            this.objectScene.add(drawSphere);
        }
    }
}

export default AbstractSpace;
</script>
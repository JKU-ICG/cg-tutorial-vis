<template>
  <div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { createNamespacedHelpers } from 'vuex';
import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

import {
    PerspectiveCamera, OrthographicCamera, Scene,
    WebGLRenderer, Group, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments,
    BoxHelper, SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color, BufferAttribute, CameraHelper} from 'three';
import { Watch } from 'vue-property-decorator';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

// Scene comprises of a world and an object

@Component({
    components: {
        vueSlider,
    },
    computed: {
        ...mapGetters(['scaleX', 'scaleY', 'scaleZ', 'translateX', 'translateY', 'translateZ', 'cameraX', 'cameraY', 'cameraZ']),
    },
})
export class AbstractSpace extends Vue {

    // Adjust aspect ratio and make it look good
    // uncomment the commented functionalities
    // add axis on the cube everywhere
    // access watch functions from the individual spaces
    // Camera Properties
    private worldCamera: any;
    // Perspective Camera Properties
    private nearPlane = 100;
    private farPlane = 10000;
    private fov = 50;
    // Orthographic Camera Properties
    private frustumSize = 100;
    // Object Camera Properties
    private objectCamera: any;
    private objectCameraHelper: any;
    private nearPlaneObj = 100;
    private farPlaneObj = 200;
    // Renderer Properties
    private renderer = new WebGLRenderer();
    private screenWidth = window.innerWidth / 2;
    private screenHeight = window.innerHeight / 2;
    private aspectRatio = this.screenWidth / this.screenHeight;
    // Scene
    private scene = new Scene();
    // Object Properties
    private objectScaleXYZ = [1, 1, 1];
    private objectArrowX: any;
    private objectArrowY: any;
    private objectArrowZ: any;
    private arrowLength = 100;
    // Cube
    private cube = new Mesh(new BoxBufferGeometry(100, 100, 100), new MeshBasicMaterial({ color: 0xc0c0c0 }));
    // MiniWorld Dimensions

    protected initCameraSpace(isCameraOrthographic: boolean) {
        this.worldCamera = new PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane);
        this.worldCamera.position.z = 1500;
        this.worldCamera.position.x = 0;
        this.objectCamera = new PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlaneObj, this.farPlaneObj);
        this.objectCameraHelper = new CameraHelper(this.objectCamera);
        this.composeCameraScene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.$el.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
    }

    protected composeCameraScene() {
        this.miniWorld();
        this.scene.add(this.objectCameraHelper);
        this.scene.add(this.objectCamera);
        this.objectCamera.add(this.cube);
    }

    protected animateCameraSpace() {
        requestAnimationFrame(this.animateCameraSpace);
        this.renderCameraSpace();
    }
    protected renderCameraSpace() {
        this.worldCamera.position.z = 500;
        const r = Date.now() * 0.0005;
        this.cube.position.x = 350 * Math.cos(r);
        this.cube.position.y = 350 * Math.sin(r);
        this.cube.position.z = -700;
        // perform update operations
        this.objectCamera.updateProjectionMatrix();
        this.objectCameraHelper.update();
        this.objectCameraHelper.visible = true;
        this.objectCamera.lookAt(this.cube.position);
        this.renderer.clear();
        // render the scene overall as viewed via the object camera
        this.objectCameraHelper.visible = true;
        this.renderer.setViewport(0, 0, this.screenWidth / 2, this.screenHeight);
        this.renderer.render(this.scene, this.worldCamera);
        // render the scene with the object camera
        this.objectCameraHelper.visible = false;
        this.renderer.setViewport(this.screenWidth / 2, 0, this.screenWidth / 2, this.screenHeight);
        this.renderer.render(this.scene, this.objectCamera);
    }

    protected initModelSpace(isObjectOrthographic: boolean) {
        this.worldCamera = new PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.composeScene();
        this.renderWorld();
        this.$el.appendChild(this.renderer.domElement);
    }

    protected animate() {
        requestAnimationFrame(this.animate);
        this.worldCamera.lookAt(this.scene.position);
        this.cube.rotation.x += 0.01;
        this.renderWorld();
    }

    private renderWorld() {
        this.worldCamera.position.z = 400;
        this.renderer.render(this.scene, this.worldCamera);
    }

    private composeScene() {
        this.miniWorld();
        this.addVertices();
        this.addCube();
        this.addObjectAxis();
    }

    private miniWorld() {
        const boxGeometry = new BoxBufferGeometry(325, 325, 325);
        const material = new MeshBasicMaterial();
        const edges = new EdgesGeometry(boxGeometry);
        const line = new LineSegments(edges);
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        line.position.x = 0;
        this.scene.add(new BoxHelper(line));
    }

    private addCube() {
        this.scene.add(this.cube);
    }

    private addVertices() {
        const vertices = new Float32Array([
            50.0, 50.0, 50.0,
            50.0, 50.0, -50.0,
            50.0, -50.0, 50.0,
            50.0, -50.0, -50.0,
            -50.0, 50.0, -50.0,
            -50.0, 50.0, 50.0,
            -50.0, -50.0, 50.0,
            -50.0, -50.0, -50.0,
        ]);

        let i = 0;
        while (i < vertices.length) {
            const sphere = new SphereBufferGeometry(3, 10, 10);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const drawSphere = new Mesh(sphere, material);
            drawSphere.position.x = vertices[i];
            drawSphere.position.y = vertices[i + 1];
            drawSphere.position.z = vertices[i + 2];
            i = i + 3;
            this.scene.add(drawSphere);
        }
    }

    private addObjectAxis() {
        const origin = new Vector3(0, 0, 0);
        const dirX = new Vector3(1, 0, 0);
        const dirY = new Vector3(0, 1, 0);
        const dirZ = new Vector3(0, 0, 1);
        this.objectArrowX = new ArrowHelper(dirX, origin, this.arrowLength, 0xff0000);
        this.objectArrowY = new ArrowHelper(dirY, origin, this.arrowLength, 0x00ff00);
        this.objectArrowZ = new ArrowHelper(dirZ, origin, this.arrowLength, 0x0000cc);
        this.scene.add(this.objectArrowX);
        this.scene.add(this.objectArrowY);
        this.scene.add(this.objectArrowZ);
    }

    private scaleObject() {
        this.cube.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        // this.renderWorld();
        this.renderCameraSpace();
    }

    @Watch('scaleX') // to be called from individual space modules
    private scaleObjectXAxis(valX: number) {
        // this.objectArrowX.setLength(this.arrowLength * valX);
        this.objectScaleXYZ[0] = valX / 2;
        this.scaleObject();
    }

    @Watch('scaleY')
    private scaleObjectYAxis(valY: number) {
        // this.objectArrowY.setLength(this.arrowLength * valY);
        this.objectScaleXYZ[1] = valY / 2;
        this.scaleObject();
    }

    @Watch('scaleZ')
    private scaleObjectZAxis(valZ: number) {
        // this.objectArrowZ.setLength(this.arrowLength * valZ);
        this.objectScaleXYZ[2] = valZ / 2;
        this.scaleObject();
    }

    @Watch('translateX')
    private translateObjX(valX: number) {
        this.cube.position.x = valX * 10;
        // this.renderWorld();
        this.renderCameraSpace();
    }

    @Watch('translateY')
    private translateObjY(valY: number) {
        this.cube.position.y = valY * 10;
        // this.renderWorld();
        this.renderCameraSpace();
    }

    @Watch('translateZ')
    private translateObjZ(valZ: number) {
        this.cube.position.z = valZ * 10;
        // this.renderWorld();
        this.renderCameraSpace();
    }

    @Watch('cameraX')
    private translateCameraX(valX: number) {
        // cameraSpace things to be dealt here.

    }

    @Watch('cameraY')
    private translateCameraY(valY: number) {

    }

    @Watch('cameraZ')
    private translateCameraZ(valZ: number) {

    }
}

export default AbstractSpace;
</script>
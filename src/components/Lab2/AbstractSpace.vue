<template>
  <div></div>
</template>

<script lang = "ts">
// see if the removal of else if condition in rotate camera stopped the rotation??
// Go back to the frustum view version and implement trackball controls there??
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { isNullOrUndefined } from 'util';
import { CameraControls } from '@/components/Lab2/CameraControls.vue';
import {
    PerspectiveCamera, OrthographicCamera, Scene,
    WebGLRenderer, Group, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments,
    BoxHelper, SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color,
    BufferAttribute, CameraHelper, Quaternion, Vector2, SceneUtils, MeshDepthMaterial} from 'three';


// Scene comprises of a world and an object
// TO DOs: Object translation should also contain negative values.
// Object axis to be fixed.
export class AbstractSpace extends mixins(CameraControls) {

    // Renderer Properties
    private renderer: WebGLRenderer;
    private screenWidth: number;
    private screenHeight: number;
    private aspectRatio: number;

    // Scene
    private scene: Scene;

    // Object Properties
    private scaleObject: { x: number, y: number, z: number };
    private objectArrowX: any; // ArrowHelper; // to be dealt with later
    private objectArrowY: any; // ArrowHelper;
    private objectArrowZ: any; // ArrowHelper;
    private arrowLength: number;

    // Cube
    private cube: Mesh;

    // Cameras
    private mainCamera: PerspectiveCamera;
    private objectCamera: any;
    private objectCameraHelper: CameraHelper;

    // is not a function!!!
    constructor() {
        super();

        this.renderer = new WebGLRenderer();
        this.screenWidth = window.innerWidth / 2;
        this.screenHeight = window.innerHeight / 2;
        this.aspectRatio = this.screenWidth / this.screenHeight;

        this.scene = new Scene();
        this.scaleObject = { x: 1, y: 1, z: 1 };

        this.mainCamera = this.fetchMainCamera();
        this.objectCamera = this.getObjectCamera();
        this.objectCameraHelper = this.getObjectCameraHelper();

        this.arrowLength = 100;
        this.cube = new Mesh(new BoxBufferGeometry(100, 100, 100), new MeshBasicMaterial({ color: 0xc0c0c0 }));
    }

    public initCameraView(el: any) {
        this.screenWidth = window.innerWidth; // because of renderering 2 views in one.
        this.updateMainCamera();
        this.composeCameraScene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        el.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
    }

    public initModelView(el: any) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.composeModelScene();
        this.renderMainCameraView();
        el.appendChild(this.renderer.domElement);
    }

    public renderScene() {
        this.objectCamera.updateProjectionMatrix(); // perform update operations
        this.objectCameraHelper.update();
        this.objectCameraHelper.visible = true;
        this.objectCamera.lookAt(this.cube.position);
        this.renderer.clear();
        this.renderMainCameraView(); // render the scene overall as viewed via the world camera
        this.renderObjectCameraView(); // render the scene as viewed via the object camera
    }

    // access specifiers to be changed?
    public renderMainCameraView() {
        this.mainCamera.position.z = 500;

        if (!isNullOrUndefined(this.objectCameraHelper)) {
            this.objectCameraHelper.visible = true;
            this.renderer.setViewport(0, 0, this.screenWidth / 2, this.screenHeight);
        }

        this.renderer.render(this.scene, this.mainCamera);
    }

    public renderObjectCameraView() {
        this.objectCameraHelper.visible = false;
        this.renderer.setViewport(this.screenWidth / 2, 0, this.screenWidth / 2, this.screenHeight);
        this.renderer.render(this.scene, this.objectCamera);
    }

    // Interactions
    public scaleObjectXAxis(valX: number) {
        this.objectArrowX.setLength(this.arrowLength * valX);
        this.scaleObject.x = valX / 2;
        this.cube.scale.set(this.scaleObject.x, this.scaleObject.y, this.scaleObject.z);
    }

    public scaleObjectYAxis(valY: number) {
        this.objectArrowY.setLength(this.arrowLength * valY);
        this.scaleObject.y = valY / 2;
        this.cube.scale.set(this.scaleObject.x, this.scaleObject.y, this.scaleObject.z);
    }

    public scaleObjectZAxis(valZ: number) {
        this.objectArrowZ.setLength(this.arrowLength * valZ);
        this.scaleObject.z = valZ / 2;
        this.cube.scale.set(this.scaleObject.x, this.scaleObject.y, this.scaleObject.z);
    }

    // also the arrows and vertices should change their position
    public translateObjX(valX: number) {
        this.cube.position.x = valX * 100;
    }

    public translateObjY(valY: number) {
        this.cube.position.y = valY * 100;
    }

    public translateObjZ(valZ: number) {
        this.cube.position.z = valZ * 100;
    }

    private composeCameraScene() {
        this.miniWorld();
        this.scene.add(this.objectCameraHelper);
        this.scene.add(this.objectCamera);
        this.addCube(); // this.objectCamera.add(this.cube);
        this.addObjectAxis(); // not working?
    }
    private composeModelScene() {
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
        const origin = new Vector3(this.cube.position.x, this.cube.position.y, this.cube.position.z);
        const dirX = new Vector3(this.cube.position.x + 1, 0, 0);
        const dirY = new Vector3(0, this.cube.position.y + 1, 0);
        const dirZ = new Vector3(0, 0, this.cube.position.z + 1);
        this.objectArrowX = new ArrowHelper(dirX, origin, this.arrowLength, 0xff0000);
        this.objectArrowY = new ArrowHelper(dirY, origin, this.arrowLength, 0x00ff00);
        this.objectArrowZ = new ArrowHelper(dirZ, origin, this.arrowLength, 0x0000cc);
        this.scene.add(this.objectArrowX);
        this.scene.add(this.objectArrowY);
        this.scene.add(this.objectArrowZ);
    }
}

export default AbstractSpace;
</script>
<template>
  <div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import mixins from 'vue-class-component';
import CameraControls from '@/components/Lab2/CameraControls.vue';
import {
    PerspectiveCamera, Scene, WebGLRenderer, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments, BoxHelper,
    SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color,
    CameraHelper, Vector2, MeshPhongMaterial, DirectionalLight, log, OrthographicCamera} from 'three';


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
    private objectArrowX: any; // ArrowHelper;
    private objectArrowY: any; // ArrowHelper;
    private objectArrowZ: any; // ArrowHelper;
    private arrowLength: number;

    // Cube
    private cube: Mesh;

    // Cameras
    private mainCamera: PerspectiveCamera;

    private objectPerspectiveCamera: PerspectiveCamera;
    private objectOrthographicCamera: OrthographicCamera;

    private objectPerspectiveCameraHelper: CameraHelper;
    private objectOrthographicCameraHelper: CameraHelper;

    private isObjectCameraPespective: boolean;

    // Light
    private directionalLight: DirectionalLight;

    constructor() {
        super();

        this.renderer = new WebGLRenderer();
        this.screenWidth = window.innerWidth / 2;
        this.screenHeight = window.innerHeight / 2;
        this.aspectRatio = this.screenWidth / this.screenHeight;

        this.scene = new Scene();
        this.scaleObject = { x: 1, y: 1, z: 1 };

        this.mainCamera = this.getMainCamera();

        this.objectPerspectiveCamera = this.getObjectPerspectiveCamera();
        this.objectPerspectiveCameraHelper = this.getObjectPerspectiveCameraHelper();

        this.objectOrthographicCamera = this.getObjectOrthographicCamera();
        this.objectOrthographicCameraHelper = this.getObjectOrthographicCameraHelper();

        this.isObjectCameraPespective = true;

        this.arrowLength = 300;

        const material = new MeshPhongMaterial({
            color: 0x2194ce,
            specular: new Color().setHSL(0.1, 0.5, 0.5),
            reflectivity: 0.2,
            shininess: 4,
        });

        this.cube = new Mesh(new BoxBufferGeometry(200, 200, 200), material);

        this.directionalLight = new DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(1, 1, 1).normalize();
    }

    public initCameraView(el: HTMLElement) {
        this.screenWidth = window.innerWidth; // because of renderering 2 views in one.

        this.reset();
        this.updateAndRotate();
        this.composeCameraScene();

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);

        el.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
    }

    public initModelView(el: HTMLElement) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);

        this.composeModelScene();

        el.appendChild(this.renderer.domElement);
    }

    public animateCameraView() {

        // this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.cube.rotation.z += 0.01;

        requestAnimationFrame(this.animateCameraView.bind(this));

        // Camera Helpers have been added individually to the scene, therefore must be updated accordingly.
        if (this.isObjectCameraPespective) {

            this.objectPerspectiveCameraHelper.visible = true;
            this.objectOrthographicCameraHelper.visible = false;

            this.objectPerspectiveCamera.updateProjectionMatrix();
            this.objectPerspectiveCamera.lookAt(this.cube.position);

            this.objectPerspectiveCameraHelper.update();
        } else {

            this.objectPerspectiveCameraHelper.visible = false;
            this.objectOrthographicCameraHelper.visible = true;

            this.objectOrthographicCamera.updateProjectionMatrix();
            this.objectOrthographicCamera.lookAt(this.cube.position);

            this.objectOrthographicCameraHelper.update();
        }

        this.renderer.clear();

        this.renderMainCameraView(); // render the scene overall as viewed via the world camera

        this.objectPerspectiveCameraHelper.visible = false;
        this.objectOrthographicCameraHelper.visible = false;

        this.renderObjectCameraView(); // render the scene as viewed via the object camera
    }

    public animateModelView() {
        requestAnimationFrame(this.animateModelView.bind(this));

        this.mainCamera.position.set(100, 0, 500);
        this.renderer.render(this.scene, this.mainCamera);
    }

    public onSwitchCamera(camera: string) {
        this.isObjectCameraPespective = false;

        if (camera.localeCompare('Perspective') === 0) {

            this.isObjectCameraPespective = true;
        }

        this.setIsObjCameraPerspective(this.isObjectCameraPespective);
    }

    public encapsulateDomElementAndAnimate(event: MouseEvent) {
        this.animateOnMouseMoveEvent(event, this.renderer.domElement);
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

    // will anyway change in the future because of view separation
    private renderMainCameraView() {
        this.renderer.setViewport(0, 0, this.screenWidth / 2, this.screenHeight);
        this.renderer.render(this.scene, this.mainCamera);
    }


    // translateZ : 2, CameraY: 4, CameraZ: 2, value acting weird. check the issue
    private renderObjectCameraView() {
        this.renderer.setViewport(this.screenWidth / 2, 0, this.screenWidth / 2, this.screenHeight);

        if (this.isObjectCameraPespective) {
            console.log('Perspective Props:');
            console.log(this.objectPerspectiveCamera.fov);
            console.log(this.objectPerspectiveCamera.far);
            this.renderer.render(this.scene, this.objectPerspectiveCamera);
        } else {
            console.log('Orthographic Props:');
            console.log(this.objectOrthographicCamera.left);
            console.log(this.objectOrthographicCamera.far);
            this.renderer.render(this.scene, this.objectOrthographicCamera);
        }
    }

    private composeCameraScene() {
        this.miniWorld();
        this.addCube();
        this.addObjectAxis();
        this.addLightsAndCameras();
    }

    private addLightsAndCameras() {
        // camera needs to be added to the scene as it has a child object
        this.directionalLight.target = this.cube;

        this.objectPerspectiveCamera.add(this.directionalLight);
        this.objectOrthographicCamera.add(this.directionalLight);

        this.scene.add(this.objectPerspectiveCamera);
        this.scene.add(this.objectPerspectiveCameraHelper);

        this.scene.add(this.objectOrthographicCamera);
        this.scene.add(this.objectOrthographicCameraHelper);
    }

    private composeModelScene() {
        this.scene.add(this.directionalLight);

        this.miniWorld();
        this.addVertices();
        this.addCube();
        this.addObjectAxis();
    }

    private miniWorld() {
        const boxGeometry = new BoxBufferGeometry(800, 325, 325);
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
            100.0, 100.0, 100.0,
            100.0, 100.0, -100.0,
            100.0, -100.0, 100.0,
            100.0, -100.0, -100.0,
            -100.0, 100.0, -100.0,
            -100.0, 100.0, 100.0,
            -100.0, -100.0, 100.0,
            -100.0, -100.0, -100.0,
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
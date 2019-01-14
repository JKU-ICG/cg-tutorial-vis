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
    CameraHelper, Vector2, MeshPhongMaterial, DirectionalLight,
    OrthographicCamera, WebGLRenderTarget, NearestFilter, RGBAFormat,
    ShaderMaterial, AmbientLight, PlaneBufferGeometry, ClampToEdgeWrapping} from 'three';

// Scene comprises of a world and an object

export class AbstractView extends mixins(CameraControls) {

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
    private directionalLightModelView: DirectionalLight;

    private directionalLight: DirectionalLight;

    private dirX: number;
    private dirY: number;
    private dirZ: number;

    private ambientLight: AmbientLight;

    // Raster
    private rasterizedScene: Scene;
    private rasterCube: Mesh;

    private texture: WebGLRenderTarget;
    private textureDimension: { width: number, height: number };

    private resolution: { x: number, y: number };

    private uniforms: any;

    constructor() {

        super();

        this.renderer = new WebGLRenderer();
        this.screenWidth = 600;
        this.screenHeight = 300;
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
            // wireframe: true,
        });

        this.cube = new Mesh(new BoxBufferGeometry(200, 200, 200), material);

        this.directionalLight = new DirectionalLight(0xffffff, 1);

        this.dirX = - this.objectPerspectiveCamera.position.x;
        this.dirY = - this.objectPerspectiveCamera.position.y;
        this.dirZ = - this.objectPerspectiveCamera.position.z;

        this.directionalLight.position.set(this.dirX, this.dirY, this.dirZ).normalize();

        this.directionalLightModelView = new DirectionalLight(0xffffff, 1);
        this.directionalLightModelView.position.set(1, 1, 1).normalize();

        this.ambientLight = new AmbientLight(0x404040);

        this.rasterizedScene = new Scene();

        this.rasterCube = new Mesh();

        this.texture = new WebGLRenderTarget(0, 0);
        this.textureDimension = { width: this.screenWidth / 30, height: this.screenHeight / 30 };

        this.resolution = { x: this.textureDimension.width, y: this.textureDimension.height };
    }

    public initModelView(el: HTMLElement) {

        this.composeModelScene();
        this.initRenderer(el);
    }

    public initCameraView(el: HTMLElement) {

        this.resetMainCamera();
        this.updateAndRotateMainCamera();
        this.composeCameraScene();
        this.initRenderer(el);
    }

    public initRasterView(el: HTMLElement, rasterVertexShader: string, rasterFragmentShader: string) {

        this.composeRasterScene(rasterVertexShader, rasterFragmentShader);

        this.initRenderer(el);
    }

    public initOutputView(el: HTMLElement) {

        this.composeCameraScene();
        this.initRenderer(el);
    }

    public animateModelView() {

        requestAnimationFrame(this.animateModelView.bind(this));

        this.mainCamera.position.set(100, 0, 700);

        this.renderer.render(this.scene, this.mainCamera);
    }

    public animateCameraView() {

        requestAnimationFrame(this.animateCameraView.bind(this));

        this.updateObjectCamera();

        this.renderer.render(this.scene, this.mainCamera);
    }

    public animateRasterView() {

        requestAnimationFrame(this.animateRasterView.bind(this));

        this.updateObjectCamera();

        if (this.isObjectCameraPespective) {

            this.objectPerspectiveCameraHelper.visible = false;
            this.renderer.render(this.scene, this.objectPerspectiveCamera, this.texture, true);
            this.renderer.render(this.rasterizedScene, this.objectPerspectiveCamera);
        } else {

            this.objectOrthographicCameraHelper.visible = false;
            this.renderer.render(this.scene, this.objectOrthographicCamera, this.texture, true);
            this.renderer.render(this.rasterizedScene, this.objectOrthographicCamera);
        }
    }

    public animateOutputView() {

        requestAnimationFrame(this.animateOutputView.bind(this));

        this.updateObjectCamera();

        if (this.isObjectCameraPespective) {

            this.objectPerspectiveCameraHelper.visible = false;
            this.renderer.render(this.scene, this.objectPerspectiveCamera);
        } else {

            this.objectOrthographicCameraHelper.visible = false;
            this.renderer.render(this.scene, this.objectOrthographicCamera);
        }
    }

    public onSwitchCamera(isCameraPers: boolean) {

        this.isObjectCameraPespective = isCameraPers;

        this.setIsObjCameraPerspective(this.isObjectCameraPespective);
    }

    public animateOnMouseDownEvent(event: MouseEvent) {

        this.startRotationOnMouseDown(event);
    }

    public animateOnMouseMoveEvent(event: MouseEvent) {

        this.rotateOnMouseMove(event, this.renderer.domElement);
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

    public translateObjX(valX: number) {

        this.cube.position.x = valX * 100;
    }

    public translateObjY(valY: number) {

        this.cube.position.y = valY * 100;
    }

    public translateObjZ(valZ: number, isViewRaster: boolean = false) {

        this.cube.position.z = valZ * 100;

        if (isViewRaster) {

            this.rasterCube.position.z = valZ * 100;
        }
    }

    public changeCameraX(valX: number) {

        this.translateCameraX(valX);
    }

    public changeCameraY(valY: number) {

        this.translateCameraY(valY);
    }

    public changeCameraZ(valZ: number) {

        this.translateCameraZ(valZ);
    }

    public changeFov(valY: number) {

        this.changeCameraFOV(valY);
    }

    public changeFar(valZ: number) {

        this.changeCameraFar(valZ);
    }

    private initRenderer(el: HTMLElement) {

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);

        el.appendChild(this.renderer.domElement);
    }

    private updateObjectCamera() {

        // Camera Helpers have been added individually to the scene, therefore must be updated accordingly.

        if (this.isObjectCameraPespective) {

            this.objectPerspectiveCameraHelper.visible = true;
            this.objectOrthographicCameraHelper.visible = false;

            this.objectPerspectiveCamera.updateProjectionMatrix();

            this.objectPerspectiveCameraHelper.update();
        } else {

            this.objectPerspectiveCameraHelper.visible = false;
            this.objectOrthographicCameraHelper.visible = true;

            this.objectOrthographicCamera.updateProjectionMatrix();
            this.objectOrthographicCamera.lookAt(this.cube.position);

            this.objectOrthographicCameraHelper.update();
        }

        this.renderer.clear();
    }

    private composeModelScene() {

        this.scene.add(this.directionalLightModelView);
        this.scene.add(this.ambientLight);

        this.miniWorld();
        this.addCube();
        this.addObjectAxis();
    }

    private composeCameraScene() {

        this.miniWorld();
        this.addCube();
        this.addObjectAxis();
        this.addLightsAndCameras();
    }

    private composeRasterScene(rasterVertexShader: string, rasterFragmentShader: string) {

        this.composeCameraScene();
        this.createTexture();
        this.createUniforms();
        this.createRasterizedScene(rasterVertexShader, rasterFragmentShader);
    }

    private createTexture() {

        const parameters = {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
            format: RGBAFormat,
            stencilBuffer: false,
        };

        this.texture = new WebGLRenderTarget(this.textureDimension.width, this.textureDimension.height, parameters);
    }

    private createUniforms() {

        const textureVal = this.texture.texture;
        textureVal.wrapS = ClampToEdgeWrapping;
        textureVal.wrapT = ClampToEdgeWrapping;
        textureVal.repeat.set(4, 4);

        this.uniforms = {
            texture: { value: textureVal },
            resolutionX: { value: this.resolution.x },
            resolutionY: { value: this.resolution.y },
        };
    }

    private createRasterizedScene(rasterVertexShader: string, rasterFragmentShader: string) {

        const boxMaterial = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: rasterVertexShader,
            fragmentShader: rasterFragmentShader,
        });

        const boxGeometry = new BoxBufferGeometry(400, 200, 200);

        this.rasterCube = new Mesh(boxGeometry, boxMaterial);

        this.rasterizedScene.add(this.rasterCube);
    }

    private addLightsAndCameras() {

        // camera needs to be added to the scene as it has a child object
        this.directionalLight.target = this.cube;

        this.objectPerspectiveCamera.add(this.directionalLight);
        this.objectOrthographicCamera.add(this.directionalLight);

        this.scene.add(this.ambientLight);

        this.scene.add(this.objectPerspectiveCamera);
        this.scene.add(this.objectPerspectiveCameraHelper);

        this.scene.add(this.objectOrthographicCamera);
        this.scene.add(this.objectOrthographicCameraHelper);
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

export default AbstractView;
</script>
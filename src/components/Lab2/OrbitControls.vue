<template>
  <div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
    PerspectiveCamera, OrthographicCamera, Vector3,
    CameraHelper, Quaternion, Vector2, Spherical} from 'three';

export class OrbitControls extends Vue {

    // Screen Dimensions
    private screen: { left: number; top: number; width: number; height: number };

    // Camera Properties
    private mainPerspectiveCamera: PerspectiveCamera;

    private objectAnyCamera: any;
    private objectAnyCameraHelper: CameraHelper;

    // Perspective Camera Properties
    private nearPlane: number;
    private farPlane: number;
    private fov: number;

    // Orthographic Camera Properties
    private frustumSize: number;
    private isObjectCameraOrthographic = false;

    // Object Camera Properties
    private nearPlaneObj: number;
    private farPlaneObj: number;

    private screenAspectRatio: number;

    // Orbit Controls Params
    private minPolarAngle: number;
    private maxPolarAngle: number;

    private minAzimuthAngle: number;
    private maxAzimuthAngle: number;

    private rotateSpeed: number;

    private position0: Vector3;

    private target: Vector3;
    private target0: Vector3;

    private spherical: Spherical;
    private sphericalDelta: Spherical;

    private scale: number;

    private rotateStart: Vector2;
    private rotateEnd: Vector2;
    private rotateDelta: Vector2;

    private minDistance: number;
    private maxDistance: number;

    constructor() {
        super();

        this.screen = {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.nearPlane = 100;
        this.farPlane = 10000;
        this.fov = 50;
        this.frustumSize = 50;

        this.screenAspectRatio = 2 * this.screen.width / this.screen.height;

        this.mainPerspectiveCamera = new PerspectiveCamera(this.fov, this.screenAspectRatio,
            this.nearPlane, this.farPlane);

        this.mainPerspectiveCamera.position.z = 500;

        this.isObjectCameraOrthographic = false; // isObjectCameraOrthographic;

        this.nearPlaneObj = 30;
        this.farPlaneObj = 100;

        this.objectAnyCamera = new PerspectiveCamera(this.fov, this.screenAspectRatio,
            this.nearPlaneObj, this.farPlaneObj);

        if (this.isObjectCameraOrthographic) {
            this.objectAnyCamera = new OrthographicCamera(- this.frustumSize, this.frustumSize,
                this.frustumSize, - this.frustumSize, this.nearPlaneObj, this.farPlaneObj);
        }

        this.objectAnyCameraHelper = new CameraHelper(this.objectAnyCamera);

        this.target = new Vector3();
        this.target0 = this.target.clone();

        // Orbit Controls
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI * 0.5;

        this.minAzimuthAngle = -Infinity;
        this.maxAzimuthAngle = Infinity;

        this.rotateSpeed = 1.0;

        this.position0 = this.mainPerspectiveCamera.position.clone();

        this.spherical = new Spherical();
        this.sphericalDelta = new Spherical();

        this.scale = 1;
        this.rotateStart = new Vector2();
        this.rotateEnd = new Vector2();
        this.rotateDelta = new Vector2();

        this.minDistance = 100;
        this.maxDistance = 5000;
    }

    public animateOnMouseDownEvent(event: MouseEvent) {
        this.rotateStart.set(event.clientX, event.clientY);
    }

    public animateOnMouseMoveEvent(event: MouseEvent, element: HTMLCanvasElement) {
        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientHeight);
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight);

        this.rotateStart.copy(this.rotateEnd);

        this.updateAndRotate();
    }

    // Slider operation on Cameras
    public translateCameraX(valX: number) {
        this.objectAnyCamera.position.x = - valX * 10;
    }

    public changeCameraFOV(valY: number) {
        if (this.isObjectCameraOrthographic) {
            this.frustumSize = valY * 10;
            this.objectAnyCamera.left = - this.frustumSize;
            this.objectAnyCamera.right = this.frustumSize;
            this.objectAnyCamera.top = - this.frustumSize;
            this.objectAnyCamera.bottom = this.frustumSize;
        }
        this.fov = valY * 10;
        this.objectAnyCamera.fov = this.fov;
    }

    public changeCameraFar(valZ: number) {
        this.farPlaneObj = valZ * 100;
        this.objectAnyCamera.far = this.farPlaneObj;
    }

    protected updateAndRotate() {
        const position = this.mainPerspectiveCamera.position;

        const offset = new Vector3();
        offset.copy(position).sub(this.target);

        const quaternion = new Quaternion().setFromUnitVectors(this.mainPerspectiveCamera.up, new Vector3(0, 1, 0));
        const quaternionInverse = quaternion.clone().inverse();

        offset.applyQuaternion(quaternion);

        this.spherical.setFromVector3(offset);

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;

        this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
        this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));

        this.spherical.makeSafe();

        this.spherical.radius *= this.scale;

        this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

        offset.setFromSpherical(this.spherical);
        offset.applyQuaternion(quaternionInverse);

        position.copy(this.target).add(offset);

        this.mainPerspectiveCamera.lookAt(this.target);

        this.sphericalDelta.set(0, 0, 0);

        this.scale = 1;
    }

    protected getMainCamera() {
        return this.mainPerspectiveCamera;
    }

    protected getObjectCamera() {
        return this.objectAnyCamera;
    }

    protected getObjectCameraHelper() {
        return this.objectAnyCameraHelper;
    }

    protected reset() {
        this.target.copy(this.target0);
        this.mainPerspectiveCamera.position.copy(this.position0);
        this.mainPerspectiveCamera.updateProjectionMatrix();
        this.updateAndRotate();
    }

    protected saveState() {
        this.target0.copy(this.target);
        this.position0.copy(this.mainPerspectiveCamera.position);
    }

    private rotateLeft(angle: number) {
        this.sphericalDelta.theta -= angle;
    }

    private rotateUp(angle: number) {
        this.sphericalDelta.phi -= angle;
    }

}

export default OrbitControls;
</script>
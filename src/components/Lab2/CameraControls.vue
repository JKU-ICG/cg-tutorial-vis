<template>
  <div></div>
</template>

<script lang = "ts">
// see if the removal of else if condition in rotate camera stopped the rotation??
// Go back to the frustum view version and implement trackball controls there??
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { isNullOrUndefined } from 'util';
import {
    PerspectiveCamera, OrthographicCamera, Scene,
    WebGLRenderer, Group, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments,
    BoxHelper, SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color,
    BufferAttribute, CameraHelper, Quaternion, Vector2, SceneUtils, MeshDepthMaterial} from 'three';

// Scene comprises of a world and an object
// TO DOs: Object translation should also contain negative values.
// Object axis to be fixed.
export class CameraControls extends Vue {

    // Mouse cursors
    private mousePrev: Vector2;
    private mouseCurr: Vector2;

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

    // Rotate Camera Properties
    private eye: Vector3;
    private eyeDirection: Vector3;
    private moveDirection: Vector3;
    private cameraUpDirection: Vector3;
    private cameraSidewaysDirection: Vector3;
    private lastPosition: Vector3;
    private axis: Vector3;
    private lastAxis: Vector3;
    private target: Vector3;
    private target0: Vector3;
    private quaternion: Quaternion;
    private angle: number;
    private lastAngle: number;
    private dynamicDampingFactor: number;
    private staticMoving: boolean;

    private screenAspectRatio: number;

    constructor() {
        super();

        this.nearPlane = 100;
        this.farPlane = 10000;
        this.fov = 50;
        this.frustumSize = 50;

        this.screen = {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.screenAspectRatio = 2 * this.screen.width / this.screen.height;

        this.mainPerspectiveCamera = new PerspectiveCamera(this.fov, this.screenAspectRatio,
            this.nearPlane, this.farPlane);

        this.isObjectCameraOrthographic = false; // isObjectCameraOrthographic;

        this.nearPlaneObj = 100;
        this.farPlaneObj = 200;

        this.objectAnyCamera = new PerspectiveCamera(this.fov, this.screenAspectRatio,
            this.nearPlaneObj, this.farPlaneObj);
        if (this.isObjectCameraOrthographic) {
            this.objectAnyCamera = new OrthographicCamera(- this.frustumSize, this.frustumSize,
                this.frustumSize, - this.frustumSize, this.nearPlaneObj, this.farPlaneObj);
        }

        this.objectAnyCameraHelper = new CameraHelper(this.objectAnyCamera);

        this.eye = new Vector3();
        this.eyeDirection = new Vector3();

        this.moveDirection = new Vector3();

        this.cameraUpDirection = new Vector3();
        this.cameraSidewaysDirection = new Vector3();

        this.lastPosition = new Vector3();
        this.axis = new Vector3();
        this.lastAxis = new Vector3();

        this.target = new Vector3();
        this.target0 = this.target.clone();

        this.quaternion = new Quaternion();

        this.angle = 0;
        this.lastAngle = 0;

        this.dynamicDampingFactor = 0.2;
        this.staticMoving = false;

        this.mousePrev = new Vector2();
        this.mouseCurr = new Vector2();
    }

    public animateOnMouseDownEvent(event: MouseEvent) {
        this.mouseCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
        this.mousePrev.copy(this.mouseCurr);
        this.updateMainCameraWithRotation();
    }

    public animateOnMouseMoveEvent(event: MouseEvent) {
        this.mousePrev.copy(this.mouseCurr);
        this.mouseCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
        this.updateMainCameraWithRotation();
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

    protected updateMainCameraWithRotation() {
        this.eye.subVectors(this.mainPerspectiveCamera.position, this.target);
        this.rotateMainCamera();
        this.mainPerspectiveCamera.position.addVectors(this.target, this.eye);
        this.mainPerspectiveCamera.lookAt(this.target);
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

    private getMouseOnCircle(pageX: number, pageY: number) {
        const mouseOnCircle = new Vector2(
            ((pageX - this.screen.width * 0.5 - this.screen.left) / (this.screen.width * 0.5)),
            ((this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width),
        );
        return mouseOnCircle;
    }

    // imported from Three.Trackballcontrols
    private rotateMainCamera() {
        this.moveDirection.set(this.mouseCurr.x, this.mouseCurr.y, 0);
        this.angle = this.moveDirection.length();

        if (this.angle) {
            this.eye.copy(this.mainPerspectiveCamera.position).sub(this.target);

            this.eyeDirection.copy(this.eye).normalize();
            this.cameraUpDirection.copy(this.mainPerspectiveCamera.up).normalize();
            this.cameraSidewaysDirection.crossVectors(this.cameraUpDirection, this.eyeDirection).normalize();

            this.cameraUpDirection.setLength(this.mouseCurr.y - this.mousePrev.y);
            this.cameraSidewaysDirection.setLength(this.mouseCurr.x - this.mousePrev.x);

            this.moveDirection.copy(this.cameraUpDirection.add(this.cameraSidewaysDirection));

            this.axis.crossVectors(this.moveDirection, this.eye).normalize();

            this.angle *= 1.0;
            this.quaternion.setFromAxisAngle(this.axis, this.angle);

            this.eye.applyQuaternion(this.quaternion);
            this.mainPerspectiveCamera.up.applyQuaternion(this.quaternion);

            this.lastAxis.copy(this.axis);
            this.lastAngle = this.angle;

        } else if (!this.staticMoving && this.lastAngle) {
            this.lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
            this.eye.copy(this.mainPerspectiveCamera.position).sub(this.target);
            this.quaternion.setFromAxisAngle(this.lastAxis, this.lastAngle);
            this.eye.applyQuaternion(this.quaternion);
            this.mainPerspectiveCamera.up.applyQuaternion(this.quaternion);
        }
        this.mousePrev.copy(this.mouseCurr);
    }

}

export default CameraControls;
</script>
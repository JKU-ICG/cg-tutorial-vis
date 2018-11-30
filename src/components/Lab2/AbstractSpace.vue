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
    BufferAttribute, CameraHelper, Quaternion, Vector2} from 'three';

import { TrackballControls } from '../../lib/three-trackballcontrols';

// Scene comprises of a world and an object
// TO DOs: Object translation should also contain negative values.
// Object axis to be fixed.
@Component({})
export class AbstractSpace extends Vue {

    // Camera Properties
    private worldCamera: any;
    // Perspective Camera Properties
    private nearPlane = 100;
    private farPlane = 10000;
    private fov = 50;
    // Orthographic Camera Properties
    private frustumSize = 50;
    private isObjectCameraOrthographic = false;
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
    private scaleObject = { x: 1, y: 1, z: 1 };
    private objectArrowX: any;
    private objectArrowY: any;
    private objectArrowZ: any;
    private arrowLength = 100;
    // Cube
    private cube = new Mesh(new BoxBufferGeometry(100, 100, 100), new MeshBasicMaterial({ color: 0xc0c0c0 }));
    // Rotate Camera Properties
    private eye = new Vector3();
    private eyeDirection = new Vector3();
    private moveDirection = new Vector3();
    private cameraUpDirection = new Vector3();
    private cameraSidewaysDirection = new Vector3();
    private lastPosition = new Vector3();
    private axis = new Vector3();
    private lastAxis = new Vector3();
    private target = new Vector3();
    private target0 = new Vector3();
    private quaternion = new Quaternion();
    private angle = 0;
    private lastAngle = 0;
    private dynamicDampingFactor: number = 0.2;
    private staticMoving: boolean = false;
    public mousePrev = new Vector2();
    public mouseCurr = new Vector2();

    protected initCameraView(isObjectCameraOrthographic: boolean) {
        this.screenWidth = window.innerWidth; // because of renderering 2 views in one.
        this.worldCamera = new PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane);
        this.staticMoving = false;
        this.dynamicDampingFactor = 0.2;
        this.target0 = this.target.clone();
        this.updateRotateCamera();
        this.setObjectCameraProperties(isObjectCameraOrthographic);
        this.composeCameraScene();
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.$el.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
    }

    protected setObjectCameraProperties(isObjectCameraOrthographic?: boolean) {
        this.objectCamera = new PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlaneObj, this.farPlaneObj);
        if (isObjectCameraOrthographic) {
            this.isObjectCameraOrthographic = isObjectCameraOrthographic;
            this.objectCamera = new OrthographicCamera(- this.frustumSize, this.frustumSize,
                this.frustumSize, - this.frustumSize, this.nearPlaneObj, this.farPlaneObj);
        }
        this.objectCameraHelper = new CameraHelper(this.objectCamera);
    }

    protected animateCameraView() {
        requestAnimationFrame(this.animateCameraView);
        this.renderCameraView();
    }

    protected initModelView() {
        this.worldCamera = new PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.composeModelScene();
        this.renderWorldCameraView();
        this.$el.appendChild(this.renderer.domElement);
    }

    protected animateModelView() {
        requestAnimationFrame(this.animateModelView);
        this.worldCamera.lookAt(this.scene.position);
        this.cube.rotation.x += 0.01;
        this.renderWorldCameraView();
    }

    // Interactions
    protected scaleObjectXAxis(valX: number) {
        this.objectArrowX.setLength(this.arrowLength * valX);
        this.scaleObject.x = valX / 2;
        this.cube.scale.set(this.scaleObject.x, this.scaleObject.y, this.scaleObject.z);
    }

    protected scaleObjectYAxis(valY: number) {
        this.objectArrowY.setLength(this.arrowLength * valY);
        this.scaleObject.y = valY / 2;
        this.cube.scale.set(this.scaleObject.x, this.scaleObject.y, this.scaleObject.z);
    }

    protected scaleObjectZAxis(valZ: number) {
        this.objectArrowZ.setLength(this.arrowLength * valZ);
        this.scaleObject.z = valZ / 2;
        this.cube.scale.set(this.scaleObject.x, this.scaleObject.y, this.scaleObject.z);
    }

    protected translateCameraX(valX: number) {
        this.objectCamera.position.x = - valX * 10;
        this.renderCameraView();
    }

    protected changeCameraFOV(valY: number) {
        if (this.isObjectCameraOrthographic) {
            this.frustumSize = valY * 10;
            this.objectCamera.left = - this.frustumSize;
            this.objectCamera.right = this.frustumSize;
            this.objectCamera.top = - this.frustumSize;
            this.objectCamera.bottom = this.frustumSize;
        }
        this.fov = valY * 10;
        this.objectCamera.fov = this.fov;
        this.renderCameraView();
    }

    protected changeCameraFar(valZ: number) {
        this.farPlaneObj = valZ * 100;
        this.objectCamera.far = this.farPlaneObj;
        this.renderCameraView();
    }

    // also the arrows and vertices should change their position
    protected translateObjX(valX: number) {
        this.cube.position.x = valX * 100;
    }

    protected translateObjY(valY: number) {
        this.cube.position.y = valY * 100;
    }

    protected translateObjZ(valZ: number) {
        this.cube.position.z = valZ * 100;
    }

    protected renderCameraView(view?: string) {
        this.objectCamera.updateProjectionMatrix(); // perform update operations
        this.objectCameraHelper.update();
        this.objectCameraHelper.visible = true;
        this.objectCamera.lookAt(this.cube.position);
        this.renderer.clear();
        this.renderWorldCameraView(); // render the scene overall as viewed via the world camera
        this.renderObjectCameraView(); // render the scene as viewed via the object camera
    }

    protected updateRotateCamera() {
        this.eye.subVectors(this.worldCamera.position, this.target);
        this.rotateCamera();
        this.worldCamera.position.addVectors(this.target, this.eye);
        this.worldCamera.lookAt(this.target);
        // if (this.lastPosition.distanceToSquared(this.object.position) > this.EPS) {
        //     this.dispatchEvent.call(this.domElement, [this.changeEvent]);
        //     this.lastPosition.copy(this.object.position);
        // }

    }
    // Change the z type to float from any
    protected rotateCamera() {
        this.moveDirection.set(this.mouseCurr.x, this.mouseCurr.y, 0);
        this.angle = this.moveDirection.length();

        if (this.angle) {
            this.eye.copy(this.worldCamera.position).sub(this.target);

            this.eyeDirection.copy(this.eye).normalize();
            this.cameraUpDirection.copy(this.worldCamera.up).normalize();
            this.cameraSidewaysDirection.crossVectors(this.cameraUpDirection, this.eyeDirection).normalize();

            this.cameraUpDirection.setLength(this.mouseCurr.y - this.mousePrev.y);
            this.cameraSidewaysDirection.setLength(this.mouseCurr.x - this.mousePrev.x);

            this.moveDirection.copy(this.cameraUpDirection.add(this.cameraSidewaysDirection));

            this.axis.crossVectors(this.moveDirection, this.eye).normalize();

            this.angle *= 1.0;
            this.quaternion.setFromAxisAngle(this.axis, this.angle);

            this.eye.applyQuaternion(this.quaternion);
            this.worldCamera.up.applyQuaternion(this.quaternion);

            this.lastAxis.copy(this.axis);
            this.lastAngle = this.angle;

        } else if (!this.staticMoving && this.lastAngle) {
            this.lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
            this.eye.copy(this.worldCamera.position).sub(this.target);
            this.quaternion.setFromAxisAngle(this.lastAxis, this.lastAngle);
            this.eye.applyQuaternion(this.quaternion);
            this.worldCamera.up.applyQuaternion(this.quaternion);
        }
        this.mousePrev.copy(this.mouseCurr);
        this.renderWorldCameraView();
    }

    protected renderWorldCameraView() {
        this.worldCamera.position.z = 500;

        if (!isNullOrUndefined(this.objectCameraHelper)) {
            this.objectCameraHelper.visible = true;
            this.renderer.setViewport(0, 0, this.screenWidth / 2, this.screenHeight);
        }

        this.renderer.render(this.scene, this.worldCamera);
    }

    private renderObjectCameraView() {
        this.objectCameraHelper.visible = false;
        this.renderer.setViewport(this.screenWidth / 2, 0, this.screenWidth / 2, this.screenHeight);
        this.renderer.render(this.scene, this.objectCamera);
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
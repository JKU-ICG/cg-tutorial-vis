<template>
  <div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { createNamespacedHelpers } from 'vuex';
import { Watch } from 'vue-property-decorator';
import {
    PerspectiveCamera, OrthographicCamera, Scene,
    WebGLRenderer, Group, BoxBufferGeometry,
    MeshBasicMaterial, EdgesGeometry, LineSegments,
    BoxHelper, SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color, BufferAttribute, CameraHelper} from 'three';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    computed: {
        ...mapGetters(['scaleX', 'scaleY', 'scaleZ', 'cameraX', 'cameraY', 'cameraZ']),
    },
})
export class FrustumView extends Vue {
    private SCREEN_WIDTH = window.innerWidth;
    private SCREEN_HEIGHT = window.innerHeight / 2;
    private FRUSTUM_SIZE = 100;
    private OBJ_Z = -700;
    private objectScaleXYZ = [1, 1, 1];
    private aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    private cameraPerspective: any;
    private cameraHelper: any;
    private cameraOrthographic: any;
    private scene = new Scene();
    private camera: any;
    private renderer: any;
    private cube = new Mesh(new BoxBufferGeometry(100, 100, 100), new MeshBasicMaterial({ color: 0xc0c0c0 }));

    private topCamera: any;
    private isOrtho = false;

    protected init(isOrtho: boolean = false) {
        this.isOrtho = isOrtho;
        this.camera = new PerspectiveCamera(50, 0.5 * this.aspect, 1, 10000);
        if (isOrtho) {
            this.cameraPerspective = new OrthographicCamera(0.5 * this.FRUSTUM_SIZE * this.aspect / - 2,
                0.5 * this.FRUSTUM_SIZE * this.aspect / 2, this.FRUSTUM_SIZE / 2, this.FRUSTUM_SIZE / - 2, 10, 200);

        } else {
            this.cameraPerspective = new PerspectiveCamera(50, 0.5 * this.aspect, 100, 200);
        }

        this.camera.position.z = 1500;
        this.camera.position.x = 0;

        const boxGeometry = new BoxBufferGeometry(1000, 500, 500);
        const edges = new EdgesGeometry(boxGeometry);
        const line = new LineSegments(edges);
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        line.position.x = -200;
        line.position.z = 400;
        line.rotation.x = 0.4;
        this.scene.add(new BoxHelper(line));

        this.cameraHelper = new CameraHelper(this.cameraPerspective);

        // add both the camera and the helper inside the scene
        this.scene.add(this.cameraHelper);
        this.scene.add(this.cameraPerspective);

        // add the cube inside the camera's perspective

        this.cameraPerspective.add(this.cube); // to keep cube on the same position as the camera

        // start renderering
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.$el.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
    }

    protected animate() {
        requestAnimationFrame(this.animate);
        this.renderScene();
    }

    @Watch('objectX')
    private scaleObjectXAxis(valX: number) {
        this.objectScaleXYZ[0] = valX / 2;
        this.cube.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        this.renderScene();
    }

    @Watch('objectY')
    private scaleObjectYAxis(valY: number) {
        this.objectScaleXYZ[1] = valY / 2;
        this.cube.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        this.renderScene();
    }

    @Watch('objectZ')
    private scaleObjectZAxis(valZ: number) {
        this.objectScaleXYZ[2] = valZ / 2;
        this.cube.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        this.renderScene();
    }
    @Watch('cameraX')
    private cameraXChanged(valX: number) {
        this.cameraPerspective.position.x = - valX * 100;
        this.renderScene();
    }

    @Watch('cameraY') // mapped to the fov or to the frustumsize of the orthographic camera
    private cameraYChanged(valY: number) {
        if (this.isOrtho) {
            this.cameraPerspective.left = 0.5 * valY * this.FRUSTUM_SIZE * this.aspect / - 2;
            this.cameraPerspective.right = 0.5 * valY * this.FRUSTUM_SIZE * this.aspect / 2;
            this.cameraPerspective.top = valY * this.FRUSTUM_SIZE / 2;
            this.cameraPerspective.bottom = - valY * this.FRUSTUM_SIZE / 2;
        } else {
            this.cameraPerspective.fov = valY * 10;
        }

        this.renderScene();
    }

    @Watch('cameraZ') // mapped to the far plane
    private cameraZChanged(valZ: number) {
        this.cameraPerspective.far = 100 * valZ;
        this.renderScene();
    }

    private renderScene() {
        const r = Date.now() * 0.0005;
        this.cube.position.x = 350 * Math.cos(r);
        this.cube.position.y = 350 * Math.sin(r);
        this.cube.position.z = this.OBJ_Z;

        // perform update operations
        this.cameraPerspective.updateProjectionMatrix();
        this.cameraHelper.update();
        this.cameraHelper.visible = true;
        this.cameraPerspective.lookAt(this.cube.position);

        this.renderer.clear();

        // render the scene overall as viewed via the perspective camera
        this.cameraHelper.visible = true;
        this.renderer.setViewport(0, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
        this.renderer.render(this.scene, this.camera);

        // render the scene with the perspective camera
        this.cameraHelper.visible = false;
        this.renderer.setViewport(this.SCREEN_WIDTH / 2, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
        this.renderer.render(this.scene, this.cameraPerspective);
    }
}
export default FrustumView;
</script>

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
        ...mapGetters(['objectX', 'objectY', 'objectZ', 'cameraX', 'cameraY', 'cameraZ']),
    },
})
export class FrustumView extends Vue {
    private SCREEN_WIDTH = window.innerWidth;
    private SCREEN_HEIGHT = window.innerHeight;
    private aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    private cameraPerspective: any;
    private cameraPerspectiveHelper: any;
    private frustumSize = 600;
    private scene = new Scene();
    private camera: any;
    private renderer: any;
    private cube = new Mesh(new BoxBufferGeometry(100, 100, 100), new MeshBasicMaterial({ color: 0xc0c0c0 }));
    private far = 700;
    private objZ = -700;

    protected init() {

        // normal camera kept quite far off
        this.camera = new PerspectiveCamera(50, 0.5 * this.aspect, 1, 10000);
        this.camera.position.z = 2500;
        // perspective camera kept nearer to the object
        this.cameraPerspective = new PerspectiveCamera(50, 0.5 * this.aspect, 150, 1000);
        this.cameraPerspectiveHelper = new CameraHelper(this.cameraPerspective);

        // add both the camera and the helper inside the scene
        this.scene.add(this.cameraPerspectiveHelper);
        this.cameraPerspective.rotation.y = Math.PI;
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

    @Watch('objectZ')
    private objectZChanged(valZ: number) {
        this.cube.position.z = -100 * valZ;
        this.objZ = -100 * valZ;
        this.renderScene();
    }

    @Watch('cameraZ')
    private cameraZChanged(valZ: number) {
        this.cameraPerspective.far = 300 * valZ;
        this.far = this.cameraPerspective.far;
        this.renderScene();
    }

    private renderScene() {
        const r = Date.now() * 0.0005;
        this.cube.position.x = 0;
        this.cube.position.z = this.objZ;

        this.cameraPerspective.fov = 100;
        this.cameraPerspective.far = this.far;

        // this.cube.position.x = 700 * Math.cos(r);
        // this.cube.position.z = 700 * Math.sin(r);
        // this.cube.position.y = 700 * Math.sin(r);

        // this.cameraPerspective.fov = 70 + 30 * Math.sin(0.5 * r);
        // this.cameraPerspective.far = this.cube.position.length();

        // perform update operations
        this.cameraPerspective.updateProjectionMatrix();
        this.cameraPerspectiveHelper.update();
        this.cameraPerspectiveHelper.visible = true;
        this.cameraPerspective.lookAt(this.cube.position);

        this.renderer.clear();

        // render the scene with the perspective camera
        this.cameraPerspectiveHelper.visible = false;
        this.renderer.setViewport(0, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
        this.renderer.render(this.scene, this.cameraPerspective);

        // Render the scene overall as viewed on a screen
        this.cameraPerspectiveHelper.visible = true;
        this.renderer.setViewport(this.SCREEN_WIDTH / 2, 0, this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT);
        this.renderer.render(this.scene, this.camera);
    }
}
export default FrustumView;
</script>

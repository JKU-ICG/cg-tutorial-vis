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
    BoxHelper, SphereBufferGeometry, Mesh, Vector3, ArrowHelper, Color, BufferAttribute} from 'three';
import { Watch } from 'vue-property-decorator';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

// Scene comprises of a world and an object

@Component({
    components: {
        vueSlider,
    },
    computed: {
        ...mapGetters(['objectX', 'objectY', 'objectZ', 'cameraX', 'cameraY', 'cameraZ']),
    },
})
export class AbstractSpace extends Vue {
    private worldCamera: any;
    private objectCamera: any;
    private worldScene = new Scene();
    private objectScene = new Scene();
    private renderer = new WebGLRenderer();
    private objectScaleXYZ = [1, 1, 1];
    private objectArrowX: any;
    private objectArrowY: any;
    private objectArrowZ: any;
    private arrowLength = 100;
    private objectCameraXYZ: any;
    private cubeGeometry = new Mesh(new BoxBufferGeometry(100, 100, 100), new MeshBasicMaterial({ color: 0xc0c0c0 }));

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
        this.composeScene();
        this.renderScene();
        this.$el.appendChild(this.renderer.domElement);
    }

    protected animate() {
        requestAnimationFrame(this.animate);
        this.objectCamera.lookAt(this.objectScene.position);
        // const time = -performance.now() * 0.0003;
        // this.objectCamera.position.x = 400 * Math.cos(time); // entire object scene rotation
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
        this.worldScene.add(new BoxHelper(line));
    }

    private addCube() {
        this.objectScene.add(this.cubeGeometry);
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
            this.objectScene.add(drawSphere);
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
        this.objectScene.add(this.objectArrowX);
        this.objectScene.add(this.objectArrowY);
        this.objectScene.add(this.objectArrowZ);
    }

    @Watch('objectX')
    private scaleObjectXAxis(valX: number) {
        this.objectArrowX.setLength(this.arrowLength * valX);
        this.objectScaleXYZ[0] = valX / 2;
        this.cubeGeometry.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        this.renderObject();
    }

    @Watch('objectY')
    private scaleObjectYAxis(valY: number) {
        this.objectArrowY.setLength(this.arrowLength * valY);
        this.objectScaleXYZ[1] = valY / 2;
        this.cubeGeometry.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        this.renderObject();
    }

    @Watch('objectZ')
    private scaleObjectZAxis(valZ: number) {
        this.objectArrowZ.setLength(this.arrowLength * valZ);
        this.objectScaleXYZ[2] = valZ / 2;
        this.cubeGeometry.scale.set(this.objectScaleXYZ[0], this.objectScaleXYZ[1], this.objectScaleXYZ[2]);
        this.renderObject();
    }
}

export default AbstractSpace;
</script>
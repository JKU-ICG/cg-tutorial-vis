<script lang="ts">
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Watch } from 'vue-property-decorator';
import {
    Mesh, Scene, WebGLRenderer, PerspectiveCamera,
    BufferGeometry, BoxBufferGeometry, SphereBufferGeometry,
    BufferAttribute, Color, MeshBasicMaterial, VertexColors, Vector3,
} from 'three';

import { DragControls } from '../../lib/three-dragcontrols';

const { mapMutations, mapGetters } = createNamespacedHelpers('cubestore');

@Component({
    computed: {
        ...mapGetters(['objects', 'object']),
    },
    methods: {
        ...mapMutations(['pushObject']),
    },
})
export class AbstractView extends Vue {
    protected scene = new Scene();
    protected renderer = new WebGLRenderer({ antialias: true });
    protected camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    protected geometries: BufferGeometry[] = [];
    protected shapes: Mesh[] = [];
    protected dragControls: any;
    protected pos = 0;

    // constructor() {
    //     super();

    //  this.scene = new Scene();
    //  this.renderer = new WebGLRenderer({ antialias: true });
    //  this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    //  this.geometries: BufferGeometry[] = [];
    //  this.shapes=  Mesh[] = [];
    //  this.dragControls: any;
    //  this.pos = 0;
    // }


    protected init() {
        this.scene.background = new Color(0xf0f0f0);
        this.camera.position.z = 400;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        this.renderScene();
        this.$el.appendChild(this.renderer.domElement);
    }

    protected initDragShapes() {
        this.dragControls = new DragControls(this.shapes, this.camera, this.renderer.domElement);
    }

    protected renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    protected updateMaterial() {
        this.shapes.forEach((shape) => {
            shape.material = new MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
            });
            shape.material.needsUpdate = true;
        });

        this.renderer.render(this.scene, this.camera);
    }

    protected updateColors(color: any) {
        this.geometries.forEach((geometry) => {
            const count = geometry.attributes.position.count;
            geometry.addAttribute('color', new BufferAttribute(new Float32Array(count * 3), 3));
            const attribColor = geometry.attributes.color;

            for (let i = 0; i < count; i++) {
                attribColor.setXYZ(
                    i,
                    color.r / 255.0,
                    color.g / 255.0,
                    color.b / 255.0,
                );
            }
            (geometry.attributes.color as BufferAttribute).needsUpdate = true;
        });

        this.renderer.render(this.scene, this.camera);
    }

    @Watch('object')
    private addShapeOnClick(shape: string) {
        let position = new Vector3(0, 0, 0);
        if (shape.length <= 0) {
            return;
        }
        if (shape.localeCompare('square') === 0) {
            position = this.createSquare();

        } else if (shape.localeCompare('cube') === 0) {
            position = this.createCube();

        } else if (shape.localeCompare('sphere') === 0) {
            position = this.createSphere();

        }
        this.$store.commit('cubestore/pushObject', position);
    }

    private appendShapeToScene(geometry: BufferGeometry): Vector3 {
        this.geometries.push(geometry);
        const material = new MeshBasicMaterial({
            vertexColors: VertexColors,
        });

        const shape = new Mesh(geometry, material);
        // just for differentiating
        shape.position.x = this.pos;
        this.pos = this.pos + 100;
        this.shapes.push(shape);
        this.scene.add(shape);
        return shape.position;
    }

    private createSquare(): Vector3 {
        const vertices = new Float32Array([
            -50.0, -50.0, 50.0,
            50.0, -50.0, 50.0,
            50.0, 50.0, 50.0,
            50.0, 50.0, 50.0,
            -50.0, 50.0, 50.0,
            -50.0, -50.0, 50.0,
        ]);
        const customGeometry = new BufferGeometry();
        customGeometry.addAttribute('position', new BufferAttribute(vertices, 3));
        return this.appendShapeToScene(customGeometry);
    }

    private createCube(): Vector3 {
        const customGeometry = new BoxBufferGeometry(50, 50, 50);
        return this.appendShapeToScene(customGeometry);
    }

    private createSphere(): Vector3 {
        const customGeometry = new SphereBufferGeometry(50, 32, 32);
        return this.appendShapeToScene(customGeometry);
    }
}

export default AbstractView;
</script>

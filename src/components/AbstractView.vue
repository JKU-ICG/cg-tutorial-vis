<script lang="ts">
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Watch } from 'vue-property-decorator';
import {
  Mesh, Scene, WebGLRenderer, PerspectiveCamera,
  BufferGeometry, BoxBufferGeometry, SphereBufferGeometry,
  BufferAttribute, Color, MeshBasicMaterial, VertexColors,
} from 'three';
import { DragControls } from '../lib/three-dragcontrols';
import { TrackballControls } from '../lib/three-trackballcontrols';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

@Component({
  computed: {
    ...mapGetters(['objects']),
  },
})
export class AbstractView extends Vue {
  protected scene = new Scene();
  protected renderer = new WebGLRenderer({ antialias: true });
  protected camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  protected geometries: BufferGeometry[] = [];
  protected shapes: Mesh[] = [];
  protected dragControls: any;
  protected controls: any;
  protected pos = 0;

  protected init() {
    this.scene.background = new Color(0xf0f0f0);
    this.camera.position.z = 400;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.dragControls = new DragControls(this.shapes, this.camera, this.renderer.domElement);
    this.dragControls.addEventListener('dragstart', this.toggleControls(event, false));
    this.dragControls.addEventListener('dragstop', this.toggleControls(event, true));
    this.renderScene();
    this.$el.appendChild(this.renderer.domElement);
  }

  protected toggleControls(event: any, flag: boolean) {
    this.controls.enabled = flag;
  }
  protected renderScene() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  protected updateMaterial() {
    this.shapes.forEach((shape) => {
      shape.material = new MeshBasicMaterial({
        color: 0x00ff00,
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

  @Watch('objects')
  private onObjectsClicked(objects: string[]) {
    if (objects.length <= 0) {
      return;
    }

    const object = objects[objects.length - 1];

    if (object.localeCompare('square') === 0) {
      this.createSquare();

    } else if (object.localeCompare('cube') === 0) {
      this.createCube();

    } else if (object.localeCompare('sphere') === 0) {
      this.createSphere();

    }
  }

  private appendShapeToScene(geometry: BufferGeometry) {
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
  }
  private createSquare() {
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
    this.appendShapeToScene(customGeometry);
  }

  private createCube() {
    const customGeometry = new BoxBufferGeometry(50, 50, 50);
    this.appendShapeToScene(customGeometry);
  }

  private createSphere() {
    const customGeometry = new SphereBufferGeometry(50, 32, 32);
    this.appendShapeToScene(customGeometry);
  }
}

export default AbstractView;
</script>

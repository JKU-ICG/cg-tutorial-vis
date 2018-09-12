<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
  Mesh, Scene, WebGLRenderer, PerspectiveCamera,
  BufferGeometry, BoxBufferGeometry, SphereBufferGeometry,
  BufferAttribute, Color, MeshBasicMaterial, VertexColors,
} from 'three';

@Component({})
export class AbstractView extends Vue {
  protected scene = new Scene();
  protected renderer = new WebGLRenderer({ antialias: true });
  protected camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  protected geometries: BufferGeometry[] = [];
  protected shapes: Mesh[] = [];

  protected createSquare() {
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
    this.geometries.push(customGeometry);
  }

  protected createCube() {
    const customGeometry = new BoxBufferGeometry(50, 50, 50);
    this.geometries.push(customGeometry);
  }

  protected createSphere() {
    const customGeometry = new SphereBufferGeometry(0.5, 32, 32);
    this.geometries.push(customGeometry);
  }

  protected appendObjectsToToolbar() {
    // Modify renderer and scale the objects, also create a different scenegraph
    // because toolbar will contain more objects
    this.scene.background = new Color(0xf0f0f0);
    this.createSquare();
    this.createCube();

    const material = new MeshBasicMaterial({ color: 0xff00ff });
    let pos = 0;

    this.geometries.forEach((geometry) => {
      const shape = new Mesh(geometry, material);
      // just for differentiating
      shape.position.x = pos;
      shape.position.y = pos;
      shape.position.z = pos;
      shape.rotation.x = 0.01;
      pos = pos + 60;
      this.shapes.push(shape);
      this.scene.add(shape);
    });
  }

  protected appendObjectsToScene() {
    this.scene.background = new Color(0xf0f0f0);
    this.createSquare();
    this.createCube();

    const material = new MeshBasicMaterial({
      vertexColors: VertexColors,
    });
    let pos = 0;

    this.geometries.forEach((geometry) => {
      const shape = new Mesh(geometry, material);
      // just for differentiating
      shape.position.x = pos;
      shape.position.y = pos;
      shape.position.z = pos;
      shape.rotation.x = 0.01;
      pos = pos + 60;
      this.shapes.push(shape);
      this.scene.add(shape);
    });
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
      (geometry.attributes.color as any).needsUpdate = true;
    });

    this.renderer.render(this.scene, this.camera);
  }

  protected finalSceneElements() {
    this.appendObjectsToScene();
    this.camera.position.z = 400;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    this.renderer.render(this.scene, this.camera);

    return {
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
    };
  }
}

export default AbstractView;
</script>

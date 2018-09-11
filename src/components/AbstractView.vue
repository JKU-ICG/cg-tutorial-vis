<script>

import * as Three from 'three';

export default {

    data() {
        return {
            scene: new Three.Scene(),
            renderer: new Three.WebGLRenderer( { antialias: true } ),
            camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ),
            geometries: [],
            shapes: [],
        }
    },

    methods: {
        createSquare() {
            var vertices = new Float32Array([
                -50.0, -50.0, 50.0,
                50.0, -50.0, 50.0,
                50.0, 50.0, 50.0,
                50.0, 50.0, 50.0,
                -50.0, 50.0, 50.0,
                -50.0, -50.0, 50.0
            ]);
            var customGeometry = new Three.BufferGeometry();
            customGeometry.addAttribute('position',new Three.BufferAttribute(vertices, 3));
            this.geometries.push(customGeometry);
        },
        createCube() {
            var customGeometry = new Three.BoxBufferGeometry(50, 50, 50);
            this.geometries.push(customGeometry);
        },
        createSphere() {
            var customGeometry = new Three.SphereBufferGeometry( 0.5, 32, 32 );
            this.geometries.push(customGeometry);
        },
        appendObjectsToToolbar() {
            //Modify renderer and scale the objects, also create a different scenegraph because toolbar will contain more objects
            this.scene.background = new Three.Color( 0xf0f0f0 );
            this.createSquare();
            this.createCube();
          
            var material = new Three.MeshBasicMaterial({color: 0xff00ff});
            var pos = 0;

            for(var index = 0; index < this.geometries.length; index++) {
                var geometry = this.geometries[index];
                var shape = new Three.Mesh(geometry, material);
                //just for differentiating
                shape.position.x = pos;
                shape.position.y = pos;
                shape.position.z = pos;
                shape.rotation.x = 0.01;
                pos = pos + 60;
                this.shapes.push(shape);
                this.scene.add(shape);
            }
        },
        appendObjectsToScene() {
            this.scene.background = new Three.Color( 0xf0f0f0 );
            this.createSquare();
            this.createCube();
          
            var material = new Three.MeshBasicMaterial({vertexColors: Three.VertexColors});
            var pos = 0;

            for(var index = 0; index < this.geometries.length; index++) {
                var geometry = this.geometries[index];
                var shape = new Three.Mesh(geometry, material);
                //just for differentiating
                shape.position.x = pos;
                shape.position.y = pos;
                shape.position.z = pos;
                shape.rotation.x = 0.01;
                pos = pos + 60;
                this.shapes.push(shape);
                this.scene.add(shape);
            }
        },
        updateMaterial() {
            for(var i = 0; i < this.shapes.length; i++) {
                this.shapes[i].material = new Three.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
                this.shapes[i].material.needsUpdate = true;
            }
            this.renderer.render(this.scene, this.camera);
        },
        updateColors(color) {
            for(var index = 0; index < this.geometries.length; index++) {
                var geometry = this.geometries[index];
                var count = geometry.attributes.position.count;
                geometry.addAttribute('color', new Three.BufferAttribute(new Float32Array(count * 3), 3));
                var attribColor = geometry.attributes.color;

                for(var i = 0 ; i < count ; i ++) {
                    attribColor.setXYZ(i, color.r/255.0, color.g/255.0, color.b/255.0);
                }
                geometry.attributes.color.needsUpdate = true;
             }
            this.renderer.render(this.scene, this.camera);
        },
        finalSceneElements() {
            this.appendObjectsToScene();
            this.camera.position.z = 400;
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
            this.renderer.render(this.scene, this.camera);

            return {
                scene: this.scene,
                renderer: this.renderer,
                camera: this.camera
            } 
        }
    }
}
</script>
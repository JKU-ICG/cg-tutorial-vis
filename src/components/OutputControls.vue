<template>   
    <div id="outputcontrol"/>
</template>

<script>

import * as Three from 'three';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

export default {

        data() {

            return {
                finalSize: 1,
                renderer: new Three.WebGLRenderer( { antialias: true } ),
                scene: new Three.Scene(),
                camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ),
                geometry: new Three.BoxBufferGeometry( 200, 200, 200),
                material: new Three.MeshBasicMaterial({vertexColors: Three.VertexColors}),
                cube: new Three.Mesh(),
            }
        },

        computed: {
            ...mapGetters(['color', 'displayWidth', 'displayHeight']),
        },
        
        methods: {
            ...mapActions([
                'increment',
                'decrement',
            ]),

            init() {
                this.scene.background = new Three.Color( 0xf0f0f0 );
                var count = this.geometry.attributes.position.count;
                this.geometry.addAttribute('color', new Float32Array(count * 3), 3);
                this.cube = new Three.Mesh(this.geometry, this.material);
                this.cube.name = 'myCube';
                this.camera.position.z = 400;
                this.scene.add(this.cube);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.displayWidth, this.displayHeight);
                document.getElementById('outputcontrol').appendChild(this.renderer.domElement); 
            },

            animate() {
                requestAnimationFrame(this.animate);
                this.cube.rotation.x += 0.01;
                this.renderer.render(this.scene, this.camera);
            }
        },
        
        watch: {
            color() { 
                var count = this.geometry.attributes.position.count;
                var attribColor = this.geometry.attributes.color;

                for(var i = 0 ; i < count ; i ++)
                {
                    attribColor.setXYZ(i, this.color.r / 255.0, this.color.g / 255.0, this.color.b / 255.0);
                }
                this.geometry.attributes.color.needsUpdate = true;
            }
        },

        mounted() {
            this.init();
            this.animate();
        },
    };
</script>
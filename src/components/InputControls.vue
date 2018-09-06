<template>
  <div>  
     New Scale: {{ scale }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <ColorPicker/>
    <div id="inputcontrol" v-on:click="changeColor"></div>    
  </div>
</template>

<script>

import * as Three from 'three';
import { createNamespacedHelpers } from 'vuex';
import ColorPicker from '@/components/ColorPicker.vue';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

export default {

        components: {
            ColorPicker,
        },

        data() {
            return {
                finalSize: 1,
                renderer: new Three.WebGLRenderer( { antialias: true } ),
                scene: new Three.Scene(),
                camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ),
                geometry: new Three.BufferGeometry(),
                material: new Three.MeshBasicMaterial({color: 0x00ff00, vertexColors: Three.VertexColors}),
                square: new Three.Mesh(),
            };
        },

        computed: {
            ...mapGetters(['scale', 'displayWidth', 'displayHeight', 'color'])
        },

        methods: {
            ...mapActions([
                'increment',
                'decrement',
            ]),

            init() {
                this.scene.background = new Three.Color( 0xf0f0f0 );
                var vertices = new Float32Array([
                        -100.0, -100.0, 100.0,
                        100.0, -100.0, 100.0,
                        100.0, 100.0, 100.0,
                        100.0, 100.0, 100.0,
                        -100.0, 100.0, 100.0,
                        -100.0, -100.0, 100.0
                ]);
                
                this.geometry.addAttribute('position', new Three.BufferAttribute(vertices, 3));
                var count = this.geometry.attributes.position.count;
                this.geometry.addAttribute('color', new Three.BufferAttribute(new Float32Array(count * 3), 3));

                this.square = new Three.Mesh(this.geometry, this.material);
                this.scene.add(this.square);
                
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.displayWidth, this.displayHeight);
                this.camera.position.z = 400;
                this.renderer.render(this.scene, this.camera);
                document.getElementById('inputcontrol').appendChild(this.renderer.domElement);
            },

            animate() {
                requestAnimationFrame(this.animate);
                this.renderer.render(this.scene, this.camera);
            },

            changeColor() {
                //only specific vertex color should change here and not the entire square with gradient
                
            }
        },
        
        mounted() {
            this.init();
            this.animate();
        }
    };
</script>
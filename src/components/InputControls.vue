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

        data: function() {
            return{
                finalSize: 1,
                renderer: new Three.WebGLRenderer( { antialias: true } ),
                scene: new Three.Scene(),
                camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ),
                geometry: new Three.BufferGeometry(),
                material: new Three.MeshBasicMaterial({color: 0x00ff00, vertexColors: Three.VertexColors}),
                triangle: new Three.Mesh(),
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

            init: function() {
                this.scene.background = new Three.Color( 0xf0f0f0 );
                var vertices = new Float32Array([
                    -100.0, -100.0,  100.0,
	                 100.0, -100.0,  100.0,
                     100.0,  100.0,  100.0,
                    100.0,  100.0,  100.0,
                     -100.0,  100.0,  100.0,
                    -100.0, -100.0,  100.0
                ]);
                
                this.geometry.addAttribute('position', new Three.BufferAttribute(vertices, 3));
                var count = this.geometry.attributes.position.count;
                this.geometry.addAttribute('color', new Three.BufferAttribute(new Float32Array( count * 3), 3));

                this.triangle = new Three.Mesh(this.geometry, this.material);
                this.scene.add(this.triangle);
                
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.displayWidth, this.displayHeight);
                this.camera.position.z = 400;
                this.renderer.render(this.scene, this.camera);
                document.getElementById('inputcontrol').appendChild(this.renderer.domElement);
            },

            animate: function() {
                requestAnimationFrame(this.animate);
                //this.triangle.rotation.x += 0.01;
                this.renderer.render(this.scene, this.camera);
            },

            changeColor: function()
            {
                var count = this.geometry.attributes.position.count;
                var attColor = this.geometry.attributes.color;
                var vColor = new Three.Color();
                for(var i = 0 ; i < count ; i ++)
                {
                    //vColor.setRGB(this.color.r, this.color.g, this.color.b);
                    vColor.setHSL(this.geometry.attributes.position.getY(i)/1000, 0.5,0.5 );
                    //vColor.setHSL(0.8, 0.5, 0.5 );
                    //vColor.set(this.color);
                    attColor.setXYZ(i, vColor.r, vColor.g, vColor.b);
                }
                this.geometry.attributes.color.needsUpdate = true;
            }
           
        },
        
        mounted: function(){
            this.init();
            this.animate();
        }
    };
</script>
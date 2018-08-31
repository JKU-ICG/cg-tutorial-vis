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
                geometry: new Three.BoxGeometry( 200, 200, 200),
                material: new Three.MeshBasicMaterial({ color: this.color }),
                cube: new Three.Mesh(),
            };
        },

        computed: {
            ...mapGetters(['scale', 'displayWidth', 'displayHeight', 'colors'])
        },

        methods: {
            ...mapActions([
                'increment',
                'decrement',
            ]),

            init: function() {
                this.cube = new Three.Mesh( this.geometry, this.material);
                this.cube.name = 'myCube';
                this.camera.position.z = 400;
                this.scene.add(this.cube);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.displayWidth, this.displayHeight);
                document.getElementById('inputcontrol').appendChild(this.renderer.domElement); 
            },

            animate: function() {
                requestAnimationFrame(this.animate);
                this.cube.rotation.x += 0.01;
                this.renderer.render(this.scene, this.camera);
            },
            changeColor: function(){
                this.cube.material.color.set('#38194D'); 
            },
        },
        
        watch: {
            scale: function() {
                this.cube.scale.set( this.scale, this.scale, this.scale);
            },
            colors: function() {
                this.cube.material.color.set(this.color);
            },
        },

        mounted: function(){
            this.init();
            this.animate();
        }
    };
</script>
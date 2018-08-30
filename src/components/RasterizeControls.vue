<template>
    <div id="rasterizecontrol"/>            
</template>

<script>

import * as Three from 'three';
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapGetters } = createNamespacedHelpers("cubestore");

export default {

        data:function(){

            return{ 
                finalSize: 1,                              
                renderer: new Three.WebGLRenderer( { antialias: true } ), 
                scene: new Three.Scene(), 
                camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ), 
                geometry: new Three.BoxGeometry(200,200,200),
                material: new Three.MeshBasicMaterial({ color:  0xFFFFFF }),
                cube: new Three.Mesh()
            }            
        },

        computed: {
            ...mapGetters(["scale", "displayWidth", "displayHeight"])
        },
        
        methods: {
            ...mapActions([
                "increment",
                "decrement"
            ]),

            init: function(){                                
                this.cube = new Three.Mesh(this.geometry, this.material);           
                this.cube.name = "myCube";
                this.camera.position.z = 400;
                this.scene.add(this.cube);    
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.displayWidth, this.displayHeight);
                document.getElementById("rasterizecontrol").appendChild(this.renderer.domElement); 
            },

            animate: function(){
                requestAnimationFrame(this.animate);
                this.cube.rotation.x += 0.01;                
                this.renderer.render(this.scene, this.camera);
            }
        },
        
        watch: {
            scale: function(){
                this.cube.scale.set(this.scale, this.scale, this.scale);                                 
                //this.renderer.render(this.scene, this.camera); //If animate is not being used then this needs to be called explicitly. Also in init.
            }
        },

        mounted: function(){
            this.init();
            this.animate();
        }        
    };
</script>
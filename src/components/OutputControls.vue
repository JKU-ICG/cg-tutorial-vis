<template>   
    <div id="outputcontrol"/>
</template>

<script>

import * as Three from 'three';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');
//https://github.com/mrdoob/three.js/blob/dev/examples/webgl_interactive_cubes_gpu.html
export default {

        data: function() {

            return{
                finalSize: 1,
                renderer: new Three.WebGLRenderer( { antialias: true } ),
                scene: new Three.Scene(),
                camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ),
                geometry: new Three.BoxBufferGeometry( 200, 200, 200),
                material: new Three.MeshBasicMaterial({ color: 0xff0000 , vertexColors: Three.VertexColors}),
                cube: new Three.Mesh(),
            }
        },

        computed: {
            ...mapGetters(['scale', 'displayWidth', 'displayHeight']),
        },
        
        methods: {
            ...mapActions([
                'increment',
                'decrement',
            ]),

            init: function() {
                this.scene.background = new Three.Color( 0xf0f0f0 );
                var count = this.geometry.attributes.position.count;               
                this.geometry.addAttribute('color', new Float32Array( count * 3), 3);
                this.geometry.attributes.color.needsUpdate = true;
                this.cube = new Three.Mesh(this.geometry, this.material);
                this.cube.name = 'myCube';
                this.camera.position.z = 400;
                this.scene.add(this.cube);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(this.displayWidth, this.displayHeight);
                document.getElementById('outputcontrol').appendChild(this.renderer.domElement); 
            },

            animate: function(){
                requestAnimationFrame(this.animate);
                this.cube.rotation.x += 0.01;
                this.renderer.render(this.scene, this.camera);
            }        },
        
        watch: {
            scale: function(){
                this.cube.scale.set(this.scale, this.scale, this.scale);
                var count = this.geometry.attributes.position.count;
                var attColor = this.geometry.attributes.color;
                var vColor = new Three.Color();
                for(var i = 0 ; i < count ; i ++)
                {
                    vColor.setHSL(0.8, 0.5, 0.5 );
                    attColor.setXYZ(i, vColor.r, vColor.g, vColor.b);
                }
                this.geometry.attributes.color.needsUpdate = true;
            }
        },

        mounted: function(){
            this.init();
            this.animate();
        },
    };
</script>
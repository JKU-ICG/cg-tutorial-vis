<template>
  <div>  
     Select scale: 
    <select v-model="scale">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>  
    <button @click="init">Initialize</button>
    <button @click="animate">Animate</button>
    <!-- <button @click="destroy">Destroy</button> -->
  </div>
</template>

<script>

import * as Three from 'three';

export default {

        data:function(){

            return{               
                scale: 3,
                renderer: new Three.WebGLRenderer( { antialias: true } ), 
                scene: new Three.Scene(), 
                camera: new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 ), 
                geometry: new Three.BoxGeometry(200,200,200),
                material: new Three.MeshBasicMaterial({ color:  0xFFFF00 }),
                cube: new Three.Mesh()
            }            
        },
        
        methods: {
           init: function(){                
                var finalSize = this.scale * 100;    
                this.renderer = new Three.WebGLRenderer( { antialias: true } );
                this.scene = new Three.Scene();
                this.camera = new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
                this.geometry = new Three.BoxGeometry(200,200,200);
                this.material = new Three.MeshBasicMaterial({ color:  0xFFFF00 });
                this.geometry = new Three.BoxGeometry(finalSize, finalSize, finalSize);
                this.cube = new Three.Mesh(this.geometry, this.material);           
                this.cube.name = "myCube";
                this.camera.position.z = 400;        
                this.scene.add(this.cube);              
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.renderer.setSize(window.innerWidth, window.innerHeight); 
                document.body.appendChild(this.renderer.domElement); 
            },
            animate: function(){
                requestAnimationFrame(this.animate);
                this.cube.rotation.x += 0.01;                
                this.renderer.render(this.scene, this.camera);
            },
            destroy: function(){
                this.material.dispose();
                this.geometry.dispose();                            
                document.body.removeChild(this.renderer.domElement);
            }

        },
        watch: {
            scale: function(){                
                this.destroy();
            }
        },

        mounted: function(){
            this.init();
            this.animate();
        }
    };
</script>
<template>
  <div>   
  </div>
</template>

<script>

import * as Three from 'three';

export default {
    data: 
        function() {
            return { 
                width: 30,
                height: 30,               
            } 
        },    

    mounted: function(){
        init();
        animate();
        var renderer, scene, camera, cube;
         function init()
        {
            scene = new Three.Scene();
            camera = new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
            renderer = new Three.WebGLRenderer( { antialias: true } );
            var geometry = new Three.BoxGeometry(200,200,200);
            var material = new Three.MeshBasicMaterial({ color:  0xFFFF00 });
            cube = new Three.Mesh(geometry, material);
            cube.name = "myCube";
            camera.position.z = 400;        
            scene.add(cube);              
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight); 
            document.body.appendChild(renderer.domElement);            
        }

        function animate(){                      
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            //cube.rotation.y += 0.02;
            renderer.render(scene, camera);
        }
    }    
};
</script>
<template>
    <div>
         <script id="vertexShader" type="x-shader/x-vertex">
            
            varying vec2 vUv;

            void main()	{
                
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        </script>
        
        <script id="fragmentShader" type="x-shader/x-fragment">
            
            uniform sampler2D texture;
            uniform float resolutionX;
            uniform float resolutionY;

            varying vec2 vUv;

            void main( void ) {

                float x = fract(vUv.x * resolutionX);
                float y = fract(vUv.y * resolutionY);

                if(( x >= 0.9 && x <= 1.0 ) || ( y >= 0.9 && y <= 1.0 ))
                {
                    gl_FragColor = vec4(0.2,0.2,0.2,0.2);
                }
                else
                {
                    gl_FragColor = texture2D( texture, vUv );
                }
            }
        </script>
    </div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { watch } from 'fs';
import { AbstractView } from '@/components/Lab2/AbstractView.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');

@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ', 'fov', 'far', 'isCameraPerspective']),
    }})
export class Rasterization extends Vue {

    private abstractView = new AbstractView();

    private mounted() {

        const vertexShader = document.getElementById('vertexShader')!.textContent || '';
        const fragmentShader = document.getElementById('fragmentShader')!.textContent || '';

        this.abstractView.initRasterView(this.$el, vertexShader, fragmentShader);
        this.abstractView.animateRasterView();
    }

    @Watch('isCameraPerspective')
    private switchCamera(isCameraPersp: boolean) {

        this.abstractView.onSwitchCamera(isCameraPersp);
    }

    @Watch('cameraX')
    private translateCameraX(valX: number) {

        this.abstractView.changeCameraX(valX);
    }

    @Watch('cameraY')
    private translateCameraY(valY: number) {

        this.abstractView.changeCameraY(valY);
    }

    @Watch('cameraZ')
    private translateCameraZ(valZ: number) {

        this.abstractView.changeCameraZ(valZ);
    }

    @Watch('far')
    private changeFar(far: number) {

        this.abstractView.changeFar(far);
    }

    @Watch('fov')
    private changeFov(fov: number) {

        this.abstractView.changeFov(fov);
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {

        this.abstractView.scaleObjectXAxis(valX);
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {

        this.abstractView.scaleObjectYAxis(valY);
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {

        this.abstractView.scaleObjectZAxis(valZ);
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {

        this.abstractView.translateObjX(valX);
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {

        this.abstractView.translateObjY(valY);
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {

        this.abstractView.translateObjZ(valZ, true);
    }
}
export default Rasterization;
</script>
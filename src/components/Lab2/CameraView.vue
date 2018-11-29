<template>
    <!-- <div v-on:mousedown = "mouseDown" v-on:mouseup = "mouseUp"> -->
    <div>
    </div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { createNamespacedHelpers } from 'vuex';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';
import { watch } from 'fs';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

// scale as well?
@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ']),
    }})
export class CameraView extends mixins(AbstractSpace) {
    private isObjectCameraOrtho = false;
    private mousePrev = { x: 0, y: 0 };
    private y1 = 0;

    private mounted() {
        this.initCameraView(this.isObjectCameraOrtho);
        this.animateCameraView();
    }

    private mouseDown(event: MouseEvent) {
        this.mousePrev.x = event.pageX; // clientX or pageX
        this.mousePrev.y = event.pageY;
    }
    // correct -> camera totation it is and that too for x and y
    // https://github.com/JKU-ICG/cg_lab_2018/blob/master/04_illumination/main.js

    private mouseUp(event: MouseEvent) {
        const diffX = (event.pageX - this.mousePrev.x);
        const diffY = (event.pageY - this.mousePrev.y);
        const diffZ = Math.sqrt((Math.pow(diffX, 2) + (Math.pow(diffY, 2))));
        this.changeWorldCameraView(diffX, diffY, diffZ);
    }

    @Watch('cameraX')
    private translateCamera(valX: number) {
        this.translateCameraX(valX);
    }

    @Watch('cameraY')
    private changeFOV(valY: number) {
        this.changeCameraFOV(valY);
    }

    @Watch('cameraZ')
    private changeFar(valZ: number) {
        this.changeCameraFar(valZ);
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {
        this.scaleObjectXAxis(valX);
        this.renderCameraView();
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {
        this.scaleObjectYAxis(valY);
        this.renderCameraView();
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {
        this.scaleObjectZAxis(valZ);
        this.renderCameraView();
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {
        this.translateObjX(valX);
        this.renderCameraView();
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {
        this.translateObjY(valY);
        this.renderCameraView();
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {
        this.translateObjZ(valZ);
        this.renderCameraView();
    }
}

export default CameraView;
</script>
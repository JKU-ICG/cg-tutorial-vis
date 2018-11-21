<template>
    <div></div>
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
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'translateX', 'translateY', 'translateZ']),
    }})
export class CameraView extends mixins(AbstractSpace) {

    private mounted() {
        this.initCameraView(true);
        this.animateCameraView();
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
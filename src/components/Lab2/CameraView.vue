<template>
    <div v-on:mousedown = "mouseDown" v-on:mouseup = "mouseUp">
        <button v-on:click="switchCameras('Perspective')">Perspective</button>
        <button v-on:click="switchCameras('OrthoGraphic')">OrthoGraphic</button>
    </div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { createNamespacedHelpers } from 'vuex';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';
import { watch } from 'fs';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ']),
    }})
export class CameraView extends Vue {

    private isObjectCameraOrtho = false;

    private abstractSpace = new AbstractSpace();

    private mounted() {
        this.abstractSpace.initCameraView(this.$el);
        this.abstractSpace.animateCameraView();
    }

    private switchCameras(camera: string) {
        this.abstractSpace.onSwitchCamera(camera);
    }

    private mouseDown(event: MouseEvent) {
        document.addEventListener('mousemove', this.mouseMove, false);
        document.addEventListener('mouseup', this.mouseUp, false);

        this.abstractSpace.animateOnMouseDownEvent(event);
    }

    private mouseUp(event: MouseEvent) {
        document.removeEventListener('mousemove', this.mouseMove, false);
        document.removeEventListener('mouseup', this.mouseUp, false);
    }

    private mouseMove(event: MouseEvent) {
        this.abstractSpace.encapsulateDomElementAndAnimate(event);
    }

    @Watch('cameraX')
    private translateCamera(valX: number) {
        this.abstractSpace.translateCameraX(valX);
    }

    @Watch('cameraY')
    private changeFOV(valY: number) {
        this.abstractSpace.changeCameraFOV(valY);
    }

    @Watch('cameraZ')
    private changeFar(valZ: number) {
        this.abstractSpace.changeCameraFar(valZ);
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {
        this.abstractSpace.scaleObjectXAxis(valX);
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {
        this.abstractSpace.scaleObjectYAxis(valY);
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {
        this.abstractSpace.scaleObjectZAxis(valZ);
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {
        this.abstractSpace.translateObjX(valX);
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {
        this.abstractSpace.translateObjY(valY);
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {
        this.abstractSpace.translateObjZ(valZ);
    }
}

export default CameraView;
</script>
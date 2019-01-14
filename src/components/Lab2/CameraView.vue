<template>
    <div v-on:mousedown = "mouseDown" v-on:mouseup = "mouseUp">
    </div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';
import { watch } from 'fs';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');

@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ', 'fov', 'far', 'isCameraPerspective']),
    }})
export class CameraView extends Vue {

    private isObjectCameraOrtho = false;

    private abstractSpace = new AbstractSpace();

    private mounted() {

        this.abstractSpace.initCameraView(this.$el);
        this.abstractSpace.animateCameraView();
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

        this.abstractSpace.animateOnMouseMoveEvent(event);
    }

    @Watch('isCameraPerspective')
    private switchCamera(isCameraPersp: boolean) {

        this.abstractSpace.onSwitchCamera(isCameraPersp);
    }

    @Watch('cameraX')
    private translateCameraX(valX: number) {

        this.abstractSpace.changeCameraX(valX);
    }

    @Watch('cameraY')
    private translateCameraY(valY: number) {

        this.abstractSpace.changeCameraY(valY);
    }

    @Watch('cameraZ')
    private translateCameraZ(valZ: number) {

        this.abstractSpace.changeCameraZ(valZ);
    }

    @Watch('far')
    private changeFar(far: number) {

        this.abstractSpace.changeFar(far);
    }

    @Watch('fov')
    private changeFov(fov: number) {

        this.abstractSpace.changeFov(fov);
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
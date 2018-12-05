<template>
    <div v-on:mousedown = "mouseDown" v-on:mouseup = "mouseUp" v-on:mousemove = "mouseMove">
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

// scale as well?
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
        this.abstractSpace.renderScene();
    }

    private mouseDown(event: MouseEvent) {
        this.abstractSpace.animateOnMouseDownEvent(event);
        this.abstractSpace.renderScene();
    }

    private mouseUp(event: MouseEvent) {

    }

    private mouseMove(event: MouseEvent) {
        this.abstractSpace.animateOnMouseMoveEvent(event);
        this.abstractSpace.renderScene();
    }

    @Watch('cameraX')
    private translateCamera(valX: number) {
        this.abstractSpace.translateCameraX(valX);
        this.abstractSpace.renderMainCameraView(); // renderScene??

    }

    @Watch('cameraY')
    private changeFOV(valY: number) {
        this.abstractSpace.changeCameraFOV(valY);
        this.abstractSpace.renderMainCameraView();
    }

    @Watch('cameraZ')
    private changeFar(valZ: number) {
        this.abstractSpace.changeCameraFar(valZ);
        this.abstractSpace.renderMainCameraView();
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {
        this.abstractSpace.scaleObjectXAxis(valX);
        this.abstractSpace.renderScene();
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {
        this.abstractSpace.scaleObjectYAxis(valY);
        this.abstractSpace.renderScene();
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {
        this.abstractSpace.scaleObjectZAxis(valZ);
        this.abstractSpace.renderScene();
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {
        this.abstractSpace.translateObjX(valX);
        this.abstractSpace.renderScene();
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {
        this.abstractSpace.translateObjY(valY);
        this.abstractSpace.renderScene();
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {
        this.abstractSpace.translateObjZ(valZ);
        this.abstractSpace.renderScene();
    }
}

export default CameraView;
</script>
<template>
    <div v-on:mousedown = "mouseDown" v-on:mouseup = "mouseUp" v-on:mousemove = "mouseMove">
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
import { Vector2 } from 'three';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

// scale as well?
@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ']),
    }})
export class CameraView extends mixins(AbstractSpace) {
    private isObjectCameraOrtho = false;

    // to be changed?
    public screen: { left: number; top: number; width: number; height: number } = {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
    };

    private mounted() {
        this.initCameraView(this.isObjectCameraOrtho);
        this.animateCameraView();
    }

    // also move to abstract space?
    private getMouseOnCircle(pageX: number, pageY: number) {
        const mouseOnCircle = new Vector2(
            ((pageX - this.screen.width * 0.5 - this.screen.left) / (this.screen.width * 0.5)),
            ((this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width),
        );
        return mouseOnCircle;
    }

    private mouseDown(event: MouseEvent) {
        this.mouseCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
        this.mousePrev.copy(this.mouseCurr);
        this.updateRotateCamera();
    }

    private mouseUp(event: MouseEvent) {

    }

    private mouseMove(event: MouseEvent) {
        this.updateRotateCamera();
        this.mousePrev.copy(this.mouseCurr);
        this.mouseCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
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
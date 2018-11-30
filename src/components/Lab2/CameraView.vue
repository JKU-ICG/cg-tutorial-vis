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
export class CameraView extends Vue {

    private isObjectCameraOrtho = false;
    private cameraControls = new AbstractSpace(); // name to be changed

    // to be changed?
    private screen: { left: number; top: number; width: number; height: number } = {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
    };

    private mounted() {
        this.cameraControls.initCameraView(this.$el);
        this.cameraControls.renderScene();
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
        this.cameraControls.mouseCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
        this.cameraControls.mousePrev.copy(this.cameraControls.mouseCurr);
        this.cameraControls.updateMainCamera();
        this.cameraControls.renderScene();
    }

    private mouseUp(event: MouseEvent) {

    }

    private mouseMove(event: MouseEvent) {
        this.cameraControls.mousePrev.copy(this.cameraControls.mouseCurr);
        this.cameraControls.mouseCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
        this.cameraControls.updateMainCamera();
        this.cameraControls.renderScene();
    }


    @Watch('cameraX')
    private translateCamera(valX: number) {
        this.cameraControls.translateCameraX(valX);
        this.cameraControls.renderMainCameraView(); // renderScene??

    }

    @Watch('cameraY')
    private changeFOV(valY: number) {
        this.cameraControls.changeCameraFOV(valY);
        this.cameraControls.renderMainCameraView();
    }

    @Watch('cameraZ')
    private changeFar(valZ: number) {
        this.cameraControls.changeCameraFar(valZ);
        this.cameraControls.renderMainCameraView();
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {
        this.cameraControls.scaleObjectXAxis(valX);
        this.cameraControls.renderScene();
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {
        this.cameraControls.scaleObjectYAxis(valY);
        this.cameraControls.renderScene();
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {
        this.cameraControls.scaleObjectZAxis(valZ);
        this.cameraControls.renderScene();
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {
        this.cameraControls.translateObjX(valX);
        this.cameraControls.renderScene();
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {
        this.cameraControls.translateObjY(valY);
        this.cameraControls.renderScene();
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {
        this.cameraControls.translateObjZ(valZ);
        this.cameraControls.renderScene();
    }
}

export default CameraView;
</script>
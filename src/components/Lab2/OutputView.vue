<template>
<div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { AbstractView } from '@/components/Lab2/AbstractView.vue';
import { watch } from 'fs';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');

@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ', 'fov', 'far', 'isCameraPerspective']),
    }})
export class OutputView extends Vue {
    private abstractView = new AbstractView();

    private mounted() {

        this.abstractView.initOutputView(this.$el);
        this.abstractView.animateOutputView();
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

        this.abstractView.translateObjZ(valZ);
    }
}

export default OutputView;
</script>
<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import { Component, Watch, Model } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { createNamespacedHelpers } from 'vuex';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    computed: {
        ...mapGetters(['scaleX', 'scaleY', 'scaleZ', 'translateX', 'translateY', 'translateZ']),
    }})
export class ModelView extends Vue {
    private modelControls: any;

    constructor() {
        super();
        this.modelControls = new AbstractSpace(); // definitely needs to change
    }

    private mounted() {
        this.modelControls.initModelView();
        this.modelControls.renderWorldCameraView();
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {
        this.modelControls.scaleObjectXAxis(valX);
        this.modelControls.renderWorldCameraView();
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {
        this.modelControls.scaleObjectYAxis(valY);
        this.modelControls.renderWorldCameraView();
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {
        this.modelControls.scaleObjectZAxis(valZ);
        this.modelControls.renderWorldCameraView();
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {
        this.modelControls.translateObjX(valX);
        this.modelControls.renderWorldCameraView();
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {
        this.modelControls.translateObjY(valY);
        this.modelControls.renderWorldCameraView();
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {
        this.modelControls.translateObjZ(valZ);
        this.modelControls.renderWorldCameraView();
    }
}

export default ModelView;
</script>
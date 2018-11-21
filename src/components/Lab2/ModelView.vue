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

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    computed: {
        ...mapGetters(['scaleX', 'scaleY', 'scaleZ', 'translateX', 'translateY', 'translateZ']),
    }})
export class ModelView extends mixins(AbstractSpace) {

    private mounted() {
        this.initModelView();
        this.animateModelView();
    }

    @Watch('scaleX')
    private scaleObjectX(valX: number) {
        this.scaleObjectXAxis(valX);
        this.renderWorldCameraView();
    }

    @Watch('scaleY')
    private scaleObjectY(valY: number) {
        this.scaleObjectYAxis(valY);
        this.renderWorldCameraView();
    }

    @Watch('scaleZ')
    private scaleObjectZ(valZ: number) {
        this.scaleObjectZAxis(valZ);
        this.renderWorldCameraView();
    }

    @Watch('translateX')
    private moveObjectX(valX: number) {
        this.translateObjX(valX);
        this.renderWorldCameraView();
    }

    @Watch('translateY')
    private moveObjectY(valY: number) {
        this.translateObjY(valY);
        this.renderWorldCameraView();
    }

    @Watch('translateZ')
    private moveObjectZ(valZ: number) {
        this.translateObjZ(valZ);
        this.renderWorldCameraView();
    }
}

export default ModelView;
</script>
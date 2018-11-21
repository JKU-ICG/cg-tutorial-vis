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
        ...mapGetters(['translateX', 'translateY', 'translateZ']),
    }})
export class ModelView extends mixins(AbstractSpace) {

    private mounted() {
        this.initModelView();
        this.animateModelView();
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
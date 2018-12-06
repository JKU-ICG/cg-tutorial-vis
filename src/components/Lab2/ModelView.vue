<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import { Component, Watch, Model } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    computed: {
        ...mapGetters(['scaleX', 'scaleY', 'scaleZ', 'translateX', 'translateY', 'translateZ']),
    }})
export class ModelView extends Vue {

    private abstractSpace = new AbstractSpace();

    private mounted() {
        this.abstractSpace.initModelView(this.$el);
        this.abstractSpace.animateModelView();
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

export default ModelView;
</script>
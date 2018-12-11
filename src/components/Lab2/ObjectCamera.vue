<template>
  <div></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';
import { watch } from 'fs';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    computed: {
        ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
            'translateX', 'translateY', 'translateZ']),
    }})
export class ObjectCamera extends Vue {
    private abstractSpace = new AbstractSpace();

    private mounted() {

        this.abstractSpace.initObjectCameraView(this.$el);
        this.abstractSpace.animateObjectCameraView();
    }

    @Watch('cameraX')
    private translateCamera(valX: number) {

        this.abstractSpace.changeCameraX(valX);
    }

    @Watch('cameraY')
    private changeFOV(valY: number) {

        this.abstractSpace.changeCameraY(valY);
    }

    @Watch('cameraZ')
    private changeFar(valZ: number) {

        this.abstractSpace.changeCameraZ(valZ);
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

export default ObjectCamera;
</script>
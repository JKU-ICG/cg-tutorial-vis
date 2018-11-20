<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';

@Component({})
export class OrthoSpace extends mixins(AbstractSpace) {

    private mounted() {
        this.initCameraSpace(false);
        this.animateCameraSpace();
    }
}

export default OrthoSpace;
</script>
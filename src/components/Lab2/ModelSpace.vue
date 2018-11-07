<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';
import { FrustumView } from '@/components/Lab2/FrustumView.vue';

@Component({})
export class ModelSpace extends mixins(FrustumView) {

    private mounted() {
        this.init(); // Object is orthographic.
        this.animate();
    }
}

export default ModelSpace;
</script>
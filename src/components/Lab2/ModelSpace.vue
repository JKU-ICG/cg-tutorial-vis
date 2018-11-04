<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';

@Component({})
export class ModelSpace extends mixins(AbstractSpace) {

    private mounted() {
        this.init(false, true);
        this.animate();
    }
}

export default ModelSpace;
</script>
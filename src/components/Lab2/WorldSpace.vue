<template>
    <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { AbstractSpace } from '@/components/Lab2/AbstractSpace.vue';

@Component({})
export class WorldSpace extends mixins(AbstractSpace) {

    private mounted() {
        this.initModelSpace(false);
        this.animate();
    }
}

export default WorldSpace;
</script>
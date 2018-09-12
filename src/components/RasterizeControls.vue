<template>   
    <div id="rasterizecontrol"/>
</template>

<script lang="ts">
import { AbstractView } from '@/components/AbstractView.vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

@Component({
    name: 'rasterize-control',
    computed: {
        ...mapGetters(['color']),
    },
})
export class RasterizeControl extends mixins(AbstractView) {
    private init() {
        const elements = this.finalSceneElements();
        document.getElementById('rasterizecontrol')!.appendChild(elements.renderer.domElement);
    }

    private mounted() {
        this.init();
    }

    @Watch('color')
    private onColorChanged(val: string, oldVal: string) {
        this.updateColors(val);
    }
}

export default RasterizeControl;
</script>

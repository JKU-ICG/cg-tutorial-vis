<template>   
    <div></div>
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
    private mounted() {
        const elements = this.finalSceneElements();
        this.$el.appendChild(elements.renderer.domElement)
    }

    @Watch('color')
    private onColorChanged(val: string, oldVal: string) {
        this.updateColors(val);
    }
}

export default RasterizeControl;
</script>

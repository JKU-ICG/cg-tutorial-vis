<template>   
    <div id="primitivecontrol"/>
</template>

<script lang="ts">
import { AbstractView } from './AbstractView.vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

@Component({
    name: 'primitive-control',
    computed: {
        ...mapGetters(['color']),
    },
})
export class PrimitiveControl extends mixins(AbstractView) {
    private init() {
        const elements = this.finalSceneElements();
        document.getElementById('primitivecontrol')!.appendChild(elements.renderer.domElement);
    }

    private mounted() {
        this.init();
    }

    @Watch('color')
    private onColorChanged(val: string, oldVal: string) {
        this.updateMaterial();
    }
}

export default PrimitiveControl;
</script>

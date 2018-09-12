<template>   
    <div id="inputcontrol"/>
</template>

<script lang="ts">
import { AbstractView } from '@/components/AbstractView.vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

@Component({
    name: 'input-control',
    computed: {
        ...mapGetters(['color']),
    },
})
export class InputControl extends mixins(AbstractView) {
    private init() {
        const elements = this.finalSceneElements();
        document.getElementById('inputcontrol')!.appendChild(elements.renderer.domElement);
    }

    private mounted() {
        this.init();
    }

    @Watch('color')
    private onColorChanged(val: string, oldVal: string) {
        this.updateColors(val);
    }
}

export default InputControl;
</script>

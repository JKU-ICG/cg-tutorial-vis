<template>
<div @mousemove="renderScene"></div>
</template>

<script lang="ts">
import { AbstractView } from '@/components/Lab1/AbstractView.vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Vector3 } from 'three';

interface IObjects {
    name: string;
    position: Vector3;
}

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

@Component({
    name: 'input-control',
    computed: {
        ...mapGetters(['color', 'objects']),
    },
})
export class InputControl extends mixins(AbstractView) {
    private mounted() {
        this.init();
        this.initDragShapes();
    }

    @Watch('color')
    private onColorChanged(val: string, oldVal: string) {
        this.updateColors(val);
    }

    @Watch('objects')
    private onObjectAdded(objects: IObjects) {
        this.renderScene();
    }
}

export default InputControl;
</script>

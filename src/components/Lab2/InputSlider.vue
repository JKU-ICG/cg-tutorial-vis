<template>
    <div id = "sliderbar" style="height: 50px; width: 100px">
        <p>
        <vue-slider ref="slider" v-model='objX' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='objY' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='objZ' :min ="1" :max="10"></vue-slider>
        Scale Object
        </p>
        <p> 
        <vue-slider ref="slider" v-model='camX' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='camY' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='camZ' :min ="1" :max="10"></vue-slider>
        Move Object Camera
        </p>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('inputslider');

@Component({
    components: {
        vueSlider,
    },
})
export default class InputSlider extends Vue {
    private objX = 1;
    private objY = 1;
    private objZ = 1;
    private camX = 1;
    private camY = 1;
    private camZ = 1;

    @Watch('objX')
    private onXChanged(valX: number) {
        this.$store.dispatch('inputslider/setObjectX', valX);
    }

    @Watch('objY')
    private onYChanged(valY: number) {
        this.$store.dispatch('inputslider/setObjectY', valY);
    }

    @Watch('objZ')
    private onZChanged(valZ: number) {
        this.$store.dispatch('inputslider/setObjectZ', valZ);
    }

    @Watch('camX')
    private onCamXChanged(valX: number) {
        this.$store.dispatch('inputslider/setCameraX', valX);
    }

    @Watch('camY')
    private onCamYChanged(valY: number) {
        this.$store.dispatch('inputslider/setCameraY', valY);
    }

    @Watch('camZ')
    private onCamZChanged(valZ: number) {
        this.$store.dispatch('inputslider/setCameraZ', valZ);
    }

}
</script>

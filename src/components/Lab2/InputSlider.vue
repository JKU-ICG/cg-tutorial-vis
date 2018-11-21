<template>
    <div id = "sliderbar" style="height: 50px; width: 100px">
        <p>
        <vue-slider ref="slider" v-model='scaleX' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='scaleY' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='scaleZ' :min ="1" :max="10"></vue-slider>
        Scale Object
        </p>
        <p>
        <vue-slider ref="slider" v-model='translateX' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='translateY' :min ="1" :max="10"></vue-slider>
        <vue-slider ref="slider" v-model='translateZ' :min ="1" :max="10"></vue-slider>
        Translate Object
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
    private scaleX = 1;
    private scaleY = 1;
    private scaleZ = 1;
    private translateX = 1;
    private translateY = 1;
    private translateZ = 1;
    private camX = 1;
    private camY = 1;
    private camZ = 1;

    @Watch('scaleX')
    private onScaleXChanged(valX: number) {
        this.$store.dispatch('inputslider/setScaleX', valX);
    }

    @Watch('scaleY')
    private onScaleYChanged(valY: number) {
        this.$store.dispatch('inputslider/setScaleY', valY);
    }

    @Watch('scaleZ')
    private onScaleZChanged(valZ: number) {
        this.$store.dispatch('inputslider/setScaleZ', valZ);
    }

    @Watch('translateX')
    private onTranslateXChanged(valX: number) {
        this.$store.dispatch('inputslider/setTranslateX', valX);
    }

    @Watch('translateY')
    private onTranslateYChanged(valY: number) {
        this.$store.dispatch('inputslider/setTranslateY', valY);
    }

    @Watch('translateZ')
    private onTranslateZChanged(valZ: number) {
        this.$store.dispatch('inputslider/setTranslateZ', valZ);
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

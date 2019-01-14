<template>
    <div class="settings-view">
        <div>
            <button v-on:click="toggleValue(true)">Perspective</button>
            <button v-on:click="toggleValue(false)">OrthoGraphic</button>
        </div>

        <div>
            Scale Object
             <vue-slider ref="slider" v-model='scaleX' :min ="1" :max="10"></vue-slider>
             <vue-slider ref="slider" v-model='scaleY' :min ="1" :max="10"></vue-slider>
             <vue-slider ref="slider" v-model='scaleZ' :min ="1" :max="10"></vue-slider>
        </div>

        <div>
            Translate Object
            <vue-slider ref="slider" v-model='translateX' :min ="1" :max="10"></vue-slider>
            <vue-slider ref="slider" v-model='translateY' :min ="1" :max="10"></vue-slider>
            <vue-slider ref="slider" v-model='translateZ' :min ="1" :max="10"></vue-slider>
        </div>

        <div>
            Move Object Camera
            <vue-slider ref="slider" v-model='camX' :min ="1" :max="10"></vue-slider>
            <vue-slider ref="slider" v-model='camY' :min ="1" :max="10"></vue-slider>
            <vue-slider ref="slider" v-model='camZ' :min ="1" :max="10"></vue-slider>
        </div>

         <div>
            Change Camera Settings
            FOV <vue-slider ref="slider" v-model='fov' :min ="1" :max="10"></vue-slider>
            FAR <vue-slider ref="slider" v-model='far' :min ="1" :max="10"></vue-slider>
        </div>
    </div>
</template>


<style lang="scss">
.settings-view > div {
  margin: 40px 0;

  &:first-child {
    margin-top: 0;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');

@Component({
    components: {
        vueSlider,
    },
})
export default class Settings extends Vue {

    private scaleX = 1;
    private scaleY = 1;
    private scaleZ = 1;
    private translateX = 1;
    private translateY = 1;
    private translateZ = 1;
    private camX = 1;
    private camY = 1;
    private camZ = 1;
    private fov = 1;
    private far = 1;
    private isCameraPerspective = true;

    @Watch('scaleX')
    private onScaleXChanged(valX: number) {

        this.$store.dispatch('settings/setScaleX', valX);
    }

    @Watch('scaleY')
    private onScaleYChanged(valY: number) {

        this.$store.dispatch('settings/setScaleY', valY);
    }

    @Watch('scaleZ')
    private onScaleZChanged(valZ: number) {

        this.$store.dispatch('settings/setScaleZ', valZ);
    }

    @Watch('translateX')
    private onTranslateXChanged(valX: number) {

        this.$store.dispatch('settings/setTranslateX', valX);
    }

    @Watch('translateY')
    private onTranslateYChanged(valY: number) {

        this.$store.dispatch('settings/setTranslateY', valY);
    }

    @Watch('translateZ')
    private onTranslateZChanged(valZ: number) {

        this.$store.dispatch('settings/setTranslateZ', valZ);
    }

    @Watch('camX')
    private onCamXChanged(valX: number) {

        this.$store.dispatch('settings/setCameraX', valX);
    }

    @Watch('camY')
    private onCamYChanged(valY: number) {

        this.$store.dispatch('settings/setCameraY', valY);
    }

    @Watch('camZ')
    private onCamZChanged(valZ: number) {

        this.$store.dispatch('settings/setCameraZ', valZ);
    }

    @Watch('fov')
    private onFovChanged(fov: number) {

        this.$store.dispatch('settings/setFov', fov);
    }

    @Watch('far')
    private onFarChanged(far: number) {

        this.$store.dispatch('settings/setFar', far);
    }

    private toggleValue(value: boolean) {

        this.$store.dispatch('settings/setIsCameraPerspective', value);
    }

}
</script>

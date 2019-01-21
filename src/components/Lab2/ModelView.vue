<template>
  <div></div>
</template>

<script lang = "ts">
import * as Three from 'three';
import Vue from 'vue';
import { Component, Watch, Model } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { AbstractView } from '@/components/Lab2/AbstractView.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');

@Component({
  computed: {
    ...mapGetters(['scaleX', 'scaleY', 'scaleZ', 'translateX', 'translateY', 'translateZ']),
  }})
export class ModelView extends Vue {

  private abstractView = new AbstractView();

  private mounted() {
    this.abstractView.initModelView(this.$el as HTMLElement);
    this.abstractView.animateModelView();
  }

  @Watch('scaleX')
  private scaleObjectX(valX: number) {
    this.abstractView.scaleObjectXAxis(valX);
  }

  @Watch('scaleY')
  private scaleObjectY(valY: number) {
    this.abstractView.scaleObjectYAxis(valY);
  }

  @Watch('scaleZ')
  private scaleObjectZ(valZ: number) {
    this.abstractView.scaleObjectZAxis(valZ);
  }

  @Watch('translateX')
  private moveObjectX(valX: number) {
    this.abstractView.translateObjX(valX);
  }

  @Watch('translateY')
  private moveObjectY(valY: number) {
    this.abstractView.translateObjY(valY);
  }

  @Watch('translateZ')
  private moveObjectZ(valZ: number) {
    this.abstractView.translateObjZ(valZ);
  }
}

export default ModelView;
</script>
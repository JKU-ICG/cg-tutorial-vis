<template>
  <div v-on:mousedown="mouseDown" v-on:mouseup="mouseUp"></div>
</template>

<script lang = "ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { AbstractView } from '@/components/Lab2/AbstractView.vue';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');

@Component({
  computed: {
    ...mapGetters(['cameraX', 'cameraY', 'cameraZ', 'scaleX', 'scaleY', 'scaleZ',
      'translateX', 'translateY', 'translateZ', 'fov', 'far', 'isCameraPerspective']),
  }})
export class CameraView extends Vue {

  private isObjectCameraOrtho = false;

  private abstractView = new AbstractView();

  private mounted() {

    this.abstractView.initCameraView(this.$el);
    this.abstractView.animateCameraView();
  }

  private mouseDown(event: MouseEvent) {

    document.addEventListener('mousemove', this.mouseMove, false);
    document.addEventListener('mouseup', this.mouseUp, false);

    this.abstractView.animateOnMouseDownEvent(event);
  }

  private mouseUp(event: MouseEvent) {

    document.removeEventListener('mousemove', this.mouseMove, false);
    document.removeEventListener('mouseup', this.mouseUp, false);
  }

  private mouseMove(event: MouseEvent) {

    this.abstractView.animateOnMouseMoveEvent(event);
  }

  @Watch('isCameraPerspective')
  private switchCamera(isCameraPersp: boolean) {

    this.abstractView.onSwitchCamera(isCameraPersp);
  }

  @Watch('cameraX')
  private translateCameraX(valX: number) {

    this.abstractView.changeCameraX(valX);
  }

  @Watch('cameraY')
  private translateCameraY(valY: number) {

    this.abstractView.changeCameraY(valY);
  }

  @Watch('cameraZ')
  private translateCameraZ(valZ: number) {

    this.abstractView.changeCameraZ(valZ);
  }

  @Watch('far')
  private changeFar(far: number) {

    this.abstractView.changeFar(far);
  }

  @Watch('fov')
  private changeFov(fov: number) {

    this.abstractView.changeFov(fov);
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

export default CameraView;
</script>
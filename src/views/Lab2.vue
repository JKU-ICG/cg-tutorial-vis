<template>
  <div>
    <InputSlider/>
    <div class="grid">
      <div> CameraView <CameraView/> </div>
      <div> ObjectCamera <ObjectCamera/> </div>
      <div> ModelView <ModelView/> </div>
  </div>
  </div>
</template>

<style lang="scss">
.grid {
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelView from '@/components/Lab2/ModelView.vue';
import CameraView from '@/components/Lab2/CameraView.vue';
import ObjectCamera from '@/components/Lab2/ObjectCamera.vue';
import InputSlider from '@/components/Lab2/InputSlider.vue';

@Component({
    components: {
        ModelView,
        CameraView,
        ObjectCamera,
        InputSlider,
    },
})
export default class Lab2 extends Vue { }
</script>

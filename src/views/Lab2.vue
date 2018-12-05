<template>
  <div>
    <InputSlider/>
    <div class="grid">
      <ModelView/>
      <CameraView/>
  </div>
  </div>
</template>

<style lang="scss">
.grid {
  display: grid;
  //grid-template-rows: 250px 250px;
  grid-template-columns: 100%;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelView from '@/components/Lab2/ModelView.vue';
import CameraView from '@/components/Lab2/CameraView.vue';
import InputSlider from '@/components/Lab2/InputSlider.vue';

@Component({
    components: {
        ModelView,
        CameraView,
        InputSlider,
    },
})
export default class Lab2 extends Vue { }
</script>

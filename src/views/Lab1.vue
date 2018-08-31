<template>
  <div class="about">
    <h1>Lab1</h1>
    <div class="grid">
      <InputControls/>      
      <PrimitiveControls/>
      <RasterizeControls/>
      <OutputControls/>
    </div>
  </div>
</template>

<style>
.grid {
  display: grid;
  grid-template-rows: 200px 200px;
  grid-template-columns: 50% 50%;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InputControls from '@/components/InputControls.vue';
import PrimitiveControls from '@/components/PrimitiveControls.vue';
import RasterizeControls from '@/components/RasterizeControls.vue';
import OutputControls from '@/components/OutputControls.vue';

@Component({
  components: {
    InputControls,
    PrimitiveControls,
    RasterizeControls,
    OutputControls,
  },
})
export default class Lab1 extends Vue {}
</script>

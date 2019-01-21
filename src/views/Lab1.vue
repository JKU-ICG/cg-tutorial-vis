<template>
  <div class="about">
    <Toolbar/>
    <div class="grid">
      <InputControls/>
      <PrimitiveControls/>
      <OutputControls/> 
      <RasterizeControls/>
    </div>
  </div>
</template>

<style lang="scss">
.grid {
  display: grid;
  //grid-template-rows: 250px 250px;
  grid-template-columns: 50% 50%;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/Lab1/Toolbar.vue';
import InputControls from '@/components/Lab1/InputControls.vue';
import PrimitiveControls from '@/components/Lab1/PrimitiveControls.vue';
import RasterizeControls from '@/components/Lab1/RasterizeControls.vue';
import OutputControls from '@/components/Lab1/OutputControls.vue';

@Component({
  components: {
    Toolbar,
    InputControls,
    PrimitiveControls,
    RasterizeControls,
    OutputControls,
  },
})
export default class Lab1 extends Vue { }
</script>

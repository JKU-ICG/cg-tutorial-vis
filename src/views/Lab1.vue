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
import Toolbar from '@/components/Toolbar.vue';
import InputControls from '@/components/InputControls.vue';
import PrimitiveControls from '@/components/PrimitiveControls.vue';
import RasterizeControls from '@/components/RasterizeControls.vue';
import OutputControls from '@/components/OutputControls.vue';

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

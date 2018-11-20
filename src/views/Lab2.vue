<template>
  <div>
    <InputSlider/>
    <div class="grid">
      <!-- <ModelSpace/> -->
      <WorldSpace/>
      <OrthoSpace/>
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
import ModelSpace from '@/components/Lab2/ModelSpace.vue';
import OrthoSpace from '@/components/Lab2/OrthoSpace.vue';
import WorldSpace from '@/components/Lab2/WorldSpace.vue';
import InputSlider from '@/components/Lab2/InputSlider.vue';

@Component({
  components: {
    ModelSpace,
    OrthoSpace,
    WorldSpace,
    InputSlider,
  },
})
export default class Lab2 extends Vue { }
</script>

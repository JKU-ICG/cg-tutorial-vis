<template>
  <div class="grid">
    <InputSlider/>
    <ModelSpace/>
    <!-- <WorldSpace/> -->
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
import ModelSpace from '@/components/Lab2/ModelSpace.vue';
import WorldSpace from '@/components/Lab2/WorldSpace.vue';
import InputSlider from '@/components/Lab2/InputSlider.vue';

@Component({
  components: {
    ModelSpace,
    WorldSpace,
    InputSlider,
  },
})
export default class Lab2 extends Vue { }
</script>

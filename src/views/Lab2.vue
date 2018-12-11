<template>
  <div>
    <Settings/>
    <div class="grid">
      <div> CameraView <CameraView/> </div>
      <div> OutputView <OutputView/> </div>
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
import OutputView from '@/components/Lab2/OutputView.vue';
import Settings from '@/components/Lab2/Settings.vue';

@Component({
    components: {
        ModelView,
        CameraView,
        OutputView,
        Settings,
    },
})
export default class Lab2 extends Vue { }
</script>

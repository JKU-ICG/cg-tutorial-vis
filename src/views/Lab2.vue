<template>
  <div class="lab">
    <div class="settings">
    <Settings/>
    </div>
    <div class="views">
      <div> CameraView <CameraView/> </div>
      <div> Rasterization View <Rasterization/> </div>
      <div> ModelView <ModelView/> </div>
      <div> OutputView <OutputView/> </div>
  </div>
  </div>
</template>

<style lang="scss">
.lab {
  display: flex;
}
.settings {
  flex: 1 0 200px;
}
.views {
  width: 100%;
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
import Rasterization from '@/components/Lab2/RasterizationView.vue';

@Component({
    components: {
        ModelView,
        CameraView,
        OutputView,
        Settings,
        Rasterization,
    },
})
export default class Lab2 extends Vue { }
</script>

<template>
  <renderer :size="{ w: 600, h: 400 }">
    <scene>
      <camera :position="{ z: 15 }"></camera>
      <cube texture="cobblestone" :size="1"></cube>
    </scene>
  </renderer>
</template>

<script lang="ts">
import VueThreejs from "vue-threejs";
import { Component, Prop, Vue } from "vue-property-decorator";
import Cube from "@/components/Cube.vue";

Vue.use(VueThreejs);

@Component({
  components: {
    Cube
  }
})
export default class ThreeJSExample extends Vue {}
</script>
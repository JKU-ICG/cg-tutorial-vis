<template>
  <div>
    Select cube texture: 
    <select v-model="texture">
      <option value="cobblestone">cobblestone</option>
      <option value="redwool">redwool</option>
      <option value="diamond">diamond</option>
    </select>
    <renderer :size="{ w: 600, h: 400 }">
      <scene>
        <camera :position="{ z: 15 }"></camera>
        <cube :texture="texture" :size="count"></cube>
      </scene>
    </renderer>
  </div>
</template>

<script lang="ts">
import VueThreejs from "vue-threejs";
import { Component, Prop, Vue } from "vue-property-decorator";
import Cube from "@/components/Cube.vue";
import { createNamespacedHelpers } from "vuex";

const { mapGetters } = createNamespacedHelpers("counter"); // use counter store

Vue.use(VueThreejs);

@Component({
  components: {
    Cube
  },
  data: function() {
    return {
      texture: "cobblestone" // pre-select the option
    };
  },
  computed: {
    ...mapGetters(["count"])
  }
})
export default class ThreeJSExample extends Vue {}
</script>
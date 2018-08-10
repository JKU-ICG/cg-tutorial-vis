<template>
  <div class="about">
    <h1>Lab1</h1>
    <CounterControls/>
    <MyCubeControls/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CounterControls from "@/components/CounterControls.vue"; // @ is an alias to /src
import ThreeJSExample from "@/components/ThreeJSExample.vue";
import MyCubeControls from "@/components/MyCubeControls.vue";

@Component({
  components: {
    CounterControls,
    ThreeJSExample,
    MyCubeControls
  }
})
export default class Lab1 extends Vue {}
</script>

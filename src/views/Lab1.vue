<template>
  <div class="about">
    <h1>Lab1</h1>
    <CounterControls/>
    <ThreeJSExample/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CounterControls from "@/components/CounterControls.vue"; // @ is an alias to /src
import ThreeJSExample from "@/components/ThreeJSExample.vue";

@Component({
  components: {
    CounterControls,
    ThreeJSExample
  }
})
export default class Lab1 extends Vue {}
</script>

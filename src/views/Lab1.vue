<template>
  <div class="about">
    <h1>Lab1</h1>
    <CounterControls/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CounterControls from "@/components/CounterControls.vue"; // @ is an alias to /src

@Component({
  components: {
    CounterControls
  }
})
export default class Lab1 extends Vue {}
</script>

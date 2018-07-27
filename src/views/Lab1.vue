<template>
  <div class="about">
    <h1>Lab1</h1>
    <HelloWorld msg="Hello Lab1"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Lab1 extends Vue {}
</script>

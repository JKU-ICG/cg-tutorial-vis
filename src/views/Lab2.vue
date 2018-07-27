<template>
  <div class="lab lab2">
    <h1>Lab2</h1>
    <HelloWorld msg="Hello Lab2"/>
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
export default class Lab2 extends Vue {}
</script>

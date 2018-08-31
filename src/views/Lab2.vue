<template>
  <div class="lab lab2">
    <h1>Lab2</h1>
    <CounterControls/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CounterControls from '@/components/CounterControls.vue'; // @ is an alias to /src

@Component({
  components: {
    CounterControls,
  },
})
export default class Lab2 extends Vue {}
</script>

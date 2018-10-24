<template>
  <div class="lab lab2">
    <h1>Lab2</h1>
    <ModelSpace/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelSpace from '@/components/ModelSpace.vue';

@Component({
  components: {
    ModelSpace,
  },
})
export default class Lab2 extends Vue { }
</script>

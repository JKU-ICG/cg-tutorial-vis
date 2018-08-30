<template>
  <div id ="colorpicker">
    <slider-picker :value="colors" @input="setColor" ></slider-picker>   
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import slider from 'vue-color/src/components/Slider.vue';

import { createNamespacedHelpers } from "vuex";

const { mapGetters, mapActions } = createNamespacedHelpers("cubestore");

export default Vue.extend({
  components: {    
      'slider-picker': slider,    
  },
  computed: {
    ...mapGetters(["colors"])
  },
  methods: {
    ...mapActions([
      "setColor"
    ]),
  }  
})
</script>


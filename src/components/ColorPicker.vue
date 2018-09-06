<template>
  <div id ="colorpicker">
    <slider-picker :value="color" @input="setColor" ></slider-picker>
     <!-- Directly updates the color value -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import slider from 'vue-color/src/components/Slider.vue';

import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('cubestore');

export default Vue.extend({

  components: {
      'slider-picker': slider,
  },

  computed: {
    ...mapGetters(['color']),
  },
  methods: {
    ...mapActions(['setColor']),
  },
});
</script>


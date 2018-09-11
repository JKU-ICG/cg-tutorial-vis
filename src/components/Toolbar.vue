<template>
  <div>
    <div id = "toolbar" style="height: 50px; width: 500px"></div>
    <!-- <slider-picker :value="color" @input="setColor" ></slider-picker> -->
    <!-- Directly updates the color value -->
  </div>  
</template>

<script lang="ts">

import Vue from 'vue';
import slider from 'vue-color/src/components/Slider.vue';
import shapeMixin from './AbstractView.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('cubestore');


export default {

    components: {
      'slider-picker': slider,
    },

    computed: {
    ...mapGetters(['color']),
    },

    mixins: [shapeMixin],

    methods: {
      ...mapActions(['setColor']),

      init() {
        var elements = this.finalSceneElements();
        document.getElementById('toolbar').appendChild(elements.renderer.domElement);
      }
    },

    mounted() {
      this.init();
    },
}
</script>

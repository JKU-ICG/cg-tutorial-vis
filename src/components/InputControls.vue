<template>
  <div>  
    <div id="inputcontrol"></div>
  </div>
</template>

<script>

import * as Three from 'three';
import shapeMixin from './AbstractView';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

export default {

        mixins: [shapeMixin],

        computed: {
            ...mapGetters(['color'])
        },

        methods: {
            init() {
                var elements = this.finalSceneElements();
                document.getElementById('inputcontrol').appendChild(elements.renderer.domElement);
            }
        },

        watch: {
            color() {
                this.updateColors(this.color);
            }
        },

        mounted() {
            this.init();
        }
    };
</script>
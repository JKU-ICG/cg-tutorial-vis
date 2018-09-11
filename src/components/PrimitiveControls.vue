<template>   
    <div id="primitivecontrol"/>
</template>

<script>

import * as Three from 'three';
import shapeMixin from './AbstractView';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

export default {

        mixins: [shapeMixin],

        computed: {
            ...mapGetters(['color']),
        },

        methods: {
            init: function() {
                var elements = this.finalSceneElements();
                document.getElementById('primitivecontrol').appendChild(elements.renderer.domElement);
            },
        },

        watch: {
            color() {
                //this.updateColors(this.color);
            }
        },

        mounted: function(){
            this.init();
        },
    };
</script>
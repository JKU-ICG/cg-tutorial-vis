<template>   
    <div id="primitivecontrol"/>
</template>

<script>

import shapeMixin from './AbstractView';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('cubestore');

export default {

        mixins: [shapeMixin],

        computed: {
            ...mapGetters(['color']),
        },

        methods: {
            init() {
                var elements = this.finalSceneElements();
                document.getElementById('primitivecontrol').appendChild(elements.renderer.domElement);
            },
        },

        watch: {
            color() {
                this.updateMaterial();
            }
        },

        mounted(){
            this.init();
        },
    };
</script>
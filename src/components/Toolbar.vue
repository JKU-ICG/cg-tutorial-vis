<template>
  <div>
    <ColorPicker/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ColorPicker from '@/components/ColorPicker.vue';

export default ({
    components: {
            ColorPicker,
        },
});
</script>

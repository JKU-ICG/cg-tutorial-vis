<template>
  <div>
    Value: {{ count }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
    <div>
      <div>Recent History (last 5 entries): {{ recentHistory }}</div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('counter'); // use counter store

export default {
  computed: {
    ...mapGetters(['count', 'recentHistory']),
  },
  methods: {
    ...mapActions([
      'increment',
      'decrement',
      'incrementIfOdd',
      'incrementAsync',
    ]),
  },
};
</script>

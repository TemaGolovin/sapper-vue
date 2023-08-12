<template>
  <div class="game-field">
    <table>
      <thead>
        <tr>
          <th>game-field</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="line in lines" :key="line.id">
          <td v-for="column in columns" :key="line.id">
            {{ line }} {{ column }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'GameField',
  data() {
    return {
      columns: 10,
      lines: 10,
    };
  },
  methods: {
    getUniqueId() {
      return _.uniqueId();
    },
  },
};
</script>

<style>
.game-field {
  border: 1px solid #000;
}
</style>

<template>
  <div class="wrapper">
    <div class="header-table">{{ this.header }}</div>
    <table class="tables-leadboards">
      <thead>
        <tr>
          <th scope="col" class="th-item">#</th>
          <th scope="col" class="th-item">Никнейм</th>
          <th scope="col" class="th-item">Время, сек</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(leader, index) in leaders" :key="index">
          <th class="leaderCol">
            {{ index + 1 }}
          </th>
          <th class="leaderCol">
            {{ leader.nick }}
          </th>
          <th class="leaderCol">
            {{ leader.victoryTime }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LeadBoard',
  props: ['header', 'leaders'],
};
</script>

<style>
.header-table {
  font-size: 18px;
  font-weight: 700;
}

.tables-leadboards {
  width: 90%;
  margin: auto;
}

.th-item {
  background-color: aquamarine;
  border: 1px solid #000;
}

.leaderCol {
  border: 1px solid #000;
}
</style>

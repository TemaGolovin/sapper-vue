<template>
  <div class="leaderboards">
    <h2 class="mb-4 mt-4">10 лучших результатов для каждого уровня</h2>
  </div>
  <main class="tables container">
    <div class="row">
      <div class="table-leader table-easy col">
        <LeadBord class="table-item" :header="'Легкий'" :leaders="getLeadersEasy?.slice(0, 10)" />
      </div>
      <div class="table-leader table-middle col">
        <LeadBord
          class="table-item"
          :header="'Средний'"
          :leaders="getLeadersMiddle?.slice(0, 10)"
        />
      </div>
      <div class="table-leader table-hard col">
        <LeadBord class="table-item" :header="'Сложный'" :leaders="getLeadersHard?.slice(0, 10)" />
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LeadBord from '@/components/LeadBoard.vue';

export default {
  name: 'LeaderBoards',
  components: {
    LeadBord,
  },
  methods: mapActions(['getLeadersFromLocalStore']),
  mounted() {
    this.getLeadersFromLocalStore();
  },
  computed: mapGetters(['getLeadersEasy', 'getLeadersMiddle', 'getLeadersHard']),
};
</script>

<style>
.table-leader {
  margin: 0 25px 25px;
  border: 4px solid rgb(36, 66, 56);
  background-color: rgb(107, 214, 179);
  border-radius: 10px;
  padding: 0 10px 10px;
}

@media (max-width: 991px) {
  .tables {
    font-size: 16px;
  }
}
</style>

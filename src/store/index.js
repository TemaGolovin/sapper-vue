import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      leadersEasy: [],
      leadersMiddle: [],
      leadersHard: [],
    };
  },
  getters: {
    getLeadersEasy(state) {
      return state.leadersEasy;
    },
    getLeadersMiddle(state) {
      return state.leadersMiddle;
    },
    getLeadersHard(state) {
      return state.leadersHard;
    },
  },
  mutations: {
    updateLeadersEasy(state, leaders) {
      state.leadersEasy = leaders;
    },
    updateLeadersMiddle(state, leaders) {
      state.leadersMiddle = leaders;
    },
    updateLeadersHard(state, leaders) {
      state.leadersHard = leaders;
    },
  },
  actions: {
    getLeadersFromLocalStore(context) {
      const leadersEasy = JSON.parse(localStorage.getItem('leadersEasy')) || [];
      const leadersMiddle = JSON.parse(localStorage.getItem('leadersMiddle')) || [];
      const leadersHard = JSON.parse(localStorage.getItem('leadersHard')) || [];
      leadersEasy.sort((a, b) => a.victoryTime - b.victoryTime);
      leadersMiddle.sort((a, b) => a.victoryTime - b.victoryTime);
      leadersHard.sort((a, b) => a.victoryTime - b.victoryTime);
      context.commit('updateLeadersEasy', leadersEasy);
      context.commit('updateLeadersMiddle', leadersMiddle);
      context.commit('updateLeadersHard', leadersHard);
    },
  },
  modules: {},
});

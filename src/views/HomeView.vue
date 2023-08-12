<template>
  <div class="home">
    <button
      type="button"
      class="btn btn-setting btn-green mb-4"
      data-bs-toggle="modal"
      data-bs-target="#setting-modal"
      :style="`width: ${columns * 34 + 16 * 2}px`"
    >
      Настройки игры
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="setting-modal"
      tabindex="-1"
      aria-labelledby="settingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="settingModalLabel">Настройки игры</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <select
              class="form-select"
              aria-label="Default select example"
              @change="hendleChangeLevel"
            >
              <option selected>Уровень сложности</option>
              <option value="easy">Легкий (Поле: 8х8, Время: 10 минут)</option>
              <option value="middle">Средний (Поле: 16х16, Время: 40 минут)</option>
              <option value="hard">Сложный (Поле: 32х16, Время: 100 минут)</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            <button
              type="button"
              class="btn btn-green"
              @click="hendleSaveSetting"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Сохронить
            </button>
          </div>
        </div>
      </div>
    </div>
    <GameField
      :columns="columns"
      :rows="rows"
      :bombs="bombs"
      :gameState="gameState"
      :time="time"
      :key="this.updateKey"
      :hendleSaveSetting="hendleSaveSetting"
      @changeState="getGameState($event)"
      @changeBomb="getGameState($event)"
    />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import GameField from '@/components/GameField.vue';

export default {
  name: 'HomeView',
  components: {
    GameField,
  },
  data() {
    return {
      columns: 16,
      rows: 16,
      time: 2400000,
      bombs: 40,
      level: 'middle',
      gameState: 'init',
      updateKey: 0,
    };
  },
  methods: {
    hendleSaveSetting() {
      this.updateKey += 1;
      this.gameState = 'init';
      switch (this.level) {
        case 'easy':
          this.columns = 8;
          this.rows = 8;
          this.time = 600000;
          this.bombs = 10;
          break;
        case 'middle':
          this.columns = 16;
          this.rows = 16;
          this.time = 2400000;
          this.bombs = 40;
          break;
        case 'hard':
          this.columns = 32;
          this.rows = 16;
          this.time = 6000000;
          this.bombs = 100;
          break;
        default:
          break;
      }
    },
    hendleChangeLevel(event) {
      event.preventDefault();
      this.level = event.target.value;
    },
    getGameState(data) {
      this.gameState = data;
    },
  },
};
</script>

<style>
.btn-green {
  background-color: rgb(107, 214, 179);
  border: 3px solid #000;
}

.btn-green:hover {
  background-color: aquamarine;
  border: 3px solid #000;
}
</style>

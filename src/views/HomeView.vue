<template>
  <div class="home">
    <div class="wrapper-setting-btn" :style="`max-width: ${columns * 34 + 16 * 2}px`">
      <button
        type="button"
        class="btn btn-setting btn-green mb-4"
        data-bs-toggle="modal"
        data-bs-target="#setting-modal"
      >
        Настройки игры
      </button>
    </div>
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
            <div class="mb-3">
              <label for="nick" class="form-control"
                >Никнейм
                <input
                  v-model="this.nick"
                  type="text"
                  class="form-control"
                  id="nick"
                  placeholder="Введите ваш никнейм"
                />
              </label>
            </div>
            <select
              class="form-select mb-3"
              aria-label="Default select example"
              @change="hendleChangeLevel"
            >
              <option selected id="selected">Уровень сложности</option>
              <option value="easy" id="select-easy">Легкий (Поле: 8х8, Время: 10 минут)</option>
              <option value="middle" id="select-middle">
                Средний (Поле: 16х16, Время: 40 минут)
              </option>
              <option value="hard" id="select-hard">Сложный (Поле: 32х16, Время: 100 минут)</option>
              <option value="castom">Свой режим</option>
            </select>
            <div class="castom-setting-group" v-if="this.level === 'castom'">
              <div class="row castom-setting mb-3">
                <div class="col">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Ячеек в ширину"
                    aria-label="Cell number in width"
                    v-model="this.castom.columns"
                  />
                </div>
                <div class="col">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Ячеек в высоту"
                    aria-label="Cell number in heigth"
                    v-model="this.castom.rows"
                  />
                </div>
                <p v-if="this.disabledButtonCell()" class="text-danger">
                  Количество ячеек должно быть от 8 и не больше 25 в ширину, и 32 в высоту.
                </p>
              </div>

              <div class="row castom-setting">
                <div class="col">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Кол-во бомб"
                    aria-label="bombs"
                    v-model="this.castom.bombs"
                  />
                </div>
                <div class="col">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Время в секундах"
                    aria-label="time"
                    v-model="this.castom.time"
                  />
                </div>
              </div>
              <p v-if="this.disabledButtonBombOrTime()" class="text-danger">
                Бомб должно быть больше 0 и меньше количества ячеек, время от 10 до 6000 секунд
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            <button
              type="button"
              class="btn btn-green"
              @click="hendleSaveSetting"
              data-bs-dismiss="modal"
              aria-label="Close"
              :disabled="
                (disabledButtonCell() || disabledButtonBombOrTime()) && this.level === 'castom'
              "
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
      :nick="nick"
      @changeState="getGameState($event)"
      @changeBomb="getGameState($event)"
      @changeTime="changeTime($event)"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import GameField from '@/components/GameField.vue';
import setAdaptive from '../helpers/setAdaptive';

export default {
  name: 'HomeView',
  components: {
    GameField,
  },
  data() {
    return {
      columns: 8,
      rows: 8,
      time: 600,
      bombs: 10,
      level: 'easy',
      gameState: 'init',
      updateKey: 0,
      nick: '',
      castom: {
        columns: '',
        rows: '',
        time: '',
        bombs: '',
      },
    };
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.setAdaptiv();
    });
  },

  methods: {
    ...mapActions(['getLeadersFromLocalStore']),

    hendleSaveSetting() {
      this.updateKey += 1;
      this.gameState = 'init';

      switch (this.level) {
        case 'easy':
          this.columns = 8;
          this.rows = 8;
          this.time = 600;
          this.bombs = 10;
          break;
        case 'middle':
          this.columns = 16;
          this.rows = 16;
          this.time = 2400;
          this.bombs = 40;
          break;
        case 'hard':
          this.columns = 16;
          this.rows = 32;
          this.time = 6000;
          this.bombs = 90;
          break;
        case 'castom':
          this.columns = this.castom.columns;
          this.rows = this.castom.rows;
          this.time = this.castom.time;
          this.bombs = this.castom.bombs;
          break;
        default:
          break;
      }
      this.setAdaptiv();
    },

    disabledButtonCell() {
      const isColumnsNormal = this.castom.columns < 8 || this.castom.columns > 25;
      const isRowNormal = this.castom.rows < 8 || this.castom.rows > 32;
      return isColumnsNormal || isRowNormal;
    },

    disabledButtonBombOrTime() {
      // eslint-disable-next-line
      const isBombsNormal =
        this.castom.bombs < 0 || this.castom.bombs > this.castom.columns * this.castom.rows;
      const isTimeNormal = this.castom.time < 10 || this.castom.time > 6000;
      return isBombsNormal || isTimeNormal;
    },

    setAdaptiv() {
      setAdaptive(this.columns);
    },
    hendleChangeLevel(event) {
      event.preventDefault();
      this.level = event.target.value;
    },
    getGameState(data) {
      this.gameState = data;
      if (data === 'victory') {
        let { nick } = this;
        const { time } = this;
        nick = nick === '' ? 'Гость' : nick;
        if (this.level === 'easy') {
          const leadersEasy = JSON.parse(localStorage.getItem('leadersEasy')) || [];
          const victoryTime = 600 - time;
          leadersEasy.push({ nick, victoryTime });
          localStorage.setItem('leadersEasy', JSON.stringify(leadersEasy));
          this.getLeadersFromLocalStore();
        }
        if (this.level === 'middle') {
          const leadersMiddle = JSON.parse(localStorage.getItem('leadersMiddle')) || [];
          const victoryTime = 2400 - time;
          leadersMiddle.push({ nick, victoryTime });
          localStorage.setItem('leadersMiddle', JSON.stringify(leadersMiddle));
          this.getLeadersFromLocalStore();
        }
        if (this.level === 'hard') {
          const leadersHard = JSON.parse(localStorage.getItem('leadersHard')) || [];
          const victoryTime = 6000 - time;
          leadersHard.push({ nick, victoryTime });
          localStorage.setItem('leadersHard', JSON.stringify(leadersHard));
          this.getLeadersFromLocalStore();
        }
      }
    },
    changeTime(data) {
      this.time -= data;
    },
  },
};
</script>

<style>
.home {
  padding: 0 20px;
}

.btn-green {
  background-color: rgb(107, 214, 179);
  border: 3px solid #000;
}

.btn-green:hover {
  background-color: aquamarine;
  border: 3px solid #000;
}

.btn-setting {
  flex: 1;
}

.wrapper-setting-btn {
  display: flex;
  margin: auto;
}

@media (max-width: 480px) {
  .home {
    padding: 0;
    font-size: 16px;
  }

  .form-select {
    font-size: 12px;
  }
  #select-middle,
  #select-easy,
  #select-hard,
  #selected {
    font-size: 12px;
  }

  .castom-setting {
    margin: 10px 0;
  }
}
</style>

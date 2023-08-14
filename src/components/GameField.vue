<template>
  <div>
    <p class="result-game" v-if="this.gameState === 'victory' || this.gameState === 'gameOver'">
      {{ this.resulText }}
    </p>
    <div class="game-field">
      <table class="table-field" @contextmenu="this.hendleTbodyRight">
        <thead class="thead">
          <tr>
            <th :colspan="columns / 2.66666">
              <div class="thead-item counter">{{ this.bombs - this.flags }}</div>
            </th>
            <th :colspan="columns / 4" @click="hendleReset">
              <div class="thead-item reset"></div>
            </th>
            <th :colspan="columns / 2.66666">
              <div class="thead-item timer">{{ this.secInMin(this.time) }}</div>
            </th>
          </tr>
        </thead>
        <tbody class="tbody" :key="resetKey">
          <tr :class="`row-table`" v-for="row in rows" :key="row">
            <td
              class="col-table"
              :id="`${row}_${column}`"
              v-for="column in columns"
              :key="column"
              :class="{
                open: this.map[`${row}_${column}`]?.isOpen,
                bomb: this.map[`${row}_${column}`]?.isOpen && this.map[`${row}_${column}`]?.isBomb,
                flag: this.map[`${row}_${column}`]?.flag && !this.map[`${row}_${column}`]?.isOpen,
                question: this.map[`${row}_${column}`]?.question,
                defused:
                  this.map[`${row}_${column}`]?.flag &&
                  this.map[`${row}_${column}`]?.isBomb &&
                  this.map[`${row}_${column}`]?.isOpen,
              }"
            >
              <div
                class="img"
                @click="this.hendleClick"
                @contextmenu="this.hendleClickRight"
                @stateGameCahnge="gameOver"
              >
                <div
                  v-if="
                    this.map[`${row}_${column}`]?.aroundBombs &&
                    this.map[`${row}_${column}`]?.aroundBombs !== 0
                  "
                  class="content"
                  :class="this.classOnNumBomb(this.map[`${row}_${column}`].aroundBombs)"
                >
                  {{ this.map[`${row}_${column}`].aroundBombs }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import fillField from '../helpers/fillField';

export default {
  name: 'GameField',

  data() {
    return {
      map: {},
      flags: 0,
      resetKey: 0,
      timerId: null,
      victoryTime: 0,
      resultText: '',
    };
  },

  methods: {
    hendleTbodyRight(event) {
      event.preventDefault();
    },
    hendleClick(event) {
      const parentTarget = event.target.parentNode;
      if (this.gameState === 'init') {
        this.map = this.hendleFildFill(parentTarget.id);
        this.$emit('changeState', 'playing');
        this.downTime();
      }
      const mapCell = this.map[parentTarget.id];
      if (
        // eslint-disable-next-line
        mapCell?.flag ||
        // eslint-disable-next-line
        this.gameState === 'gameOver' ||
        // eslint-disable-next-line
        this.gameState === 'victory' ||
        mapCell?.question
      ) {
        return;
      }

      if (mapCell?.isBomb) {
        this.gameOver('произошел взрыв');
      }
      this.openCells(parentTarget.id);
      this.victory();
    },
    hendleClickRight(event) {
      event.preventDefault();
      const parentTarget = event.target.parentNode;
      if (this.gameState === 'init') {
        this.map = this.hendleFildFill(parentTarget.id);
        this.$emit('changeState', 'playing');
      }
      const mapCell = this.map[parentTarget.id];
      if (
        // eslint-disable-next-line
        (mapCell?.isBomb && mapCell?.isOpen) ||
        // eslint-disable-next-line
        mapCell?.isOpen ||
        // eslint-disable-next-line
        this?.gameState === 'gameOver' ||
        this?.gameState === 'victory'
      ) {
        return;
      }
      if (mapCell.flag) {
        mapCell.flag = false;
        this.flags -= 1;
        mapCell.question = true;
      } else if (mapCell.question) {
        mapCell.question = false;
      } else {
        mapCell.flag = true;
        this.flags += 1;
      }
      this.victory();
    },
    hendleFildFill(initCell = null) {
      return fillField(this.columns, this.rows, this.bombs, initCell);
    },
    hendleReset() {
      this.$emit('changeState', 'init');
      this.$emit('initBombs', 'init');
      this.map = {};
      this.resetKey += 1;
      this.hendleSaveSetting();
    },
    secInMin(time) {
      const seconds = time;
      const minutes = Math.floor(seconds / 60);
      const resultMin = minutes >= 10 ? minutes : `0${minutes}`;
      const restSec = seconds % 60;
      const resultRestSec = restSec >= 10 ? restSec : `0${restSec}`;
      return `${resultMin}:${resultRestSec}`;
    },
    gameOver(text) {
      this.walkField((id) => {
        if (this.map[id].isBomb) {
          this.map[id].isOpen = true;
        }
      });
      this.$emit('changeState', 'gameOver');
      clearTimeout(this.timerId);
      this.resulText = `Вы програли: ${text}. Попробуйте снова.`;
    },
    walkField(callback) {
      Object.entries(this.map).forEach(([id]) => {
        callback(id);
      });
    },
    openCells(cellId) {
      if (this.map[cellId] && !this.map[cellId].isOpen) {
        this.setOpenCell(cellId);
        if (this.map[cellId].aroundBombs === 0) {
          this.walkAround(cellId, (watchedCell) => this.openCells(watchedCell.id));
        }
      }
    },
    setOpenCell(cellId) {
      if (!this.map[cellId].isOpen && !this.map[cellId].flag) {
        this.map[cellId].isOpen = true;

        if (!this.map[cellId].isBomb) {
          this.map[cellId].aroundBombs = this.getBombsAround(cellId);
        }
      }
    },
    getBombsAround(cellId) {
      let bombAround = 0;
      this.walkAround(cellId, (watchedCell) => {
        if (watchedCell.isBomb) {
          bombAround += 1;
        }
      });
      this.map[cellId].aroundBombs = bombAround;
      return bombAround;
    },
    walkAround(cellId, callback) {
      const [idX, idY] = cellId.split('_');
      for (let diffX = -1; diffX <= 1; diffX += 1) {
        for (let diffY = -1; diffY <= 1; diffY += 1) {
          const tergetIdX = Number(idX) + diffX;
          const tergetIdY = Number(idY) + diffY;
          const targetId = `${tergetIdX}_${tergetIdY}`;
          if (this.map[targetId]) {
            if (targetId !== cellId) {
              callback(this.map[targetId]);
            }
          }
        }
      }
    },
    classOnNumBomb(aroundBombs) {
      switch (aroundBombs) {
        case 1:
          return 'text-primary';
        case 2:
          return 'text-success';
        case 3:
          return 'text-danger';
        case 4:
          return 'dark-blue'; // new class
        case 5:
          return 'brown'; // new class
        case 6:
          return 'text-info';
        case 7:
          return 'text-dark';
        case 8:
          return 'text-white';
        default:
          break;
      }
      return null;
    },
    downTime() {
      if (this.time > 1) {
        this.timerId = setTimeout(() => {
          this.victoryTime += 1;
          this.$emit('changeTime', 1);
          this.downTime();
        }, 1000);
      } else {
        this.gameOver('время истекло');
      }
    },
    victory() {
      let openCells = 0;
      let closedCellsWithBombs = 0;
      let cellWithFlagAndBomb = 0;
      const allCells = this.columns * this.rows;
      this.walkField((id) => {
        if (this.map[id].isOpen) {
          openCells += 1;
        }
        if (!this.map[id].isOpen && this.map[id].isBomb) {
          closedCellsWithBombs += 1;
          if (this.map[id].flag) {
            cellWithFlagAndBomb += 1;
          }
        }
      });
      if (
        // eslint-disable-next-line
        allCells - openCells === closedCellsWithBombs ||
        (cellWithFlagAndBomb === this.bombs && this.bombs - this.flags === 0)
      ) {
        this.$emit('changeState', 'victory');
        clearTimeout(this.timerId);
        this.resulText = `Ура! Вы победили! Ваше время: ${this.secInMin(this.victoryTime)}.`;
      }
    },
  },
  props: ['columns', 'rows', 'bombs', 'gameState', 'time', 'hendleSaveSetting', 'nick'],
};
</script>

<style>
:root {
  --width-cell: 32px;
  --border-collapse: separate;
  --border-cell: 3px solid rgb(36, 66, 56);
  --border-cell-top: 3px solid rgb(107, 214, 179);
  --border-cell-left: 3px solid rgb(107, 214, 179);
  --outline-open: 2px solid rgb(36, 66, 56);
}

.result-game {
  color: red;
  font-size: 18px;
  font-weight: 700;
}

.table-field {
  margin: auto;
  border: 4px solid rgb(36, 66, 56);
  border-collapse: var(--border-collapse);
  background-color: rgb(107, 214, 179);
  border-radius: 10px;
  padding: 0 10px 10px;
}

.thead {
  height: 50px;
}

.thead-item {
  width: 95px;
  height: 40px;
  background-color: aquamarine;
  border-top: 4px solid rgb(36, 66, 56);
  border-left: 4px solid rgb(36, 66, 56);
  text-align: end;
  margin: auto;
  font-size: 18px;
  padding: 4px 5px;
  position: relative;
}
.counter {
  padding: 5px 15px;
}
.counter::before {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  top: 0;
  left: 10px;
  background: url('../assets/bomb.png') no-repeat;
  background-size: cover;
}

.timer::before {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  top: 4px;
  left: 2px;
  background: url('../assets/timer.png') no-repeat;
  background-size: cover;
}

.reset {
  width: 40px;
  height: 40px;
  border: none;
  background: url('../assets/reset.png') no-repeat;
  background-size: cover;
}

.reset:active {
  border: 2px solid rgb(36, 66, 56);
  border-bottom: 4px solid rgb(107, 214, 179);
  border-right: 4px solid rgb(107, 214, 179);
  background-color: aquamarine;
}

.col-table {
  border: var(--border-cell);
  border-top: var(--border-cell-top);
  border-left: var(--border-cell-left);
  width: var(--width-cell);
  height: var(--width-cell);
  margin: 20px;
  background-color: aquamarine;
  font-weight: 700;
}

.bomb {
  background: url('../assets/bomb.png') no-repeat;
  background-size: cover;
  padding: 5px;
}

.flag {
  background: url('../assets/flag.png') no-repeat;
  background-size: cover;
  padding: 5px;
  background-color: aquamarine;
}

.question {
  background: url('../assets/question.png') no-repeat;
  background-size: contain;
  background-color: aquamarine;
}

.open {
  outline: var(--outline-open);
  border: none;
  background-color: rgb(159, 255, 223);
}

.img {
  width: 100%;
  height: 100%;
}

.content {
  padding-top: 5px;
}

.dark-blue {
  color: darkblue;
}

.brown {
  color: brown;
}

.defused {
  background: url('../assets/defused.png') no-repeat;
  background-size: cover;
  background-color: rgb(159, 255, 223);
}

@media (max-width: 480px) {
  .table-field {
    font-size: 12px;
  }
  .thead-item {
    font-size: 14px;
    padding-top: 7px;
  }
}
</style>

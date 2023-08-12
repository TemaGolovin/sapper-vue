<template>
  <div class="game-field">
    <table @contextmenu="this.hendleTbodyRight">
      <thead class="thead">
        <tr>
          <th :colspan="columns / 2.66666">
            <div class="thead-item counter">{{ this.bombs - this.flags }}</div>
          </th>
          <th :colspan="columns / 4" @click="hendleReset">
            <div class="thead-item reset"></div>
          </th>
          <th :colspan="columns / 2.66666">
            <div class="thead-item timer">{{ this.millisecInMin() }}</div>
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
              >
                {{ this.map[`${row}_${column}`].aroundBombs }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
      wathedCells: {},
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
      }
      const mapCell = this.map[parentTarget.id];
      if (parentTarget.classList.contains('flag') || this.gameState === 'gameOver') {
        return;
      }

      if (mapCell?.isBomb) {
        this.gameOver();
      }
      this.openCells(parentTarget.id);
    },
    hendleClickRight(event) {
      event.preventDefault();
      const parentTarget = event.target.parentNode;
      if (parentTarget.classList.contains('bomb') || this.map[parentTarget.id].isOpen) {
        return;
      }
      if (parentTarget.classList.contains('flag')) {
        parentTarget.classList.remove('flag');
        this.flags -= 1;
        parentTarget.classList.add('question');
      } else if (parentTarget.classList.contains('question')) {
        parentTarget.classList.remove('question');
      } else {
        parentTarget.classList.add('flag');
        this.flags += 1;
      }
    },
    hendleFildFill(initCell = null) {
      return fillField(this.columns, this.rows, this.bombs, initCell);
    },
    hendleReset() {
      this.$emit('changeState', 'init');
      this.$emit('initBombs', 'init');
      this.map = {};
      this.resetKey += 1;
      this.wathedCells = {};
      this.hendleSaveSetting();
    },
    millisecInMin() {
      const seconds = this.time / 1000;
      const minutes = Math.floor(seconds / 60);
      const resultMin = minutes >= 10 ? minutes : `0${minutes}`;
      const restSec = seconds % 60;
      const resultRestSec = restSec >= 10 ? restSec : `0${restSec}`;
      return `${resultMin}:${resultRestSec}`;
    },
    gameOver() {
      Object.entries(this.map).forEach(([id, params]) => {
        if (params.isBomb) {
          this.map[id].isOpen = true;
        }
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
      if (!this.map[cellId].isOpen) {
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
  },
  props: ['columns', 'rows', 'bombs', 'gameState', 'time', 'hendleSaveSetting'],
};
</script>

<style>
table {
  margin: auto;
  border: 4px solid rgb(36, 66, 56);
  border-collapse: separate;
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
  border: 3px solid rgb(36, 66, 56);
  border-top: 3px solid rgb(107, 214, 179);
  border-left: 3px solid rgb(107, 214, 179);
  width: 32px;
  height: 32px;
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
  outline: 2px solid rgb(36, 66, 56);
  border: none;
  background-color: aquamarine;
}

.img {
  width: 100%;
  height: 100%;
}

.content {
  padding-top: 5px;
}
</style>

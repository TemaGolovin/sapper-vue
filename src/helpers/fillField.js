const numberSystemTranslation = (num, cols) => {
  let result;
  if (typeof num === 'string') {
    const [row, col] = num.split('_').map((item) => Number(item));
    result = (row - 1) * cols + col;
  }
  if (typeof num === 'number') {
    const col = num % cols === 0 ? cols : num % cols;
    const row = Math.ceil(num / cols);
    result = `${row}_${col}`;
  }
  return result;
};

const chageBombInitCell = (map, initCell, amountCell, cols) => {
  const target = Math.ceil(Math.random() * amountCell);
  const tergetMap = map[numberSystemTranslation(target, cols)];
  const initCellMap = map[initCell];
  if (tergetMap.isBomb) {
    chageBombInitCell(map, initCell, amountCell, cols);
  }
  [tergetMap.isBomb, initCellMap.isBomb] = [initCellMap.isBomb, tergetMap.isBomb];
};

const fillField = (columns, rows, bombs, initCell) => {
  const map = {};
  let currentBombs = bombs;
  for (let row = 1; row <= rows; row += 1) {
    for (let col = 1; col <= columns; col += 1) {
      map[`${row}_${col}`] = {
        id: `${row}_${col}`,
        isBomb: currentBombs > 0,
        aroundBombs: null,
        isOpen: false,
        flag: false,
      };
      currentBombs -= 1;
    }
  }

  const amountCell = columns * rows;

  for (let cellBomb = 1; cellBomb < amountCell; cellBomb += 1) {
    const target = cellBomb + Math.ceil(Math.random() * (amountCell - cellBomb));
    const oneDimenNumMapBomb = numberSystemTranslation(cellBomb, columns);
    const oneDimenNumTargetBomb = numberSystemTranslation(target, columns);
    const mapBomb = map[oneDimenNumMapBomb];
    const targetBomb = map[oneDimenNumTargetBomb];
    [mapBomb.isBomb, targetBomb.isBomb] = [targetBomb.isBomb, mapBomb.isBomb];
  }
  if (map[initCell].isBomb) {
    chageBombInitCell(map, initCell, amountCell, columns);
  }
  return map;
};

export default fillField;

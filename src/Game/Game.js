import Tik from "./Tik.js";
import Ant from "./Ant.js";
import CONFIG from "../CONFIG.js";
import Cell from "./Cell.js";

class Game {
  constructor(fn) {
    this.ants = [];
    this.timerId = null;
    this.field = [];
    this.createField();
    this.tikNum = 0;
    this.setFieldView = fn;
  }
  createField() {
    const field = [];
    for (let i = 0; i < CONFIG.colNum; i++) {
      const row = [];
      for (let j = 0; j < CONFIG.rowNum; j++) {
        const type =
          j === 0 ||
          i === 0 ||
          i === CONFIG.colNum - 1 ||
          j === CONFIG.rowNum - 1
            ? "wall"
            : "empty";
        const cell = new Cell(j, i, type);
        row.push(cell);
      }
      field.push(row);
    }
    this.field = field;
  }
  createCell(x, y, type) {
    if (type === "enemy" || type === "friend") {
      const ant = new Ant(x, y, type);
      this.ants.push(ant);
      return ant;
    }
    return new Cell(x, y, type);
  }
  getCell(x, y) {
    return this.field[x][y];
  }
  removeCell(x, y) {
    const cell = new Cell(x, y, "empty");
    this.field[x][y] = cell;
    return this.field;
  }
  setCell(x, y, cell) {
    this.field[x][y] = cell;
    return this.field;
  }
  moveCell(ant, direction) {
    const { x, y } = ant;
    let newX, newY;
    switch (direction) {
      case "-x":
        newX = x - 1;
        newY = y;
        break;
      case "+x":
        newX = x + 1;
        newY = y;
        break;
      case "-y":
        newX = x;
        newY = y - 1;
        break;
      case "+y":
        newX = x;
        newY = y + 1;
        break;
    }
    const targetCell = this.field[newX][newY];
    debugger;
    if (targetCell.type === "empty") {
      this.field[newX][newY] = ant;
      ant.updateXY(newX, newY);
      this.field[x][y] = this.createCell(x, y, "empty");
    }
  }
  /**
   * @param {Array} field - двумерный массив поля
   */
  start = fnUpdateField => {
    this.timerId = setInterval(
      () => this.makeTik(fnUpdateField),
      CONFIG.tikTime
    );
    //ставим таймер
    //по таймеру выполняем makeTik
    //на каждом тике проходимся по массиву муравьев и запрашиваем makeMove
    // собрав все движения муравьев выполняем рассчет коллизий и собираем новое поле
    // в конце каждого тика нужно отдавать массив поля на отрисовку
    return [];
  };
  makeTik = fn => {
    const moves = this.ants.map(ant => {
      const direction = ant.makeMove();
      return { ant, direction };
    });
    moves.forEach(move => {
      this.moveCell(move.ant, move.direction);
    });
    debugger;
    fn(this.field);
    this.tikNum++;
    if (this.tikNum > CONFIG.maxMoves) this.stop();
  };
  stop = () => {
    clearInterval(this.timerId);
    this.tikNum = 0;
  };
}
export default Game;

import Tik from "./Tik.js";
import Ant from "./Ant.js";
import CONFIG from "../CONFIG.js";
import Cell from "./Cell.js";

class Game {
  constructor() {
    this.ants = [];
    this.timerId = null;
    this.field = [];
    this.createField();
  }
  createField() {
    const field = [];
    for (let i = 0; i < CONFIG.colNum; i++) {
      const row = [];
      for (let j = 0; j < CONFIG.rowNum; j++) {
        const cell = new Cell(j, i, "empty");
        row.push(cell);
      }
      field.push(row);
    }
    this.field = field;
  }
  createCell(x, y, type) {
    if (type === "enemy" || type === "friend") return new Ant(x, y, type);
    return new Cell(x, y, type);
  }
  switchCell(x, y, cell) {
    this.field[x][y] = cell;
    return this.field;
  }
  /**
   * @param {Array} field - двумерный массив поля
   */
  start = field => {
    //ставим таймер
    //по таймеру выполняем makeTik
    //на каждом тике проходимся по массиву муравьев и запрашиваем makeMove
    // собрав все движения муравьев выполняем рассчет коллизий и собираем новое поле
    // в конце каждого тика нужно отдавать массив поля на отрисовку
    return [];
  };
  makeTik = () => {};
  stop = () => {
    //удаляем таймер
  };
}
export default Game;

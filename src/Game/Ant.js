import Cell from "./Cell.js";

class Ant extends Cell {
  constructor(x, y, type) {
    super(x, y, type);
  }
  /**
   *
   * @param {Array} visibleArr массив видимых клеток для муравья
   */
  makeMove(visibleArr) {
    return "-x"; // возвращает значение направления движения
  }
  clone() {}
  die() {}
}
export default Ant;

import Cell from "./Cell.js";

class Ant extends Cell {
  // constructor(x, y, type) {
  //   super(x, y, type);
  // }
  /**
   *
   * @param {Array} visibleArr массив видимых клеток для муравья
   */
  makeMove(visibleArr) {
    const moves = ["-x", "+x", "-y", "+y"];
    const d = Math.floor(Math.random() * (4 - 0));
    return moves[d]; // возвращает значение направления движения
  }
  updateXY(x, y) {
    this.x = x;
    this.y = y;
  }
  die() {}
}
export default Ant;

class Ant {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
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

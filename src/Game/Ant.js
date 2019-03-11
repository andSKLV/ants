import Cell from "./Cell.js";

class Ant extends Cell {
  // constructor(x, y, type) {
  //   super(x, y, type);
  // }
  /**
   *
   * @param {Array} visibleArr массив видимых клеток для муравья
   */
  getBasis(cell) {
    const {x : x1,y : y1} = this;
    const {x : x2,y : y2} = cell;
    const dx = x2 - x1;
    const dy = -(y2 - y1); //перевернутая шкала, так как -y это вверх в отличии от нормальной шкалы
    return {dx,dy};
  }
  getDistance(cell) {
    const {x : x1,y : y1} = this;
    const {x : x2,y : y2} = cell;
    return Math.abs(x2-x1) + Math.abs(y2-y1);
  }
  makeMove(visibleArr) {
    if (this.type==='enemy') return this.getRandomMove(); //FIXME: пока что для одной команды рандом
    const directions = {
      x: 0,
      y: 0,
    }
    const enviroment = visibleArr.filter(cell => cell.type !== 'empty' && cell.type !== 'wall');
    enviroment.forEach(cell=>{
      const distance = this.getDistance(cell);
      const {dx,dy} = this.getBasis(cell);
      if (distance===undefined || dx === undefined || dy === undefined) {
        throw new Error ('Distance calculating error',distance,dx,dy,this,cell);
      }
      let factor = 0;
      switch (cell.type) {
        case 'enemy':
        case 'friend':
          if (this.isOpposite(cell)) {
            factor = 0.75;
          } else {
            factor = -0.1;
          }
          break;
        case 'honey':
          factor = 1;
          break;
        case 'wall':
          factor = -1;
          break;
        case 'friendHome':
        case 'enemyHome':
          if (this.isOpposite(cell)) {
            factor = 1;
          } else {
            factor = -1;
          }
          break;
        default:
          break;
      }
      factor = factor * 1/distance;
      directions.x = directions.x + factor*(dx/distance);
      directions.y = directions.y + factor*(dy/distance);
    })
    const scale = (Math.abs(directions.x) > Math.abs(directions.y)) ? 'x' : 'y';
    const sign = Math.sign(directions[scale]);
    return `${sign}${scale}`;
  }
  addMove(conditions){

  }
  isOpposite({type}){
    const reg = new RegExp(type);
    return !reg.test(this.type);
  }
  getRandomMove() {
    const moves = ["-x", "+x", "-y", "+y"];
    const direction = Math.floor(Math.random() * (4 - 0));
    return moves[direction];
  }
  updateXY(x, y) {
    this.x = x;
    this.y = y;
  }
  die() {}
}
export default Ant;

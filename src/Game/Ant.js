import Cell from "./Cell.js";
import { GetRandomElFromArray } from './service.js';

const behaviors = {
  normal: {
    distanceDependencyPow : 2,
  }
}

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
    const dy = y2 - y1; //перевернутая шкала, так как -y это вверх в отличии от нормальной шкалы
    return {dx,dy};
  }
  getDistance(cell) {
    const {x : x1,y : y1} = this;
    const {x : x2,y : y2} = cell;
    return Math.abs(x2-x1) + Math.abs(y2-y1);
  }
  makeMove(visibleArr) {
    if (this.type==='enemy') return this.getRandomMove(); //FIXME: пока что для одной команды рандом

    const behavior = behaviors.normal;
    const {distanceDependencyPow} = behavior;

    const directions = {
      '+x': 0,
      '-x': 0,
      '+y': 0,
      '-y': 0,
    }
    const enviroment = visibleArr.filter(cell => cell.type !== 'empty');
    enviroment.forEach(cell=>{
      const distance = this.getDistance(cell);
      const deltas = this.getBasis(cell);
      const {dx,dy} = deltas;
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
            factor = 0.1;
          }
          break;
        case 'honey':
          factor = 1;
          break;
        case 'wall':
          factor = distance === 1 ? -1 : 0;
          break;
        case 'friendHome':
        case 'enemyHome':
          if (this.isOpposite(cell)) {
            factor = 1;
          } else {
            factor = -0.8;
          }
          break;
        default:
          break;
      }
      applyFactorXY(deltas, factor, distance);
    })

    return  getMaxFactor(directions);

    function applyFactorXY(deltas, factor, distance) {
      ['x', 'y'].forEach(scale => {
        applyFactor(scale, deltas, factor, distance);
      })
    }

    function applyFactor(scale, deltas, factor, distance) {
      const deltaName = `d${scale}`;
      const delta = deltas[deltaName];
      const directionName = delta > 0 ? `+${scale}` : `-${scale}`;
      const factorWithDistance = (Number.isInteger(factor)) ? (factor/distance) * (Math.abs(delta) / distance)**distanceDependencyPow : -Infinity;
      directions[directionName] += factorWithDistance;
    }

    function getMaxFactor(directions) {
      let maxDirection = [];
      let maxValue = - Infinity;
      for (let key in directions) {
        const val = directions[key];
        if (val === maxValue) {
          maxDirection.push(key);
        }
        if (val > maxValue) {
          maxValue = val;
          maxDirection = [key];
        }

      }
      return GetRandomElFromArray(maxDirection);
    }
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

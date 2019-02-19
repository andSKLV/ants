import Tik from "./Tik.js";
import Ant from "./Ant.js";
import CONFIG from "../CONFIG.js";
import Cell from "./Cell.js";
import { GetRandom, GetCell } from "./service.js";

class Game {
  constructor(fn) {
    this.ants = [];
    this.timerId = null;
    this.field = [];
    this.createField();
    this.tikNum = 0;
    this.antsToDelete = [];
    this.setFieldView = fn;
  }
  createField() {
    const field = [];
    for (let y = 0; y < CONFIG.maxRow; y++) {
      const row = [];
      for (let x = 0; x < CONFIG.maxCol; x++) {
        const type =
          x === 0 ||
          y === 0 ||
          x === CONFIG.maxCol - 1 ||
          y === CONFIG.maxRow - 1
            ? "wall"
            : "empty";
        const cell = new Cell(x, y, type);
        row.push(cell);
      }
      field.push(row);
    }
    this.field = field;
  }
  createCell(x, y, type) {
    if (type === "enemy" || type === "friend") {
      const ant = this.createAnt(x, y, type);
      return ant;
    }
    return new Cell(x, y, type);
  }
  createAnt(x, y, type) {
    const ant = new Ant(x, y, type);
    this.ants.push(ant);
    return ant;
  }
  deleteAnt(ant) {
    const { x, y } = ant;
    this.removeCell(x, y);
    this.antsToDelete.push(ant);
    return ant;
  }
  removeCell(x, y) {
    const cell = new Cell(x, y, "empty");
    this.field[y][x] = cell;
    return this.field;
  }
  setCell(x, y, cell) {
    this.field[y][x] = cell;
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
      default:
        return false;
    }
    const targetCell = this.field[newY][newX];
    switch (targetCell.type) {
      case "empty":
        this.moveAnt(ant, newX, newY);
        break;
      case "honey":
        this.eatHoney(ant, newX, newY);
        break;
      case "friend":
      case "enemy":
        const ant2 = this.field[newY][newX];
        if (ant2.type !== ant.type) this.destroyAnts(ant, ant2);
      default:
        break;
    }
    return ant;
  }
  moveAnt = (ant, newX, newY) => {
    const { x, y } = ant;
    this.field[newY][newX] = ant;
    ant.updateXY(newX, newY);
    this.field[y][x] = this.createCell(x, y, "empty");
    return true;
  };
  eatHoney = (ant, newX, newY) => {
    this.moveAnt(ant, newX, newY);
    const { x: randX, y: randY } = this.getRandomEmptyCell();
    this.createAnt(randX, randY, ant.type);
    return true;
  };
  destroyAnts = (ant1, ant2) => {
    this.deleteAnt(ant1);
    this.deleteAnt(ant2);
    return false;
  };
  checkNeighbour = () => {
    const f = this.field;
    this.ants.forEach(ant => {
      if (this.antsToDelete.includes(ant)) return false;
      const neighArr = getNeighbourArray(ant);
      const searchType = ant.type === "enemy" ? "friend" : "enemy";
      neighArr.forEach(neigh => {
        if (
          neigh &&
          neigh.type === searchType &&
          !this.antsToDelete.includes(neigh)
        ) {
          this.destroyAnts(ant, neigh);
          return false;
        }
      });
    });
    function getNeighbourArray(ant) {
      const { x, y } = ant;
      return [f[y - 1][x], f[y + 1][x], f[y][x - 1], f[y][x + 1]];
    }
  };
  updateAntsArray = () => {
    this.ants = this.ants.filter(ant => !this.antsToDelete.includes(ant));
    this.antsToDelete = [];
  };
  getRandomEmptyCell = () => {
    let isFound = false;
    let x, y;
    while (!isFound) {
      x = GetRandom(0, CONFIG.maxCol);
      y = GetRandom(0, CONFIG.maxRow);
      if (this.field[y][x].type === "empty") isFound = true;
    }
    return { x, y };
  };
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
    console.time();
    console.log(this.ants.length);
    this.checkNeighbour();
    if (this.antsToDelete.length) this.updateAntsArray();
    const FIELD_LENGTH = this.field
      .flat()
      .filter(x => x.type === "enemy" || x.type === "friend").length;
    if (this.ants.length !== FIELD_LENGTH) debugger; // где то ошибка в вычитаниях муравьев
    const moves = this.ants.map(ant => {
      const direction = ant.makeMove();
      return { ant, direction };
    });
    moves.forEach(move => {
      this.moveCell(move.ant, move.direction);
      if (this.antsToDelete.length) this.updateAntsArray();
    });
    fn(this.field); //setState new field
    this.tikNum++;
    if (this.tikNum > CONFIG.maxMoves) this.stop();
    console.timeEnd();
  };
  stop = () => {
    clearInterval(this.timerId);
    this.tikNum = 0;
  };
}
export default Game;

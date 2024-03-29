import Ant from "./Ant.js";
import CONFIG from "../CONFIG.js";
import Cell from "./Cell.js";
import { GetRandom } from "./service.js";

class Game {
  constructor({ fnStop, fnUpdateField, fnUpdateScore }) {
    this.ants = [];
    this.enemyCanBirth = CONFIG.initAntsNum;
    this.enemyHome = [];
    this.friendCanBirth = CONFIG.initAntsNum;
    this.friendHome = [];
    this.enAntsNum = null;
    this.frAntsNum = null;
    this.timerId = null;
    this.field = [];
    this.createField();
    // this.createRandomAnts(CONFIG.initAntsNum);
    this.tikNum = 0;
    this.antsToDelete = [];
    this.fnStop = fnStop;
    this.fnUpdateField = fnUpdateField;
    this.fnUpdateScore = fnUpdateScore;
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
  createRandomAnts(num) {
    for (let n = 0; n < num; n++) {
      const { x, y } = this.getRandomEmptyCell();
      this.createAnt(x, y, "enemy");
    }
    for (let n = 0; n < num; n++) {
      const { x, y } = this.getRandomEmptyCell();
      this.createAnt(x, y, "friend");
    }
  }
  createCell(x, y, type) {
    if (type === "enemy" || type === "friend") {
      const ant = this.createAnt(x, y, type);
      return ant;
    }
    if (type === "enemyHome" || type === "friendHome") {
      const home = new Cell(x, y, type);
      this[type].push(home);
      return home;
    }
    return new Cell(x, y, type);
  }
  createAnt(x, y, type) {
    const ant = new Ant(x, y, type);
    this.ants.push(ant);
    this.field[y][x] = ant;
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
        break;
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
    const counterName = `${ant.type}CanBirth`;
    this[counterName]++;
    return true;
  };
  destroyAnts = (ant1, ant2) => {
    this.deleteAnt(ant1);
    this.deleteAnt(ant2);
    return false;
  };
  /**
   * Запуск рождения муравьев на респе
   */
  birthAnts = () => {
    const getBirth = type => {
      let homeArr, counterName;
      switch (type) {
        case "enemy":
          homeArr = this.enemyHome;
          counterName = "enemyCanBirth";
          break;
        case "friend":
          homeArr = this.friendHome;
          counterName = "friendCanBirth";
          break;
        default:
          return false;
          break;
      }
      if (!this[counterName] || !homeArr.length) return false; // если нет муравьев в запасе или домов
      const i = GetRandom(0, homeArr.length);
      const home = homeArr[i];
      const crest = this.getCrestArray(home.x, home.y).filter(
        cell => cell.type === "empty"
      );
      if (!crest.length) return false; //если нет свободных клеток у дома
      const cell = crest[0];
      this.createAnt(cell.x, cell.y, type);
      this[counterName]--;
      return true;
    };
    let canBirth = true;
    while (canBirth) {
      canBirth = getBirth("enemy");
    }
    canBirth = true;
    while (canBirth) {
      canBirth = getBirth("friend");
    }
  };
  checkNeighbour = () => {
    this.ants.forEach(ant => {
      if (this.antsToDelete.includes(ant)) return false;
      const neighArr = this.getCrestArray(ant.x, ant.y);
      const searchType = ant.type === "enemy" ? "friend" : "enemy";
      for (let i = 0; i < neighArr.length; i++) {
        const neigh = neighArr[i];
        if (
          neigh &&
          neigh.type === searchType &&
          !this.antsToDelete.includes(neigh)
        ) {
          this.destroyAnts(ant, neigh);
          break;
        }
      }
    });
  };
  getCrestArray = (x, y) => {
    const f = this.field;
    return [f[y - 1][x], f[y + 1][x], f[y][x - 1], f[y][x + 1]];
  };
  /**
   * Удаление муравьев путем вычитания массива antsToDelete из ants
   */
  updateAntsArray = () => {
    this.ants = this.ants.filter(ant => !this.antsToDelete.includes(ant));
    this.antsToDelete = [];
  };
  /**
   * Получаем рандомную пустую ячейку поля
   * @returns {object} {x,y} координаты
   */
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
   * Создание на поле случайной ячейки меда
   */
  randomHoney = () => {
    this.addCellRandomXY("honey");
  };
  addCellRandomXY = type => {
    const { x, y } = this.getRandomEmptyCell();
    const cell = this.createCell(x, y, type);
    this.setCell(x, y, cell);
    return cell;
  };
  /**
   * @param {Array} field - двумерный массив поля
   */
  start = () => {
    this.timerId = setInterval(() => this.makeTik(), CONFIG.tikTime);
  };
  makeTik = () => {
    console.time();
    this.clg("ants");
    //проверка на начальное условие уничтожения муравьев
    this.checkNeighbour();
    this.clg("del");
    if (this.antsToDelete.length) this.updateAntsArray();
    this.clg("ants");

    //рождение муравьев
    this.birthAnts();
    //

    //проверка на идентично количества муравьев на поле и в стеке
    const FIELD_LENGTH = this.field
      .flat()
      .filter(x => x.type === "enemy" || x.type === "friend").length; // TODO: потом далить
    if (this.ants.length !== FIELD_LENGTH) debugger; // где то ошибка в вычитаниях муравьев

    //движения муравьев
    this.makeMove();
    if (this.tikNum % CONFIG.honeyFriquency === 0) this.randomHoney();
    // конец движения

    //update UI
    this.fnUpdateField(this.field); //setState new field
    const score = this.getScore();
    this.fnUpdateScore(score);
    //

    this.tikNum++;
    if (this.isGameOver(score)) this.stop();

    console.timeEnd();
  };
  /**
   * Расчет движений всех муравьев
   */
  makeMove = () => {
    const moves = this.ants.map(ant => {
      const visibleZone = this.getVisibleZone(ant);
      const direction = ant.makeMove(visibleZone);
      return { ant, direction };
    });
    moves.forEach(move => {
      this.moveCell(move.ant, move.direction);
      if (this.antsToDelete.length) {
        this.clg("del");
        this.clg("ants");
        this.updateAntsArray();
        this.clg("ants");
      }
    });
  };
  getVisibleZone ({x, y}) {
    const delta = CONFIG.visibleRange;
    const minX = (x - delta > 0) ? x - delta : 0;
    const maxX = x + delta;
    const minY = (y - delta > 0) ? y-delta : 0;
    const maxY = y + delta;
    const visibleArray = [];
    for (let i = minY;i<=maxY;i++) {
      for (let j = minX;j<=maxX;j++) {
        if (i===y && j===x) continue;
        if (this.field[i]===undefined || this.field[i][j]===undefined) continue;
        const cell = this.field[i][j];
        visibleArray.push(cell);
      }
    }
    return visibleArray;
  }
  /**
   * @param {object} score - кол-во игроков в каждой команде
   * @returns {boolean} завершена ли игра
   */
  isGameOver = score => {
    if (this.tikNum > CONFIG.maxMoves) return true;
    if (score.friends === 0 || score.enemies === 0) return true;
    return false;
  };
  /**
   * Останавливает игру
   */
  stop = () => {
    clearInterval(this.timerId);
    this.fnStop();
    this.tikNum = 0;
    this.clg("equal");
  };
  getScore = () => {
    let enemies = 0;
    let friends = 0;
    this.ants.forEach(ant => {
      ant.type === "friend" ? friends++ : enemies++;
    });
    return { friends, enemies };
  };
  /**
   * Проверка, осталось ли одинаковое число друзей и врагов
   * Должно быть true без генерации меда
   */
  checkEquality() {
    const enemy = [];
    const friend = [];
    this.ants.forEach(el => {
      if (el.type === "enemy") enemy.push(el);
      if (el.type === "friend") friend.push(el);
    });
    const bool = enemy.length === friend.length;
    console.log("Одинаковое количество в обоих командах = ", bool);
  }
  clg(type) {
    switch (type) {
      case "equal":
        this.checkEquality();
        break;
      case "del":
        console.log("to delete ", this.antsToDelete.length);
        break;
      case "ants":
        console.log("this.ants.len= ", this.ants.length);
        break;
      default:
        break;
    }
  }
}
export default Game;

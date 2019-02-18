import Tik from "./Tik.js";
import Ant from "./Ant.js";

class Game {
  constructor() {
    this.ants = [];
    this.timerId = null;
    this.field = [];
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

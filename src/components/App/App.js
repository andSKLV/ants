import React from "react";
import "./style.css";
import ControlBar from "../ControlBar";
import Field from "../Field";
import CONFIG from "../../CONFIG.js";
import Game from "../../Game";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setter: null,
      isStarted: false,
      fieldArray: [],
      game: null,
      friendsPer: "50%",
      enemiesPer: "50%",
      friends: CONFIG.initAntsNum,
      enemies: CONFIG.initAntsNum
    };
  }
  componentDidMount() {
    this.game = new Game({
      fnStop: this.applyStopper,
      fnUpdateField: this.updateField,
      fnUpdateScore: this.applyScore
    });
    const fieldArray = this.game.field;
    this.setState({ fieldArray });
  }
  applyScore = ({ friends, enemies }) => {
    const all = friends + enemies;
    let friendsPer, enemiesPer;
    friendsPer = (100 * friends) / all;
    friendsPer = `${friendsPer}%`;
    enemiesPer = (100 * enemies) / all;
    enemiesPer = `${enemiesPer}%`;
    this.setState({ friends, enemies, friendsPer, enemiesPer });
  };
  onClickSetter = type => {
    this.setState({ setter: type });
  };
  onClickStart = () => {
    this.setState({ isStarted: !this.state.isStarted, setter: false });
    this.game.start(this.updateField);
  };
  onClickStop = () => {
    this.game.stop();
  };
  applyStopper = () => {
    this.setState({ isStarted: !this.state.isStarted, setter: false });
  };
  updateField = newField => {
    this.setState({ field: newField });
  };
  getShortCut = str => {
    const obj = {
      empty: "x",
      enemy: "e",
      honey: "h",
      friend: "f",
      wall: "w"
    };
    return obj[str];
  };
  onClickSet = (x, y) => {
    if (!this.state.setter) return false;
    if (this.state.isStarted) return false;
    const cell = this.game.createCell(x, y, this.state.setter);
    const newField = this.game.setCell(x, y, cell);
    this.setState({ fieldArray: newField });
  };
  render() {
    return (
      <div className="App">
        <ControlBar
          onClickSetter={this.onClickSetter}
          onClickStart={this.onClickStart}
          onClickStop={this.onClickStop}
          isStarted={this.state.isStarted}
          setter={this.state.setter}
        />
        <div className="Score">
          <div className="Friends" style={{ width: this.state.friendsPer }}>
            {this.state.friends}
          </div>
          <div className="Enemies" style={{ width: this.state.enemiesPer }}>
            {this.state.enemies}
          </div>
        </div>
        <Field
          fieldArray={this.state.fieldArray}
          onClickSet={this.onClickSet}
        />
      </div>
    );
  }
}
export default App;

import React from "react";
import "./style.css";
import ControlBar from "../ControlBar";
import Field from "../Field";
import CONFIG from "../../CONFIG.js";
import Game from "../../Game";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.game = new Game({
      fnStop: this.applyStopper,
      fnUpdateField: this.updateField,
      fnUpdateScore: this.applyScore
    });
    const field = this.game.field;
    this.state = {
      setter: null,
      isStarted: false,
      fieldArray: field,
      game: null,
      friends: null,
      enemies: null
    };
  }
  applyScore = ({ friends, enemies }) => {
    this.setState({ friends, enemies });
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
          <div>Friends:</div>
          <div>{this.state.friends}</div>
          <div>Enemies:</div>
          <div>{this.state.enemies}</div>
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

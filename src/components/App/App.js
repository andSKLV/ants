import React from "react";
import "./style.css";
import ControlBar from "../ControlBar";
import Field from "../Field";
import CONFIG from "../../CONFIG.js";
import Game from "../../Game";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.game = new Game();
    const field = this.game.field;
    this.state = {
      setter: null,
      isStarted: false,
      fieldArray: field,
      game: null
    };
  }
  onClickSetter = type => {
    this.setState({ setter: type });
  };
  onClickStart = () => {
    this.setState({ isStarted: !this.state.isStarted, setter: false });
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
    const newFieldArray = this.state.fieldArray;
    const cell = this.game.createCell(x, y, this.state.setter);
    const newField = this.game.switchCell(x, y, cell);
    this.setState({ fieldArray: newField });
  };
  render() {
    return (
      <div className="App">
        <ControlBar
          onClickSetter={this.onClickSetter}
          onClickStart={this.onClickStart}
          isStarted={this.state.isStarted}
        />
        <Field
          fieldArray={this.state.fieldArray}
          onClickSet={this.onClickSet}
        />
      </div>
    );
  }
}
export default App;

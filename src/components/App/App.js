import React from "react";
import "./style.css";
import ControlBar from "../ControlBar";
import Field from "../Field";
import CONFIG from "../CONFIG.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    const field = [];
    for (let i = 0; i < CONFIG.colNum; i++) {
      const row = [];
      for (let j = 0; j < CONFIG.rowNum; j++) {
        row.push("x");
      }
      field.push(row);
    }
    this.state = {
      setter: null,
      isStarted: false,
      fieldArray: field
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
    newFieldArray[x][y] = this.getShortCut(this.state.setter);
    this.setState({ fieldArray: newFieldArray });
  };
  render() {
    return (
      <div className="App">
        <ControlBar
          onClickSetter={this.onClickSetter}
          onClickStart={this.onClickStart}
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

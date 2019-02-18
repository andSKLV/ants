import React from "react";
import "./style.css";
import ControlBar from "../ControlBar";
import Field from "../Field";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ControlBar />
        <Field />
      </div>
    );
  }
}
export default App;

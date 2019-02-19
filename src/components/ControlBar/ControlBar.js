import React from "react";
import Tag from "./Tag.js";

const ControlBar = props => {
  const { onClickSetter, onClickStart, onClickStop, isStarted, setter } = props;
  return (
    <div className="ControlBar">
      <Tag title="friend" onClickSetter={onClickSetter} setter={setter} />
      <Tag title="enemy" onClickSetter={onClickSetter} setter={setter} />
      <Tag title="honey" onClickSetter={onClickSetter} setter={setter} />
      <Tag title="wall" onClickSetter={onClickSetter} setter={setter} />
      <button
        className="start-btn"
        onClick={() => (isStarted ? onClickStop() : onClickStart())}
      >
        {isStarted ? "Stop" : "Start"}
      </button>
    </div>
  );
};

export default ControlBar;

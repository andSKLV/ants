import React from "react";
import Cell from "../Cell";

const ControlBar = props => {
  const { onClickSetter, onClickStart } = props;
  return (
    <div className="ControlBar">
      <Cell type="friend" onClick={type => onClickSetter(type)} />
      <div>Friend</div>
      <Cell type="enemy" onClick={type => onClickSetter(type)} />
      <div>Enemy</div>
      <Cell type="honey" onClick={type => onClickSetter(type)} />
      <div>Honey</div>
      <Cell type="wall" onClick={type => onClickSetter(type)} />
      <div>Wall</div>
      <button className="start-btn" onClick={() => onClickStart()}>
        Start
      </button>
    </div>
  );
};

export default ControlBar;

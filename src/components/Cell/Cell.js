import React from "react";

const getColor = type => {
  switch (type) {
    case "enemy":
      return "red";
    case "friend":
      return "blue";
    case "honey":
      return "yellow";
    case "wall":
      return "black";
    default:
      return "white";
  }
};
const Cell = props => {
  const { type, onClick } = props;
  const style = { backgroundColor: getColor(type) };

  return (
    <div
      className="Cell"
      style={style}
      onClick={() => onClick && onClick(type)}
    />
  );
};
export default Cell;

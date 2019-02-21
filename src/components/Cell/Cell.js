import React from "react";

const getColor = type => {
  switch (type) {
    case "enemy":
      return "red";
    case "friend":
      return "blue";
    case "honey":
      return "orange";
    case "wall":
      return "black";
    case "empty":
      return "white";
    case "enemyHome":
    case "friendHome":
      return "yellow";
    default:
      return "white";
  }
};
const Cell = props => {
  const { type, onClick } = props;
  const borderColor = {
    enemyHome: "red",
    friendHome: "blue"
  };
  const style = {
    backgroundColor: getColor(type),
    border:
      type === "enemyHome" || type === "friendHome"
        ? `5px solid ${borderColor[type]}`
        : "1px solid black",
    boxSizing: "border-box"
  };

  return (
    <div
      className="Cell"
      style={style}
      onClick={() => onClick && onClick(type)}
    />
  );
};
export default Cell;

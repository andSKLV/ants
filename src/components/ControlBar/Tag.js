import React from "react";
import Cell from "../Cell";

const Tag = props => {
  const { onClickSetter, title, setter } = props;
  const isActive = setter === title;
  return (
    <div className={isActive ? "activeTag" : ""}>
      <Cell type={title} onClick={title => onClickSetter(title)} />
      <div>{title}</div>
    </div>
  );
};
export default Tag;

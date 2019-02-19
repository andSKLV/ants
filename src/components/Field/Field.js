import React from "react";
import Cell from "../Cell";

const Field = props => {
  const { fieldArray, onClickSet } = props;
  const createField = arr => {
    return arr.map((row, ri) => {
      return (
        <div className="Row" key={ri}>
          {row.map((cell, ci) => {
            return (
              <Cell
                type={cell.type}
                onClick={() => onClickSet(ri, ci)}
                key={`${ri}-${ci}`}
              />
            );
          })}
        </div>
      );
    });
  };
  return <div className="Field">{createField(fieldArray)}</div>;
};
export default Field;

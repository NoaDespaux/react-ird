import React, { MouseEvent } from "react";

interface squareProps {
  value: string,
  onSquareClick: (a: MouseEvent<HTMLButtonElement>) => void
}

export default function Square({ value, onSquareClick }: squareProps) {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
import Konva from "konva";
import React, { useRef } from "react";
import { Line } from "react-konva";
import { Shape } from "../../../types/shapes";

const FreeHand: React.FC<Shape> = ({ ...props }) => {
  const lineRef = useRef<Konva.Line>(null);

  return (
    <Line
      ref={lineRef}
      {...props}
      tension={0.5}
      name="shape"
      lineCap="round"
      lineJoin="round"
    />
  );
};

export default FreeHand;

import Konva from "konva";
import React, { useRef } from "react";
import { Line } from "react-konva";
import { KonvaFreeHand } from "../../../types/shapes";
import ShapeGroup from "./ShapeGroup";

const FreeHand: React.FC<KonvaFreeHand> = ({ ...props }) => {
  const lineRef = useRef<Konva.Line>(null);

  return (
    <ShapeGroup
      _id={props._id}
      x={props.styleProperties.points[0]}
      y={props.styleProperties.points[1]}
    >
      <Line
        id={props._id}
        ref={lineRef}
        {...props}
        tension={0.5}
        name="shape"
        lineCap="round"
        lineJoin="round"
      />
    </ShapeGroup>
  );
};

export default FreeHand;

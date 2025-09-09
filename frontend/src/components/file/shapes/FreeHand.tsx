import Konva from "konva";
import React, { useRef } from "react";
import { Line } from "react-konva";
import { KonvaFreeHand } from "../../../types/shapes";
import ShapeGroup from "./ShapeGroup";

const FreeHand: React.FC<KonvaFreeHand> = ({ ...props }) => {
  const lineRef = useRef<Konva.Line>(null);

  return (
    <ShapeGroup _id={props._id} x={props.styleProperties.x!} y={props.styleProperties.y!}>
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

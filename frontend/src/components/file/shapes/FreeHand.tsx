import Konva from "konva";
import React, { useRef } from "react";
import { Line } from "react-konva";
import { KonvaFreeHand } from "../../../types/shapes";
import ShapeGroup from "./ShapeGroup";
import { ToolType } from "@/types/tools/tool";

const FreeHand: React.FC<KonvaFreeHand> = ({ ...props }) => {
  const trRef = useRef<Konva.Transformer>(null);
  const lineRef = useRef<Konva.Line>(null);

  return (
    <ShapeGroup trRef={trRef} _id={props._id} type={ToolType.FreeHand}>
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

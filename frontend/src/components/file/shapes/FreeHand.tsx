import Konva from "konva";
import React, { useRef } from "react";
import { Line } from "react-konva";
import { Shape } from "../../../types/shapes";
import ShapeGroup from "./ShapeGroup";
import Transformer from "../whiteboard/Transformer";
import { ToolType } from "@/types/tools/tool";

const FreeHand: React.FC<Shape> = ({ ...props }) => {
  const trRef = useRef<Konva.Transformer>(null);
  const lineRef = useRef<Konva.Line>(null);

  const handleTransformingEnd = () => { }
  const handleDragMove = () => { }
  const handleDragEnd = () => { }

  return (
    <React.Fragment>
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
      <Transformer
        ref={trRef}
        handleTransformingEnd={handleTransformingEnd}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />
    </React.Fragment>
  );
};

export default FreeHand;

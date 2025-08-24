import React, { useRef } from "react";
import { Texts } from "../../../types/shapes";
import ShapeGroup from "./ShapeGroup";
import { Text as KonvaText } from "react-konva";
import Konva from "konva";

const Text: React.FC<Texts> = ({ ...props }) => {
  const groupRef = useRef<Konva.Group>();

  return (
    <ShapeGroup
      _id={props._id}
      x={props.x}
      y={props.y}
    >
      <KonvaText
        name="text"
        {...props}
        x={0}
        y={0}
      />
    </ShapeGroup>
  );
};

export default Text;

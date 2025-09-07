import React, { useRef } from "react";
import ShapeGroup from "./ShapeGroup";
import { Text as KonvaText } from "react-konva";
import Konva from "konva";
import { KonvaText as KonvaTextType } from "@/types/shapes";

const Text: React.FC<KonvaTextType> = ({ ...props }) => {
  const groupRef = useRef<Konva.Group>();

  return (
    <ShapeGroup _id={props._id} x={props.x} y={props.y}>
      <KonvaText name="text" {...props} />
    </ShapeGroup>
  );
};

export default Text;

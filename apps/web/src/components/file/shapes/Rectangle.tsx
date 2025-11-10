import React, { useMemo } from "react";
import { Rect } from "react-konva";
import { useSelector } from "react-redux";

import { KonvaRectangle } from "../../../types/shapes";

import { RootState } from "../../../redux/store";

import ShapeGroup from "./ShapeGroup";
import ShapeText from "./ShapeText";

const Rectangle: React.FC<KonvaRectangle> = ({ ...props }) => {
  const selectedShapeId = useSelector((state: RootState) => state.app.selectedShapeToAddArrow);
  const isSelected = useMemo(
    () => selectedShapeId?._id === props._id,
    [props._id, selectedShapeId?._id],
  );

  return (
    <ShapeGroup
      _id={props._id}
      x={props.styleProperties.x}
      y={props.styleProperties.y}
    >
      <Rect
        id={props._id}
        name={"shape"}
        {...props.styleProperties}
        x={0}
        y={0}
        lineCap="round"
        draggable={false}
        strokeScaleEnabled={false}
        offsetX={props.styleProperties.width! / 2}
        offsetY={props.styleProperties.height! / 2}
        opacity={isSelected ? 0.3 : props.styleProperties.opacity}
      />

      {/* Render Text */}
      <ShapeText shapeId={props._id} shape={props} />

    </ShapeGroup>
  );
};

export default Rectangle;

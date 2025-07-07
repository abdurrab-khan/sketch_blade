import React, { useRef } from "react";
import Konva from "konva";
import { Rect } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";
import { getRectangleResizeValue, getResizeShape } from "@/utils/Helper";

import { Shape } from "../../../types/shapes";

import { RootState } from "../../../redux/store";
import { updateExistingShapes } from "../../../redux/slices/appSlice";

import Transformer from "../canvas/Transformer";

import { updateAttachedArrowPosition } from "../../../utils/ShapeUtils";
import ShapeGroup from "./ShapeGroup";
import { ToolType } from "@/types/tools/tool";

const Rectangle: React.FC<Shape> = ({ ...props }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state: RootState) => state.app.shapes)

  const reactRef = React.useRef(null);
  const trRef = useRef<Konva.Transformer>(null)

  const handleTransforming = (e: KonvaEventObject<MouseEvent>) => {
    if (!e.target) return;
    const node = e.target;

    getRectangleResizeValue(node);
  }

  const handleTransformingEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!e?.target) return;
    const node = e.target;

    const newShapeValue = getResizeShape([node]);
    dispatch(updateExistingShapes(newShapeValue))
  }

  const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
    // handle logic when going to beyond canvas x or y position || and attached arrow also.
    if (!e.currentTarget?.attrs) return;
    const { x, y, arrowProps } = e.currentTarget.attrs as Konva.RectConfig;
    if (!x || !y || !arrowProps || arrowProps?.length === 0) return;

    // Logic to change the position of the arrow based on movement.
    const updatedArrowPosition = updateAttachedArrowPosition(x, y, shapes, arrowProps);
    if (updateAttachedArrowPosition.length > 0) {
      dispatch(updateExistingShapes(updatedArrowPosition))
    }
  }

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!e.currentTarget?.attrs) return;
    const { id, x, y } = e.currentTarget.attrs as Konva.RectConfig;

    dispatch(
      updateExistingShapes(
        {
          shapeId: id,
          shapeValue: {
            x, y
          }
        }
      )
    )
  }

  return (
    <>
      <ShapeGroup _id={props._id} trRef={trRef} type={ToolType.Rectangle}>
        <Rect
          id={props._id}
          ref={reactRef}
          lineCap="round"
          name={"shape"}
          {...props}
        />
      </ShapeGroup>

      <Transformer
        ref={trRef}
        handleTransforming={handleTransforming}
        handleTransformingEnd={handleTransformingEnd}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />
    </>
  );
};

export default Rectangle;

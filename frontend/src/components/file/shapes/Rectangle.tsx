import Konva from "konva";
import { Rect } from "react-konva";
import React, { useEffect, useRef } from "react";
import { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";

import { Shape } from "../../../types/shapes";

import { RootState } from "../../../redux/store";
import { updateExistingShapes } from "../../../redux/slices/appSlice";

import Transformer from "../canvas/Transformer";

import { updateAttachedArrowPosition } from "../../../utils/ShapeUtils";
import { getResizeShape } from "@/utils/Helper";
import ShapeGroup from "./ShapeGroup";

const Rectangle: React.FC<Shape> = ({ ...props }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state: RootState) => state.app.shapes)
  const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId)

  const reactRef = React.useRef(null);
  const trRef = useRef<Konva.Transformer>(null)

  const handleTransformingEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e?.currentTarget?.attrs)) return;

    const node = (e.currentTarget as Konva.Transformer).nodes()
    const attrs = node[0].attrs as NodeConfig;

    const shapeUpdatedValue = getResizeShape(attrs);
    if (!shapeUpdatedValue) return;

    dispatch(
      updateExistingShapes(
        {
          shapeId: attrs.id!,
          shapeValue: shapeUpdatedValue,
        }
      )
    )
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
      <ShapeGroup _id={props._id} trRef={trRef}>
        <Rect
          id={props._id}
          ref={reactRef}
          {...props}
          strokeScaleEnabled={false}
          name={"shape"}
        />
      </ShapeGroup>

      <Transformer
        ref={trRef}
        handleTransformingEnd={handleTransformingEnd}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />
    </>
  );
};

export default Rectangle;

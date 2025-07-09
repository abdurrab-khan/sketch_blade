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
    if (!(e.currentTarget instanceof Konva.Transformer)) return;

    const transformer = e.currentTarget;
    const shapeNode = transformer.nodes()[0];

    if (!shapeNode) return;

    const { arrowProps, id } = shapeNode.attrs;
    const { x, y } = transformer.attrs;

    if (!arrowProps || arrowProps?.length === 0) return;
    if (x === undefined || y === undefined) return;

    const updatedShapes = shapes.map(shape =>
      shape._id === id ? { ...shape, x, y } : shape
    );

    const updatedArrowPosition = updateAttachedArrowPosition(updatedShapes, arrowProps);

    if (updatedArrowPosition.length > 0) {
      dispatch(updateExistingShapes(updatedArrowPosition))
    }
  }

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e.currentTarget instanceof Konva.Group)) return;

    const group = e.currentTarget;
    const shapeNode = group.findOne('.shape');

    if (!shapeNode) return;

    const { id } = shapeNode.attrs;
    const { x, y } = group.attrs;

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
      <ShapeGroup
        _id={props._id}
        trRef={trRef}
        type={ToolType.Rectangle}
      >
        <Rect
          id={props._id}
          ref={reactRef}
          strokeScaleEnabled={false}
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

import Konva from "konva";
import { Group, Rect } from "react-konva";
import React, { useEffect, useRef } from "react";
import { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import { useDispatch, useSelector } from "react-redux";

import { Shape } from "../../../types/shapes";

import { RootState } from "../../../redux/store";
import { handleSelectedIds, updateExistingShapes } from "../../../redux/slices/appSlice";

import Transformer from "../canvas/Transformer";

import { updateAttachedArrowPosition } from "../../../utils/ShapeUtils";
import { getResizeShape } from "@/utils/Helper";

const Rectangle: React.FC<Shape> = ({ ...props }) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state: RootState) => state.app.shapes)
  const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId)

  const reactRef = React.useRef(null);
  const trRef = useRef<Konva.Transformer>(null)

  const handleOnClick = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    const tr = trRef?.current;
    if (!tr) return;

    const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
    if (metaPressed && selectedShapes) return;

    const id = selectedShapes?._id === props._id ? null : { _id: props._id };

    tr.nodes(id ? [e.target] : [])
    dispatch(handleSelectedIds(id))
  }

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

  useEffect(() => {
    const tr = trRef?.current;
    if (!tr || trRef.current?.nodes().length === 0) return;

    if (Array.isArray(selectedShapes?._id) || selectedShapes?._id !== props._id) {
      tr.nodes([])
    }

    return () => {
      tr.nodes([])
    }
  }, [props._id, selectedShapes])

  return (
    <>
      <Group onClick={handleOnClick}>
        <Rect
          ref={reactRef}
          {...props}
          strokeScaleEnabled={false}
          name={"shape"}
        />
      </Group>

      <Transformer ref={trRef} handleTransformingEnd={handleTransformingEnd} handleDragMove={handleDragMove} handleDragEnd={handleDragEnd} />
    </>
  );
};

export default Rectangle;

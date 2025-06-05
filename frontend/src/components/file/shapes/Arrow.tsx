import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Circle, Group, Arrow as KonvaArrow } from "react-konva";

import { Arrow as ArrowType, Shape } from "../../../types/shapes";

import { RootState } from "../../../redux/store";
import { handleSelectedIds, updateExistingShapes } from "../../../redux/slices/appSlice";

import Transformer from "../canvas/Transformer";

import { getUpdatedAttachProps } from "../../../utils/ShapeUtils";
import { checkRefValue } from "../../../utils/AppUtils";

import { ARROW_CIRCLE_RADIUS } from "../../../lib/constant";
import { updatePointsAfterTransformation } from "../../../utils/Helper";

const Arrow: React.FC<Shape> = ({ ...props }) => {
  const [isClicked, setIsClicked] = useState(false);

  const arrowRef = useRef<Konva.Arrow>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const groupRef = useRef<Konva.Group>(null);
  const circleRefs = useRef<Konva.Circle[]>([])

  const shapes = useSelector((state: RootState) => state.app.shapes);
  const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId);
  const dispatch = useDispatch();

  // Handler function when click on group.
  const handleOnClick = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    const tr = trRef?.current;
    if (!tr) return;

    const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
    if (metaPressed && selectedShapes) return;

    const id = selectedShapes?._id === props._id ? null : { _id: props._id };

    setIsClicked(prev => !prev)
    tr.nodes(id ? [e.target] : [])
    dispatch(handleSelectedIds(id))
  }

  // Attached Points movement handler.
  const handlePointDrag = (pointIndex: number, e: KonvaEventObject<MouseEvent>) => {
    const tr = trRef?.current;
    const arrRef = arrowRef?.current;
    if (!tr || !arrRef) return;


    const points = (props as ArrowType).points;
    const x = e.target.x();
    const y = e.target.y();

    points[pointIndex * 2] = x
    points[pointIndex * 2 + 1] = y;

    tr.forceUpdate();
    arrRef.setAttrs({ points })
  };

  const handleCircleDragEnd = () => {
    dispatch(
      updateExistingShapes(
        {
          shapeId: props._id,
          shapeValue: {
            points: (props as ArrowType).points
          }
        }
      )
    )
  }

  // Transformer handling function.
  const handleTransforming = () => {
    // Change the size of the circle.
    updateControlCircles();
  }

  // Handler function to update the size of circle.
  const updateControlCircles = () => {
    if (!isClicked || !groupRef.current) return;

    const group = groupRef.current;
    const currentScaleX = group.scaleX();
    const currentScaleY = group.scaleY();

    circleRefs.current.forEach((ref: Konva.Circle) => {
      if (ref && currentScaleX !== 0 && currentScaleY !== 0) {
        const inverseScaleX = 1 / currentScaleX;
        const inverseScaleY = 1 / currentScaleY;

        ref.scaleX(inverseScaleX);
        ref.scaleY(inverseScaleY);
        ref.getLayer()?.batchDraw();
      }
    });
  };

  // Handler function to update after end of any movement.
  const handleMovementEnd = () => {
    // Update the size of the arrow.
    const allRefs = checkRefValue(groupRef, arrowRef, trRef) as [Konva.Group, Konva.Arrow, Konva.Transformer]
    if (!allRefs) return;

    const [group, arrow, tr] = allRefs;
    const newPoints = updatePointsAfterTransformation((props as ArrowType).points, group);

    group.x(0)
    group.y(0)
    group.scaleX(1)
    group.scaleY(1)
    group.rotation(0)
    group.skewX(0)
    group.skewY(0)

    tr.forceUpdate();
    updateControlCircles();
    group.getLayer()?.batchDraw();

    // Call Database or LocalStorage to update it.

    // Check whether arrow attached shape is detached or not.
    const updatedAttachProps = getUpdatedAttachProps(arrow.attrs, shapes);

    if (updatedAttachProps) {
      updatedAttachProps[0].shapeValue = {
        ...(updatedAttachProps[0].shapeValue),
        points: newPoints
      }

      dispatch(
        updateExistingShapes(updatedAttachProps)
      )
    } else {
      dispatch(
        updateExistingShapes(
          {
            shapeId: props._id,
            shapeValue: {
              points: newPoints
            }
          }
        )
      )
    }
  }

  const handleDragMove = () => {
    // TODO: Write a logic when going beyond the canvas size.
  }


  useEffect(() => {
    const tr = trRef?.current;
    if (!tr || trRef.current?.nodes().length === 0) return;

    if (Array.isArray(selectedShapes?._id) || selectedShapes?._id !== props._id) {
      if (isClicked) {
        setIsClicked(false);
      }

      tr.nodes([])
    }

    return () => {
      tr.nodes([])
    }
  }, [props._id, isClicked, selectedShapes])

  return (
    <>
      <Group ref={groupRef} onClick={handleOnClick}>
        <KonvaArrow ref={arrowRef} {...props} lineCap="round" name={"shape"} />
        {
          isClicked && (props as ArrowConfig).points.map((_, i) => {
            if (i % 2 === 0) return null;
            const points = (props as ArrowConfig).points;
            const x = points[i];
            const y = points[i + 1];
            const pointIndex = i / 2;

            return (
              <Circle
                x={x}
                y={y}
                radius={ARROW_CIRCLE_RADIUS}
                stroke="lightgray"
                onDragMove={(e) => handlePointDrag(pointIndex, e)}
                onDragEnd={handleCircleDragEnd}
                ref={(node) => {
                  if (node) {
                    circleRefs.current[pointIndex] = node;
                  }
                }}
              />
            )
          })
        }
      </Group>
      <Transformer
        ref={trRef}
        handleTransforming={handleTransforming}
        handleTransformingEnd={handleMovementEnd}
        handleDragMove={handleDragMove}
        handleDragEnd={handleMovementEnd}
      />
    </>
  );
};

export default Arrow;

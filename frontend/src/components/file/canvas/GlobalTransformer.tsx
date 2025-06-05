import Konva from "konva";
import { Group } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, MutableRefObject, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Transformer from "./Transformer";

// Redux
import { RootState } from "../../../redux/store";
import { updateExistingShapes } from "../../../redux/slices/appSlice";

// Constant
import { ArrowSupportedShapes } from "../../../lib/constant";

// Utils
import { getUpdatedAttachProps, updateAttachedArrowPosition } from "../../../utils/ShapeUtils";

// Types
import { Arrow as ArrowType, Shape, Arrow } from "../../../types/shapes";
import { getResizeShape, updatePointsAfterTransformation } from "../../../utils/Helper";

// Component Interface
interface GlobalTransformerProps {
  isDragging: MutableRefObject<boolean>;
  isTransforming: MutableRefObject<boolean>;
}

const GlobalTransformer = forwardRef<Konva.Transformer, GlobalTransformerProps>(({ isDragging, isTransforming }, tr) => {
  const groupRef = useRef<Konva.Group>(null)

  const { type: activeTool } = useSelector(
    (state: RootState) => state.app.activeTool,
  );
  const shapes: Shape[] = useSelector(
    (state: RootState) => state.app.shapes,
  ) as Shape[];
  const dispatch = useDispatch();

  // Helper functions
  const resizeShape = (node: Konva.Node) => {
    // Transformer and group ref 
    const trRef = (tr as MutableRefObject<Konva.Transformer>)?.current;
    const group = groupRef?.current;
    if (!trRef || !group) return;

    // Shape Attrs
    const attrs = node.attrs as Shape;

    // Shapes updated values
    const updatedValue: Array<{ shapeId: string, shapeValue: Partial<Shape> }> = [];

    // Handle Resize of Rect or Ellipse
    if (ArrowSupportedShapes.includes(attrs.type)) {
      const shapeUpdatedValue = getResizeShape(attrs);
      if (!shapeUpdatedValue) return;

      updatedValue.push({
        shapeId: attrs._id,
        shapeValue: shapeUpdatedValue
      })
    } else if (attrs.type === "point arrow") {
      // Handle Resize of Arrow
      const arrow = attrs as Arrow;
      const newPoints = updatePointsAfterTransformation((attrs as ArrowType).points, group);

      // Reset group transformation
      group.x(0);
      group.y(0);
      group.scaleX(1);
      group.scaleY(1);
      group.rotation(0);
      group.skewX(0);
      group.skewY(0);

      // Checking whether arrow has a attach shape or not.
      const attachedProps = getUpdatedAttachProps(arrow, shapes);
      if (attachedProps) {
        updatedValue.concat(attachedProps);
      }

      // Always update arrow points (ensure arrow entry exists)
      updatedValue[0].shapeValue = {
        ...(updatedValue[0].shapeValue ?? {}),
        points: newPoints
      };
    }

    dispatch(updateExistingShapes(updatedValue));
  };

  const dragShape = (attrs: Konva.NodeConfig) => {
    const { x, y, arrowProps = null, } = attrs;
    if (!x || !y) return;

    // Update the position of ArrowSupportedShape during movements
    if (ArrowSupportedShapes.includes((attrs as Shape).type)) {
      if (!arrowProps?.length) return;
      const updatedArrowPosition = updateAttachedArrowPosition(x, y, shapes, arrowProps)


      if (updateAttachedArrowPosition.length > 0) {
        dispatch(updateExistingShapes(updatedArrowPosition))
      }
    }
  };

  const handleTransformingEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e?.currentTarget?.attrs)) return;

    const nodes = (e.currentTarget as Konva.Transformer).nodes();
    if (!nodes.length) return;

    if (nodes.length === 1) {
      const attrs = nodes[0].attrs;

      resizeShape(attrs);
    } else {
      nodes.forEach((node) => {
        const attrs = node.attrs;

        resizeShape(attrs);
      })
    }
  }

  // Event handler functions
  const handleDragMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e.target instanceof Konva.Transformer) || activeTool !== "cursor")
      return;

    const nodes = (e.currentTarget as Konva.Transformer).nodes();
    isDragging.current = true;

    if (!nodes.length) return;
    if (nodes.length === 1) {
      const currentShapeAttrs = nodes[0]?.attrs;

      dragShape(currentShapeAttrs);
    } else {
      nodes.forEach((node) => {
        const shapeAttrs = node?.attrs;

        dragShape(shapeAttrs);
      });
    }
  };

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!(e?.currentTarget?.attrs) || !groupRef.current) return;
    const attrs = e.currentTarget.attrs;

    // TODO: Write a logic when going beyond the canvas size.

    // Check Is any attachedShape is detached or not.
    if ((attrs as Shape).type === "point arrow") {
      const arrow = attrs as Arrow;

      // Check whether arrow attached shape is detached or not.
      const newPoints = updatePointsAfterTransformation(arrow.points, groupRef.current);
      const updatedAttachProps = getUpdatedAttachProps(arrow, shapes);

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
              shapeId: arrow._id,
              shapeValue: {
                points: newPoints
              }
            }
          )
        )
      }
    }

  }

  return (
    <Group ref={groupRef}>
      <Transformer
        ref={tr}
        handleTransforming={() => isTransforming.current = true}
        handleTransformingEnd={handleTransformingEnd}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />
    </Group>
  );
})
export default GlobalTransformer;

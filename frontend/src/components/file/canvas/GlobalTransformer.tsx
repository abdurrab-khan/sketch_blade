import Konva from "konva";
import { Group } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, MutableRefObject, useEffect, useRef } from "react";
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
import { Shape, Arrow } from "../../../types/shapes";
import { getRectangleResizeValue, getResizeShape, updatePointsAfterTransformation } from "../../../utils/Helper";

// Component Interface
interface GlobalTransformerProps {
  isDragging: MutableRefObject<boolean>;
  isTransforming: MutableRefObject<boolean>;
}

const GlobalTransformer = forwardRef<Konva.Transformer, GlobalTransformerProps>(({ isDragging, isTransforming }, tr) => {
  const groupRef = useRef<Konva.Group>(null)

  const selectedShapeIds = useSelector((state: RootState) => state.app.selectedShapesId)

  const { type: activeTool } = useSelector(
    (state: RootState) => state.app.activeTool,
  );
  const shapes: Shape[] = useSelector(
    (state: RootState) => state.app.shapes,
  ) as Shape[];

  const dispatch = useDispatch();

  const dragShape = (attrs: Konva.NodeConfig) => {
    const { x, y, arrowProps = null, } = attrs;
    if (!x || !y) return;

    // Update the position of ArrowSupportedShape during movements
    if (ArrowSupportedShapes.includes((attrs as Shape).type)) {
      if (!arrowProps?.length) return;
      const updatedArrowPosition = updateAttachedArrowPosition(shapes, arrowProps)


      if (updatedArrowPosition.length > 0) {
        dispatch(updateExistingShapes(updatedArrowPosition))
      }
    }
  };

  const handleTransforming = (e: KonvaEventObject<MouseEvent>) => {
    isTransforming.current = true
    if (!e.currentTarget) return;

    const nodes = (e.currentTarget as Konva.Transformer).nodes();

    if (nodes.length > 0) {
      nodes.forEach((n) => {
        getRectangleResizeValue(n);
      })
    }
  }

  const handleTransformingEnd = (e: KonvaEventObject<MouseEvent>) => {
    isTransforming.current = false;
    if (!e?.currentTarget) return;

    const nodes = (e.currentTarget as Konva.Transformer).nodes();

    if (nodes.length > 0) {
      const newShapeValue = getResizeShape(nodes);
      dispatch(updateExistingShapes(newShapeValue))
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

  useEffect(() => {
    const trRef = (tr as MutableRefObject<Konva.Transformer>)?.current;
    if (!trRef || trRef.nodes().length === 0) return; // Return -- Whether we does not have any shape in transformer.

    if (Array.isArray(selectedShapeIds?._id)) return;
    trRef.nodes([])

  }, [selectedShapeIds, tr, isDragging])

  return (
    <Group ref={groupRef}>
      <Transformer
        ref={tr}
        handleTransforming={handleTransforming}
        handleTransformingEnd={handleTransformingEnd}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />
    </Group>
  );
})
export default GlobalTransformer;

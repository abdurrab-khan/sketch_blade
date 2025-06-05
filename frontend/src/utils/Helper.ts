import Konva from "konva";
import { ArrowProps, Coordinates, Proximity } from "../types";
import {
  Arrow,
  ArrowDirection,
  ArrowPosition,
  ArrowSupportedShapes,
  AttachedShape,
  Shape,
} from "../types/shapes";
import { ToolType } from "../types/tools/tool";
import { DeletedShapeProps } from "./ShapeUtils";

/**
 * Utility function to check if the mouse is near the edge of a shape.
 * @param mouseX {number}
 * @param mouseY {number}
 * @param shape {Shape}
 * @param threshold {number}
 * @returns {boolean}
 */
function isMouseNearShapeEdge(
  mouseX: number,
  mouseY: number,
  shape: Shape,
  threshold = 5,
) {
  const { x, y, height, width } = shape as ArrowSupportedShapes;

  if (shape.type === "ellipse") {
    const centerX = x;
    const centerY = y;
    const radius = width / 2;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distanceFromCenter = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    return Math.abs(distanceFromCenter - radius) <= threshold;
  } else {
    const distToTop = Math.abs(mouseY - y);
    const distToBottom = Math.abs(mouseY - (y + height));
    const distToLeft = Math.abs(mouseX - x);
    const distToRight = Math.abs(mouseX - (x + width));

    const isWithinExtendedX =
      mouseX >= x - threshold && mouseX <= x + width + threshold;
    const isWithinExtendedY =
      mouseY >= y - threshold && mouseY <= y + height + threshold;

    if (isWithinExtendedX && isWithinExtendedY) {
      // Near top edge
      if (distToTop <= threshold && mouseX >= x && mouseX <= x + width) {
        return true;
      }
      // Near bottom edge
      if (distToBottom <= threshold && mouseX >= x && mouseX <= x + width) {
        return true;
      }
      // Near left edge
      if (distToLeft <= threshold && mouseY >= y && mouseY <= y + height) {
        return true;
      }
      // Near right edge
      if (distToRight <= threshold && mouseY >= y && mouseY <= y + height) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Utility function to get the anchor point of a shape based on its type and the specified anchor position.
 * @param shape {ArrowSupportedShapes}
 * @param anchorPosition {ArrowDirection}
 * @returns
 */
function getAnchorPoint(
  x: number,
  y: number,
  shape: ArrowSupportedShapes,
  anchorPosition: ArrowDirection,
): Coordinates {
  if (shape.type === "rectangle") {
    const { width, height } = shape as ArrowSupportedShapes;
    switch (anchorPosition) {
      case "TOP":
        return { x: x + width / 2, y };
      case "RIGHT":
        return { x: x + width, y: y + height / 2 };
      case "BOTTOM":
        return { x: x + width / 2, y: y + height };
      case "LEFT":
        return { x, y: y + height / 2 };
      default:
        return { x: x + width / 2, y: y + height / 2 };
    }
  } else if (shape.type === "ellipse") {
    const { radiusX, radiusY } = shape as Ellipse;
    switch (anchorPosition) {
      case "TOP":
        return { x, y: y - radiusY };
      case "RIGHT":
        return { x: x + radiusX, y };
      case "BOTTOM":
        return { x, y: y + radiusY };
      case "LEFT":
        return { x: x - radiusX, y };
      default:
        return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

/**
 * Utility function to find the best connection points between two shapes.
 * It calculates the shortest distance between the edges of the two shapes and returns the best anchor points.
 * @param sourceShape {ArrowSupportedShapes}
 * @param targetShape {ArrowSupportedShapes}
 * @returns
 */
export const findBestConnectionPoints = (
  x: number,
  y: number,
  sourceShape?: ArrowSupportedShapes,
  targetShape?: ArrowSupportedShapes,
): {
  from?: Coordinates;
  to?: Coordinates;
} | null => {
  if (!sourceShape && !targetShape) return null;

  const positions = ["TOP", "RIGHT", "BOTTOM", "LEFT"] as ArrowDirection[];
  let shortestDistance = Infinity;
  let bestSourceAnchor = "CENTER" as ArrowDirection;
  let bestTargetAnchor = "CENTER" as ArrowDirection;

  if (sourceShape && !targetShape) {
    return {
      from: getAnchorPoint(x, y, sourceShape, bestSourceAnchor),
    };
  }

  if (!sourceShape && targetShape) {
    return {
      to: getAnchorPoint(x, y, targetShape, bestTargetAnchor),
    };
  }

  positions.forEach((sourcePos) => {
    const sourcePoint = getAnchorPoint(x, y, sourceShape!, sourcePos);

    positions.forEach((targetPos) => {
      const targetPoint = getAnchorPoint(x, y, targetShape!, targetPos);

      // Calculate distance
      const dx = targetPoint.x - sourcePoint.x;
      const dy = targetPoint.y - sourcePoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        bestSourceAnchor = sourcePos;
        bestTargetAnchor = targetPos;
      }
    });
  });

  return {
    from: getAnchorPoint(x, y, sourceShape!, bestSourceAnchor),
    to: getAnchorPoint(x, y, targetShape!, bestTargetAnchor),
  };
};

// <-------------------------------> HELPER FUNCTIONS <--------------------------------->
/**
 * Utility function to detect if the mouse is near the edge of a shape.
 * @param mouseX {number}
 * @param mouseY {number}
 * @param shapes {Shape[]}
 * @param threshold {number}
 * @param activeTool {ToolType}
 * @param currentShape {Shape}
 * @returns {Proximity}
 */
export function detectShapeEdgeProximity(
  mouseX: number,
  mouseY: number,
  shapes: Shape[],
  threshold = 5,
  activeTool: ToolType,
  currentShape: Shape | null,
): Proximity {
  const proximityProperties: Proximity = {
    shapeId: null,
    arrowProps: null,
    isNear: false,
  };

  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];

    if (isMouseNearShapeEdge(mouseX, mouseY, shape, threshold)) {
      proximityProperties.shapeId = shape._id;
      proximityProperties.isNear = true;

      if (activeTool === "point arrow") {
        const position: ArrowPosition =
          !(currentShape as Arrow)?.points ||
          (currentShape as Arrow)?.points?.length <= 2
            ? "START"
            : "END";

        proximityProperties.arrowProps = {
          arrowPosition: position,
        };
      }
    }
  }

  return proximityProperties;
}

/**
 * Utility function to calculate the distance between two points.
 * @param startingPointIndex {number}
 * @param points {number[]}
 * @returns {number}
 */
export function calculatePointDistance(
  startingPointIndex: number,
  points: number[],
): number {
  const firstX = points[startingPointIndex];
  const firstY = points[startingPointIndex + 1];
  const lastX = points[startingPointIndex + 2];
  const lastY = points[startingPointIndex + 3];

  const distance = Math.sqrt((lastX - firstX) ** 2 + (lastY - firstY) ** 2);

  return distance ? Number(distance) : 0;
}

/**
 * Utility function to get the transformed position of a pointer in a Konva stage.
 * @param stage {Konva.Stage}
 * @returns {Coordinates | null}
 */
export function getTransformedPos(stage: Konva.Stage): Coordinates | null {
  const pos = stage.getPointerPosition();
  const transform = stage.getAbsoluteTransform().copy();
  const invertedTransform = transform.invert();
  const transformedPos = pos ? invertedTransform.point(pos) : null;

  return transformedPos;
}

/**
 * Utility function to get the transformed position of a pointer in a Konva stage.
 * @param attrs {Konva.NodeConfig}
 * @returns {height: number, width: number} | null
 */
export function getResizeShape(attrs: Konva.NodeConfig): {
  height: number;
  width: number;
} | null {
  if (!attrs) return null;

  const height = Math.round(attrs.height! * (attrs.scaleX ?? 1));
  const width = Math.round(attrs.width! * (attrs.scaleY ?? 1));

  return {
    height,
    width,
  };
}

/**
 * Utility function to update the points of a shape after transformation.
 * @param oldPoints {number[]}
 * @param groupRef {Konva.Group}
 * @returns {number[]}
 */
export function updatePointsAfterTransformation(
  oldPoints: number[],
  groupRef: Konva.Group | Konva.Transformer,
) {
  const newPoints = [];

  for (let i = 0; i < oldPoints.length; i += 2) {
    const x = oldPoints[i];
    const y = oldPoints[i + 1];
    const absPoints = groupRef.getAbsoluteTransform().point({ x, y });

    newPoints.push(absPoints.x, absPoints.y);
  }

  return newPoints;
}

/**
 * Utility function to filter the arrow properties based on the updated shape properties.
 * @param arrowId {string}
 * @param prevUpdatedProps {DeletedShapeProps}
 * @param attachedArrowIds {[ArrowPosition, string][]}
 * @param shapes {Shape[]}
 * @returns {[key : string] : ArrowProps[]}
 */
export function filterArrowProps(
  arrowId: string,
  prevUpdatedProps: DeletedShapeProps,
  attachedArrowIds: [ArrowPosition, string][],
  shapes: Shape[],
): { [key: string]: ArrowProps[] | null } {
  const updatedValue: { [key: string]: ArrowProps[] | null } = {};

  attachedArrowIds.forEach(([, shapeId]) => {
    let attachedShapes: ArrowProps[];

    if (prevUpdatedProps.updatedShapes[shapeId]) {
      attachedShapes = prevUpdatedProps.updatedShapes[shapeId] as ArrowProps[];
    } else {
      const shape = shapes.find(
        (s) => s._id === shapeId,
      ) as ArrowSupportedShapes;
      attachedShapes = shape?.arrowProps ?? [];
    }

    attachedShapes.filter((s) => s._id !== arrowId);
    updatedValue[shapeId] = attachedShapes.length === 0 ? null : attachedShapes;
  });

  return updatedValue;
}

export function filterAttachedShapeProps(
  shapeId: string,
  arrowProps: ArrowProps[],
  prevUpdatedProps: DeletedShapeProps,
  shapes: Shape[],
): { [key: string]: AttachedShape | null } {
  const updatedValue: { [key: string]: AttachedShape | null } = {};

  arrowProps.forEach((props) => {
    let filterArrowProps: AttachedShape;

    if (prevUpdatedProps.updatedShapes[props._id]) {
      filterArrowProps = prevUpdatedProps.updatedShapes[
        props._id
      ] as AttachedShape;
    } else {
      const shape = shapes.find((s) => s._id === props._id) as Arrow;
      filterArrowProps = shape?.attachedShape as AttachedShape;
    }

    filterArrowProps = Object.fromEntries(
      Object.entries(filterArrowProps ?? {}).filter(([, id]) => id !== shapeId),
    ) as AttachedShape;

    updatedValue[props._id] =
      Object.keys(filterArrowProps).length === 0 ? null : filterArrowProps;
  });

  return updatedValue;
}

/**
 * Utility function to get the start or end points of an arrow based on its position.
 * @param arrow {Arrow}
 * @param position {ArrowPosition}
 * @returns {[number, number]} - The x and y coordinates of the arrow's start or end point based on the position.
 */
export function getArrowPointsForPosition(
  arrow: Arrow,
  position: ArrowPosition,
): [number, number] {
  if (position === "START") {
    return [arrow.points[0], arrow.points[1]];
  } else {
    const points = arrow.points;
    return [points[points.length - 2], points[points.length - 1]];
  }
}

export function updateArrowProps(arrow: Arrow, shape: ArrowSupportedShapes) {
  const updatedArrowProps = shape.arrowProps?.filter(
    (p) => p._id !== arrow._id,
  );
  const updatedAttachedShape = "";
}

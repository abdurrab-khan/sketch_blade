import { FourCoordinates, SelectedShapesId } from "../types";
import { Arrow, AttachedShape, Ellipse } from "../types/shapes";
import {
  AllToolBarProperties,
  DrawingToolType,
  ToolType,
} from "../types/tools/tool";
import {
  ArrowSupportedShapes as ShapesThatSupportArrow,
  MAX_ARROW_LIMIT,
  ArrowSupportedShapes as ArrowSupportedShapeList,
} from "../lib/constant";
import {
  calculatePointDistance,
  filterArrowProps,
  filterAttachedShapeProps,
  findBestConnectionPoints,
  getArrowPointsForPosition,
} from "./Helper";

interface PropsToAddArrow {
  arrowProps: ArrowProps[];
  attachedShape: AttachedShape | null;
}

interface UpdateArrowPoints {
  arrowPoints: number[];
  from?: {
    x: number;
    y: number;
  };
  to?: {
    x: number;
    y: number;
  };
}

export interface DeletedShapeProps {
  updatedShapes: {
    [shapeId: string]: ArrowProps[] | AttachedShape | null;
  };
  deletedShapes: string[];
}

// <----------------------------------> SHAPE UTILS <------------------------------------------>
/**
 * Utility function to get the shape properties based on the current selector and tool bar properties.
 * @param key {keyof ToolBarProperties}[]
 * @param toolBarProperties {Partial<ToolBarProperties>}
 */
export function getShapeProperties(toolBarProperties: AllToolBarProperties) {
  const key = Object.keys(toolBarProperties);

  if (key.length <= 0 || !Array.isArray(key)) return {};

  let properties = {};

  key.forEach((key) => {
    switch (key) {
      case "edgeStyle": {
        const property = toolBarProperties.edgeStyle;

        const tension = property === "SHARP" ? 0 : 0.15;
        const cornerRadius = property === "SHARP" ? 0 : 32;

        const radiusValue =
          toolBarProperties.type === "point arrow"
            ? {
                tension,
              }
            : { cornerRadius };

        properties = {
          ...properties,
          ...radiusValue,
        };
        break;
      }
      case "strokeWidth": {
        const property = toolBarProperties.strokeWidth;

        let strokeWidth;
        if (property === "THIN") {
          strokeWidth = 3;
        } else if (property === "MEDIUM") {
          strokeWidth = 4;
        } else if (property === "THICK") {
          strokeWidth = 5;
        }
        properties = { ...properties, strokeWidth };
        break;
      }
      case "strokeStyle": {
        const property = toolBarProperties.strokeStyle;
        let dash;
        if (property === "SOLID") {
          dash = [0];
        } else if (property === "DASHED") {
          dash = [10, 15];
        } else {
          dash = [3, 10];
        }
        properties = { ...properties, dash };
        break;
      }
      case "fontSize": {
        const fontSize = toolBarProperties?.fontSize;
        let size;

        if (fontSize === "SMALL") {
          size = 22;
        } else if (fontSize === "MEDIUM") {
          size = 24;
        } else {
          size = 28;
        }

        properties = { ...properties, fontSize: size };
        break;
      }
      case "textAlign": {
        const textAlign = toolBarProperties.textAlign;

        properties = { ...properties, textAlign: textAlign?.toLowerCase() };
        break;
      }
      case "fontFamily": {
        properties = { ...properties, fontFamily: "sans-serif" };
        break;
      }
      default: {
        properties = {
          ...properties,
          [key]: toolBarProperties[key as keyof ToolBarProperties],
        };
      }
    }
  });

  return properties;
}

/**
 * Utility function to get the updated properties of a shape based on the active tool and selected shapes.
 * @param shape {Shape}
 * @param activeTool {ToolType}
 * @param selectedShapesId {SelectedShapesId | null}
 * @returns {Shape}
 */
export function getUpdatedProps(
  shape: Shape,
  activeTool: ToolType,
  selectedShapesId: SelectedShapesId | null,
) {
  if (
    selectedShapesId &&
    selectedShapesId?._id?.length > 0 &&
    selectedShapesId?._id?.includes(shape["_id"])
  ) {
    if (selectedShapesId?.purpose === "FOR_DELETING") {
      shape["opacity"] = 0.5;
    }
  }

  if (activeTool !== ToolType.Cursor) {
    shape["draggable"] = false;
  } else {
    shape["draggable"] = true;
  }

  return shape;
}

/**
 * Utility function to get the updated properties to add an arrow to a shape.
 * @param shapes {Shape[]}
 * @param selectedShapeId {ArrowProps | null}
 * @param arrow {Arrow}
 * @returns {PropsToAddArrow | null}
 */
export function getUpdatedPropsToAddArrow(
  shapes: Shape[],
  selectedShapeId: ArrowProps | null,
  arrow: Arrow,
): PropsToAddArrow | null {
  if (!arrow || !selectedShapeId) return null;

  const currentShape = shapes.find(
    (shape) => shape._id === selectedShapeId?._id,
  ) as ArrowSupportedShapes;

  if (
    !currentShape ||
    currentShape?.arrowProps?.some(
      (props) =>
        props?._id === arrow?._id &&
        props?.arrowPosition === selectedShapeId?.arrowPosition,
    )
  )
    return null;

  const updatedValue: PropsToAddArrow = {
    // Add the arrow info into the shape
    arrowProps: [
      ...(currentShape?.arrowProps ?? []),
      {
        _id: arrow?._id,
        x: selectedShapeId?.x,
        y: selectedShapeId?.y,
        arrowDirection: selectedShapeId?.arrowDirection,
        arrowPosition: selectedShapeId?.arrowPosition as ArrowPosition,
      },
    ],

    // Add the attached shape info to the shape
    attachedShape: {
      ...(arrow?.attachedShape ?? {}),
      [selectedShapeId.arrowPosition]: currentShape._id,
    } as AttachedShape,
  };

  return updatedValue;
}

/**
 * Utility function to recalculate the dimensions of a shape based on the tool type and coordinates.
 * @param tool {ToolType}
 * @param coordinates {FourCoordinates}
 * @param shape {Shape}
 * @returns {Shape}
 */
export function recalculatesShapeDimensions(
  tool: DrawingToolType,
  coordinates: FourCoordinates,
  shape: Shape,
): Shape {
  const copyShape = { ...shape };
  const { x, y2, y, x2 } = coordinates;

  switch (tool) {
    case ToolType.Rectangle: {
      const width = Math.abs(x2 - x);
      const height = Math.abs(y2 - y);

      if (!copyShape.isAddable && (height > 4 || width > 5)) {
        copyShape.isAddable = true;
      }

      (copyShape as ArrowSupportedShapes)["height"] = height;
      (copyShape as ArrowSupportedShapes)["width"] = width;
      break;
    }
    case ToolType.Ellipse: {
      const width = Math.abs(x2 - x);
      const height = Math.abs(y2 - y);

      if (!copyShape.isAddable) {
        const radius = Math.hypot(x2 - x, y2 - y);

        if (radius >= 5) {
          copyShape.isAddable = true;
        }
      }

      (copyShape as Ellipse).height = height;
      (copyShape as Ellipse).width = width;
      break;
    }
    case ToolType.FreeHand:
    case ToolType.PointArrow: {
      let points: number[] = [];

      if (tool === "free hand") {
        points = [...(copyShape as Arrow).points, x2, y2];
        (copyShape as Arrow).isAddable = points.length > 5;
      } else {
        const len = (copyShape as Arrow).points.length;

        const fromToRemove = len < 3 ? len : len - 2;
        const deleteCount = len < 3 ? 0 : 2;
        const copyPoints = (copyShape as Arrow).points.slice();
        copyPoints.splice(fromToRemove, deleteCount, x2, y2);

        if (copyPoints.length < 5) {
          const distance = calculatePointDistance(0, copyPoints);

          (copyShape as Arrow).isAddable =
            distance > 20 && (copyShape as Arrow).isDrawingArrow;
        } else {
          for (let i = 0; i < copyPoints.length - 4; i += 4) {
            const distance = calculatePointDistance(i, copyPoints);
            (copyShape as Arrow).isAddable = distance > 20;

            if (distance > 20) break;
          }
        }

        points = copyPoints;
      }

      (copyShape as Arrow).points = points;
    }
  }

  return copyShape;
}

/**
 * Utility function to check if the arrow is attached to a shape and if the distance is far away.
 * @param arrow {Arrow}
 * @param shapes {ArrowSupportedShapes[]}
 * @returns {Array<{ shapeId: string; shapeValue: Partial<Shape> }> | null}
 */
export function getUpdatedAttachProps(
  arrow: Arrow,
  shapes: Shape[],
): Array<{ shapeId: string; shapeValue: Partial<Shape> }> | null {
  const attachedShapeIds = arrow?.attachedShape;
  if (!attachedShapeIds) return null;

  const result: { [key in ArrowPosition]: ArrowSupportedShapes | null } = {
    START: null,
    END: null,
  };
  const updatedValue: Array<{ shapeId: string; shapeValue: Partial<Shape> }> =
    [];

  const shapeMap = new Map<string, ArrowSupportedShapes>();
  for (const shape of shapes) {
    if (ShapesThatSupportArrow.includes(shape.type)) {
      shapeMap.set(shape._id, shape as ArrowSupportedShapes);
    }
  }

  for (const position of ["START", "END"] as const) {
    const shapeId = attachedShapeIds[position];
    if (!shapeId) continue;

    const shape = shapeMap.get(shapeId);
    if (!shape) continue;

    const arrowPoints = getArrowPointsForPosition(arrow, position);
    const distance = calculatePointDistance(0, [
      shape.x,
      shape.y,
      ...arrowPoints,
    ]);

    if (distance > MAX_ARROW_LIMIT) {
      const { [position]: remove, ...other } = arrow.attachedShape;
      const updatedArrowProps = shape?.arrowProps?.filter(
        (p) => p._id !== arrow._id,
      );

      const attachedShape =
        Object.keys(other).length === 0 ? null : (other as AttachedShape);
      const arrowProps =
        updatedArrowProps?.length === 0 ? null : updatedArrowProps;

      if (updatedValue.length === 0) {
        updatedValue.push(
          {
            shapeId: arrow._id,
            shapeValue: {
              attachedShape,
            },
          },
          {
            shapeId: shape._id,
            shapeValue: {
              arrowProps,
            },
          },
        );
      } else {
        updatedValue[0].shapeValue = {
          attachedShape: {
            ...(updatedValue[0].shapeValue as AttachedShape),
            ...attachedShape,
          },
        };

        updatedValue.push({
          shapeId: shape._id,
          shapeValue: {
            arrowProps,
          },
        });
      }
    }
  }

  // Let's create a new object to update the attachedShape properties and arrowProps.
  if (result?.START === null && result?.END === null) return null;
  return updatedValue;
}

/**
 * Utility function to update the position of an attached arrow. Based on the
 * current position of the shape, it will update the arrow position.
 * @param shapes {Shape[]}
 * @param arrowProps {ArrowProps}
 * @returns {shapeId: string, shapeValue: { points: number[] }}[]
 */
export function updateAttachedArrowPosition(
  shapes: Shape[],
  arrowProps: ArrowProps[],
): { shapeId: string; shapeValue: { points: number[] } }[] {
  const updatedArrowPosition: {
    shapeId: string;
    shapeValue: { points: number[] };
  }[] = [];

  // Update arrow points
  const updateArrowPoints = ({
    arrowPoints,
    from,
    to,
  }: UpdateArrowPoints): number[] => {
    const copyArrowPoints = [...arrowPoints];

    if (from || to) {
      const secondLast = copyArrowPoints.length - 2;

      if (from && to) {
        // Update for start point
        copyArrowPoints[0] = from.x;
        copyArrowPoints[1] = from.y;

        // Update for end points
        copyArrowPoints[secondLast] = to.x;
        copyArrowPoints[secondLast + 1] = to.y;
      } else {
        const position = from ? "from" : "to";

        // Index
        const startIndex = position === "from" ? 0 : secondLast;
        const endIndex = position === "from" ? 1 : secondLast + 1;

        // Values
        const values = position === "from" ? from : to;

        if (values?.x !== undefined && values.y !== undefined) {
          copyArrowPoints[startIndex] = values.x;
          copyArrowPoints[endIndex] = values.y;
        }
      }
    }

    return copyArrowPoints;
  };

  // Process each arrow that's attached to the moving shape
  arrowProps.forEach((arrowProp) => {
    const arrow = shapes.find(
      (s) => s._id === arrowProp._id && s.type === "point arrow",
    ) as Arrow;

    if (!arrow?.attachedShape) return;

    const attachedShape = arrow.attachedShape;
    const sourceShape = shapes.find(
      (s) => s._id === attachedShape.START,
    ) as ArrowSupportedShapes;
    const targetShape = shapes.find(
      (s) => s._id === attachedShape.END,
    ) as ArrowSupportedShapes;

    const newPointPosition = findBestConnectionPoints(
      sourceShape,
      targetShape,
      arrow.points,
    );

    if (newPointPosition) {
      const { from, to } = newPointPosition;

      const newPoints = updateArrowPoints({
        from,
        to,
        arrowPoints: arrow.points,
      });

      updatedArrowPosition.push({
        shapeId: arrow._id,
        shapeValue: {
          points: newPoints,
        },
      });
    }
  });

  return updatedArrowPosition;
}

/**
 * Utility function to get all deleted shape ids.
 * @param selectedIds {string[]}
 * @param shapes {Shape[]}
 * @returns {string[]}
 */
export function getDeletedShapeProps(
  selectedIds: string[],
  shapes: Shape[],
): DeletedShapeProps {
  const updatedValue: DeletedShapeProps = {
    updatedShapes: {},
    deletedShapes: [],
  };

  selectedIds.forEach((id) => {
    const shape = shapes.find((s) => s._id === id);
    if (!shape) return;

    if (shape.type === "point arrow" && (shape as Arrow).attachedShape) {
      // If removed shape is Arrow, We have to filter from "ArrowProps".
      const attachedShapeIds = Object.entries(
        (shape as Arrow)?.attachedShape as Record<ArrowPosition, string>,
      );
      const filteredArrowProps = filterArrowProps(
        id,
        updatedValue,
        attachedShapeIds as [ArrowPosition, string][],
        shapes,
      );

      updatedValue.updatedShapes = {
        ...updatedValue.updatedShapes,
        ...(filteredArrowProps as {
          [key: string]: ArrowProps[] | null;
        }),
      };
    } else if (
      ArrowSupportedShapeList.includes(shape.type) &&
      (shape as ArrowSupportedShapes)?._id
    ) {
      // If removed shape is Rect, Ellipse,..., We have to remove from "AttachedShape."
      const filteredArrowProps = filterAttachedShapeProps(
        id,
        (shape as ArrowSupportedShapes).arrowProps ?? [],
        updatedValue,
        shapes,
      );

      updatedValue.updatedShapes = {
        ...updatedValue.updatedShapes,
        ...(filteredArrowProps as { [key: string]: AttachedShape | null }),
      };
    }

    updatedValue.deletedShapes.push(id);
  });

  return updatedValue;
}

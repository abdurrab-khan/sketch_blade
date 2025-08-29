import { FourCoordinates } from "../types";
import {
  Arrow,
  ArrowPosition,
  ArrowProps,
  AttachedShape,
  Ellipse,
  KonvaShapeMap,
  KonvaStyleMap,
  Rectangle,
  ShapeMap,
  Shapes,
  StylePropsMap,
} from "../types/shapes";
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

// <================================> SHAPE UTILITY  <================================>

function getKonvaStyle<K extends keyof StylePropsMap>(
  styleProps: StylePropsMap[K],
): KonvaStyleMap[K] {
  const style: KonvaStyleMap[K] = {};

  for (const s of Object.keys(styleProps) as Array<keyof StylePropsMap[K]>) {
    const property = styleProps[s];

    switch (s) {
      case "dash": {
        const dashValue = property === "SOLID" ? [0] : property === "DASHED" ? [10, 15] : undefined;
        if (dashValue) style[s] = dashValue;
        break;
      }
      case "strokeWidth": {
        const strokeWidthValue = property === "THIN" ? 3 : property === "MEDIUM" ? 4 : 5;
        style[s] = strokeWidthValue;
        break;
      }
      case "cornerRadius": {
        const cornerRadiusValue = property === "SHARP" ? 0 : 32;
        style[s] = cornerRadiusValue;
        break;
      }
      case "tension": {
        const tensionValue = property === "SHARP" ? 0 : 0.15;
        style[s] = tensionValue;
        break;
      }
      case "fillPatternImage": {
        break;
      }
      case "fontSize": {
        const fontSize = property === "SMALL" ? 22 : property === "MEDIUM" ? 24 : 28;
        style[s] = fontSize;
        break;
      }
      case "fontFamily": {
        style[s] = "sans-serif";
        break;
      }
      case "align": {
        style[s] = property.toLowerCase();
        break;
      }
      default: {
        style[s] = property;
      }
    }
  }

  return style;
}

/**
 * Utility function to get the updated properties of a shape based on the active tool and selected shapes.
 * @param shape {Shapes}
 * @returns {ShapePropsMap[K]}
 */
export function getKonvaProps<K extends Extract<keyof ShapeMap, keyof KonvaShapeMap>>(
  shape: ShapeMap[K],
): KonvaShapeMap[K] {
  const konvaStyleProps = getKonvaStyle(shape.styleProperties);

  const result = {
    ...shape,
    styleProperties: konvaStyleProps,
  };

  if ((result.type === "rectangle" || result.type === "ellipse") && result?.text) {
    result["text"] = getKonvaStyle(result?.text);
  }

  return result as unknown as KonvaShapeMap[K];
}

/**
 * Utility function to get the updated properties to add an arrow to a shape.
 * @param shapes {Shape[]}
 * @param selectedShapeId {ArrowProps | null}
 * @param arrow {Arrow}
 * @returns {PropsToAddArrow | null}
 */
export function getUpdatedPropsToAddArrow(
  shapes: Shapes[],
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
        props?._id === arrow?._id && props?.arrowPosition === selectedShapeId?.arrowPosition,
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
 * @param tool {Drawing}
 * @param coordinates {FourCoordinates}
 * @param shape {Shape}
 * @returns {Shape}
 */
export function recalculatesShapeDimensions(
  tool: DrawingToolTypeLiteral,
  coordinates: FourCoordinates,
  shape: Shapes,
): Shapes {
  const copyShape = { ...shape };
  const { x, y2, y, x2 } = coordinates;

  switch (tool) {
    case "rectangle": {
      const width = Math.abs(x2 - x);
      const height = Math.abs(y2 - y);

      (copyShape as Rectangle)["styleProperties"]["height"] = height;
      (copyShape as Rectangle)["styleProperties"]["width"] = width;
      break;
    }
    case "ellipse": {
      const width = Math.abs(x2 - x);
      const height = Math.abs(y2 - y);

      (copyShape as Ellipse)["styleProperties"]["height"] = height;
      (copyShape as Ellipse)["styleProperties"]["width"] = width;
      break;
    }
    case "free hand":
    case "point arrow": {
      let points: number[] = [];

      const prevPoints = (copyShape as Arrow)["styleProperties"]["points"];

      if (tool === "free hand") {
        points = [...prevPoints, x2, y2];
      } else {
        const len = prevPoints.length;

        const fromToRemove = len < 3 ? len : len - 2;
        const deleteCount = len < 3 ? 0 : 2;
        const copyPoints = prevPoints.slice();
        copyPoints.splice(fromToRemove, deleteCount, x2, y2);

        points = copyPoints;
      }

      (copyShape as Arrow)["styleProperties"]["points"] = points;
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
  shapes: Shapes[],
): Array<{ shapeId: string; shapeValue: Partial<Shapes> }> | null {
  const attachedShapeIds = arrow?.attachedShape;
  if (!attachedShapeIds) return null;

  const result: { [key in ArrowPosition]: ArrowSupportedShapes | null } = {
    START: null,
    END: null,
  };
  const updatedValue: Array<{ shapeId: string; shapeValue: Partial<Shape> }> = [];

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
    const distance = calculatePointDistance(0, [shape.x, shape.y, ...arrowPoints]);

    if (distance > MAX_ARROW_LIMIT) {
      const { [position]: remove, ...other } = arrow.attachedShape;
      const updatedArrowProps = shape?.arrowProps?.filter((p) => p._id !== arrow._id);

      const attachedShape = Object.keys(other).length === 0 ? null : (other as AttachedShape);
      const arrowProps = updatedArrowProps?.length === 0 ? null : updatedArrowProps;

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
  shapes: Shapes[],
  arrowProps: ArrowProps[],
): { shapeId: string; shapeValue: { points: number[] } }[] {
  const updatedArrowPosition: {
    shapeId: string;
    shapeValue: { points: number[] };
  }[] = [];

  // Update arrow points
  const updateArrowPoints = ({ arrowPoints, from, to }: UpdateArrowPoints): number[] => {
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
    const arrow = shapes.find((s) => s._id === arrowProp._id && s.type === "point arrow") as Arrow;

    if (!arrow?.attachedShape) return;

    const attachedShape = arrow.attachedShape;
    const sourceShape = shapes.find((s) => s._id === attachedShape.START) as ArrowSupportedShapes;
    const targetShape = shapes.find((s) => s._id === attachedShape.END) as ArrowSupportedShapes;

    const newPointPosition = findBestConnectionPoints(sourceShape, targetShape, arrow.points);

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
export function getDeletedShapeProps(selectedIds: string[], shapes: Shapes[]): DeletedShapeProps {
  const updatedValue: DeletedShapeProps = {
    updatedShapes: {},
    deletedShapes: [],
  };

  selectedIds.forEach((id) => {
    const shape = shapes.find((s) => s._id === id);
    if (!shape) return;

    if (shape.type === "arrow" && (shape as Arrow).attachedShape) {
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
    } else if (ArrowSupportedShapeList.includes(shape.type) && shape?._id) {
      // If removed shape is Rect, Ellipse,..., We have to remove from "AttachedShape."
      const filteredArrowProps = filterAttachedShapeProps(
        id,
        shape.arrowProps ?? [],
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

/**
 * Utility function that return a true if the shape is addable, by checking the coordinates.
 * @param tool {DrawingToolTypeLiteral}
 * @param coordinates {FourCoordinates}
 * @return {boolean}
 */
export function isShapeAddable(shape: Shapes): boolean {
  switch (shape.type) {
    case "rectangle": {
      const height = shape.styleProperties?.height;
      const width = shape.styleProperties?.width;

      return height > 4 || width > 5;
    }
    case "ellipse": {
      const a = shape.styleProperties?.width / 2;
      const b = shape.styleProperties?.height / 2;

      return Math.sqrt(a * b) >= 5;
    }
    case "free hand":
    case "point arrow": {
      const points = shape.styleProperties.points;

      if (shape.type === "free hand") return points.length > 5;
      else {
        if (points.length < 5) {
          const distance = calculatePointDistance(0, points);
          return distance > 20;
        } else {
          for (let i = 0; i < points.length - 4; i += 4) {
            const distance = calculatePointDistance(i, points);
            return distance > 20;
          }
        }
      }

      return false;
    }
    case "text": {
      const text = shape.styleProperties.text;

      return text !== undefined && text.length > 0;
    }
  }

  return false;
}

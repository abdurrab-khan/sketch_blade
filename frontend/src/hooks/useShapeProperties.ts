import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { Shapes, ToolType } from "@/types/shapes/shapes.ts";
import { StylePropsMap } from "@/types/shapes/style-properties.ts";

export type StylePropsTemp<T> = T extends keyof StylePropsMap ? StylePropsMap[T] : null;

const createNewShape = <K extends ToolType>(
  type: K,
  styleProperties: StylePropsTemp<K>,
): Shapes | null => {
  if (type === "hand") return null;

  if (styleProperties === null) return null;

  if (type === "eraser") {
    return {
      type: "eraser",
      styleProperties: styleProperties as unknown as StylePropsMap["eraser"],
    } as unknown as Shapes;
  }

  return {
    type: type as Exclude<ToolType, "hand" | "eraser">,
    _id: uuid(),
    isLocked: false,
    styleProperties: styleProperties as unknown as StylePropsMap[keyof StylePropsMap],
  } as Shapes;
};

const useShapeProperties = (): Shapes | null => {
  const {
    activeTool: { type: toolType },
    shapeStyles,
    shapes,
  } = useSelector((state: RootState) => state.app);

  const shapeProperties = useMemo((): Shapes | null => {
    if (!shapeStyles) return null;

    return createNewShape(toolType, shapeStyles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes.length, shapeStyles, toolType]);

  return shapeProperties;
};

export default useShapeProperties;

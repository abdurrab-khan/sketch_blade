import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { CombineShape } from "@/types/shapes/shapes.ts";
import { DrawingToolTypeLiteral } from "@/types/tools/tool.ts";

const useShapeProperties = (): CombineShape | null => {
  const {
    activeTool: { type: toolType },
    shapeStyleProps,
    shapes,
  } = useSelector((state: RootState) => state.app);

  const shapeProperties = useMemo((): CombineShape | null => {
    if (!shapeStyleProps) return null;

    return {
      _id: uuid(),
      isLocked: false,
      type: toolType as DrawingToolTypeLiteral,
      styleProperties: shapeStyleProps,
    } as CombineShape;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes.length, shapeStyleProps, toolType]);

  return shapeProperties;
};

export default useShapeProperties;

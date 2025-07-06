import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store.ts";
import { ToolBarArr } from "../lib/constant.ts";
import { Shape } from "../types/shapes/shape-union.ts";
import {
  DrawingToolTypeLiteral,
  ToolBarProperties,
} from "../types/tools/tool.ts";
import { getShapeProperties } from "../utils/ShapeUtils.ts";

const useShapeProperties = (): Shape | null => {
  const [shapeProperties, setShapeProperties] = useState<Shape | null>(null);

  const {
    activeTool: { type: activeTool },
    toolBarProperties: properties,
  } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (!properties) return;

    if (ToolBarArr.includes(activeTool)) {
      const allProperties = getShapeProperties(
        Object.keys(properties) as (keyof ToolBarProperties)[],
        properties,
      );

      setShapeProperties({
        type: activeTool,
        isAddable: false,
        customProperties: properties,
        ...allProperties,
      } as Shape);
    } else {
      setShapeProperties(null);
    }
  }, [activeTool, properties]);

  return shapeProperties;
};
export default useShapeProperties;

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store.ts";
import { ToolBarArr } from "../lib/constant.ts";
import { Shape } from "../types/shapes/shape-union.ts";
import { ToolBarProperties } from "../types/tools/tool.ts";
import { getShapeProperties } from "../utils/ShapeUtils.ts";

const useShapeProperties = (isDrawing: boolean): Shape | null => {
  const [shapeProperties, setShapeProperties] = useState<Shape | null>(null);
  const {
    activeTool: { type: activeTool },
    toolBarProperties: properties,
  } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (!properties || !isDrawing) return;

    if (ToolBarArr.includes(activeTool)) {
      const allProperties = getShapeProperties(
        activeTool,
        Object.keys(properties) as (keyof ToolBarProperties)[],
        properties,
      );

      setShapeProperties({
        type: activeTool,
        customProperties: properties,
        ...allProperties,
      } as Shape);
    } else {
      setShapeProperties(null);
    }
  }, [activeTool, properties, isDrawing]);

  return shapeProperties;
};
export default useShapeProperties;

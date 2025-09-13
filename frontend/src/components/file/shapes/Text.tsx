import React, { useMemo } from "react";
import { Text as KonvaText } from "react-konva";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { KonvaText as KonvaTextType } from "@/types/shapes";

import ShapeGroup from "./ShapeGroup";

const Text: React.FC<KonvaTextType> = ({ ...props }) => {
  const selectedShape = useSelector((state: RootState) => state.app.selectedShapesId)
  const isUpdating = useMemo(() => {
    return (
      !Array.isArray(selectedShape?._id) &&
      selectedShape?._id === props._id &&
      selectedShape.purpose === "FOR_EDITING"
    )
  }, [props._id, selectedShape]);

  // Return null -- if text is editing.
  if (isUpdating) return <></>;

  return (
    <ShapeGroup _id={props._id}
      x={props.styleProperties.x!}
      y={props.styleProperties.y!}
    >
      <KonvaText name="text" {...props.styleProperties} />
    </ShapeGroup>
  );
};

export default Text;

import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Ellipse, FreeHand, Rectangle, Arrow, Text } from "../../shapes";
import { RootState } from "../../../../redux/store";
import { getUpdatedProps } from "../../../../utils/ShapeUtils";
import { CombineShape, ShapePropsMap } from "@/types/shapes";

const ListComponent: { [K in keyof ShapePropsMap]: React.ComponentType<ShapePropsMap[K]> } =
{
  rectangle: Rectangle,
  ellipse: Ellipse,
  "free hand": FreeHand,
  "point arrow": Arrow,
  text: Text
};

const GetDynamicShape = ({ ...props }: CombineShape): ReactNode => {
  const {
    activeTool: { type: activeTool },
    selectedShapesId,
  } = useSelector((state: RootState) => state.app);
  const Component = ListComponent[props.type];

  const updatedProps = getUpdatedProps(
    props,
    activeTool,
    selectedShapesId,
  );

  return <Component {...updatedProps} />;
};

export { GetDynamicShape };

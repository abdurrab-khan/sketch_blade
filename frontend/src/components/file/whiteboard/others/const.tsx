import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { DrawingToolType } from "../../../../types/tools/tool";
import { Shape } from "../../../../types/shapes";
import { Ellipse, FreeHand, Rectangle, Arrow } from "../../shapes";
import { RootState } from "../../../../redux/store";
import { getUpdatedProps } from "../../../../utils/ShapeUtils";

const ListComponent: { [key in DrawingToolType]: React.ComponentType<Shape> } =
{
  rectangle: Rectangle,
  ellipse: Ellipse,
  "free hand": FreeHand,
  "point arrow": Arrow,
};

const GetDynamicShape = ({ ...props }: Shape): ReactNode => {
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

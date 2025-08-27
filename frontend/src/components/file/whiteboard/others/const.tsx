import React, { ReactNode } from "react";
import { Ellipse, FreeHand, Rectangle, Arrow, Text } from "../../shapes";
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
  const Component = ListComponent[props.type];

  const updatedProps = getUpdatedProps(props, null, null);

  return <Component {...updatedProps} />;
};

export { GetDynamicShape };

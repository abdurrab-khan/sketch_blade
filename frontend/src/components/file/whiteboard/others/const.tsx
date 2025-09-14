import React, { lazy, ReactNode } from "react";
import { Ellipse, FreeHand, Rectangle, Arrow, Text } from "../../shapes";
import { KonvaShapeMap, Shapes } from "@/types/shapes";
import { getKonvaProps } from "@/utils/ShapeUtils";

const ListComponent: { [K in Exclude<keyof KonvaShapeMap, "eraser">]: React.ComponentType<KonvaShapeMap[K]> } = {
  rectangle: lazy(() => import("../../shapes/Rectangle")),
  ellipse: lazy(() => import("../../shapes/Ellipse")),
  arrow: lazy(() => import("../../shapes/Arrow")),
  text: lazy(() => import("../../shapes/Text")),
  "free hand": lazy(() => import("../../shapes/FreeHand")),
};

const GetDynamicShape = ({ ...props }: Shapes): ReactNode => {
  if (props === null || !(props.type in ListComponent)) return <React.Fragment></React.Fragment>;

  switch (props.type) {
    case "rectangle": {
      const updatedProps = getKonvaProps(props) as KonvaShapeMap["rectangle"];
      return <Rectangle {...updatedProps} />;
    }
    case "ellipse": {
      const updatedProps = getKonvaProps(props) as KonvaShapeMap["ellipse"];
      return <Ellipse {...updatedProps} />;
    }
    case "arrow": {
      const updatedProps = getKonvaProps(props) as KonvaShapeMap["arrow"];
      return <Arrow {...updatedProps} />;
    }
    case "text": {
      const updatedProps = getKonvaProps(props) as KonvaShapeMap["text"];
      return <Text {...updatedProps} />;
    }
    case "free hand": {
      const updatedProps = getKonvaProps(props) as KonvaShapeMap["free hand"];
      return <FreeHand {...updatedProps} />;
    }
    default:
      return <React.Fragment></React.Fragment>;
  }
};

export { GetDynamicShape };

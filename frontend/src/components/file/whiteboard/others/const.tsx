import React, { ReactNode } from "react";
import { Ellipse, FreeHand, Rectangle, Arrow, Text } from "../../shapes";
import { KonvaShapeMap, Shapes } from "@/types/shapes";
import Eraser from "../../shapes/Eraser";
import { getKonvaProps } from "@/utils/ShapeUtils";

const ListComponent: { [K in keyof KonvaShapeMap]: React.ComponentType<KonvaShapeMap[K]> } = {
  rectangle: Rectangle,
  ellipse: Ellipse,
  arrow: Arrow,
  text: Text,
  eraser: Eraser,
  "free hand": FreeHand,
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
    case "eraser": {
      const updatedProps = getKonvaProps(props) as KonvaShapeMap["eraser"];
      return <Eraser {...updatedProps} />;
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

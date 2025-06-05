import Konva from "konva";
import React, { useRef } from "react";
import { Group, Text as KonvaText } from "react-konva";

import { Shape } from "../../../types/shapes";
import Transformer from "../canvas/Transformer";

const Text: React.FC<Shape> = ({ ...props }) => {
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  return <>
    <Group>
      <KonvaText {...props} ref={textRef} />
    </Group>

    <Transformer ref={trRef} handleTransforming={() => { }} handleTransformingEnd={() => { }} handleDragMove={() => { }} handleDragEnd={() => { }} />
  </>;
};

export default Text;

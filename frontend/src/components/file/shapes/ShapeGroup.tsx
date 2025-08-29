import Konva from "konva";
import { RefObject } from "react";
import { Group } from "react-konva";

interface ShapeGroupProps {
  _id: string;
  x: number;
  y: number;
  children: React.ReactNode;
  groupRef?: RefObject<Konva.Group>;
}

export default function ShapeGroup({ _id, x, y, groupRef, children }: ShapeGroupProps) {
  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      // onClick={handleMouseClick}
      // onMouseDown={handleMouseDown}
      draggable
    >
      {children}
    </Group>
  );
}

import Konva from "konva";
import { useSelector } from "react-redux";
import { Stage as KonvaStage, Layer } from "react-konva";
import React, { useRef, useState } from "react";
import GlobalTransformer from "./GlobalTransformer";

// Redux
import { RootState } from "../../../redux/store";

// Const
import { GetDynamicShape } from "./others/const";

// Utils
import { cn } from "../../../lib/utils";
import { getCustomCursor } from "../../../utils/AppUtils";
import ShapeCreator from "./ShapeCreator";
import Selector from "../tools/Selector";

// Component Interface
interface StageProps {
  children: React.ReactNode;
  stageRef: React.RefObject<Konva.Stage>;
  transformerRef: React.RefObject<Konva.Transformer>;
}

export const Stage: React.FC<StageProps> = ({
  children,
  stageRef,
  transformerRef,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isDragging = useRef<boolean>(false);
  const isTransforming = useRef<boolean>(false);

  const activeTool = useSelector(
    (state: RootState) => state.app.activeTool.type,
  );
  const shapes = useSelector((state: RootState) => state.app.shapes);

  return (
    <KonvaStage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={activeTool === "hand"}
      className={cn(getCustomCursor(activeTool, isHovered))}
    >
      <Layer>
        {Array.isArray(shapes) &&
          shapes.length > 0 &&
          shapes.map((props, index) => (
            <GetDynamicShape key={index} {...props} />
          )
          )}
        <ShapeCreator stageRef={stageRef} />
        {children}
        <GlobalTransformer
          ref={transformerRef}
          isDragging={isDragging}
          isTransforming={isTransforming}
        />
        <Selector
          stageRef={stageRef}
          trRef={transformerRef}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isDragging={isDragging.current}
          isTransforming={isTransforming.current}
        />
      </Layer>
    </KonvaStage>
  );
};

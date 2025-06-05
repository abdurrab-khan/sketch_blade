import Konva from "konva";
import { useSelector } from "react-redux";
import { Stage as KonvaStage, Layer } from "react-konva";
import React, { useRef, useState } from "react";
import GlobalTransformer from "./GlobalTransformer";

// Hooks
import useStageHandler from "../../../hooks/useStageHandler";

// Redux
import { RootState } from "../../../redux/store";

// Const
import { GetDynamicShape } from "./others/const";

// Types
import { Shape } from "../../../types/shapes";

// Utils
import { cn } from "../../../lib/utils";
import { getCustomCursor } from "../../../utils/AppUtils";

// Component Interface
interface StageProps {
  children: React.ReactNode;
  stageRef: React.RefObject<Konva.Stage>;
  selectionRectRef: React.RefObject<Konva.Rect>;
  transformerRef: React.RefObject<Konva.Transformer>;
}

export const Stage: React.FC<StageProps> = ({
  children,
  stageRef,
  selectionRectRef,
  transformerRef,
}) => {
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isDragging = useRef(false);
  const isTransforming = useRef(false);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useStageHandler({
    currentShape,
    setCurrentShape,
    isHovered,
    setIsHovered,
    selectionRectRef,
    stageRef,
    transformerRef,
    isDragging,
    isTransforming,
  });

  const activeTool = useSelector(
    (state: RootState) => state.app.activeTool.type,
  );
  const shapes = useSelector((state: RootState) => state.app.shapes);

  return (
    <KonvaStage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      draggable={activeTool === "hand"}
      className={cn(getCustomCursor(activeTool, isHovered))}
    >
      <Layer>
        {shapes &&
          shapes.length > 0 &&
          shapes.map((props, index) => (
            <GetDynamicShape key={index} {...props} />
          ))}
        {currentShape && <GetDynamicShape {...currentShape} />}
      </Layer>

      {children}

      <GlobalTransformer
        ref={transformerRef}
        isDragging={isDragging}
        isTransforming={isTransforming}
      />
    </KonvaStage>
  );
};

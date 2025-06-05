import Konva from "konva";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { getTransformedPos } from "@/utils/Helper";

type MouseValue = {
  x: number;
  y: number;
};

const useMouseValue = ({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>;
}): MouseValue | null => {
  const [mouseValue, setMouseValue] = useState<MouseValue | null>(null);
  const { type: activeTool } = useSelector(
    (state: RootState) => state.app.activeTool,
  );

  useEffect(() => {
    if (activeTool !== "eraser") return;
    const handleMouseMove = (e: MouseEvent) => {
      if (
        !e.target ||
        (e.target as HTMLElement)?.tagName !== "CANVAS" ||
        !stageRef.current
      )
        return;

      const stage = stageRef.current;

      const transformedPos = getTransformedPos(stage);

      setMouseValue(transformedPos);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      setMouseValue(null);
    };
  }, [activeTool, stageRef]);

  return mouseValue;
};

export default useMouseValue;

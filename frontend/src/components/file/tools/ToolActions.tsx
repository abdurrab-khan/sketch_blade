import { useSelector } from "react-redux";

import { RootState } from "../../../redux/store";
import AllActions from "./AllActions";
import { CombineShapeStyle } from "@/types/shapes";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className={
        "absolute left-5 top-16 z-30 h-fit max-h-[85vh] w-fit min-w-[12.5rem] overflow-y-auto rounded-lg bg-secondary p-4"
      }
    >
      <div className={"flex size-full flex-col gap-y-4"}>{children}</div>
    </div>
  );
};

const ToolActions = () => {
  const shapeStyles = useSelector((state: RootState) => state.app.shapeStyles);

  if (!shapeStyles) return <></>;

  const shapeActionStyles: Partial<keyof CombineShapeStyle>[] = [
    "fill",
    "stroke",
    "fillPatternImage",
    "dash",
    "strokeWidth",
    "cornerRadius",
    "fontSize",
    "fontFamily",
    "align",
    "radius",
    "opacity",
  ];

  return (
    <Container>
      {shapeActionStyles.map((key, index) =>
        shapeStyles[key] ? (
          <AllActions key={index} toolKey={key} />
        ) : null,
      )}
    </Container>
  );
};

export default ToolActions;

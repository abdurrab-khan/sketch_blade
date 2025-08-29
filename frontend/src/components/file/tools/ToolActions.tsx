import { useSelector } from "react-redux";

import { RootState } from "../../../redux/store";
import { AllToolBarProperties } from "../../../types/tools/tool";
import AllActions from "./AllActions";

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
  const toolBarProperties = useSelector((state: RootState) => state.app.toolBarProperties);

  if (!toolBarProperties) return <></>;

  const propertiesElement: (keyof AllToolBarProperties)[] = [
    "fill",
    "stroke",
    "fillStyle",
    "strokeStyle",
    "strokeWidth",
    "edgeStyle",
    "fontSize",
    "fontFamily",
    "textAlign",
    "eraserRadius",
    "opacity",
  ];

  return (
    <Container>
      {propertiesElement.map((key, index) =>
        toolBarProperties[key as keyof AllToolBarProperties] ? (
          <AllActions key={index} toolKey={key} />
        ) : null,
      )}
    </Container>
  );
};

export default ToolActions;

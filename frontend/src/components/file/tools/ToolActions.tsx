import { useSelector } from "react-redux";

import { RootState } from "../../../redux/store";
import Container from "./Container";
import { ToolBarProperties } from "../../../types/tools/tool";
import AllActions from "./AllActions";

const ToolActions = () => {
  const toolBarProperties = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );

  if (!toolBarProperties) return <></>;

  const propertiesElement: (keyof ToolBarProperties)[] = [
    "fill",
    "stroke",
    "fillStyle",
    "strokeStyle",
    "strokeWidth",
    "edgeStyle",
    "fontSize",
    "eraserRadius",
    "opacity",
  ];

  return (
    <Container>
      {propertiesElement.map((key, index) =>
        toolBarProperties[key as keyof ToolBarProperties] ? (
          <AllActions key={index} toolKey={key} />
        ) : null,
      )}
    </Container>
  );
};

export default ToolActions;

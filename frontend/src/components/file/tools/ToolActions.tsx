import { useSelector } from "react-redux";
import {
  Fill,
  Stroke,
  FillStyle,
  StrokeStyle,
  StrokeWidth,
  EdgeStyle,
  FontSize,
  EraserRadius,
  Opacity,
} from "./AllActions";
import { RootState } from "../../../redux/store";
import Container from "./Container";
import { ToolBarProperties } from "../../../types/tools/tool";

const ToolActions = () => {
  const toolBarProperties = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );

  if (!toolBarProperties) return <></>;

  const propertiesElement = {
    fill: <Fill />,
    stroke: <Stroke />,
    fillStyle: <FillStyle />,
    strokeStyle: <StrokeStyle />,
    strokeWidth: <StrokeWidth />,
    edgeStyle: <EdgeStyle />,
    fontSize: <FontSize />,
    eraserRadius: <EraserRadius />,
    opacity: <Opacity />,
  };

  return (
    <Container>
      {Object.keys(propertiesElement).map((key, index) =>
        toolBarProperties[key as keyof ToolBarProperties] ? (
          <span key={index}>
            {
              propertiesElement[
                key as keyof typeof propertiesElement
              ] as React.ReactNode
            }
          </span>
        ) : null,
      )}
    </Container>
  );
};

export default ToolActions;

import React from "react";
import ToolBarActions from "./const.ts";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store.ts";
import { changeToolBarPropertiesValue } from "../../../redux/slices/appSlice.ts";
import {
  EdgeStyle as IEdgeStyle,
  FillStyle as IFillStyle,
  FontSize as IFontSize,
  StrokeStyle as IStrokeStyle,
  StrokeWidth as IStrokeWidth,
} from "../../../types/shapes/common.ts";

interface ContainerProps {
  children: React.ReactNode;
  label: string;
}

// Containers for the different tool properties
const ColorContainer = ({ color }: { color: string }) => {
  return <div className={"size-full"} style={{ backgroundColor: color }} />;
};

const Container: React.FC<ContainerProps> = ({ children, label }) => {
  return (
    <div className={"flex flex-col gap-y-2"}>
      <span>
        <p className={"text-xs font-medium"}>{label}</p>
      </span>
      <div className={"flex flex-wrap gap-2"}>{children}</div>
    </div>
  );
};

const IconContainer = ({ icon, value }: { icon: string; value: string }) => {
  return <img src={icon} className={"size-full object-cover"} alt={value} />;
};

// Define function that handles value changes and dispatches the new value to the Redux store
const valueChangerHandler = (
  dispatch: AppDispatch,
  dispatchValue: Record<string, string | number>,
) => {
  const value = Object.values(dispatchValue)[0];

  if (!value) return;

  const key = Object.keys(dispatchValue)[0];
  if (typeof value === "number") {
    const isOpacity = key === "opacity";
    const min = isOpacity ? 0.15 : 10;
    const max = isOpacity ? 1 : 100;

    if (value <= min || value > max) return;
  }

  // API call to update the value in the backend
  dispatch(changeToolBarPropertiesValue(dispatchValue));
};

// Define the components for each tool property
const Fill = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (color: string) => {
    valueChangerHandler(dispatch, {
      fill: color,
    });
  };

  return (
    <Container label={"Background"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector?.fill}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.backgroundColors.map((color, index) => (
          <ToggleGroupItem
            key={index}
            value={color}
            aria-label={`Toggle ${color}`}
            className={"p-0"}
          >
            <ColorContainer color={color} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Container>
  );
};

const Stroke = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (color: string) => {
    valueChangerHandler(dispatch, {
      stroke: color,
    });
  };

  return (
    <Container label={"Stroke"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector?.stroke || ""}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.strokeColors.map((color, index) => (
          <ToggleGroupItem
            key={index}
            value={color}
            aria-label={`Toggle ${color}`}
            className={"p-0"}
          >
            <ColorContainer color={color} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Container>
  );
};

const FillStyle = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (style: IFillStyle) => {
    valueChangerHandler(dispatch, {
      fillStyle: style,
    });
  };

  return (
    <Container label={"Fill"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector?.fillStyle || ""}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.fillStyles.map(({ path, color }, index) => (
          <ToggleGroupItem
            key={index}
            value={color}
            aria-label={`Toggle ${color}`}
          >
            <IconContainer icon={path} value={color} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Container>
  );
};

const StrokeStyle = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (style: IStrokeStyle) => {
    valueChangerHandler(dispatch, {
      strokeStyle: style,
    });
  };

  return (
    <Container label={"Stroke style"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector?.strokeStyle || ""}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.strokeStyles.map(({ style, path }, index) => (
          <ToggleGroupItem
            key={index}
            value={style}
            aria-label={`Toggle ${style}`}
          >
            <IconContainer icon={path} value={style} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Container>
  );
};

const StrokeWidth = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (width: IStrokeWidth) => {
    valueChangerHandler(dispatch, {
      strokeWidth: width,
    });
  };

  return (
    <Container label={"Stroke width"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector?.strokeWidth || ""}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.strokeWidth.map(({ width, path }, index) => (
          <ToggleGroupItem
            key={index}
            value={width}
            aria-label={`Toggle ${width}`}
          >
            <IconContainer icon={path} value={width} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Container>
  );
};

const EdgeStyle = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (style: IEdgeStyle) => {
    valueChangerHandler(dispatch, {
      edgeStyle: style,
    });
  };

  return (
    <Container label={"Edge Style"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector.edgeStyle}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.edgeRounded.map(({ path, style }, index) => (
          <ToggleGroupItem
            key={index}
            value={style}
            aria-label={`Toggle ${style}`}
          >
            <IconContainer icon={path} value={style} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Container>
  );
};

const Opacity: React.FC = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacityValue = Number.parseFloat(e.target.value);

    valueChangerHandler(dispatch, {
      opacity: opacityValue,
    });
  };

  return (
    <Container label="Opacity">
      <input
        type="range"
        min="0.15"
        max="1"
        step="0.01"
        value={selector?.opacity || 0}
        onChange={handleValueChange}
        className={"w-full"}
      />
    </Container>
  );
};

const EraserRadius: React.FC = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    valueChangerHandler(dispatch, {
      eraserRadius: parseInt(e.target.value, 10),
    });
  };

  return (
    <Container label={"Radius"}>
      <input
        type="range"
        min="10"
        max="100"
        value={selector?.eraserRadius}
        onChange={handleValueChange}
        className={"w-full"}
      />
    </Container>
  );
};

const FontSize: React.FC = () => {
  const selector = useSelector(
    (state: RootState) => state.app.toolBarProperties,
  );
  const dispatch = useDispatch();

  const handleValueChange = (size: IFontSize) => {
    valueChangerHandler(dispatch, {
      fontSize: size,
    });
  };

  return (
    <Container label={"Font Size"}>
      <ToggleGroup
        type="single"
        className={"gap-2"}
        value={selector?.fontSize || ""}
        onValueChange={handleValueChange}
      >
        {ToolBarActions.fontSize.map(({ Icon, size }) => {
          return (
            <ToggleGroupItem
              key={size}
              value={size}
              aria-label={`Toggle ${size}`}
            >
              <Icon className="size-full object-cover" />
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </Container>
  );
};

export {
  Fill,
  Stroke,
  FillStyle,
  StrokeStyle,
  StrokeWidth,
  EdgeStyle,
  Opacity,
  EraserRadius,
  FontSize,
};
